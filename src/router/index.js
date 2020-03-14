import Vue from "vue";
import VueRouter from "vue-router";
import Store from "../store/index";
import Home from "../views/Home.vue";
import SignIn from "../views/SignIn.vue";
import NotFound from "../views/NotFound.vue"

Vue.use(VueRouter);

// const ifNotAuthenticated = async (to, from, next) => { // delete
// 	await Store.dispatch("CHECK_AUTHORIZED");
// 	if (!Store.getters.isUserAuthenticated) {
// 		next();
// 	}
// 	else {
// 		next("/menu");
// 	}
// };
// const ifAuthenticated = async (to, from, next) => {
// 	await Store.dispatch("CHECK_AUTHORIZED");
// 	if (Store.getters.isUserAuthenticated) {
// 		next();
// 	}
// 	else {
// 		next("/");
// 	}
// };

const routes = [
	{
		path: "/menu",
		name: "home",
		component: Home,
		// beforeEnter: ifAuthenticated
	},
	{
		path: "/",
		name: "signin",
		component: SignIn,
		// beforeEnter: ifNotAuthenticated
	},
	{
		path: "*",
		name: "notfound",
		component: NotFound
	}
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (Store.getters.isUserAuthenticated) {
            next()
            return
        }
        next('/')
    } else {
        next()
    }
})
export default router;
