<template>
   <div></div>
</template>

<script>
   export default {
      name: "object-information",
      // запомнить имя объекта в шине
      mounted() {
         console.log('Object-information.vue');
         this.$store.commit('change_headerNav', {
            showBack: true,
            showHome: true,
            text: 'Общая информация об объекте '+ this.$store.state.objectInfo.object_name,
            colorNav: 'lightBlue',
            colorHome: 'black',
            colorText: 'black'
         });
      }
   }
</script>

<style scoped>

</style>