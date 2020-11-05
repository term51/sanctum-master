import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import layout from './layout'
import datePicker from './datePicker'
import objectInfo from './objectInfo'
import router from './router'

Vue.use(Vuex);

export default new Vuex.Store({
   state: {
      message: null,
      error: null,
      accentColors: { // Системные цвета
         black: '#424852',
         blue: '#5E9CEA',
         lightBlue: '#72ebf1',
         green: '#9ED26A',
         red: '#FB836F',
         gray: '#E4E8EB',
         aquamarine: '#61DDBC',
         orange: '#FDCD56'
      }
   },
   mutations: {
      // Задаем ошибку
      setMessage(state, message) {
         state.message = message;
      },
      // очищаем message
      clearMessage(state) {
         state.message = null;
      },
      // Задаем ошибку
      setError(state, error) {
         state.error = error;
      },
      // очищаем ошибку
      clearError(state) {
         state.error = null;
      }
   },
   getters: {
      message: s => s.message,
      error: s => s.error
   },
   actions: {},
   modules: {
      layout,
      auth,
      datePicker,
      objectInfo,
      router
   }
})
