<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <h2 class="title">Оговорки по доп. соглашению</h2>
      <div class="input-field">
         <input
            id="contract_number"
            type="text"
            v-model.trim="contract_number"
            :class="{invalid: ($v.contract_number.$dirty && !$v.contract_number.required)}"
         >
         <label for="contract_number" :class="{active: (contract_number)}">Номер договора</label>
         <small
            class="helper-text invalid"
            v-if="$v.contract_number.$dirty && !$v.contract_number.required"
         >Обязательное поле</small>
      </div>
      <div class="input-field">
         <input
            id="contract_date"
            type="text"
            v-on:change="setContractDate"
            ref="contractDateFromInput"
            class="datepicker">
         <label for="contract_date" :class="{active: (contract_date)}">Дата составления</label>
         <small
            class="helper-text invalid"
            v-if="$v.contract_date.$dirty && !$v.contract_date.required"
         >Обязательное поле</small>
      </div>
      <div class="input-field">
         <input
            id="contract_amount_estimate"
            type="text"
            v-model.trim="contract_amount_estimate"
            :class="{invalid: ($v.contract_amount_estimate.$dirty && !$v.contract_amount_estimate.required)}"
         >
         <label for="contract_amount_estimate" :class="{active: (contract_amount_estimate)}">Сумма в смете</label>
         <small
            class="helper-text invalid"
            v-if="$v.contract_amount_estimate.$dirty && !$v.contract_amount_estimate.required"
         >Обязательное поле</small>
      </div>
<!--      <div class="input-field">-->
<!--         <input-->
<!--            id="contract_percentage_prepaid_amount"-->
<!--            type="text"-->
<!--            v-model.trim="contract_percentage_prepaid_amount"-->
<!--            :class="{invalid: ($v.contract_percentage_prepaid_amount.$dirty && !$v.contract_percentage_prepaid_amount.required)}"-->
<!--         >-->
<!--         <label for="contract_number" :class="{active: (contract_number)}">% аванса от суммы</label>-->
<!--         <small-->
<!--            class="helper-text invalid"-->
<!--            v-if="$v.contract_percentage_prepaid_amount.$dirty && !$v.contract_percentage_prepaid_amount.required"-->
<!--         >Обязательное поле</small>-->
<!--      </div>-->

<!--      <h2 class="title">Срок выполнения работ по договору</h2>-->
<!--      <div class="input-field">-->
<!--         <input-->
<!--            id="contract_date_start"-->
<!--            v-on:change="setDateStart"-->
<!--            ref="dateStartFromInput"-->
<!--            type="text"-->
<!--            class="datepicker">-->
<!--         <label for="contract_date_start" :class="{active: (contract_date_start)}">Начало работ</label>-->
<!--         <small-->
<!--            class="helper-text invalid"-->
<!--            v-if="$v.contract_date_start.$dirty && !$v.contract_date_start.required"-->
<!--         >Обязательное поле</small>-->
<!--      </div>-->

<!--      <div class="input-field">-->
<!--         <input-->
<!--            id="contract_date_deadline"-->
<!--            v-on:change="setDateDeadline"-->
<!--            ref="dateDeadlineFromInput"-->
<!--            type="text"-->
<!--            class="datepicker">-->
<!--         <label for="contract_date_deadline" :class="{active: (contract_date_deadline)}">Окончание работ</label>-->
<!--         <small-->
<!--            class="helper-text invalid"-->
<!--            v-if="$v.contract_date_deadline.$dirty && !$v.contract_date_deadline.required"-->
<!--         >Обязательное поле</small>-->
<!--      </div>-->

<!--      <h2 class="title">Сроки АВР и срок гарантии на выполненные работы</h2>-->
<!--      <div class="input-field">-->
<!--         <input-->
<!--            id="days_for_submitting_ACW"-->
<!--            type="number"-->
<!--            v-model.trim="days_for_submitting_ACW"-->
<!--            :class="{invalid: ($v.days_for_submitting_ACW.$dirty && !$v.days_for_submitting_ACW.required)}"-->
<!--         >-->
<!--         <label for="days_for_submitting_ACW" :class="{active: (days_for_submitting_ACW)}">Срок предъявления АВР</label>-->
<!--         <small-->
<!--            class="helper-text invalid"-->
<!--            v-if="$v.days_for_submitting_ACW.$dirty && !$v.days_for_submitting_ACW.required"-->
<!--         >Обязательное поле</small>-->
<!--      </div>-->
<!--      <div class="input-field">-->
<!--         <input-->
<!--            id="days_for_warranty"-->
<!--            type="number"-->
<!--            v-model.trim="days_for_warranty"-->
<!--            :class="{invalid: ($v.days_for_warranty.$dirty && !$v.days_for_warranty.required)}"-->
<!--         >-->
<!--         <label for="days_for_warranty" :class="{active: (days_for_warranty)}">Гарантия на срок</label>-->
<!--         <small-->
<!--            class="helper-text invalid"-->
<!--            v-if="$v.days_for_warranty.$dirty && !$v.days_for_warranty.required"-->
<!--         >Обязательное поле</small>-->
<!--      </div>-->

      <div class="input-field">
         <button @click.prevent="downloadDocument" class="btn btn-dark lighten-1 waves-effect waves-light">
            Скачать дополнительное соглашение
         </button>
      </div>
      <!-- сохранить доп соглашение -->
      <div class="input-field">
         <button
            @click.prevent="submitHandler"
            class="btn btn-standard btn-large light-green lighten-1 waves-effect waves-light"
            type="submit">
            Сохранить дополнительное соглашение
         </button>
      </div>
   </div>
</template>

<script>
   import {required} from 'vuelidate/lib/validators'
   import M from "materialize-css/dist/js/materialize.min";

   export default {
      name: "additional-agreement",
      data: () => ({
         //оговорки
         contract_number: '',
         contract_date: '',
         contract_amount_estimate: '',
         // contract_percentage_prepaid_amount: '',
         // срок выполнения работ по договору
         // contract_date_start: '',
         // contract_date_deadline: '',
         //инициализация датапикеров
         contractDateFromInput: null, // Дата составления
         // dateStartFromInput: null, // Начало работ
         // dateDeadlineFromInput: null,
         //Сроки АВР и срок гарантии на выполненные работы
         // days_for_submitting_ACW: '',
         // days_for_warranty: ''
      }),
      validations: {
         contract_number: {required}, //Номер договора
         contract_date: {required},// Дата составления договора
         contract_amount_estimate: {required},// Сумма в смете
         // contract_percentage_prepaid_amount: {required},// % аванса от суммы

         // срок выполнения работ по договору
         // contract_date_start: {required}, // Начало работ
         // contract_date_deadline: {required},

         //Сроки АВР и срок гарантии на выполненные работы
         // days_for_submitting_ACW: {required}, // дней для предъявления АВР
         // days_for_warranty: {required} // дней на гарантию
      },
      created() {
         // Получить данные о пользователе
         try {
            this.$store.dispatch('waitToken', this.getAdditionalAgreementData)
         } catch (e) {
            console.log(e);
         }
      },
      methods: {
         // Получить данные о пользователе
         async getAdditionalAgreementData() {

            await this.$http.get('wp/v2/auction/additional-agreement', {
               params: {contract_id: this.$route.params.contract_id}
            })
               .then(response => {
                  //Получаем всё содержимое, все хедеры, статус и тд...
                  // console.log(response);
                  return response.json();
               })
               .then(response => {

                  this.contract_number = response.contract_number;
                  this.contract_date = response.contract_date;
                  this.contractDateFromInput.el.value = response.contract_date;
                  this.contract_amount_estimate = response.contract_amount_estimate;
                  // this.contract_percentage_prepaid_amount = response.contract_percentage_prepaid_amount;
                  //
                  // this.contract_date_start = response.contract_date_start;
                  // this.contract_date_deadline = response.contract_date_deadline;
                  // this.dateStartFromInput.el.value = response.contract_date_start;
                  // this.dateDeadlineFromInput.el.value = response.contract_date_deadline;
                  //
                  // this.days_for_submitting_ACW = response.days_for_submitting_ACW;
                  // this.days_for_warranty = response.days_for_warranty;

                  console.log(response);
               })
               .catch(function (error) {
                  console.log(error);
                  // this.$store.dispatch('setError', error.data.code);
                  // this.$store.getters.error
                  throw  error;
               });
         },
         setContractDate() {
            this.contract_date = this.contractDateFromInput.el.value;
         },
         setDateStart() {
            this.contract_date_start = this.dateStartFromInput.el.value;
         },
         setDateDeadline() {
            this.contract_date_deadline = this.dateDeadlineFromInput.el.value;
         },
         downloadDocument() {
            this.$message('Скачивается');
            location.href = `${this.$http.options.root}/wp/v2/document/download-additional-agreement-with-master?contract_id=${this.$route.params.contract_id}`;
         },
         // отправить данные о пользователе
         async submitHandler() { // Функция отправки формы
            if (this.$v.$invalid) {   // Если форма не валидна
               this.$v.$touch();   //	Sets the $dirty flag of the model and all its children to true recursively.
               return  // отмена
            }
            // константа с данными
            const formData = {
               contract_id: this.$route.params.contract_id,
               contract_number: this.contract_number,
               contract_date: this.contract_date,
               contract_amount_estimate: this.contract_amount_estimate,
               // contract_percentage_prepaid_amount: this.contract_percentage_prepaid_amount,
               // contract_date_start: this.contract_date_start,
               // contract_date_deadline: this.contract_date_deadline,
               // days_for_submitting_ACW: this.days_for_submitting_ACW,
               // days_for_warranty: this.days_for_warranty
            };

            console.log(formData);

            try {
               // отправка данных для сохранения
               await this.$http.post('wp/v2/auction/additional-agreement', formData)
                  .then(response => {
                     return response.json();
                  })
                  .then(response => {
                     // console.log(response);
                     this.$store.commit('setMessage', response.message);
                  })
                  .catch(function (error) {
                     this.$store.commit('setError', error.data.code);
                     throw  error;
                  });

            } catch (e) {
               console.log('catch auction Additional-agreement.vue');
               console.log(e);
            }
            this.$store.commit('clearMessage');
            this.$store.commit('clearError');
         }
      },
      mounted() {
         this.contractDateFromInput = M.Datepicker.init(this.$refs.contractDateFromInput, this.$store.state.datePicker.datePickerOptions);
         // this.dateStartFromInput = M.Datepicker.init(this.$refs.dateStartFromInput, this.$store.state.datePicker.datePickerOptions);
         // this.dateDeadlineFromInput = M.Datepicker.init(this.$refs.dateDeadlineFromInput, this.$store.state.datePicker.datePickerOptions);

         console.log('auction/Additional-agreement.vue');
         this.$store.commit('change_headerNav', {
            text: 'Информация для сопроводительной документации',
            colorNav: 'red',
            colorHome: 'black',
            colorText: 'black'
         });
      },
      beforeDestroy() {
         // Проверка на существование переменной
         if (this.contractDateFromInput && this.contractDateFromInput.destroy) {
            this.contractDateFromInput.destroy();
         }
      }
   }
</script>

<style scoped>

</style>