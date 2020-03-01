import axios from "axios";

export default {
	state: {
		isAuthenticated: false,
		error: null
	},
	mutations: {
		SET_USER_AUTHENTICATED(state, payload) {
			state.isAuthenticated = payload;
		},
		SET_ERROR(state, payload) {
			state.error = payload;
		},
		CLEAR_ERROR(state) {
			state.error = null;
		}
	},
	actions: {
		async SignIn({ commit }, email) {
			commit("CLEAR_ERROR");			
			console.log(email);
			const url = "/api/v1/food/auth/login";
			let requestParams = {
				url: url,
				method: "POST",
				params: { email: email }
			};
			await axios(requestParams).then(
				resp => {
					console.log(resp);
					if (resp.data.success) {
						commit("SET_USER_AUTHENTICATED", true);
					}
				},
				err => {
					console.log(err.message);
					commit("SET_ERROR", err.message);
				}
			);
		},
		async Logout({ commit }) {
			commit("CLEAR_ERROR");
			const url = "/api/v1/food/auth/logout";
			let requestParams = {
				url: url,
				method: "POST"
			};
			axios(requestParams)
				.then(
					resp => {
						if (resp.data.success) {
							commit("SET_USER_AUTHENTICATED", false);
						}
					},
					err => {
						commit("SET_ERROR", err.message);
					}
				);
		}
	},
	getters: {
		isUserAuthenticated(state) {
			return state.isAuthenticated;
		},
		getError(state) {
			return state.error;
		}
	}
};
