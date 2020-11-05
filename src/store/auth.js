import Vue from 'vue'
//регистрация, авторизация и logout

export default {
   state: {
      userId: '',
      userLogin: '',
      userPass: '',
      userApproved: false,
      token: '',
      notifications: false,
      banStatus: false
   },
   mutations: {
      // задаем логин и пароль
      setUserData(state, data) {
         state.userLogin = data.login;
         state.userPass = data.password;
      },
      setId(state, id) {
         state.userId = id;
      },
      setToken(state, token) {
         state.token = token;
      },
      clearToken(state) {
         state.token = '';
      }
   },
   getters: {
      token: s => s.token
   },
   actions: {
      // Авторизация (получение токена)
      async login({commit}, {username, password}) {
         // Получаем токен
         await Vue.http.post('jwt-auth/v1/token', {username, password})
            .then(response => {
               //Получаем всё содержимое, все хедеры, статус и тд...
               return response.json();
            }) // Если хотим получить только чистые данные с id
            .then(response => {
               commit('setId', response.userId);
               // задаем токен
               commit('setToken', response.token);
               console.log(response);
            })
            .catch(function (error) {
               commit('setError', error.data.code);
               // this.$store.getters.error
               throw  error;
            });
      },
      // Выход (удаление токена)
      logout({commit}) {
         commit('clearToken');
      },
      // Ожидание токена
      waitToken({state}, fn) {
         if (state.token) {
            fn()
         } else {
            const interval = setInterval(() => {
               // если токен получен
               if (state.token) {
                  console.log('Токен получен')
                  clearInterval(interval)
                  fn()
               }
            }, 1000)
         }
      }

   }
}