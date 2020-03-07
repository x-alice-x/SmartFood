import axios from "axios";
import Vue from "vue";

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
			Vue.$cookies.set("email" ,email);
			console.log(Vue.$cookies.get("email"));
			commit("CLEAR_ERROR");
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
			await axios(requestParams).then(
				resp => {
					if (resp.data.success) {
						Vue.$cookies.remove("email");
						Vue.$cookies.remove("laravel_session");
						commit("SET_USER_AUTHENTICATED", false);
					}
				},
				err => {
					commit("SET_ERROR", err.message);
				}
			);
		},
		async CHECK_AUTHORIZED({ commit }) {
			console.log(Vue.$cookies.get("email"));
			if (Vue.$cookies.get("email")) {
				commit("SET_USER_AUTHENTICATED", true);
			} else {
				commit("SET_USER_AUTHENTICATED", false);
			}
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
