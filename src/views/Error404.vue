<template>
   <h1 style="color:red;">404 Такой страницы не существует</h1>
</template>

<script>
   export default {
      name: 'error404',
      mounted() {
         this.$store.commit('change_headerNav', {
            text: 'Ошибка',
            colorNav: 'red',
            colorHome: 'black',
            colorText: 'black'
         });
      }
   }
</script>

<style scoped>

</style>
