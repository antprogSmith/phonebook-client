import { LitElement, html, css } from 'lit-element';
import '../ant-modal';

export class AntContactChip extends LitElement {

	static get properties() {
		return {
			cargo: {type: Object},
			name : {type: String},
			img : {type: String},
			addUser: {type: Boolean},
		};
	}

	constructor() {
		super();

		this.name = '';
		this.img = 'images/person32.png';
	}

	firstUpdated() {
		this.modal = this.shadowRoot.querySelector('ant-modal');
	}



	_confirmDelete(event) {
		const code = this.getAttribute('delete');
		event.preventDefault();
		event.cancelBubble = true;

		event = new CustomEvent('delete', { detail: this.cargo, cancelable: true });

		if (code) {
			eval(code);
		} else {
			this.dispatchEvent(event);
		}
	}

	_editChip(event) {
		const code = this.getAttribute('edit');
		event.preventDefault();
		event.cancelBubble = true;

		event = new CustomEvent('edit', { detail: this.cargo, cancelable: true });

		if (code) {
			eval(code);
		} else {
			this.dispatchEvent(event);
		}
	}

	_selected(event){
		const code = this.getAttribute('selected');
		event.preventDefault();
		event.cancelBubble = true;

		event = new CustomEvent('selected', { detail: this.cargo, cancelable: true });

		if (code) {
			eval(code);
		} else {
			this.dispatchEvent(event);
		}
	}


	_closeChip(event){
		this.modal.open();
		event.preventDefault();
		event.cancelBubble = true;
	}

	render() {
		this.img = this.img === undefined ? 'images/person32.png' : this.img;

		return html`
		<div class="chip" img="${this.img}" name="${this.name}" @click="${this._selected}">
			${!this.addUser ? html`<img alt="Edit contact" class="editBtn" src='images/pencil32.png' title="Edit" @click="${this._editChip}"/>` : ''}

			<img alt="Contact image" id="contactImage" src="${this.img}" width="96" height="96"/>
			<span id="personName">${this.name}</span>

			${!this.addUser ? html`<span class="closebtn" @click="${this._closeChip}" title="Delete">×</span>` : ''}
			
		
			<ant-modal headertext="Are you sure?" confirmtext="OK" canceltext="Cancel"
				@confirm="${this._confirmDelete}">
				Delete contact
			</ant-modal>
		 </div>`;

	}


	static get styles() {
		return [
			css`
        :host {
          font-size: 62.5%;
			 color: #1a2b42;
        }

		  .chip {
				display: inline-block;
				padding: 0 25px;
				height: 50px;
				font-size: 16px;
				line-height: 50px;
				border-radius: 25px;
				background-color: #b2c0d2;
			}
			
			.chip img {
				float: left;
				margin: 0 10px 0 -25px;
				height: 50px;
				width: 50px;
				border-radius: 50%;
			}

			.closebtn {
				padding-left: 10px;
				color: #888;
				font-weight: bold;
				float: right;
				font-size: 20px;
				cursor: pointer;
			}
			
			.closebtn:hover {
				color: #000;
			}

			.editBtn {
				width: unset !important; 
				height: unset !important;
				padding: 8px;
				float: right;
				cursor: pointer;				
				border-radius: unset;
			}
		`,
		];
	}

}



