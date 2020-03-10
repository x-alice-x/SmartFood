import Vue from 'vue'
import Vuex from 'vuex'
import dishesModule from './dishes'
import weekdaysModule from './weekdays'
import userModule from './user'
import cartModule from './cart'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        dishesModule,
        weekdaysModule,
        userModule,
        cartModule
    }
})