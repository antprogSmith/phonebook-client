import { LitElement, html, css } from 'lit-element';
import '../ant-selection';
import '../ant-contact-chip';
import '../ant-contact-card';
import '../ant-modal';
const url = "http://localhost:4000";
import { Selection } from './selection';
import {PhoneEntry} from './phoneEntry';

export class AntPhonebook extends LitElement {
	constructor() {
		super();

		this.phoneBooks = [];
		this.contacts = [];
		this.filteredContacts = [];
		this.dataSelection = new Selection();
		this.phoneEntry = new PhoneEntry();
		this.getServerData();
	}


	async getServerData() {
		const data = await this.dataSelection.getPhoneBooks();
		const books = data.data.phoneBooks;
		this.phoneBooks = books.map(book => {
			return { id: book.id, text: book.text }
		});

		books.forEach(book => {
			if (book.phoneBookEntries) {
				book.phoneBookEntries.forEach(entry => {
					this.contacts.push(
						{ phoneBookId: book.id, id: entry.id, cell: entry.cell, name: entry.name, img: entry.img }
					);
				});
			}
		});

		this.filterPhoneBookId = "";
		this.filterPhoneText = "";
		this.filteredContacts = this.contacts;
		this.editCard = '';		// Card used to edit a contact
		this.filterContacts();
		this.requestUpdate();
	}

	_selectSelection(event) {
		if (event.detail === 1) return;

		this.filterPhoneBookId = event.detail.id;
		this.filterContacts();
		this.requestUpdate();
	}

	_deleteSelection(event) {
		console.log('delete selection', event.detail);
		this.editCard = html`
			<ant-modal opened headertext="Are you sure?" confirmtext="OK" canceltext="Cancel"
				@confirm="${this._confirmDeleteSelection}" @cancel="${this._cancelDeleteSelection}"
				.cargo="${event.detail}">
				Delete Phonebook (${event.detail.text})
			</ant-modal>`;
		this.requestUpdate();
	}

	async _confirmDeleteSelection(event) {
		console.log('confirm delete selection', event);
		const id = event.detail.cargo.id;
		const index = this.phoneBooks.findIndex(x => x.id == id);
		if (index >= 0) {
			await this.dataSelection.deleteBook(id);
			this.phoneBooks.splice(index, 1);
			this.shadowRoot.querySelector('ant-selection').requestUpdate();
			this.selection.reset();

			this.contacts = this.contacts.filter((contact) =>
				contact.phoneBookId != id);
			this.filterContacts();
		}

		this.editCard = '';
		this.requestUpdate();
	}

	_cancelDeleteSelection(event) {
		this.editCard = '';
		this.requestUpdate();
	}

	_editSelection(event) {
		console.log('edit selection', event.detail);
		this.editCard = html`
		<ant-modal opened headertext="Edit (${event.detail.text})" confirmtext="OK" canceltext="Cancel"
			@confirm="${this._confirmEditSelection}" @cancel="${this._cancelDeleteSelection}"
			.cargo="${event.detail}">
			<input id="phoneBookInput" class="input" type="text" placeholder="Phonebook name" value="${event.detail.text}">
		</ant-modal>`;
		this.requestUpdate();
	}

	async _confirmEditSelection(event) {
		console.log('confirm edit selection', event);
		const id = event.detail.cargo.id;
		const index = this.phoneBooks.findIndex(x => x.id == id);
		const text = event.srcElement.querySelector('#phoneBookInput').value;

		if (!text) return;

		if (index >= 0) {
			// Update
			const book = await this.dataSelection.updateBook(id, text);
			this.phoneBooks[index].text = book.data.updatePhoneBook.text;
		} else {
			// Add
			const book = await this.dataSelection.addBook(text);
			this.phoneBooks.push(book.data.createPhoneBook);
		}

		this.shadowRoot.querySelector('ant-selection').requestUpdate();
		this.editCard = '';
		this.requestUpdate();
	}

	_addSelection(event) {
		console.log('add selection', event.detail);
		this.editCard = html`
		<ant-modal opened headertext="Add a new phonebook" confirmtext="OK" canceltext="Cancel"
			@confirm="${this._confirmEditSelection}" @cancel="${this._cancelDeleteSelection}">
			<input id="phoneBookInput" class="input" type="text" placeholder="Phonebook name">
		</ant-modal>`;
		this.requestUpdate();
	}


	firstUpdated() {
		this.input = this.shadowRoot.querySelector('.input.is-small');
		this.selection = this.shadowRoot.querySelector('ant-selection');
	}


	resetFilters(event) {
		this.filterPhoneText = "";
		this.selection.reset();
		this.input.value = '';
		this.input.focus();
	}

	filterContacts() {
		const phoneBookId = this.filterPhoneBookId;
		const text = this.filterPhoneText.toLowerCase();

		this.filteredContacts = this.contacts.filter((contact) =>
			(phoneBookId === "" || contact.phoneBookId == phoneBookId) &&
			(text === "" || contact.name.toLowerCase().indexOf(text) >= 0)
		).sort((first, second) => {
			const a = first.name.toLowerCase();
			const b = second.name.toLowerCase();
			if (a < b) {
				return -1
			} else if (a > b) {
				return 1;
			}
			return 0;
		});

	}

	filterByText(event) {
		this.filterPhoneText = this.input.value;
		this.filterContacts();
		this.requestUpdate();
	}

	async _contactDelete(event) {
		console.log('contact delete', event.detail);
		const id = event.detail.id;
		await this.phoneEntry.deleteEntry(id);

		this.contacts = this.contacts.filter((contact) => contact.id !== id);
		this.filterContacts();
		this.requestUpdate();
	}

	_contactEdit(event) {
		console.log('contact edit', event.detail);
		const { id, name, cell, img, phoneBookId } = event.detail;

		this.editCard = html`
			<ant-contact-card
				.contactId="${id}" .phoneBookId="${phoneBookId}"
				.name="${name}" .phone="${cell}" .img="${img}"
				@save="${this._contactSave}" @cancel="${this._cancelContactEdit}">
			</ant-contact-card>`;
		this.requestUpdate();
	}

	async _contactSave(event) {
		console.log('contact save', event.detail);

		let { phoneBookId, id, phone, name, img } = event.detail;
		if (!phoneBookId) {
			phoneBookId = this._currentPhoneBookId;
		}

		const contact = this.contacts.find((contact) => contact.id === id);
		this.editCard = '';
		if (contact) {
			// edit
			await this.phoneEntry.updateEntry(id, name, phone, img);
			contact.cell = phone;
			contact.name = name;
			contact.img = img;
			this.filterContacts();
			this.requestUpdate();
		} else {
			// add
			const person = await this.phoneEntry.addEntry(name, phone, img, phoneBookId);
			const newData = {...person.data.createPhoneBookEntry};
			const newPerson = {
				id: newData.id,
				cell: phone,
				name,
				img,
				phoneBookId
			};
			this.contacts.push(newPerson);
			this.filterContacts();
			this.requestUpdate();
		}
	}

	_contactAdd(event) {
		console.log('contact Add', event.detail);
		this.editCard = html`
			<ant-contact-card
				@save="${this._contactSave}" @cancel="${this._cancelContactEdit}">
			</ant-contact-card>`;
		this.requestUpdate();
	}

	_cancelContactEdit(event) {
		this.editCard = '';
		this.requestUpdate();
	}

	get _currentPhoneBookId() {
		return this.selection && this.selection.currentId ? this.selection.currentId : '-1';
	}

	_renderPage() {
		const currentId = this._currentPhoneBookId;
		console.log(currentId);
		let addContact = '';

		if (currentId !== '-1') {
			addContact = html`
				<a class="panel-block" id="addContact">
					<ant-contact-chip name="Add contact" adduser @selected="${this._contactAdd}">
					</ant-contact-chip>
				</a>
			`;
		}

		return html`
		${this.editCard}
		<nav class="panel">
        <p class="panel-heading">Phone Books</p>
        <div class="panel-block">
          <p class="control has-icons-left">
            <input class="input is-small" type="text" placeholder="search" @input="${this.filterByText}">
            <span class="icon is-small is-left">
              <i class="fas fa-search" aria-hidden="true"></i>
            </span>
          </p>
        </div>

			<ant-selection .items=${this.phoneBooks} 
				@delete="${this._deleteSelection}" @edit="${this._editSelection}" 
				@click="${this._selectSelection}" @add="${this._addSelection}">
			</ant-selection>

		  <div>
		  		${addContact}
			  	${this.filteredContacts.map(contact => {
			return html`
					<a class="panel-block" id="${contact.phoneBookId}">
						<ant-contact-chip name="${contact.name}" 
							.img="${contact.img}"
							.cargo="${contact}"
							@delete="${this._contactDelete}" @edit="${this._contactEdit}" @cancel="${this._cancelContactEdit}">
						</ant-contact-chip>
					</a>
				`;
		})}

			<div class="panel-block">
				<button class="button is-link is-outlined is-fullwidth" @click="${this.resetFilters}">
					reset all filters
				</button>
			</div>
		  </div>
      </nav>
      `;
	}

	render() {
		return html`
		<link rel="stylesheet" href="./css/bulma.min.css">

		<main>
			${this._renderPage()}
		</main>
    `;
	}

	static get styles() {
		return [
			css`
		:host {
			font-size: 62.5%;
			color: #1a2b42;
		}

		:host > * {
			display: flex;
		}

		.panel {
			width: 100%;
			font-size: x-large;
		}

		.panel-heading {
		background-color: lightgrey;
		}

		main {
			background-color: #f4f0ff;
		}


		#phoneBookInput {
			width: 95%;
		}
	`,
		];
	}
}


