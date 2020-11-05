<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <h2 class="title">Личные данные заказчика</h2>

      <form @submit.prevent="submitHandler">

         <div class="input-field">
            <!-- $dirty говорит о том, что пользователь уже что-то неправильное ввел -->
            <input
               id="full_name"
               type="text"
               v-model.trim="full_name"
               :class="{invalid: ($v.full_name.$dirty && !$v.full_name.required)}">
            <label for="full_name" :class="{active:(full_name)}">ФИО заказчика</label>
            <small
               class="helper-text invalid"
               v-if="$v.full_name.$dirty && !$v.full_name.required"
            >Введите ваше ФИО</small>
         </div>

         <div class="input-field">
            <input
               id="phone"
               type="text"
               v-model.trim="phone"
               :class="{invalid: ($v.phone.$dirty && !$v.phone.required) || ($v.phone.$dirty && !$v.phone.numeric) || ($v.phone.$dirty && !$v.phone.minLength)}">
            <label for="phone" :class="{active:(phone)}">Телефон заказчика</label>
            <small
               class="helper-text invalid"
               v-if="$v.phone.$dirty && !$v.phone.required"
            >Введите телефон</small>
            <small
               class="helper-text invalid"
               v-else-if="$v.phone.$dirty && !$v.phone.numeric"
            >Разрешено вводить только числа</small>
            <small
               class="helper-text invalid"
               v-else-if="$v.phone.$dirty && !$v.phone.minLength"
            >Номер должен состоять минимум из {{ $v.phone.$params.minLength.min }} символов. Сейчас он
               {{phone.length}} </small>
         </div>

         <div class="input-field">
            <input
               id="email"
               type="text"
               v-model.trim="email"
               :class="{invalid: ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email)}"
            >
            <label for="email" :class="{active:(email)}">Email</label>
            <small
               class="helper-text invalid"
               v-if="$v.email.$dirty && !$v.email.required"
            >Поле Email не должно быть пустым</small>
            <small
               class="helper-text invalid"
               v-else-if="$v.email.$dirty && !$v.email.email"
            >Введите корректный Email</small>
         </div>

         <div class="input-field">
            <!-- $dirty говорит о том, что пользователь уже что-то неправильное ввел -->
            <input
               id="passport"
               type="text"
               v-model.trim="passport"
               :class="{invalid: ($v.passport.$dirty && !$v.passport.required)}">
            <label for="passport" :class="{active:(passport)}">Паспорт серия номер</label>
            <small
               class="helper-text invalid"
               v-if="$v.passport.$dirty && !$v.passport.required"
            >Обязательное поле</small>
         </div>

         <div class="input-field">
            <!-- $dirty говорит о том, что пользователь уже что-то неправильное ввел -->
            <input
               id="issued_by"
               type="text"
               v-model.trim="issued_by"
               :class="{invalid: ($v.issued_by.$dirty && !$v.issued_by.required)}">
            <label for="issued_by" :class="{active:(issued_by)}">Кем выдан</label>
            <small
               class="helper-text invalid"
               v-if="$v.issued_by.$dirty && !$v.issued_by.required"
            >Обязательное поле</small>
         </div>

         <div class="input-field">
            <!-- $dirty говорит о том, что пользователь уже что-то неправильное ввел -->
            <input
               id="date_of_issue"
               type="text"
               v-on:change="setDateOfIssue"
               ref="dateOfIssueFromInput"
               class="datepicker">
            <label for="date_of_issue" :class="{active: (date_of_issue)}">Дата выдачи</label>
            <small
               class="helper-text invalid"
               v-if="$v.date_of_issue.$dirty && !$v.date_of_issue.required"
            >Обязательное поле</small>
         </div>

         <div class="input-field">
            <!-- $dirty говорит о том, что пользователь уже что-то неправильное ввел -->
            <input
               id="place_of_registration"
               type="text"
               v-model.trim="place_of_registration"
               :class="{invalid: ($v.place_of_registration.$dirty && !$v.place_of_registration.required)}">
            <label for="place_of_registration" :class="{active:(place_of_registration)}">Место регистрации</label>
            <small
               class="helper-text invalid"
               v-if="$v.place_of_registration.$dirty && !$v.place_of_registration.required"
            >Обязательное поле</small>
         </div>

         <h2 class="title">Реквизиты</h2>

         <div class="input-field">
            <!-- $dirty говорит о том, что пользователь уже что-то неправильное ввел -->
            <input
               id="payment_account"
               type="text"
               v-model.trim="payment_account"
               :class="{invalid: ($v.payment_account.$dirty && !$v.payment_account.required)}">
            <label for="payment_account" :class="{active:(payment_account)}">Р/C</label>
            <small
               class="helper-text invalid"
               v-if="$v.payment_account.$dirty && !$v.payment_account.required"
            >Обязательное поле</small>
         </div>

         <div class="input-field">
            <!-- $dirty говорит о том, что пользователь уже что-то неправильное ввел -->
            <input
               id="RCBIC"
               type="text"
               v-model.trim="RCBIC"
               :class="{invalid: ($v.RCBIC.$dirty && !$v.RCBIC.required)}">
            <label for="RCBIC" :class="{active:(RCBIC)}">БИК</label>
            <small
               class="helper-text invalid"
               v-if="$v.RCBIC.$dirty && !$v.RCBIC.required">Обязательное поле</small>
         </div>

         <div class="input-field">
            <!-- $dirty говорит о том, что пользователь уже что-то неправильное ввел -->
            <input
               id="bank_name"
               type="text"
               v-model.trim="bank_name"
               :class="{invalid: ($v.bank_name.$dirty && !$v.bank_name.required)}">
            <label for="bank_name" :class="{active:(bank_name)}">Банк</label>
            <small
               class="helper-text invalid"
               v-if="$v.bank_name.$dirty && !$v.bank_name.required">Обязательное поле</small>
         </div>

         <div class="input-field">
            <input
               id="correspondent_account"
               type="text"
               v-model.trim="correspondent_account"
               :class="{invalid: ($v.correspondent_account.$dirty && !$v.correspondent_account.required)}">
            <label for="correspondent_account" :class="{active:(correspondent_account)}">К/Счет</label>
            <small
               class="helper-text invalid"
               v-if="$v.correspondent_account.$dirty && !$v.correspondent_account.required">Обязательное поле</small>
         </div>

         <h2 class="title">Оговорки по договору</h2>

         <div class="input-field">
            <input
               id="contract_city"
               type="text"
               v-model.trim="contract_city"
               :class="{invalid: ($v.contract_city.$dirty && !$v.contract_city.required)}">
            <label for="contract_city" :class="{active:(contract_city)}">Город</label>
            <small
               class="helper-text invalid"
               v-if="$v.contract_city.$dirty && !$v.contract_city.required"
            >Обязательное поле</small>
         </div>
         <div class="input-field">
            <input
               id="contract_number"
               type="text"
               v-model.trim="contract_number"
               :class="{invalid: ($v.contract_number.$dirty && !$v.contract_number.required)}">
            <label for="contract_number" :class="{active:(contract_number)}">Номер договора</label>
            <small
               class="helper-text invalid"
               v-if="$v.contract_number.$dirty && !$v.contract_number.required"
            >Обязательное поле</small>
         </div>
         <div class="input-field">
            <input
               id="contract_date"
               v-on:change="setContractDate"
               type="text"
               ref="contractDateFromInput"
               class="datepicker">
            <label for="contract_date" :class="{active:(contract_date)}">Дата составления</label>
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
               :class="{invalid: ($v.contract_amount_estimate.$dirty && !$v.contract_amount_estimate.required)}">
            <label for="contract_amount_estimate" :class="{active:(contract_amount_estimate)}">Сумма в смете</label>
            <small
               class="helper-text invalid"
               v-if="$v.contract_amount_estimate.$dirty && !$v.contract_amount_estimate.required"
            >Обязательное поле</small>
         </div>
         <div class="input-field">
            <input
               id="contract_percentage_prepaid_amount"
               type="text"
               v-model.trim="contract_percentage_prepaid_amount"
               :class="{invalid: ($v.contract_percentage_prepaid_amount.$dirty && !$v.contract_percentage_prepaid_amount.required)}">
            <label for="contract_percentage_prepaid_amount" :class="{active:(contract_percentage_prepaid_amount)}">%
               аванса от суммы</label>
            <small
               class="helper-text invalid"
               v-if="$v.contract_percentage_prepaid_amount.$dirty && !$v.contract_percentage_prepaid_amount.required"
            >Обязательное поле</small>
         </div>

         <h2 class="title">Срок выполнения работ по договору</h2>
         <div class="input-field">
            <input
               id="contract_date_start"
               v-on:change="setDateStart"
               ref="dateStartFromInput"
               type="text"
               class="datepicker">
            <label for="contract_date_start" :class="{active: (contract_date_start)}">Начало работ</label>
            <small
               class="helper-text invalid"
               v-if="$v.contract_date_start.$dirty && !$v.contract_date_start.required"
            >Обязательное поле</small>
         </div>

         <div class="input-field">
            <input
               id="contract_date_deadline"
               v-on:change="setDateDeadLine"
               ref="dateDeadlineFromInput"
               type="text"
               class="datepicker">
            <label for="contract_date_deadline" :class="{active: (contract_date_deadline)}">Окончание работ</label>
            <small
               class="helper-text invalid"
               v-if="$v.contract_date_deadline.$dirty && !$v.contract_date_deadline.required"
            >Обязательное поле</small>
         </div>


         <h2 class="title">Сроки АВР и срок гарантии на выполненные работы</h2>

         <div class="input-field">
            <input
               id="days_for_submitting_ACW"
               type="number"
               v-model.trim="days_for_submitting_ACW"
               :class="{invalid: ($v.days_for_submitting_ACW.$dirty && !$v.days_for_submitting_ACW.required)}">
            <label for="days_for_submitting_ACW" :class="{active:(days_for_submitting_ACW)}">Срок предъявления
               АВР</label>
            <small
               class="helper-text invalid"
               v-if="$v.days_for_submitting_ACW.$dirty && !$v.days_for_submitting_ACW.required"
            >Обязательное поле</small>
         </div>
         <div class="input-field">
            <input
               id="days_for_warranty"
               type="number"
               v-model.trim="days_for_warranty"
               :class="{invalid: ($v.days_for_warranty.$dirty && !$v.days_for_warranty.required)}">
            <label for="days_for_warranty" :class="{active:(days_for_warranty)}">Гарантия на срок</label>
            <small
               class="helper-text invalid"
               v-if="$v.days_for_warranty.$dirty && !$v.days_for_warranty.required"
            >Обязательное поле</small>
         </div>

         <!--сохранить -->
<!--         <div class="input-field">-->
<!--            <button-->
<!--               -->
<!--               class="btn btn-standard light-green lighten-1 waves-effect waves-light"-->
<!--               type="submit">-->
<!--               Сохранить изменения-->
<!--            </button>-->
<!--         </div>-->
         <!-- создать сопровод документацию -->
         <div class="input-field">
            <button
               @click.prevent="saveObjectData"
               class="btn btn-standard btn-large red accent-1 waves-effect waves-light"
               type="submit">Создать сопроводительную документацию
            </button>
         </div>

      </form>
   </div>
</template>

<script>

   import {required, numeric, minLength, email} from 'vuelidate/lib/validators'
   import M from "materialize-css/dist/js/materialize.min";
   //импортируем сообщения
   // import messages from '@/plugins/toastsMessages';

   export default {
      name: "accompanying-documentation",
      data: () => ({
         //поля формы
         full_name: '',
         phone: '',
         email: '',
         passport: '',
         issued_by: '', // (кем выдан)
         date_of_issue: '',//(дата выдачи)
         place_of_registration: '',//(место регистрации)
         // реквизиты
         payment_account: '',//(расчетный счет)
         RCBIC: '',//(БИК)
         bank_name: '', // (банк)
         correspondent_account: '', //(кр/счет)
         // оговорки по договору
         contract_city:'', // город
         contract_number: '', //Номер договора
         contract_date: '',// Дата составления договора
         contract_amount_estimate: '',// Сумма в смете
         contract_percentage_prepaid_amount: '',// % аванса от суммы

         // срок выполнения работ по договору
         contract_date_start: '', // Начало работ
         contract_date_deadline: '', // Окончание работ
         //инициализация датапикеров
         dateOfIssueFromInput: null, // Дата выдачи паспорта
         contractDateFromInput: null, // Дата составления договора
         dateStartFromInput: null, // Начало работ
         dateDeadlineFromInput: null, // окончание работ

         //Сроки АВР и срок гарантии на выполненные работы
         days_for_submitting_ACW: '', // дней для предъявления АВР
         days_for_warranty: '' // дней на гарантию
      }),
      // правила валидации создаются как объекты с названием моделей из data. Внутрь объектов помещаются подлюченные выше правила валидации
      validations: {
         full_name: {required},
         phone: {
            required,
            numeric,
            // minLength: minLength(11)
            minLength: minLength(3)
         },
         email: {email, required},
         passport: {required},
         issued_by: {required},
         date_of_issue: {required},
         place_of_registration: {required},
         payment_account: {required},
         RCBIC: {required},
         bank_name: {required},
         correspondent_account: {required},
         contract_city:{required}, // город
         contract_number: {required}, //Номер договора
         contract_date: {required},// Дата составления договора
         contract_amount_estimate: {required},// Сумма в смете
         contract_percentage_prepaid_amount: {required},// % аванса от суммы

         // срок выполнения работ по договору
         contract_date_start: {required}, // Начало работ
         contract_date_deadline: {required},

         //Сроки АВР и срок гарантии на выполненные работы
         days_for_submitting_ACW: {required}, // дней для предъявления АВР
         days_for_warranty: {required} // дней на гарантию
      },
      created() {
         try {
            this.$store.dispatch('waitToken', this.getObjectData)
         } catch (e) {
            console.log(e);
         }
      },
      methods: {
         // задаются данные из datapickers
         setDateOfIssue() {
            this.date_of_issue = this.dateOfIssueFromInput.el.value;
         },
         setContractDate() {
            this.contract_date = this.contractDateFromInput.el.value;
         },
         setDateStart() {
            this.contract_date_start = this.dateStartFromInput.el.value;
         },
         setDateDeadLine() {
            this.contract_date_deadline = this.dateDeadlineFromInput.el.value;
         },

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

                  this.full_name = response.customer_full_name;
                  this.phone = response.customer_phone;
                  this.email = response.customer_email;
                  this.passport = response.customer_passport;
                  this.issued_by = response.customer_issued_by;
                  this.date_of_issue = response.customer_date_of_issue;
                  this.dateOfIssueFromInput.el.value = response.customer_date_of_issue;
                  this.place_of_registration = response.customer_place_of_registration;
                  // реквизиты
                  this.payment_account = response.customer_payment_account;
                  this.RCBIC = response.customer_RCBIC;
                  this.bank_name = response.customer_bank_name;
                  this.correspondent_account = response.customer_correspondent_account;
                  // оговорки по договору
                  this.contract_city = response.contract_city;
                  this.contract_number = response.contract_number;
                  this.contract_date = response.contract_date;
                  this.contractDateFromInput.el.value = response.contract_date;
                  this.contract_amount_estimate = response.contract_amount_estimate;
                  this.contract_percentage_prepaid_amount = response.contract_percentage_prepaid_amount;
                  // срок выполнения работ по договору
                  this.contract_date_start = response.contract_date_start;
                  this.dateStartFromInput.el.value = response.contract_date_start;
                  this.contract_date_deadline = response.contract_date_deadline;
                  this.dateDeadlineFromInput.el.value = response.contract_date_deadline;

                  this.days_for_submitting_ACW = response.days_for_submitting_ACW
                  this.days_for_warranty = response.days_for_warranty
                  // console.log(response);
               })
               .catch(function (error) {
                  console.log(error);
                  this.$store.commit('setError', error.data.code);
                  throw  error;
               });
            this.$store.commit('clearError');
         },
         // сохранить данные
         async saveObjectData() {
            if (this.$v.$invalid) {   // Если форма не валидна
               this.$v.$touch();   //	Sets the $dirty flag of the model and all its children to true recursively.
               return  // отмена
            }

            const formData = {
               object_id: this.$route.params.id,
               customer_full_name: this.full_name,
               customer_phone: this.phone,
               customer_email: this.email,
               customer_passport: this.passport,
               customer_issued_by: this.issued_by,
               customer_date_of_issue: this.date_of_issue,
               customer_place_of_registration: this.place_of_registration,
               // реквизиты
               customer_payment_account: this.payment_account,
               customer_RCBIC: this.RCBIC,
               customer_bank_name: this.bank_name,
               customer_correspondent_account: this.correspondent_account,
               // оговорки по договору
               contract_city: this.contract_city,
               contract_number: this.contract_number,
               contract_date: this.contract_date,
               contract_amount_estimate: this.contract_amount_estimate,
               contract_percentage_prepaid_amount: this.contract_percentage_prepaid_amount,
               // срок выполнения работ по договору
               contract_date_start: this.contract_date_start,
               contract_date_deadline: this.contract_date_deadline,

               days_for_submitting_ACW: this.days_for_submitting_ACW,
               days_for_warranty: this.days_for_warranty,
            }

            try {
               console.log(formData);
               await this.$http.post('wp/v2/object-information/accompanying-documentation', formData)
                  .then(response => response.json())
                  .then(response => {
                     this.$store.commit('setMessage', response.message);
                     this.submitHandler();
                  })
                  .catch(function (error) {
                     console.log(error);
                     this.$store.commit('setError', error.data.code);
                     throw error
                  })

            } catch (e) {
               console.log('catch Create-an-object.vue');
               // this.$error('Ошибка');
               console.log(e);
            }


            this.$store.commit('clearMessage');
            this.$store.commit('clearError');

         },
         submitHandler() { // Функция отправки формы
            // if (this.$v.$invalid) {   // Если форма не валидна
            //    this.$v.$touch();   //	Sets the $dirty flag of the model and all its children to true recursively.
            //    return  // отмена
            // }

            this.$router.push(`/in-work/object-information/${this.$route.params.id}/accompanying-documentation-in-work`)
         }
      },
      mounted() {

         this.dateOfIssueFromInput = M.Datepicker.init(this.$refs.dateOfIssueFromInput, this.$store.state.datePicker.datePickerOptions);
         this.contractDateFromInput = M.Datepicker.init(this.$refs.contractDateFromInput, this.$store.state.datePicker.datePickerOptions);
         this.dateStartFromInput = M.Datepicker.init(this.$refs.dateStartFromInput, this.$store.state.datePicker.datePickerOptions);
         this.dateDeadlineFromInput = M.Datepicker.init(this.$refs.dateDeadlineFromInput, this.$store.state.datePicker.datePickerOptions);


         console.log('Accompanying-documentation.vue');
         this.$store.commit('change_headerNav', {
            text: 'Информация для сопроводительной документации',
            colorNav: 'red',
            colorHome: 'black',
            colorText: 'black'
         });
      },
      beforeDestroy() {
         if (this.dateOfIssueFromInput && this.dateOfIssueFromInput.destroy) {
            this.dateOfIssueFromInput.destroy();
         }
         if (this.contractDateFromInput && this.contractDateFromInput.destroy) {
            this.contractDateFromInput.destroy();
         }
         if (this.dateStartFromInput && this.dateStartFromInput.destroy) {
            this.dateStartFromInput.destroy();
         }
         if (this.dateDeadlineFromInput && this.dateDeadlineFromInput.destroy) {
            this.dateDeadlineFromInput.destroy();
         }
      }
   }
</script>

<style lang="scss" scoped>

   .btn-large {
      white-space: normal;
      line-height: 20px;
   }
</style>