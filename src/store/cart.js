import axios from "axios";
export default {
	mutations: {

	},
	actions: {
		async OrderDish(dish_id, menu_id) {
			const url = "/api/v1/food/basket";
			let requestParams = {
				url: url,
				method: "POST",
				params: { dish_id: dish_id, menu_id: menu_id }
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
		async DeleteDish(dish_id, menu_id) {
			const url = "/api/v1/food/basket";
			let requestParams = {
				url: url,
				method: "DEL",
				params: { dish_id: dish_id, menu_id: menu_id }
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