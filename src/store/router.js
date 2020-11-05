// Формирование массива переходов по страницам
export default {
   state: {
      routes: ['/'],
      route: ''
   },
   getters: {},
   mutations: {
      // addRoute_v2(state, route) {
      //    state.route = route
      //    console.log('in',state.route);
      //    let regex = /\/([^\/]+)?$/
      //    let vasya = state.route.split(regex)
      //    console.log('out',vasya);
      // },
      addRoute(state, route) {
         const lastElement = state.routes.length - 1
         if (state.routes[lastElement] !== route) state.routes.push(route)

      },

      deleteRoute(state) {
         state.routes.pop()
      }
   },
   actions: {}
}