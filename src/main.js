// Vue components
import Vue from 'vue'
import Vuelidate from "vuelidate" //  валидатор форм
import VueResourse from 'vue-resource' // ajax
import App from './App.vue'
import router from './router'
import store from './store' // глобальная шина событий
import Loader from './components/app/Loader' // loader для приложения
import Notification from './components/app/Notification' // Уведомление для приложения
import ModalListAutocomplete from './components/app/Modal-list-autocomplete' // модальное окно с поиском по полученным данным


// Библиотеки
//import VueApexCharts from 'vue-apexcharts'; // построение графиков

// filters
import dateFilter from "@/filters/date.filter";
import cleanHTMLFilter from "@/filters/cleanHTML.filter";
// plugins
import toastsMessagePlugin from "@/plugins/toastsMessage.plugin";
// import './registerServiceWorker'
// import 'materialize-css/dist/js/materialize.min'

Vue.config.productionTip = false; //отключает предупреждение о работе в режиме разработки при запуске Vue

Vue.use(Vuelidate); // Подключение валидатора форм
Vue.use(VueResourse); // Подключение плагина для общения с сервером
// Прописываем глобально конфиг для vue-resource
// этот объект будет объединяться с this.$resource в компонентах
Vue.http.options.root = 'https://imobile76.ru/wp-json'; //http://localhost:8080/
// const wp_config = {
//    secretKey: "sanctum-secret-key",
//    token: ""
// };
// console.log(wp_config);

// Подключаем плагины и библиотеки глобально
//Vue.use(VueApexCharts); // графики
//Vue.component('apexchart', VueApexCharts);

Vue.use(toastsMessagePlugin); // собственный плагин всплывающих подсказок
// Подключаем фильтры глобально
Vue.filter("date", dateFilter);
Vue.filter("cleanHTML", cleanHTMLFilter);

// Подключаем личные компоненты
Vue.component('Loader', Loader);
Vue.component('Notification', Notification);
Vue.component('Modal-list-autocomplete', ModalListAutocomplete);

new Vue({
   router,
   store,
   render: h => h(App)
}).$mount('#app');

// после каждого перехода
router.afterEach((to) => {
   // добавить путь в store.routes, массив маршрутов
   store.commit('addRoute', to.fullPath)
   // store.commit('addRoute_v2', to.fullPath)
   // console.log(store.state.router.routes);
})

