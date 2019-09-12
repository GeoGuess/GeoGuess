import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'

Vue.config.productionTip = false

const updateSizes = (obj = {}) => {
	obj.width = window.innerWidth
	obj.height = window.innerHeight
	return obj
}

Object.defineProperty(Vue.prototype, '$viewport', {
	value: Vue.observable(updateSizes())
})

window.addEventListener('resize', () => {
	updateSizes(Vue.prototype.$viewport)
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
