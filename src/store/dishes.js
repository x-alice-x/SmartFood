// import Vue from 'vue'
import axios from 'axios';

export default {

    state: {
        menu: [],
        todayMenu: [],
        dateIndex: 0
    },
    mutations: {
        updateDates(state, dishes) {
            state.menu = dishes
        },
        setDishes(state, index) {
            if (index) {
                state.dateIndex = index
                state.todayMenu = state.menu[state.dateIndex]
            } else {
                if (index === 0) {
                    state.todayMenu = state.menu[0]
                } else {
                    state.todayMenu = state.menu[state.dateIndex]
                }
            }
        },
        showBlackList(state, payload) {
            state.todayMenu.categories[payload.indexCategory].dishes[payload.indexDishes].showBlackList = payload.bool
        },
        showTransition(state, payload) {
            state.todayMenu.categories[payload.indexCategory].dishes[payload.indexDishes].showTransition = payload.bool
        }
    },
    actions: {
        async fetchMenu({ commit }, blackList = 1) {
            commit("CLEAR_ERROR");
            let requestParams = {}
            let menu = []
            const url = '/api/v2/food/menu'
            requestParams = {
                url: url,
                method: 'GET',
                params: { with_blacklist: blackList }
            }
            await axios(requestParams)
                .then(resp => {
                        if (resp.data.data) {
                            for (let i = 0; i < resp.data.data.length; i++) {
                                for (let j = 0; j < resp.data.data[i].categories.length; j++) {
                                    for (let k = 0; k < resp.data.data[i].categories[j].dishes.length; k++) {
                                        if (resp.data.data[i].categories[j].dishes[k].image === 'https://edatomsk.ru/images/delivery/delivery.svg') {
<<<<<<< HEAD
                                            resp.data.data[i].categories[j].dishes[k].image = '../assets/img/dish_placeholder.svg'
=======
                                            // resp.data.data[i].categories[j].dishes[k].image = 'https://image.flaticon.com/icons/svg/857/857681.svg'
                                            resp.data.data[i].categories[j].dishes[k].image = 'https://image.flaticon.com/icons/svg/637/637129.svg';
>>>>>>> f4f0f2f7131dcd915340ac93686297feff5622b6
                                        }
                                        resp.data.data[i].categories[j].dishes[k].showBlackList = true;
                                        resp.data.data[i].categories[j].dishes[k].showTransition = false;
                                        resp.data.data[i].categories[j].dishes[k].in_basket_count =
                                            resp.data.data[i].categories[j].dishes[k].in_basket_count.toString().replace(/.0/, '');
                                    }
                                }
                            }
                            menu = resp.data.data
                            console.log(menu)
                            commit('updateDates', menu)
                            commit('setDishes')
                        }
                    },
                    err => {
                        console.log(err);
                        commit("SET_ERROR", err);
                    })
        }
    },

    getters: {
        dates(state) {
            return state.menu
        },
        todayMenu(state) {
            return state.todayMenu
        }
    }
}
