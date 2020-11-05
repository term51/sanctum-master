<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <h2 class="title"></h2>
      <Loader size="big" v-if="loading"/>
      <router-link
         v-else
         v-for="(material,index) of usedMaterials"
         :key="index"
         class="btn btn-standard btn-large"
         tag="button"
         :style="'background-color:' + $store.state.accentColors.gray"
         :to="'/profile-and-settings/used-materials/edit-used-materials/' + material.id">{{material.title}}
      </router-link>

      <router-link
         v-show="!loading"
         class="btn btn-standard btn-large"
         tag="button"
         :style="'background-color:' + $store.state.accentColors.green"
         to="/profile-and-settings/used-materials/add-used-materials">Создать категорию материалов
      </router-link>
   </div>
</template>

<script>
   //импортируем сообщения
   import messages from '@/plugins/toastsMessages';

   export default {
      name: "used-materials",
      data: () => ({
         loading: true,
         usedMaterials: []
      }),
      created() {
         try {
            this.$store.dispatch('waitToken',this.getUsedMaterials)
         } catch (e) {
            console.log(e);
         }
      },
      methods: {
         // получаем данные с сервера
         async getUsedMaterials() {
            await this.$http.get('wp/v2/users/used-materials', {
               params: {user_id: this.$store.state.auth.userId}
            })
               .then(response => {
                  return response.json();
               })
               .then((response) => {
                  console.log(response);
                  response.forEach((item) => {
                     this.usedMaterials.push({
                        id: item.policy_id,
                        title: item.policy_title
                     })
                  })
                  this.loading = false;
               })
               .catch(function (error) {
                  console.log(error);
                  throw error
               })
         },
      },
      mounted() {
         if (messages[this.$route.query.message]) {
            this.$message(messages[this.$route.query.message]);
         }

         console.log('Used-materials.vue');
         this.$store.commit('change_headerNav', {
            text: 'Используемые материалы',
            colorNav: 'blue',
            colorHome: 'black',
            colorText: 'black'
         });
      },
   }
</script>

<style scoped>

</style>