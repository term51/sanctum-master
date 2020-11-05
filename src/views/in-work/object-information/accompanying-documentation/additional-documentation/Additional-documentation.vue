<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <h2 class="title"></h2>
      <div class="input-field">
         <router-link
            class="btn  btn-dark waves-effect waves-light"
            tag="button"
            :to="`/in-work/object-information/${$route.params.id}/accompanying-documentation-in-work/additional-documentation/act-of-completed-work`">
            Акт выполненных работ
         </router-link>
      </div>
      <div class="input-field">
         <router-link
            class="btn  btn-dark waves-effect waves-light"
            tag="button"
            :to="`/in-work/object-information/${$route.params.id}/accompanying-documentation-in-work/additional-documentation/act-of-inspection-of-hidden-works`">
            Акт освидетельствования скрытых работ
         </router-link>
      </div>
      <div class="input-field">
         <router-link
            class="btn  btn-dark waves-effect waves-light"
            tag="button"
            :to="`/in-work/object-information/${$route.params.id}/accompanying-documentation-in-work/additional-documentation/additional-agreement`">
            Дополнительное соглашение
         </router-link>
      </div>
   </div>
</template>

<script>
   export default {
      name: "additional-documentation",
      mounted() {

         console.log('Additional-documentation.vue');
         this.$store.commit('change_headerNav', {
            text: 'Дополнительная документация',
            colorNav: 'red',
            colorHome: 'black',
            colorText: 'black'
         });
      }
   }
</script>

<style scoped>

</style>