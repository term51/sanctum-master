<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <h2 class="title"></h2>
      <Loader size="big" v-show="loading"/>

      <form @submit.prevent="submitHandler" v-show="!loading">

         <!--         <select ref="s_contracts" @change="selectContract($event.target.value)">-->
         <!--            <option value="">Выберите договор</option>-->
         <!--            <option-->
         <!--               v-for="(contract,index) in contracts"-->
         <!--               :key="index"-->
         <!--               :value="contract.contract_number">№ {{contract.contract_number}} от {{contract.contract_date}}-->
         <!--            </option>-->
         <!--         </select>-->


         <div class="delivery-date-wrap">
            <div>Доставить</div>
            <div class="input-field">
               <b>{{delivery_date}} </b>
            </div>

         </div>

         <div v-for="(material,index) in materials" :key="index" class="card blue-grey lighten-4 ">
            <div class="card-content">
               <span class="card-title">{{material.material_title ? material.material_title : 'Материал удален из базы' }}</span>
               <div class="card-inner-wrap">
                  <span>Замеры по смете</span>
                  <div class="unit">{{material.work_scope}}</div>

               </div>
               <div class="card-inner-wrap">
                  <span>Заказано по замерам</span>
                  <div class="unit">{{material.work_scope_ordered_materials}} ({{material.count_material}} шт)</div>
               </div>
            </div>
         </div>

         <div class="input-field">
            <button
               @click.prevent="sendEmail"
               :style="'background-color:'+$store.state.accentColors.blue"
               class="btn btn-standard  waves-effect waves-light">
               Отправить писмо поставщикам (повторно)
            </button>
         </div>
         <div class="input-field">
            <button
               :disabled="delivery_status"
               type="submit"
               class="btn btn-standard btn-large light-green lighten-1 waves-effect waves-light">
               Доставлено
            </button>
         </div>
      </form>
   </div>
</template>

<script>
   export default {
      name: "delivery-material-list",
      data: () => ({
         delivery_status: false,
         loading: true,
         delivery_date: '',
         materials: [],
      }),
      created() {
         try {
            this.$store.dispatch('waitToken', this.getDeliveryMaterials)
         } catch (e) {
            console.log(e)
         }
      },
      methods: {
         async sendEmail() {

            await this.$http.get('wp/v2/object-information/delivery-request/send-email', {
               params: {
                  datetime: this.delivery_date,
                  delivery_id: this.$route.params.delivery_id
               }
            })
               .then(response => {
                  return response.json();
               })
               .then(response => {
                  console.log('in', response);
                  this.$store.commit('setMessage', response.message)
               })
               .catch(function (error) {
                  console.log(error);
                  this.$store.commit('setError', error.data.code);
                  throw  error;
               });
            this.$store.commit('clearMessage');
            this.$store.commit('clearError');
         },
         // получаем данные с сервера
         async getDeliveryMaterials() {
            this.materials = []

            await this.$http.get('wp/v2/object-information/delivery-materials-list', {
               params: {
                  user_id: this.$store.state.auth.userId,
                  delivery_id: this.$route.params.delivery_id
               }
            })
               .then(response => {
                  return response.json();
               })
               .then(response => {
                  console.log('in', response);
                  // получить все материалы
                  this.materials = response.delivery_materials
                  this.delivery_date = response.info.date
                  this.loading = false;
                  if (response.info.status == 0) this.delivery_status = true
               })
               .catch(function (error) {
                  console.log(error);
                  this.$store.commit('setError', error.data.code);
                  throw  error;
               });
            this.$store.commit('clearError');
         },
         async submitHandler() {
            if (confirm('Товары доставлены?')) {
               await this.$http.post('wp/v2/object-information/delivery-materials-list', {
                  // user_id: this.$store.state.auth.userId,
                  delivery_id: this.$route.params.delivery_id
               })
                  .then(response => response.json())
                  .then(response => {
                     this.delivery_status = true
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
         console.log('Delivery-materials-list.vue');
         this.$store.commit('change_headerNav', {
            text: 'Заказанные материалы',
            colorNav: 'red',
            colorHome: 'black',
            colorText: 'black'
         });
      },
   }
</script>

<style lang="scss" scoped>
   .card {
      .card-content {
         padding: 15px;
      }

      &-title {
         font-size: 14px;
         line-height: 16px;
         font-weight: bold;
      }

      &-inner-wrap {
         display: inline-block;
         width: 50%;

         .unit {
            font-weight: bold;
         }
      }
   }

   .delivery-date-wrap {


      > div {
         display: inline-block;
         width: 32%;
      }

      .input-field {
         margin-left: 5px;
      }
   }

</style>