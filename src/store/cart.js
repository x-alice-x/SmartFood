import axios from "axios";
export default {
	state: {
		todayCart: [],
		dateIndex: 0,
		cart: []
	},
	mutations: {
		SET_CART(state, index) {
			if (index) {
                state.dateIndex = index
                state.todayCart = state.cart[state.dateIndex]
            } else {
                if (index == 0) {
					state.todayCart = state.cart[0]
					console.log("todayCart", state.todayCart)
                } else {
                    state.todayCart = state.cart[state.dateIndex]
                }
            }
		},
		UPDATE_CART(state, cart) {
			state.cart = cart;
		}
	},
	actions: {
		async fetchCart({commit}) {
			const url = "/api/v2/food/basket";
			let cart = [];
			let requestParams = {
				url: url,
				method: "GET"
			};
			await axios(requestParams).then(
				resp => {
					if (resp.data.data) {
						console.log(resp.data.data[0])
						cart = resp.data.data;
						commit("UPDATE_CART", cart);
						commit("SET_CART");
					}
				},
				err => {
					console.log(err);
				}
			);
		},

		async OrderDish(commit, ids) {
			const url = "/api/v2/food/basket";
			console.log(ids, url);
			let requestParams = {
				url: url,
				method: "POST",
				params: { dish_id: ids.dish_id, menu_id: ids.menu_id, count: ids.count}
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
				params: { dish_id: ids.dish_id, menu_id: ids.menu_id, count: ids.count }
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
	},
	getters: {
		getTodayCart(state) {
			return state.todayCart;
		}
	}
}