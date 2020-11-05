<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <h2 class="title"></h2>
      <Loader size="big" v-if="loading"/>
      <router-link
         v-else
         v-for="(policy,index) of pricePolicy"
         :key="index"
         class="btn btn-standard btn-large"
         tag="button"
         :style="'background-color:' + $store.state.accentColors.gray"
         :to="'/profile-and-settings/price-policy/edit-policy/'+policy.id">{{policy.title}}
      </router-link>

      <router-link
         v-show="!loading"
         class="btn btn-standard btn-large"
         tag="button"
         :style="'background-color:' + $store.state.accentColors.green"
         to="/profile-and-settings/price-policy/add-policy">Создать ценовую категорию
      </router-link>
   </div>

</template>

<script>
   //импортируем сообщения
   import messages from '@/plugins/toastsMessages';

   export default {
      name: "price-policy",
      data: () => ({
         loading: true,
         pricePolicy: []
      }),
      created() {
         try {
            this.$store.dispatch('waitToken',this.getPricePolicy)
         } catch (e) {
            console.log(e);
         }
      },
      methods: {
         // получаем данные с сервера
         async getPricePolicy() {
            await this.$http.get('wp/v2/users/price-policy', {
               params: {user_id: this.$store.state.auth.userId}
            })
               .then(response => {
                  return response.json();
               })
               .then((response) => {
                  console.log(response);
                  response.forEach((item) => {
                     this.pricePolicy.push({
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

         console.log('Price-policy.vue');
         this.$store.commit('change_headerNav', {
            text: 'Ценовые категории',
            colorNav: 'blue',
            colorHome: 'black',
            colorText: 'black'
         });
      },
   }
</script>

<style scoped>

</style>