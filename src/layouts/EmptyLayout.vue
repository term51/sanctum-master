<template>
   <!--Header-->
   <div>
      <div class="header-nav-wrap" :style="'background-color:' + navColor">
         <div class="row">
            <div class="container">
               <div class="row">
                  <div class="col s2">
                     <a v-if="showBack" class="grey lighten-4 waves-effect waves-dark btn-back" @click="navBack"><img
                        :src="imgBackUrl"></a>
                  </div>
                  <div class="col s8 header-nav-title-wrap valign-wrapper">
                     <h1 :style="'color:'+ navTextColor" class="header-nav-title center-align">{{navText}}</h1>
                  </div>
                  <div class="col s2">
                     <router-link v-if="showHome /*&& haveToken*/" to="/" class="right btn-home">
                        <img :src="imgHomeUrl">
                     </router-link>
                     <a title="Выход из приложения" href="#" v-if="this.$route.fullPath === '/'" @click.prevent="logout" class="right btn-logout">
                        <img :src="imgLogoutUrl" alt="">
                     </a>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <!-- Содержимое компонентов-->
      <div class="container">
         <div class="row">
            <transition name="slide" mode="out-in">
               <router-view/>
            </transition>
         </div>
      </div>
   </div>

   <!--   <div class="grey darken-1 empty-layout">-->
   <!--      -->
   <!--   </div>-->
</template>

<script>
   //импортируем сообщения
   import messages from '@/plugins/toastsMessages';
   import Vue from "vue";
   import store from "../store";

   export default {
      created() {
         this.getToken();
      },
      methods: {
         navBack() {
            // this.$router.go(-1)
            store.commit('deleteRoute')
            const lastElement = store.state.router.routes.length - 1
            this.$router.push(store.state.router.routes[lastElement])
            // console.log(store.state.router.routes);
         },
         // получить куки по названию
         getCookie(name) {
            let matches = document.cookie.match(new RegExp(
               '(?:^|; )' + name.replace(/([.$?*+\\/{}|()[]^])/g, '\\$1') + '=(.*?)(?:;|$)'
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
         },
         // Выход из учетной записи
         async logout() {
            // await this.$store.dispatch('logout');
            // this.$router.push('/login?message=logout');
            // удаление куки
            let date = new Date();
            date.setTime(date.getTime() - 1);
            document.cookie = `token=; expires=${date.toUTCString()}; domain=imobile76.ru`;
            window.location = 'https://login.imobile76.ru/?message=logout';
         },
         async getToken() {
            try {
               // production - работа с авторизацией через login.*domain*.ru; development и др. - локальная авторизация
               if (process.env.NODE_ENV === 'production') {
                  // получить токен из куки
                  this.$store.state.auth.token = this.getCookie('token');
                  this.$store.state.auth.userId = this.getCookie('user');
                  // Если токена нет или он не валидный - перекидываем на модуль авторизации
                  if (typeof this.$store.state.auth.token === 'undefined') {
                     window.location = 'https://login.imobile76.ru/?message=authorization';
                  }
                  console.log(this.$store.state.auth)
               } else {
                  // если другой режим производится локальная авторизация
                  await this.$store.dispatch('login', {username: '79385196323', password: '123'});
                  console.log(this.$store.state.auth);
               }


               // Интерсепртор для всех запросов
               Vue.http.interceptors.push(request => {
                  // При отправке данных на сервер добавим информации в хедеры
                  // Функция принимает 2 параметра, 1 - название Хедера, 2 - значение (токен для авторизации)
                  request.headers.set('Authorization', 'Bearer ' + this.$store.state.auth.token)
               });
               // Interceptors - обрабатывают каждый из запросов уходящий на сервер и в определяемой функции модифицирует данный запрос.
               // Например для безопасности нужно отправлять токен вместе с запросом. Сервер проверит наличие токена и выдаст ответ.

            } catch (e) {
               console.log('catch login.vue');
               console.log(e);
            }
         }
      },
      mounted() {
      },
      computed: {
         // Если что-то обновится в глобальной шине message, то автоматически сработает метод message()
         message() {
            return this.$store.getters.message;
         },
         // Если что-то обновится в глобальной шине error, то автоматически сработает метод error()
         error() {
            return this.$store.getters.error;
         },
         // получаем состояние цвета из Vuex
         navColor() {
            return this.$store.state.layout.headerNav.Color;
         },
         navText() {
            return this.$store.state.layout.headerNav.Text;
         },
         // получаем Урлы иконок
         imgHomeUrl() {
            return this.$store.state.layout.headerNav.HomeImgUrl;
         },
         imgBackUrl() {
            return require(`@/img/left_arrow.svg`);
         },
         imgLogoutUrl() {
            return require(`@/img/logout.svg`)
         },
         // Получаем цвет текста
         navTextColor() {
            return this.$store.state.layout.headerNav.TextColor;
         },
         showBack() {
            return this.$store.state.layout.headerNav.ShowBack;
         },
         showHome() {
            return this.$store.state.layout.headerNav.ShowHome;
         },
         haveToken() {
            if (this.$store.getters.token) {
               return true;
            } else {
               return false;
            }
         }
      },
      // отследить ошибки
      watch: {
         message(wpMessage) {
            if (wpMessage !== null)
               this.$message(wpMessage);
         },
         error(wpError) {
            // console.log(wpError);
            if (wpError !== null)
               this.$error(messages[wpError] || 'Что-то пошло не так');
         }
      }

   }
</script>

<style lang="scss">

   //###settings###
   //fonts
   $font-main: "Roboto", sans-serif;
   $font-color-light: #fff;
   $font-color-dark: #000;
   $font-size-small: 14px;

   //buttons
   $btn-wh-small: 32px;
   $btn-lh-small: 32px;
   $fz-btn-small: 20px;
   $fz-btn-medium: 34px;
   //header-nav
   $header-nav-height: 50px;

   //toasts
   $toast-error-color: #fb4f33;


   * {
      font-family: $font-main;
   }

   .mt-5 {
      margin-top: 50px;
   }

   .header-nav {
      &-wrap {
         height: $header-nav-height;

         .btn {

            &-back, &-home, &-logout {
               margin-top: 8px;
               width: $btn-wh-small;
               height: $btn-wh-small;
               line-height: $btn-lh-small;
               color: $font-color-dark;
               font-size: $fz-btn-small;
               text-align: center;
            }

            &-home {
               font-size: $fz-btn-medium;
            }
         }

      }

      &-title {
         &-wrap {
            height: $header-nav-height;
         }

         width: 100%;
         font-size: $font-size-small;
         line-height: 25px;
         text-align: center;
         //font-family: $font-main;
         font-weight: 500;
         font-style: normal;
         color: $font-color-light;
         margin: 0;
      }
   }

   .authorization {
      &-title {
         text-align: center;
         font-weight: bold;
      }

      button {
         display: block;
         text-transform: none;
         width: 100%;
         color: $font-color-dark;
      }
   }

   /*стили для датапикеров*/

   .datepicker-container {
      .datepicker-footer {
         .datepicker-done {
            background-color: #424852 !important;
            color: #fff;
         }
      }
   }

   /*Стили для картинок wp*/
   img.aligncenter {
      display: block;
      margin-left: auto;
      margin-right: auto;
   }

   img.alignright {
      float: right;
      margin: 0.5em 0 0.5em 1em;
   }

   img.alignleft {
      float: left;
      margin: 0.5em 1em 0.5em 0;
   }

   /*Стили для всплывающих сообщений*/
   .toast.error {
      background-color: $toast-error-color;
   }

   /*Стили для обычных блоков*/
   .title {
      text-align: center;
      font-weight: bold;
      font-size: 14px;
      line-height: 16px;
   }

   /*стили для select*/
   .dropdown-content li > a, .dropdown-content li > span {
      color: #000000 !important;
   }

   /*Стили для кнопок*/
   .btn {
      white-space: nowrap;
   }

   .btn-large {
      padding: 0px 20px !important;
   }

   .btn-standard {
      /*height: 50px !important;*/
      /*line-height: 50px !important;*/
      width: 100%;
      color: black !important;
      text-transform: none !important;
      margin-bottom: 15px;
   }

   .btn.disabled {
      pointer-events: all !important;
   }

   .btn-delete {
      border: none;
      color: #000000;
      cursor: pointer;
      line-height: 0;
      height: 30px;
   }

   .btn-delete:hover {
      background-color: #ff4038 !important;
   }

   .btn-dark {
      background-color: #424852 !important;
      color: #fff !important;
      width: 100%;
      text-transform: none !important;
   }

</style>