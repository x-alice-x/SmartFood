// import Vue from 'vue'
import axios from 'axios';

export default {
    state:{
        menu: [],
        todayMenu: [],
        dateIndex: 0
    },
    mutations:{
        updateDates(state, dishes) {
            state.menu = dishes
        },
        setDishes(state, index) {
            if (index){
                state.dateIndex = index
                state.todayMenu = state.menu[state.dateIndex]
            }
            else{
                if (index === 0){
                    state.todayMenu = state.menu[0]
                }
                else{
                    state.todayMenu = state.menu[state.dateIndex]
                }
            }
        }
    },
    actions: {
        async fetchMenu({commit}, blackList = 0) {
            commit("CLEAR_ERROR");
            let requestParams = {}
            let menu = []
            const url = '/api/v2/food/menu'
            requestParams = {
                url: url,
                method: 'GET',
                params: {with_blacklist: blackList}
            }
            await axios(requestParams)
                .then(resp => {
                    if(resp.data.data){
                        // for (let i = 0; i < resp.data.data.length; i++){
                        //     for (let j = 0; j < resp.data.data[i].dishes.length; j++){
                        //         if (resp.data.data[i].dishes[j].image === 'https://edatomsk.ru/images/delivery/delivery.svg'){
                        //             resp.data.data[i].dishes[j].image = 'https://image.flaticon.com/icons/svg/857/857681.svg'
                        //         }
                        //     }
                        // }
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
    getters:{
        dates(state){
            return state.menu
        },
        todayMenu(state){
            return state.todayMenu
        }
    }
}