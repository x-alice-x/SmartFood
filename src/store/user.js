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
		},
	},
	actions: {
		SignIn({ commit }, email) {
			return new Promise((resolve, reject) => {
				commit("CLEAR_ERROR");
				Vue.$cookies.remove("email");
				Vue.$cookies.remove("name");
				Vue.$cookies.remove("photo");

				const url = "/api/v2/food/auth/login";
				let requestParams = {
					url: url,
					method: "POST",
					params: { email: email }
				};
				axios(requestParams).then(
					resp => {
						if (resp.data.success) {
							commit("SET_USER_AUTHENTICATED", true);
							Vue.$cookies.set("email" ,email);
							Vue.$cookies.set("name", resp.data.data.name);
							Vue.$cookies.set("photo", resp.data.data.photo);
							resolve("OK");
						}
					},
					err => {
						commit("SET_ERROR", err.message);
						reject(err);
					}
				);
			});
		},
		async Logout({ commit }) {
			commit("CLEAR_ERROR");
			const url = "/api/v2/food/auth/logout";
			let requestParams = {
				url: url,
				method: "POST"
			};
			await axios(requestParams).then(
				resp => {
					if (resp.data.success) {
						Vue.$cookies.remove("email");
						Vue.$cookies.remove("name");
						Vue.$cookies.remove("photo");
						commit("SET_USER_AUTHENTICATED", false);
					}
				},
				err => {
					commit("SET_ERROR", err.status);
					commit("SET_USER_AUTHENTICATED", true);
				}
			);
		},
		async CHECK_AUTHORIZED({ commit }) {
			if (Vue.$cookies.get("name")) {
				commit("SET_USER_AUTHENTICATED", true);
			} else {
				commit("SET_USER_AUTHENTICATED", false);
			}
		},
		async SetNotAuth({ commit }) {
			commit("SET_USER_AUTHENTICATED", false);
		},
		async ClearCookies() {
			Vue.$cookies.remove("email");
			Vue.$cookies.remove("name");
			Vue.$cookies.remove("photo");
		}
	},
	getters: {
		isUserAuthenticated(state) {
			return state.isAuthenticated;
		},
		getError(state) {
			return state.error;
		},
		getUserEmail() {
			return Vue.$cookies.get("email");
		},
		getUserName() {
			return Vue.$cookies.get("name");
		},
		getUserPhoto() {
			return Vue.$cookies.get("photo");
		}
	}
};
