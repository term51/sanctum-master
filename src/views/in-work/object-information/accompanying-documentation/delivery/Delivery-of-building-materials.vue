<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <h2 class="title"></h2>
      <Loader size="big" v-show="loading"/>

      <section class="s-locations" v-show="!loading">

         <table class="striped">
            <thead>
            <tr>
               <th>Номер доставки</th>
               <th>Дата</th>
               <th>Статус</th>
               <th></th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(delivery,index) in deliveries" :key="index">
               <router-link
                  tag="td"
                  :to="`/in-work/object-information/${$route.params.id}/accompanying-documentation-in-work/delivery-materials-list/` + delivery.id">
                  {{delivery.id}}
               </router-link>
               <router-link
                  tag="td"
                  :to="`/in-work/object-information/${$route.params.id}/accompanying-documentation-in-work/delivery-materials-list/` + delivery.id">
                  {{delivery.date}}
               </router-link>
               <router-link
                  tag="td"
                  :style="{color:  delivery.status == 1 ? $store.state.accentColors.blue : $store.state.accentColors.green}"
                  :to="`/in-work/object-information/${$route.params.id}/accompanying-documentation-in-work/delivery-materials-list/` + delivery.id">
                  {{delivery.status == 1 ? 'Заказано' : 'Доставлено'}}
               </router-link>
               <td>
                  <button
                     @click="deleteDeliveries(delivery.id)"
                     class="number btn-delete"
                     :style="'background-color:'+ $store.state.accentColors.red">X
                  </button>
               </td>
            </tr>
            </tbody>
         </table>

         <div class="input-field">
            <router-link
               class="btn btn-standard btn-large red accent-1 waves-effect waves-light"
               tag="button"
               :to="`/in-work/object-information/${$route.params.id}/accompanying-documentation-in-work/delivery-request`">
               Запросить новую доставку
            </router-link>
         </div>
      </section>
   </div>
</template>

<script>

   export default {
      name: "delivery-of-building-materials",
      data: () => ({
         loading: true,
         deliveries: [],
      }),
      created() {
         try {
            this.$store.dispatch('waitToken', this.getDeliveries)
         } catch (e) {
            console.log(e)
         }
      },
      methods: {
         async getDeliveries() {
            // получение всех доставок по id локации
            this.deliveries = []

            await this.$http.get('wp/v2/object-information/delivery-of-building-materials', {
               params: {
                  // user_id: this.$store.state.auth.userId,
                  object_id: this.$route.params.id
               }
            })
               .then(response => response.json())
               .then(response => {
                  console.log('in', response)

                  // если доставок нет, переход в создание доставки
                  if (response.length === 0) {
                     // удаляем этот роут из истории переходов
                     this.$store.commit('deleteRoute')
                     // "/in-work/object-information/11/accompanying-documentation-in-work/delivery-of-building-materials"
                     this.$router.push({name: 'delivery-request'})
                  }



                  this.deliveries = response
                  this.loading = false
               })
               .catch(function (e) {
                  throw e;
               })

         },
         // удаление доставки
         async deleteDeliveries(id) {
            if (confirm('Точно отменить доставку?')) {
               await this.$http.delete('wp/v2/object-information/delivery-of-building-materials', {
                  params: {
                     // user_id: this.$store.state.auth.userId,
                     delivery_id: id
                  }
               })
                  .then(response => response.json())
                  .then(response => {
                     this.loading = true
                     this.getDeliveries()
                     this.$store.commit('setMessage', response.message)
                  })
                  .catch(function (e) {
                     this.$store.commit('setError', e.data.code)
                     throw e
                  })
               this.$store.commit('clearMessage')
               this.$store.commit('clearError')
            }
         }
      },
      mounted() {

         console.log('Delivery-of-building-materials.vue');
         this.$store.commit('change_headerNav', {
            text: 'Доставка строй материалов',
            colorNav: 'red',
            colorHome: 'black',
            colorText: 'black'
         });
      }
   }
</script>

<style lang="scss" scoped>
   table {
      thead {
         background-color: #E4E8EB;

         th {
            &:first-child {
               max-width: 50px;
            }

            border-radius: 0;
            text-align: center;
         }
      }

      tr {
         cursor: pointer;
      }

      td {
         font-size: 14px;
      }

      td:last-child {
         padding: 0;
      }
   }
</style>