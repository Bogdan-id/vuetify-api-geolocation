import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
		language: null,
  },
  mutations: {
		change_language(state, value) {
			state.language = value
		}
  },
  actions: {
		change_language({commit}, value) {
			commit('change_language', value)
		}
	}
})
