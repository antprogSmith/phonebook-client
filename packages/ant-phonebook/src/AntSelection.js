import { LitElement, html, css } from 'lit-element';

export class AntSelection extends LitElement {

	constructor(){
		super();
		this.items = [];		// default value so it wont crash if nothing was passed
		this.currentId = "-1";
	}

	static get properties() {
		return {
			items: { type: Array },
		};
	}


	reset(){
		this.shadowRoot.querySelector('.panel-tabs > a').click();
	}

	firstUpdated() {
		this.panelTabs = this.shadowRoot.querySelector('.panel-tabs');
	}

	filterSelection(event) {
		for (let i = 0; i < this.panelTabs.children.length; i++) {
			this.panelTabs.children[i].classList.remove('is-active');
			if (this.panelTabs.children[i].children.length > 0 &&
				this.panelTabs.children[i].children[0].tagName === "SPAN") {
				this.panelTabs.children[i].children[0].setAttribute('hidden', '');
			}
		}
		this.currentId = event.srcElement.id;
		event.srcElement.classList.add('is-active');
		if (event.srcElement.children[0]) {
			event.srcElement.children[0].removeAttribute('hidden');
		}

		return this._createEvent(event, 'click', event.srcElement);
	}

	_editItem(event){
		return this._createEvent(event, 'edit', event.srcElement.parentElement.parentElement);
	}

	_deleteItem(event){
		return this._createEvent(event, 'delete', event.srcElement.parentElement.parentElement);
	}

	_createEvent(event, eventName, srcElement){
		const code = this.getAttribute(eventName);
		const {id, text} = srcElement;

		event.preventDefault();
		event.cancelBubble = true;

		const detail = {
			id,
			text: text ? text.trim() : ''
		};
		event = new CustomEvent(eventName, { detail, cancelable: true });

		if (code) {
			eval(code);
		} else {
			this.dispatchEvent(event);
		}
	}

	addItem(event){
		return this._createEvent(event, 'add', event.srcElement);
	}

	_generateItems() {
		return this.items.map(item => {
			return html`
			<a @click="${this.filterSelection}" id="${item.id}">${item.text}
				<span hidden>
					<img class="panel-image" src="/images/edit-regular.svg" @click="${this._editItem}"> 
					<img class="panel-image" src="/images/trash-alt-regular.svg" @click="${this._deleteItem}"> 
				</span>
			</a>`
		});
	}

	render() {
		return html`
		<link rel="stylesheet" href="./css/bulma.min.css">

		<p class="panel-tabs">
			<a @click="${this.filterSelection}" class="is-active">All</a>
			${this._generateItems()}
			<a @click="${this.addItem}">
				<img class="panel-image" src="/images/plus-solid.svg">
			</a>
		</p>
    `;
	}

	static get styles() {
		return [
			css`
        :host {
          font-size: 62.5%;
			 color: #1a2b42;
        }

        .is-active {
				border-radius: 0.7rem;
				background-color: lightgray;
		  }

		  .panel-tabs {
				width: 100%;
				font-size: x-large;
		  }

		  .panel-image {
				height: 1rem;
				margin-bottom: inherit;
				padding-left: 0.2rem;
		  }
		`,
		];
	}
}

