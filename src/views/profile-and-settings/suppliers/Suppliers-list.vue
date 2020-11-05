<template>
   <div class="btn-wrap col s12">
      <h2 class="title"></h2>
      <Loader size="big" v-if="loading"/>
      <router-link
         v-else
         v-for="(supplier,index) in suppliers"
         :key="index"
         class="btn btn-medium"
         :style="'background-color:' + $store.state.accentColors.gray"
         tag="button"
         :title="supplier.name"
         :to="'/profile-and-settings/edit-supplier/' + supplier.id">ID:<b>{{supplier.id}}</b> {{supplier.name}}
      </router-link>

      <router-link
         class="btn btn-standard btn-large"
         :style="'background-color:' + $store.state.accentColors.green"
         tag="button"
         to="/profile-and-settings/create-supplier/">Создать поставщика
      </router-link>
   </div>
</template>

<script>
   export default {
      name: "suppliers-list",
      data: () => ({
         loading: true,
         suppliers: []
      }),
      created() {
         try {
            this.$store.dispatch('waitToken', this.getSuppliers)
         } catch (e) {
            console.log(e);
         }
      },
      methods: {
         // получить объекты
         async getSuppliers() {
            this.suppliers = []

            await this.$http.get('wp/v2/suppliers/suppliers-list')
               .then(response => response.json())
               .then(response => {
                  console.log('in', response);
                  this.suppliers = response
                  this.loading = false

                  if (this.suppliers.length === 0) {
                     // удаляем этот роут из истории переходов
                     this.$store.commit('deleteRoute')
                     this.$router.push('/profile-and-settings/create-supplier/')
                  }
               })
               .catch(function (e) {
                  throw e;
               })
         }
      },
      mounted() {
         console.log('Suppliers-list.vue');
         this.$store.commit('change_headerNav', {
            text: 'Поставщики материалов',
            colorNav: 'blue',
            colorHome: 'black',
            colorText: 'black'
         });
      }
   }
</script>

<style lang="scss" scoped>
   .btn {
      width: 31%;
      margin: 10px;
      color: #000000;
      text-transform: none;
      overflow: hidden;
   }
   .btn-standard{
      display: block;
      margin: 50px auto 0;
   }

   @media screen and (max-width: 1300px) {
      .btn {
         width: 47%;
      }
   }

   @media screen and (max-width: 800px) {
      .btn {
         width: 100%;
      }
   }
</style>
