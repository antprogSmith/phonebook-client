import { LitElement, html, css } from 'lit-element';

export class AntModal extends LitElement {

	static get styles() {
		return css`
			:host {
				display: block;
			}

			:host([opened]) #backdrop,
			:host([opened]) #modal {
				opacity: 1;
				pointer-events: all;
			}

			:host([opened]) #modal {
				top: 15vh;
			}

			#backdrop {
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100vh;
				background: rgba(0,0,0,0.75);
				z-index: 10;
				opacity: 0;
				pointer-events: none;
			}

			#modal {
				position: fixed;
				top: 10vh;
				left: 25%;
				width: 50%;
				z-index: 100;
				background: white;
				border-radius: 3px;
				box-shadow: 0 2px 8px rgba(0,0,0,0.26);
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				opacity: 0;
				pointer-events: none;
				transition: all 0.3s ease-out;
			}

			header {
				padding: 1rem;
				border-bottom: 1px solid #ccc;
				background-color: lightgray;
			}

			::slotted(h1) {
				font-size: 1.25rem;
				margin: 0;
			}

			#main {
				padding: 1rem;
			}

			#actions {
				border-top: 1px solid #ccc;
				padding: 1rem;
				display: flex;
				justify-content: flex-end;
			}

			#actions button {
				margin: 0 0.25rem;
			}

			button {
				border-top: 1px solid #ccc;
				padding: 1rem;
				border: none;
				outline: 0;
				display: inline-block;
				padding: 8px;
				color: white;
				background-color: #000;
				text-align: center;
				cursor: pointer;
				font-size: 18px;
				margin: 0 0.25rem;
			}

			button:hover {
				box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
			}
	 `;
	}

	static get properties() {
		return {
			opened: {type: Boolean},
			confirmText : {type: String},
			cancelText : {type: String},
			headerText : {type: String},
			help: {type: Boolean},
			disableBackgroundClickable: {type: Boolean},
			cargo: {type: Object},
		};
	}

	constructor() {
		super();
		this.confirmText = "Confirm";
		this.cancelText = "Cancel";
		this.headerText = "Confirm";
		this.help = false;
		this.disableBackgroundClickable = false;
		this.cargo = {};
	}

	hide(event) {
		event.preventDefault();
		event.cancelBubble = true;
		this.removeAttribute('opened');
	}


	open() {
		this.setAttribute('opened', '');
	}


	_cancel(event) {
		this.hide(event);

		const code = this.getAttribute('cancel');
		if (code) {
			eval(code);
		} else {
			event = new CustomEvent('cancel', { bubbles: true, composed: true });
			this.dispatchEvent(event);
		}
	}

	_confirm(event) {
		this.hide(event);

		const code = this.getAttribute('confirm');
		if (code) {
			eval(code);
		} else {
			const detail = {event: 'confirm', cargo: this.cargo};
			event = new CustomEvent('confirm', { detail, bubbles: true, composed: true });
			this.dispatchEvent(event);
		}
	}

	// Leave the Bad indentation totally on the  left.
	// It shows as Help to users, and indentation is unwanted
	render() {
		if (this.help){
			return html`
<textarea rows="5" cols="50">
Example Usage
<ant-modal opened help confirmtext="OK" disablebackgroundclickable canceltext="Cancel" 
	confirm="alert('ok')" cancel="alert('cancel')" headertext="Are you sure?">
	<div slot="title">Add to cart</div>
	<div>My custom text</div>
	<div slot="footer">
		<button click="alert('Custom click')">Custom</button>
		<button id="cancel-button">Cancel</button>
		<button id="confirm-button">OK</button>
	</div>
</ant-modal>
</textarea>
			`;
		}


		let backdrop;
		if (this.disableBackgroundClickable === false) {
			backdrop = html`<div id="backdrop" @click=${this._cancel}></div>`;
		} else {
			backdrop = html`<div id="backdrop"></div>`;
		};


		return html`
		<div class="modal-container">
		<i class="fas fa-fish"></i>
			${backdrop}			
			<div id="modal">
				<header>
					<slot name="title"><h1>${this.headerText}</h1></slot>
				</header>
				<section id="main">
					<slot></slot>
				</section>
				<section id="actions">
					<slot name="footer">
						<button id="cancel-button" @click=${this._cancel}>${this.cancelText}</button>
						<button id="confirm-button" @click=${this._confirm}>${this.confirmText}</button> 
					</slot>
				</section>
			</div>
		</div>
	 `;
	}
}
