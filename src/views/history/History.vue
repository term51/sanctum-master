<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <h2 class="title"></h2>
      <router-link
         class="btn btn-standard"
         :style="'background-color:' + this.$store.state.accentColors.gray "
         tag="button"
         to="/history/general-statistics-of-objects">Общая статистика
      </router-link>

      <router-link
         class="btn btn-standard"
         :style="'background-color:' + this.$store.state.accentColors.gray "
         tag="button"
         to="/history/objects">Статистика по каждому объекту
      </router-link>
   </div>

</template>

<script>
   export default {
      name: "history",
      mounted() {
         console.log('History.vue');
         this.$store.commit('change_headerNav', {
            text: 'История объектов',
            colorNav: 'gray',
            colorHome: 'black',
            colorText: 'black'
         });
      }
   }
</script>

<style lang="scss" scoped>
.btn{
   height: 50px;
   margin-top: 20px;
}
</style>