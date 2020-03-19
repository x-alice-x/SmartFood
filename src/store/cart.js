import axios from "axios";
export default {
	mutations: {

	},
	actions: {
		async OrderDish(commit, ids) {
			const url = "/api/v2/food/basket";
			console.log(ids, url);
			let requestParams = {
				url: url,
				method: "POST",
				params: { dish_id: ids.dish_id, menu_id: ids.menu_id }
			};
			await axios(requestParams).then(
				resp => {
					console.log(resp);
				},
				err => {
					console.log(err);
				}
			);
		},
		async DeleteDish(commit, ids) {
			const url = "/api/v2/food/basket";
			let requestParams = {
				url: url,
				method: "DELETE",
				params: { dish_id: ids.dish_id, menu_id: ids.menu_id }
			};
			await axios(requestParams).then(
				resp => {
					console.log(resp);
				},
				err => {
					console.log(err);
				}
			);
		},
		async BlackListChange(commit, ids) {
			let method = null
			ids.whichFunc ? method = "DELETE" : method = "POST"
			const url = "/api/v2/food/blacklist";
			let requestParams = {
				url: url,
				method: method,
				params: { dish_id: ids.dish_id, menu_id: ids.menu_id }
			};
			await axios(requestParams).then(
				resp => {
					console.log(resp);
				},
				err => {
					console.log(err);
				}
			);
		},
	}
}