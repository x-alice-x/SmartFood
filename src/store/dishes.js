// import Vue from 'vue'
import axios from 'axios';
import Router from 'vue-router';

export default {
    state:{
        dishes: [],
        currentDishes: 0
    },
    mutations:{
        updateDates(state, dishes) {
            state.dishes = dishes
        },
        setDishes(state, index) {
            if (index){
                state.currentDishes = state.dishes[index]
            }
            else{
                state.currentDishes = state.dishes[0]
            }
        }
    },
    actions: {
        async fetchMenu({commit}) {
            commit("CLEAR_ERROR");
            let requestParams = {}
            let dishes = []
            const url = '/api/v1/food/menu'
            requestParams = {
                url: url,
                method: 'GET',
            }
            await axios(requestParams)
                .then(resp => {
                    if(resp.data.data){
                        for (let i = 0; i < resp.data.data.length; i++){
                            resp.data.data[i].dishes.forEach((item) => {
                                item.swipe = 'middle'
                                return item})
                            for (let j = 0; j < resp.data.data[i].dishes.length; j++){
                                if (resp.data.data[i].dishes[j].image === 'https://edatomsk.ru/images/delivery/delivery.svg'){
                                    resp.data.data[i].dishes[j].image = 'https://imageog.flaticon.com/icons/png/512/60/60847.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF'
                                }
                            }
                        }
                        dishes = resp.data.data
                        commit('updateDates', dishes)
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
            return state.dishes
        },
        currentDishes(state){
            return state.currentDishes
        }
    }
}