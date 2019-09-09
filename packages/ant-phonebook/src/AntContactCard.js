import { LitElement, html, css } from 'lit-element';
import '../ant-modal';


export class AntContactCard extends LitElement {
	static get properties() {
		return {
			name: { type: String },
			phone: { type: String },
			contactId: { type: String },
			phoneBookId: { type: String },
			img: { type: String },
		};
	}


	firstUpdated(){
		this.selectPhoto = this.shadowRoot.querySelector('#selectPhoto');
		this.avatar = this.shadowRoot.querySelector('#avatar');
	}

	_save(event) {
		const img = this.shadowRoot.querySelector('#avatar').src.replace(window.location.href, '');
		const detail = {
			name: this.shadowRoot.querySelector('#personName').value,
			phone: this.shadowRoot.querySelector('#phone').value,
			id: this.contactId,
			phoneBookId: this.phoneBookId,
			img
		};
		event = new CustomEvent('save', { detail, bubbles: true, composed: true });

		const code = this.getAttribute('save');
		if (code) {
			eval(code);
		} else {
			this.dispatchEvent(event);
		}
	}

	_cancel(event) {
		const code = this.getAttribute('cancel');
		if (code) {
			eval(code);
		} else {
			const cancelEvent = new CustomEvent('cancel', { bubbles: true, composed: true });
			this.dispatchEvent(cancelEvent);
		}
	}

	_setAvatar(event) {
		this.selectPhoto.click();
	}

	photoSelected(event) {
		for (let i = 0; i < event.target.files.length; i++) {
			const file = event.target.files[i];
			const reader = new FileReader();
			const me = this;
			reader.onload = function (e) {
				me.avatar.src = reader.result;
			}
			reader.readAsDataURL(file);
		}

	}


	static get styles() {
		return [
			css`
				.card {
					box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
					transition: 0.3s;
					text-align: center;
					max-width: 310px;
					margin: auto;
					background-color: aliceblue;
					z-index: 20;
					top:20%;
					left: 0;
					right: 0;
					position: absolute;
				}
				
				.card:hover {
					box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
				}
				
				.container {
					padding: 2px 16px;
				}

				.image {
					width: 10rem;
				}

				button {
					border: none;
					outline: 0;
					display: inline-block;
					padding: 8px;
					color: white;
					background-color: #000;
					text-align: center;
					cursor: pointer;
					width: 40%;
					font-size: 18px;
				}

				button:hover {
					box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
				}

				.smallButton {
					padding: unset;
					width: auto;
					font-size: small;
				}

				.not-match-password {
					color: red;
				}

				.buttons {
					margin-top: 1rem;
					margin-bottom: 1rem;
				}

				.input-group {
					padding-top: 0.7rem;
				}
			`
		];
	}


	render() {
		const name = this.name || '';
		const phone = this.phone || '';
		const img = this.img || 'images/img_avatar.png';

		return html`
		<div class="card">
			<img class="image" id="avatar" src="${img}" alt="avatar" @click="${this._setAvatar}">
			<div class="container">
				<section>
					<div class="input-group">
						<label for="personName">Name:&nbsp;</label>
						<input type="text" placeholder="contact name" value="${name}" id="personName"/>
					</div>
					<div class="input-group">
						<label for="phone">Phone:</label>
						<input type="text" id="phone" placeholder="phone number" value="${phone}"/>
					</div>
					<input type="file" accept="image/*" id="selectPhoto" 
						@change="${this.photoSelected}"
						style="visibility: hidden; width: 5px; display: contents;">
				</section>
				<section class="buttons">
					<button id="save" @click="${this._save}">Save</button>
					<button id="cancel" @click="${this._cancel}">Cancel</button>
				</section>
			</div>
		</div>`;
	}
}
