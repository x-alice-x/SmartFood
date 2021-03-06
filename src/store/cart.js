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
                console.log(state.todayCart);
            } else {
                if (index == 0) {
                    state.todayCart = state.cart[0]
                    console.log("todayCart", state.todayCart)
                } else {
                    state.todayCart = state.cart[state.dateIndex]
                }
            }
            console.log(state.todayCart)
        },
        UPDATE_CART(state, cart) {
            state.cart = cart;
        },
        showTransitionCart(state, payload) {
            if (payload.name === 'left') {
                state.todayCart.basket_dishes[payload.indexDishes].showTransitionLeft = payload.bool
            } else if (payload.name === 'right') {
                state.todayCart.basket_dishes[payload.indexDishes].showTransitionRight = payload.bool
            } else if (payload.name === 'all') {
                state.todayCart.basket_dishes[payload.indexDishes].showTransitionLeft = payload.bool
                state.todayCart.basket_dishes[payload.indexDishes].showTransitionRight = payload.bool
            }
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
                        for (let i = 0; i < resp.data.data.length; i++) {
                            for (let j = 0; j < resp.data.data[i].basket_dishes.length; j++) {
                                if (resp.data.data[i].basket_dishes[j].image === 'https://edatomsk.ru/images/delivery/delivery.svg') {
                                    resp.data.data[i].basket_dishes[j].image = 'https://image.flaticon.com/icons/svg/857/857681.svg'
                                }
                                resp.data.data[i].basket_dishes[j].count =
                                    resp.data.data[i].basket_dishes[j].count.toString().replace(/\.0/, '');
                                resp.data.data[i].basket_dishes[j].showTransitionLeft = false;
                                resp.data.data[i].basket_dishes[j].showTransitionRight = false;
                            }
                        }
                        cart = resp.data.data;
                        console.log(cart);
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
                params: {dish_id: ids.dish_id, menu_id: ids.menu_id, count: ids.count}
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
                params: {dish_id: ids.dish_id, menu_id: ids.menu_id, count: ids.count}
            };
            await axios(requestParams).then(
                resp => {
                    console.log(resp);
                },
                err => {
                    console.log(err.response.data);
                }
            );
        },
        async ClearCart(commit, del) {
            const url = "/api/v2/food/basket/all";
            let requestParams = {
                url: url,
                method: "DELETE",
                params: {menu_id: del.menu_id}
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
                params: {dish_id: ids.dish_id, menu_id: ids.menu_id}
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
        },
        getCartSum(state) {
            return state.todayCart.basket_summ;
        },
        getLimit(state) {
            return state.todayCart.basket_summ_limit;
        },
        getCart(state) {
            return state.cart;
        }
    }
}