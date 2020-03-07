// import Vue from 'vue'
import axios from 'axios'

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
            let requestParams = {}
            let dishes = []
            const url = '/api/v1/food/menu'
            requestParams = {
                url: url,
                method: 'GET',
            }
            axios(requestParams)
                .then(resp => {
                    if(resp.data.data){
                        for (let i = 0; i < resp.data.data.length; i++){
                            resp.data.data[i].dishes.forEach((item) => {
                                item.swipe = 'middle'
                                return item})
                        }
                        dishes = resp.data.data
                        console.log(resp.data.data)
                        commit('updateDates', dishes)
                        commit('setDishes')
                    }
                    },
                    err => {
                        console.log(err)
                    })
        }
    },
    getters:{
        dates(state){
            return state.dishes
        },
        currentDishes(state){
            return state.currentDishes.dishes
        }
    }
}