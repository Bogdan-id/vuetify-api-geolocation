import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
		language: null,
  },
  mutations: {
		changeLanguage(state, value) {
			state.language = value
		}
  },
  actions: {
		changeLanguage({commit}, value) {
			commit('change_language', value)
		}
	}
})
