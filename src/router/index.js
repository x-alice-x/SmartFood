import Vue from "vue";
import VueRouter from "vue-router";
import Store from "../store/index";
import Home from "../views/Home.vue";
import SignIn from "../views/SignIn.vue";

Vue.use(VueRouter);

const ifNotAuthenticated = async (to, from, next) => {
	await Store.dispatch("CHECK_AUTHORIZED");
	console.log(Store.getters.isUserAuthenticated);
	if (!Store.getters.isUserAuthenticated) {
		next();
	}
	else {
		next("/");
	}
};
const ifAuthenticated = async (to, from, next) => {
	await Store.dispatch("CHECK_AUTHORIZED");
	if (Store.getters.isUserAuthenticated) {
		next();
	}
	else {
		next("/signin");
	}
};

const routes = [
	{
		path: "/",
		name: "home",
		component: Home,
		beforeEnter: ifAuthenticated
	},
	{
		path: "/signin",
		name: "signin",
		component: SignIn,
		beforeEnter: ifNotAuthenticated
	}
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes
});

export default router;
