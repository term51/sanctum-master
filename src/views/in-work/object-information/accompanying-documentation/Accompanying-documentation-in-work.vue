<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <h2 class="title"></h2>

      <form>
         <div class="input-field">
            <input
               id="full_name"
               type="text"
               v-model="full_name"
               disabled>
            <label for="full_name" class="active">ФИО заказчика</label>
         </div>
         <div class="input-field">
            <input
               id="phone"
               type="text"
               v-model="phone"
               disabled>
            <label for="phone" class="active">Телефон заказчика</label>
         </div>
         <div class="input-field">
            <input
               id="email"
               type="text"
               v-model="email"
               disabled>
            <label for="email" class="active">Email</label>
         </div>
         <div class="input-field">
            <textarea
               ref="textArea"
               id="note"
               v-model="note"
               class="materialize-textarea"
               disabled></textarea>
            <label class="active" for="note">Комментарий к объекту</label>

         </div>

         <div class="input-field">
            <router-link
               class="btn  btn-dark waves-effect waves-light"
               tag="button"
               :to="`/in-work/object-information/${$route.params.id}/accompanying-documentation`">Редактировать информацию
            </router-link>
         </div>

         <div class="input-field">
            <router-link
               class="btn  btn-dark waves-effect waves-light"
               tag="button"
               :to="`/in-work/object-information/${$route.params.id}/locations`">Локации объекта
            </router-link>
         </div>

         <div class="input-field">
            <button @click.prevent="downloadFamiliarizedEstimate('')"
                    class="btn btn-dark btn-large waves-effect waves-light">
               Скачать ознакомительную смету
            </button>
         </div>

         <div class="input-field">
            <button @click.prevent="downloadFamiliarizedEstimate('material')"
                    class="btn btn-dark btn-large waves-effect waves-light">
               Скачать материалы по смете
            </button>
         </div>

         <h2 class="title">Оговорки по договору</h2>


         <div class="input-field">
            <input
               id="contract_city"
               type="text"
               v-model="contract_city"
               disabled>
            <label for="contract_city" class="active">Город</label>
         </div>
         <div class="input-field">
            <input
               id="contract_number"
               type="text"
               v-model="contract_number"
               disabled>
            <label for="contract_number" class="active">Номер договора</label>
         </div>
         <div class="input-field">
            <input
               id="contract_amount_estimate"
               type="text"
               v-model="contract_amount_estimate"
               disabled>
            <label for="contract_amount_estimate" class="active">Сумма в смете</label>
         </div>

         <h2 class="title">Срок выполнения работ по договору</h2>
         <div class="input-field">
            <input
               id="contract_date_start"
               type="text"
               v-model="contract_date_start"
               disabled>
            <label for="contract_date_start" class="active">Начало работ</label>

         </div>
         <div class="input-field">
            <input
               id="contract_date_deadline"
               type="text"
               v-model="contract_date_deadline"
               disabled>
            <label for="contract_date_deadline" class="active">Окончание работ</label>
         </div>


         <h2 class="title">Сроки АВР и срок гарантии на выполненные работы</h2>
         <div class="input-field">
            <input
               id="days_for_submitting_ACW"
               type="number"
               v-model="days_for_submitting_ACW"
               disabled>
            <label for="days_for_submitting_ACW" class="active">Срок предъявления АВР</label>
         </div>
         <div class="input-field">
            <input
               id="days_for_warranty"
               type="number"
               v-model="days_for_warranty"
               disabled>
            <label for="days_for_warranty" class="active">Гарантия на срок</label>
         </div>

         <div class="input-field">
            <button @click.prevent="downloadAgencyAgreement"
                    class="btn btn-dark btn-large waves-effect waves-light">
               Скачать агентский договор
            </button>
         </div>

         <div class="input-field">
            <router-link
               class="btn  btn-dark btn-large waves-effect waves-light"
               tag="button"
               :to="`/in-work/object-information/${$route.params.id}/accompanying-documentation-in-work/delivery-of-building-materials`">
               Доставка строй материалов
            </router-link>
         </div>

         <!--         <div class="input-field">-->
         <!--            <router-link-->
         <!--               class="btn  btn-dark btn-large waves-effect waves-light"-->
         <!--               tag="button"-->
         <!--               :to="`/in-work/object-information/${$route.params.id}/accompanying-documentation-in-work/additional-documentation`">-->
         <!--               Дополнительная документация-->
         <!--            </router-link>-->
         <!--         </div>-->


      </form>
   </div>
</template>

<script>
   export default {
      name: "accompanying-documentation-in-work",
      data: () => ({
         //поля формы
         object_address: '',
         object_name: '',
         object_priority: '',
         full_name: '',
         phone: '',
         email: '',
         note: '',
         textArea: null,
         // оговорки по договору
         contract_city: '', //город
         contract_number: '', //Номер договора
         contract_amount_estimate: '',// Сумма в смете

         // срок выполнения работ по договору
         contract_date_start: '', // Начало работ
         contract_date_deadline: '', // Окончание работ

         //Сроки АВР и срок гарантии на выполненные работы
         days_for_submitting_ACW: '', // дней для предъявления АВР
         days_for_warranty: '' // дней на гарантию
      }),
      created() {
         try {
            this.$store.dispatch('waitToken', this.getObjectData)
         } catch (e) {
            console.log(e);
         }
      },
      methods: {
         // Получить данные о заказчике и договоре
         async getObjectData() {

            await this.$http.get('wp/v2/object-information/accompanying-documentation', {
               params: {
                  user_id: this.$store.state.auth.userId,
                  object_id: this.$route.params.id
               }
            })
               .then(response => {
                  return response.json();
               })
               .then(response => {
                  // console.log(response);
                  this.full_name = response.customer_full_name
                  this.phone = response.customer_phone
                  this.email = response.customer_email
                  this.note = response.note
                  // Формула для получения количества пикселей для строки с описанием (note)
                  this.$refs.textArea.style.height = (Math.ceil(response.note.length / 52) * 30) + 'px';
                  //============================================================================
                  // оговорки по договору
                  this.contract_city = response.contract_city //город
                  this.contract_number = response.contract_number //Номер договора
                  this.contract_amount_estimate = response.contract_amount_estimate // Сумма в смете
                  // срок выполнения работ по договору
                  this.contract_date_start = response.contract_date_start // Начало работ
                  this.contract_date_deadline = response.contract_date_deadline // Окончание работ
                  //Сроки АВР и срок гарантии на выполненные работы
                  this.days_for_submitting_ACW = response.days_for_submitting_ACW // дней для предъявления АВР
                  this.days_for_warranty = response.days_for_warranty // дней на гарантию

               })
               .catch(function (error) {
                  console.log(error);
                  this.$store.commit('setError', error.data.code);
                  throw  error;
               });
            this.$store.commit('clearError');
         },
         //Скачать ознакомительную смету
         downloadFamiliarizedEstimate(type = null) {
            console.log(type);
            if (!type) {
               this.$message('Скачивается ознокомительная смета');
               location.href = `${this.$http.options.root}/wp/v2/document/download-familiarized-estimate?user_id=${this.$store.state.auth.userId}&object=${this.$route.params.id}`;
            } else {
               this.$message('Скачивается смета по материалам');
               location.href = `${this.$http.options.root}/wp/v2/document/download-familiarized-estimate?user_id=${this.$store.state.auth.userId}&object=${this.$route.params.id}&type=${type}`;
            }
         },
         //Скачать сопроводительную документацию
         downloadAgencyAgreement() {
            this.$message('Скачивается агентский договор');
            location.href = `${this.$http.options.root}/wp/v2/document/download-agency-agreement?user_id=${this.$store.state.auth.userId}&object_id=${this.$route.params.id}`;
         }
      },
      mounted() {
         console.log('Accompanying-documentation-in-work.vue');
         this.$store.commit('change_headerNav', {
            text: 'Информация по объекту ' + this.$store.state.objectInfo.object_name,
            colorNav: 'red',
            colorHome: 'black',
            colorText: 'black'
         });
      }
   }
</script>

<style lang="scss" scoped>
   .materialize-textarea {
      /*resize: horizontal;*/
   }

   .btn-large {
      white-space: normal;
      line-height: 20px;
   }
</style>