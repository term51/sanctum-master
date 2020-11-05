<template>
   <div class="btn-wrap col s12 offset-xl1 xl10">
      <!--      offset-m2 m6 -->
      <!--      <p class="center">Для работы с сервисом необходимо заполнить данные в профиле и посетить офис для заключения договора.</p>-->
<!--      <Notification notification="userApproved"/>-->
<h2 class="title"></h2>
      <router-link
         class="btn"
         :style="'background-color:' + this.$store.state.accentColors.blue"
         tag="button"
         to="/profile-and-settings"><img src="@/img/user_black.svg">Профиль и настройки
      </router-link>

      <router-link
         class="btn"
         tag="button"
         :style="'background-color:' + this.$store.state.accentColors.green"
         to="/create-an-object"><img src="@/img/plus_black.png">Создать объект
      </router-link>

      <router-link
         class="btn"
         tag="button"
         :style="'background-color:' + this.$store.state.accentColors.red"
         to="/in-work"><img src="@/img/tools_black.svg">В работе
      </router-link>

      <router-link
         class="btn"
         :style="'background-color:' + this.$store.state.accentColors.gray"
         tag="button"
         to="/history"><img src="@/img/history.svg">История объектов
      </router-link>

      <router-link
         class="btn"
         :style="'background-color:' + this.$store.state.accentColors.aquamarine"
         tag="button"
         to="/news"><img src="@/img/fire.svg">Новости и предложения
      </router-link>

      <router-link
         class="btn"
         :style="'background-color:' + this.$store.state.accentColors.orange"
         tag="button"
         to="/statistics"><img src="@/img/statistic.svg">Статистика
      </router-link>

      <router-link
         class="btn"
         :style="'background-color:' + this.$store.state.accentColors.lightBlue"
         tag="button"
         to="/auction"><img src="@/img/auction.svg">Аукцион
      </router-link>
   </div>
</template>

<script>
   // @ is an alias to /src
   export default {
      name: 'home',
      mounted() {

         this.$store.commit('change_headerNav', {
            showBack: false,
            showHome: false,
            text: 'Личный кабинет мастера',
            colorNav: 'black',
            colorHome: 'white',
            colorText: 'white'
         });
      },
      // Позволяет выполнить действие перед уходом со страницы
      // beforeRouteLeave(to, fromR, next) {
      //    // this.$store.commit('change_headerNavBackUrl', fromR.fullPath);
      //    console.log(fromR.fullPath);
      //    next(true)
      // }
   }
</script>

<style lang="scss" scoped>
   p.center {
      max-width: 420px;
      margin: 25px auto;
   }

   .btn-wrap {
      text-align: center;

      button {
         white-space: nowrap;
         position: relative;
         overflow: hidden;
         height: 50px;
         padding: 10px 0 10px 55px;
         width: 240px;
         display: inline-block;
         margin: 10px;
         text-align: left;
         text-transform: none;
         color: #000;
         font-weight: bold;
         line-height: 25px;
         font-size: 14px;
      }

      img {
         position: absolute;
         top: 0px;
         left: 0px;
         vertical-align: top;
         width: 50px;
         height: 50px;
         padding: 10px;
         background-color: rgba(0, 0, 0, 0.1);
      }
   }

   @media screen and (min-width: 1820px) {
      .btn-wrap {
         text-align: left;
      }
   }

</style>