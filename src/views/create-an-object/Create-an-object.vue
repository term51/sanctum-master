<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <!--      <Notification notification="userApproved"/>-->
      <h2 class="title">Данные объекту</h2>

      <form @submit.prevent="submitHandler">

         <div class="input-field">
            <input
               id="object_address"
               type="text"
               v-model.trim="object_address"
               :class="{invalid: ($v.object_address.$dirty && !$v.object_address.required)}"
            >
            <label for="object_address">Адрес объекта</label>
            <small
               class="helper-text invalid"
               v-if="$v.object_address.$dirty && !$v.object_address.required"
            >Обязательное поле</small>
         </div>

         <div class="input-field">
            <input
               id="object_name"
               type="text"
               v-model.trim="object_name"
               :class="{invalid: ($v.object_name.$dirty && !$v.object_name.required)}"
            >
            <label for="object_name">Имя объекта</label>
            <small
               class="helper-text invalid"
               v-if="$v.object_name.$dirty && !$v.object_name.required"
            >Обязательное поле</small>
         </div>

         <div class="input-field">
            <select ref="s_priority" class="">
               <option value="3">Высокий</option>
               <option value="2">Средний</option>
               <option value="1">Низкий</option>
            </select>
            <label>Приоритет объекта</label>
         </div>

         <div class="input-field">
            <input
               id="customer_name"
               type="text"
               v-model.trim="customer_name"
               :class="{invalid: ($v.customer_name.$dirty && !$v.customer_name.required)}"
            >
            <label for="customer_name">Имя заказчика</label>
            <small
               class="helper-text invalid"
               v-if="$v.customer_name.$dirty && !$v.customer_name.required"
            >Обязательное поле</small>
         </div>


         <div class="input-field">
            <input
               id="customer_phone"
               type="text"
               v-model.trim="customer_phone"
               :class="{invalid: ($v.customer_phone.$dirty && !$v.customer_phone.required) || ($v.customer_phone.$dirty && !$v.customer_phone.numeric) || ($v.customer_phone.$dirty && !$v.customer_phone.minLength)}"
            >
            <label for="customer_phone">Телефон заказчика</label>
            <small
               class="helper-text invalid"
               v-if="$v.customer_phone.$dirty && !$v.customer_phone.required"
            >Введите телефон</small>
            <small
               class="helper-text invalid"
               v-else-if="$v.customer_phone.$dirty && !$v.customer_phone.numeric"
            >Разрешено вводить только числа</small>
            <small
               class="helper-text invalid"
               v-else-if="$v.customer_phone.$dirty && !$v.customer_phone.minLength"
            >Номер должен состоять минимум из {{ $v.customer_phone.$params.minLength.min }} символов. Сейчас он
               {{customer_phone.length}} </small>
         </div>

         <div class="input-field">
            <input
               id="customer_email"
               type="text"
               v-model.trim="customer_email"
               :class="{invalid: ($v.customer_email.$dirty && !$v.customer_email.required) || ($v.customer_email.$dirty && !$v.customer_email.email)}"
            >
            <label for="customer_email">Email заказчика</label>

            <small
               class="helper-text invalid"
               v-if="$v.customer_email.$dirty && !$v.customer_email.email"
            >Введите корректный Email</small>
         </div>

         <div class="input-field">
            <textarea
               id="note"
               v-model.trim="note"
               class="validate materialize-textarea"></textarea>
            <label for="note">Комментарий к объекту</label>

         </div>

         <div class="input-field">
            <button
               class="btn-standard btn-large light-green lighten-1 waves-effect waves-light"
               type="submit">
               Создать объект
            </button>
         </div>
      </form>
   </div>
</template>

<script>
   //забираем правила валидации из vuelidate (minLength - правило минимальной длинны для пароля)
   import {required, numeric, minLength, email} from 'vuelidate/lib/validators';
   import M from "materialize-css/dist/js/materialize.min";

   export default {
      name: "create-an-object",
      data: () => ({
         //поля формы
         object_address: '',
         object_name: '',
         priority: null,
         customer_name: '',
         // meeting_dateTime: '',
         meeting_date: null,
         meeting_time: null,
         customer_phone: '',
         customer_email: '',
         note: ''
      }),
// правила валидации создаются как объекты с названием моделей из data. Внутрь объектов помещаются подлюченные выше правила валидации
      validations: {
         object_address: {required},
         object_name: {required},
         customer_name: {required},
         customer_phone: {
            required, numeric,
            minLength: minLength(11)
            // minLength: minLength(3)
         },
         customer_email: {email}
      },
      methods: {
         // dateTimeClick() {
         //    this.meeting_date.open();
         // },
         // changeDate() {
         //    this.meeting_time.open();
         // },
         // changeTime() {
         //    if (typeof this.meeting_time.el != 'undefined' && typeof this.meeting_time.el != 'undefined') {
         //       this.meeting_date.el.value;
         //       this.meeting_time.el.value;
         //       this.meeting_dateTime = this.meeting_date.el.value + ' ' + this.meeting_time.el.value;
         //       console.log(this.meeting_dateTime);
         //       console.log(this.meeting_date.el.value + ' ' + this.meeting_time.el.value);
         //    }
         // },
         async submitHandler() { // Функция отправки формы
            if (this.$v.$invalid) {   // Если форма не валидна
               this.$v.$touch();   //	Sets the $dirty flag of the model and all its children to true recursively.
               return  // отмена
            }

            const formData = {
               creator_id: this.$store.state.auth.userId,
               object_address: this.object_address,
               object_name: this.object_name,
               object_priority: this.priority.el.value,
               customer_full_name: this.customer_name,
               // meeting_dateTime: this.meeting_dateTime,
               customer_phone: this.customer_phone,
               customer_email: this.customer_email,
               note: this.note
            };
            console.log('formData from Create-an-object.vue');


            try {
               console.log(formData);
               await this.$http.post('wp/v2/create-an-object', formData)
                  .then(response => response.json())
                  .then(response => {
                     this.$store.commit('setMessage', response.message);
                     this.$router.push({name: 'object-information', params: {id: response.object_id}})
                  })
                  .catch(function (e) {
                     console.log(e);
                     this.$store.commit('setError', e.data.code);
                     // this.$store.commit('setError', error.data.code);
                     throw e
                  })

            } catch (e) {
               console.log('catch Create-an-object.vue');
               // this.$error('Ошибка');
               console.log(e);
            }
            this.$store.commit('clearMessage');
            this.$store.commit('clearError');
         }
      },
      mounted() {
         this.priority = M.FormSelect.init(this.$refs.s_priority);
         this.meeting_date = M.Datepicker.init(this.$refs.i_meeting_date, this.$store.state.datePicker.datePickerOptions);
         // this.meeting_date = M.Datepicker.init(this.$refs.i_meeting_date, {onSelect: function(date) {console.log(date)}});
         this.meeting_time = M.Timepicker.init(this.$refs.i_meeting_time, this.$store.state.datePicker.timePickerOptions);


         console.log('Create-an-object.vue');
         this.$store.commit('change_headerNav', {
            text: 'Создать объект',
            colorNav: 'green',
            colorHome: 'black',
            colorText: 'black'
         });
      },
      //очищаем память
      beforeDestroy() {
         // Проверка на существование переменной
         // if (this.meeting_date && this.meeting_date.destroy) {
         //    this.meeting_date.destroy();
         // }
         // if (this.meeting_time && this.meeting_time.destroy) {
         //    this.meeting_time.destroy();
         // }
         if (this.priority && this.priority.destroy) {
            this.priority.destroy();
         }
      }
   }
</script>

<style scoped>

</style>