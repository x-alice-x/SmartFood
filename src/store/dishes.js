// import Vue from 'vue'
import axios from 'axios'

export default {
    state:{
        dishes: []
    },
    mutations:{
        updateDishes(state, dishes) {
            state.dishes = dishes
        }
    },
    actions: {
        async fetchDishes({commit}) {
            let requestParams = {}
            let dishes = []
            const url = 'api/v1/food/menu/'
            requestParams = {
                url: url,
                method: 'GET',
            }
            axios(requestParams)
                .then(resp => {
                    dishes = resp.data.data
                    commit('updateDishes', dishes)
                    },
                    err => {
                        console.log(err)
                    })
        }
    },
    getters:{
        allDishes(state){
            return state.dishes
        }
    }
}