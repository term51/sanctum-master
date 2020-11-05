<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <!--      <Notification notification="userApproved"/>-->
      <h2 class="title"></h2>
      <router-link
         class="btn"
         tag="button"
         to="/profile-and-settings/personal-data"><img src="@/img/user_white.svg">Личные данные
      </router-link>

      <router-link
         class="btn"
         tag="button"
         to="/profile-and-settings/type-of-work"><img src="@/img/tools_white.svg">Виды работ
      </router-link>

      <router-link
         class="btn"
         tag="button"
         to="/profile-and-settings/price-policy"><img src="@/img/label.svg">Ценовая политика
      </router-link>

      <router-link
         class="btn"
         tag="button"
         to="/profile-and-settings/used-materials"><img src="@/img/cart.svg">Используемые материалы
      </router-link>

      <router-link
         class="btn"
         tag="button"
         to="/profile-and-settings/calculators-constructor-list"><img src="@/img/calculator.svg">Конструктор калькуляторов
      </router-link>

      <router-link
         class="btn"
         tag="button"
         to="/profile-and-settings/suppliers-list"><img src="@/img/truck_white.svg">Поставщики
      </router-link>

<!--      <div class="notifications-wrap" title="Oбщие уведомления о всех событиях">-->
<!--         <p>Уведомления</p>-->
<!--         <div class="switch">-->
<!--            <label>-->
<!--               Выкл-->
<!--               <input :checked="notifications" type="checkbox">-->
<!--               <span class="lever"></span>-->
<!--               Вкл-->
<!--            </label>-->
<!--         </div>-->
<!--      </div>-->
   </div>
</template>

<script>
   export default {
      name: "profile-and-settings",
      computed: {
         notifications() {
            return this.$store.state.auth.notifications;
         }
      },
      mounted() {
         console.log('Profile-and-settings.vue');
         this.$store.commit('change_headerNav', {
            text: 'Профиль и настройки',
            colorNav: 'blue',
            colorHome: 'black',
            colorText: 'black'
         });
      },
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
         width: 255px;
         display: inline-block;
         margin: 10px;
         text-align: left;
         text-transform: none;
         color: #fff;
         font-weight: normal;
         line-height: 25px;
         font-size: 14px;
         background-color: #424852;
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
</style>