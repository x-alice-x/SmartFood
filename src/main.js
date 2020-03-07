import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueCookies from 'vue-cookies'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VModal from 'vue-js-modal'
import 'swiper/dist/css/swiper.css'
import Vue2TouchEvents from 'vue2-touch-events'

Vue.use(Vue2TouchEvents)

Vue.config.productionTip = false

Vue.use(VueCookies)
Vue.use(VueAwesomeSwiper)
Vue.use(VModal)

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
