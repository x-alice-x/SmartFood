import axios from "axios";
export default {
	mutations: {

	},
	actions: {
		async OrderDish(commit, ids) {
			const url = "/api/v1/food/basket";
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
			const url = "/api/v1/food/basket";
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
		}
	}
}