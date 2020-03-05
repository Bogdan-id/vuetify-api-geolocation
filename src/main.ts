import Vue from 'vue'
import App from './App.vue'
import store from './store'
import { createProvider } from './vue-apollo'
import i18n from './i18n'
import vuetify from './plugins/vuetify'
import vuelidate from 'vuelidate'

console.log(i18n)
console.log(vuelidate)
Vue.use(vuelidate)

Vue.config.productionTip = true

new Vue({
  store,
  apolloProvider: createProvider(),
  i18n,
  vuetify,
  render: h => h(App)
}).$mount('#app')
