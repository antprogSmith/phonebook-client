const url = "http://localhost:4000";

export class Selection {
	async getPhoneBooks() {
		const query = `
				query {
					phoneBooks{
						id
						text
						phoneBookEntries{
						  id
						  cell
						  name
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

	async addBook(text) {
		const query = `
			mutation{
				createPhoneBook(data:{
					text:"${text}"
				}){
					id
					text
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

	async updateBook(id, text) {
		const query = `
			mutation{
				updatePhoneBook(id: "${id}", data:{
					text:"${text}"
				}){
					id
					text
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

	async deleteBook(id) {
		const query = `
			mutation{
				deletePhoneBook(id:"${id}"){
					id
					text
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
	
}