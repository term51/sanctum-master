<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <h2 class="title"></h2>
      <router-link
         class="btn btn-standard"
         :style="'background-color:' + this.$store.state.accentColors.gray "
         tag="button"
         to="/auction/winning-bid-list">Списо выигрышных ставок
      </router-link>

      <router-link
         class="btn btn-standard"
         :style="'background-color:' + this.$store.state.accentColors.gray "
         tag="button"
         to="/auction/available-objects-list">Список объектов доступных для торгов
      </router-link>

      <router-link
         class="btn btn-standard"
         :style="'background-color:' + this.$store.state.accentColors.gray "
         tag="button"
         to="/auction/contracts-concluded-list">Заключенные договора
      </router-link>
   </div>
</template>

<script>
   export default {
      name: "auction",
      mounted() {
         console.log('Auction.vue');
         this.$store.commit('change_headerNav', {
            showBack: true,
            showHome: true,
            text: 'Аукцион',
            colorNav: 'lightBlue',
            colorHome: 'black',
            colorText: 'black'
         });
      },
   }
</script>

<style lang="scss" scoped>
   .btn{
      height: 50px;
      margin-top: 20px;
   }
</style>
