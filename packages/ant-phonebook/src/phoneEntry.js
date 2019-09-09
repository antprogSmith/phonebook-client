const url = "http://localhost:4000";

export class PhoneEntry {
	async addEntry(name, cell, img, phoneBookId) {
		const query = `
		mutation{
			createPhoneBookEntry(data:{
			  name:"${name}",
			  cell:"${cell}",
			  img:"${img}",
			  phoneBookId:"${phoneBookId}"
			}){
			  id
			  cell
			  name
			  img
			  phoneBook{
				id
				text
				img
			 }
			}
		 }
		`;

		const opts = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ query })
		};

		return fetch(url, opts)
			.then(res => res.json());
	}

	async updateEntry(id, name, cell, img) {
		const query = `
		mutation{
			updatePhoneBookEntry(id:"${id}", data:{
			  name:"${name}",
			  cell:"${cell}",
			  img:"${img}"
			}){
			  id
			  cell
			  name
			  img
			}
		 }
		`;
		const opts = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ query })
		};

		return fetch(url, opts)
			.then(res => res.json());
	}

	async deleteEntry(id) {
		const query = `
		mutation{
			deletePhoneBookEntry(id:"${id}"){
			  id
			  cell
			  name
			  img
			}
		}`;

		const opts = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ query })
		};

		return fetch(url, opts)
			.then(res => res.json());
	}
	
}