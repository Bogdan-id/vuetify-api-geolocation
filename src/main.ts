import Vue from 'vue'
import App from './App.vue'
import store from './store'
import { createProvider } from './vue-apollo'
import i18n from './i18n'
import vuetify from './plugins/vuetify'
import Vuelidate from 'vuelidate'

Vue.config.productionTip = true

// instead of use 'Vue.use()' you can just add library instance in new Veu({})
new Vue({
  store,
  apolloProvider: createProvider(),
  i18n,
	vuetify,
	Vuelidate,
  render: h => h(App)
}).$mount('#app')
