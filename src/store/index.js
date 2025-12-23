import { createStore } from 'vuex'
import state from './state.js'
import mutations from './mutations.js'
import actions from './actions.js'
import getters from './getters.js'

/**
 * Main Vuex Store
 * Combines all store modules for the horse racing game
 */
export default createStore({
  state,
  mutations,
  actions,
  getters,
  modules: {
    // Future modules can be added here
  }
})