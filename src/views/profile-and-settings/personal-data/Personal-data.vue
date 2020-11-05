<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <!--      <Notification notification="userApproved"/>-->
      <h2 class="title">Личные данные</h2>

      <form @submit.prevent="submitHandler">

         <div class="input-field">
            <!-- $dirty говорит о том, что пользователь уже что-то неправильное ввел -->
            <input
               id="full_name"
               type="text"
               v-model.trim="full_name"
               :class="{invalid: ($v.full_name.$dirty && !$v.full_name.required)}"
            >
            <label for="full_name" :class="{active: (full_name)}">ФИО</label>
            <small
               class="helper-text invalid"
               v-if="$v.full_name.$dirty && !$v.full_name.required"
            >Введите ваше ФИО</small>
         </div>

         <div class="input-field">
            <input
               id="phone_number"
               type="text"
               v-model.trim="phone_number"
               :class="{invalid: ($v.phone_number.$dirty && !$v.phone_number.required) || ($v.phone_number.$dirty && !$v.phone_number.numeric) || ($v.phone_number.$dirty && !$v.phone_number.minLength)}"
            >
            <label for="phone_number" :class="{active: (phone_number)}">Введите ваш телефон</label>
            <small
               class="helper-text invalid"
               v-if="$v.phone_number.$dirty && !$v.phone_number.required"
            >Введите телефон</small>
            <small
               class="helper-text invalid"
               v-else-if="$v.phone_number.$dirty && !$v.phone_number.numeric"
            >Разрешено вводить только числа</small>
            <small
               class="helper-text invalid"
               v-else-if="$v.phone_number.$dirty && !$v.phone_number.minLength"
            >Номер должен состоять минимум из {{ $v.phone_number.$params.minLength.min }} символов. Сейчас он
               {{phone_number.length}} </small>
         </div>

         <div class="input-field">
            <input
               id="email"
               type="text"
               v-model.trim="email"
               :class="{invalid: ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email)}"
            >
            <label for="email" :class="{active: (email)}">Введите ваш Email</label>
            <small
               class="helper-text invalid"
               v-if="$v.email.$dirty && !$v.email.required"
            >Поле Email не должно быть пустым</small>
            <small
               class="helper-text invalid"
               v-else-if="$v.email.$dirty && !$v.email.email"
            >Введите корректный Email</small>
            <small>На почту придет сообщение для подтверждения</small>
         </div>

         <div class="input-field">
            <!-- $dirty говорит о том, что пользователь уже что-то неправильное ввел -->
            <input
               id="passport"
               type="text"
               v-model.trim="passport"
               :class="{invalid: ($v.passport.$dirty && !$v.passport.required)}"
            >
            <label for="passport" :class="{active: (passport)}">Паспорт серия номер</label>
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
               :class="{invalid: ($v.issued_by.$dirty && !$v.issued_by.required)}"
            >
            <label for="issued_by" :class="{active: (issued_by)}">Кем выдан</label>
            <small
               class="helper-text invalid"
               v-if="$v.issued_by.$dirty && !$v.issued_by.required"
            >Обязательное поле</small>
         </div>

         <div class="input-field">
            <!-- $dirty говорит о том, что пользователь уже что-то неправильное ввел -->
            <input
               ref="dateOfIssueFromInput"
               v-on:change="setDateOfIssue"
               id="date_of_issue"
               type="text"
               v-model.trim="date_of_issue"
               :class="{invalid: ($v.date_of_issue.$dirty && !$v.date_of_issue.required)}"
            >
            <label for="date_of_issue" :class="{active: (date_of_issue)}">Дата выдачи</label>
            <small
               class="helper-text invalid"
               v-if="$v.date_of_issue.$dirty && !$v.date_of_issue.required"
            >Обязательное поле</small>
         </div>

         <div class="input-field">
            <!-- $dirty говорит о том, что пользователь уже что-то неправильное ввел -->
            <input
               id="plase_of_registration"
               type="text"
               v-model.trim="plase_of_registration"
               :class="{invalid: ($v.plase_of_registration.$dirty && !$v.plase_of_registration.required)}"
            >
            <label for="plase_of_registration" :class="{active: (plase_of_registration)}">Место регистрации</label>
            <small
               class="helper-text invalid"
               v-if="$v.plase_of_registration.$dirty && !$v.plase_of_registration.required"
            >Обязательное поле</small>
         </div>

         <h2 class="title">Юридические данные</h2>

         <div class="input-field">
            <!-- $dirty говорит о том, что пользователь уже что-то неправильное ввел -->
            <input
               id="payment_account"
               type="text"
               v-model.trim="payment_account"
               :class="{invalid: ($v.payment_account.$dirty && !$v.payment_account.required)}"
            >
            <label for="payment_account" :class="{active: (payment_account)}">Р/C</label>
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
               :class="{invalid: ($v.RCBIC.$dirty && !$v.RCBIC.required)}"
            >
            <label for="RCBIC" :class="{active: (RCBIC)}">БИК</label>
            <small
               class="helper-text invalid"
               v-if="$v.RCBIC.$dirty && !$v.RCBIC.required"
            >Обязательное поле</small>
         </div>

         <div class="input-field">
            <!-- $dirty говорит о том, что пользователь уже что-то неправильное ввел -->
            <input
               id="bank_name"
               type="text"
               v-model.trim="bank_name"
               :class="{invalid: ($v.bank_name.$dirty && !$v.bank_name.required)}"
            >
            <label for="bank_name" :class="{active: (bank_name)}">Банк</label>
            <small
               class="helper-text invalid"
               v-if="$v.bank_name.$dirty && !$v.bank_name.required"
            >Обязательное поле</small>
         </div>

         <div class="input-field">
            <!-- $dirty говорит о том, что пользователь уже что-то неправильное ввел -->
            <input
               id="correspondent_account"
               type="text"
               v-model.trim="correspondent_account"
               :class="{invalid: ($v.correspondent_account.$dirty && !$v.correspondent_account.required)}"
            >
            <label for="correspondent_account" :class="{active: (correspondent_account)}">К/Счет</label>
            <small
               class="helper-text invalid"
               v-if="$v.correspondent_account.$dirty && !$v.correspondent_account.required"
            >Обязательное поле</small>
         </div>

         <div class="input-field">
            <button
               class="btn-large light-green lighten-1 waves-effect waves-light"
               type="submit">
               Сохранить информацию
            </button>
         </div>
      </form>
   </div>
</template>

<script>
   //забираем правила валидации из vuelidate (minLength - правило минимальной длинны для пароля)
   import {required, numeric, minLength, email} from 'vuelidate/lib/validators'
   import M from "materialize-css/dist/js/materialize.min";
   //импортируем сообщения
   // import messages from '@/plugins/toastsMessages';

   export default {
      name: "personal-data",
      data: () => ({
         //поля формы
         full_name: '',
         phone_number: '',
         email: '',
         passport: '',
         issued_by: '', // (кем выдан)
         date_of_issue: '',//(дата выдачи)
         dateOfIssueFromInput: null, // Датапикер
         plase_of_registration: '',//(место регистрации)
         // юр данные
         payment_account: '',//(расчетный счет)
         RCBIC: '',//(БИК)
         bank_name: '', // (банк)
         correspondent_account: '' //(кр/счет)
      }),
// правила валидации создаются как объекты с названием моделей из data. Внутрь объектов помещаются подлюченные выше правила валидации
      validations: {
         full_name: {required},
         phone_number: {
            required,
            numeric,
            // minLength: minLength(11)
            minLength: minLength(3)
         },
         email: {email, required},
         passport: {required},
         issued_by: {required},
         date_of_issue: {required},
         plase_of_registration: {required},
         payment_account: {required},
         RCBIC: {required},
         bank_name: {required},
         correspondent_account: {required}
      },
      created() {
         // Получить данные о пользователе
         try {
            // подождать получение токена
            this.$store.dispatch('waitToken', this.getPersonalData)
         } catch (e) {
            console.log(e);
         }
      },
      methods: {
         // задаются данные из datapickers
         setDateOfIssue() {
            this.date_of_issue = this.dateOfIssueFromInput.el.value;
         },
         // Получить данные о пользователе
         async getPersonalData() {

            await this.$http.get('wp/v2/users/personal-data', {
               params: {user_id: this.$store.state.auth.userId}
            })
               .then(response => {
                  //Получаем всё содержимое, все хедеры, статус и тд...
                  // console.log(response);
                  return response.json();
               })
               .then(response => {
                  this.full_name = response.full_name;
                  this.phone_number = response.phone_number;
                  this.email = response.email;
                  this.passport = response.passport;
                  this.issued_by = response.issued_by;
                  this.date_of_issue = response.date_of_issue;
                  this.dateOfIssueFromInput.el.value = response.date_of_issue;
                  this.plase_of_registration = response.plase_of_registration;
                  this.payment_account = response.payment_account;
                  this.RCBIC = response.RCBIC;
                  this.bank_name = response.bank_name;
                  this.correspondent_account = response.correspondent_account;
                  // console.log(response);
               })
               .catch(function (error) {
                  console.log(error.data.code);
                  this.$store.commit('setError', error.data.code);
                  throw  error;
               });
         },
         // отправить данные о пользователе
         async submitHandler() { // Функция отправки формы
            if (this.$v.$invalid) {   // Если форма не валидна
               this.$v.$touch();   //	Sets the $dirty flag of the model and all its children to true recursively.
               return  // отмена
            }
            // константа с данными
            const formData = {
               user_id: this.$store.state.auth.userId,
               full_name: this.full_name,
               phone_number: this.phone_number,
               email: this.email,
               passport: this.passport,
               issued_by: this.issued_by,
               date_of_issue: this.date_of_issue,
               plase_of_registration: this.plase_of_registration,
               payment_account: this.payment_account,
               RCBIC: this.RCBIC,
               bank_name: this.bank_name,
               correspondent_account: this.correspondent_account
            };

            // console.log(formData);

            try {
               // Регистрация (получение токена и создание пользователя)
               await this.$http.post('wp/v2/users/personal-data', formData)
                  .then(response => {
                     //Получаем всё содержимое, все хедеры, статус и тд...
                     // console.log(response);
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
               console.log('catch Personal-data.vue');
               console.log(e);
            }
            this.$store.commit('clearMessage');
            this.$store.commit('clearError');
         }
      },
      mounted() {
         this.dateOfIssueFromInput = M.Datepicker.init(this.$refs.dateOfIssueFromInput, this.$store.state.datePicker.datePickerOptions);

         console.log('Personal-data.vue');
         this.$store.commit('change_headerNav', {
            text: 'Личные данные',
            colorNav: 'blue',
            colorHome: 'black',
            colorText: 'black'
         });
      },
      beforeDestroy() {
         if (this.dateOfIssueFromInput && this.dateOfIssueFromInput.destroy) {
            this.dateOfIssueFromInput.destroy();
         }
      }
   }
</script>

<style lang="scss" scoped>
   button {
      width: 100%;
      color: #000;
   }
</style>