<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <h2 class="title"></h2>

      <form @submit.prevent="submitHandler">

         <div class="input-field">
            <input
               id="supplier_name"
               type="text"
               v-model.trim="supplier_name"
               :class="{invalid: ($v.supplier_name.$dirty && !$v.supplier_name.required)}"
            >
            <label for="supplier_name">Название поставщика</label>
            <small
               class="helper-text invalid"
               v-if="$v.supplier_name.$dirty && !$v.supplier_name.required"
            >Обязательное поле</small>
         </div>

         <div class="input-field">
            <input
               id="supplier_manager"
               type="text"
               v-model.trim="supplier_manager"
               :class="{invalid: ($v.supplier_manager.$dirty && !$v.supplier_manager.required)}"
            >
            <label for="supplier_manager">ФИО менеджера</label>
            <small
               class="helper-text invalid"
               v-if="$v.supplier_manager.$dirty && !$v.supplier_manager.required"
            >Обязательное поле</small>
         </div>

         <div class="input-field">
            <input
               id="supplier_phone"
               type="text"
               v-model.trim="supplier_phone"
               :class="{invalid: ($v.supplier_phone.$dirty && !$v.supplier_phone.required) || ($v.supplier_phone.$dirty && !$v.supplier_phone.numeric) || ($v.supplier_phone.$dirty && !$v.supplier_phone.minLength)}"
            >
            <label for="supplier_phone">Телефон</label>
            <small
               class="helper-text invalid"
               v-if="$v.supplier_phone.$dirty && !$v.supplier_phone.required"
            >Обязательное поле</small>
            <small
               class="helper-text invalid"
               v-else-if="$v.supplier_phone.$dirty && !$v.supplier_phone.numeric"
            >Разрешено вводить только числа</small>
         </div>

         <div class="input-field">
            <input
               id="supplier_email"
               type="text"
               v-model.trim="supplier_email"
               :class="{invalid: ($v.supplier_email.$dirty && !$v.supplier_email.required) || ($v.supplier_email.$dirty && !$v.supplier_email.email)}"
            >
            <label for="supplier_email">Email</label>
            <small
               class="helper-text invalid"
               v-if="$v.supplier_email.$dirty && !$v.supplier_email.required"
            >Обязательное поле</small>
            <small
               class="helper-text invalid"
               v-if="$v.supplier_email.$dirty && !$v.supplier_email.email"
            >Введите корректный Email</small>
         </div>

         <div class="input-field">
            <textarea
               id="supplier_note"
               v-model.trim="supplier_note"
               class="validate materialize-textarea"></textarea>
            <label for="supplier_note">Комментарий к поставщику</label>

         </div>

         <div class="input-field">
            <button
               class="btn-standard btn-large light-green lighten-1 waves-effect waves-light"
               type="submit">
               Создать поставщика
            </button>
         </div>
      </form>
   </div>
</template>

<script>
   import {required, numeric, email} from 'vuelidate/lib/validators';

   export default {
      name: "create-supplier",
      data: () => ({
         //поля формы
         supplier_name: '',
         supplier_manager: '',
         supplier_phone: '',
         supplier_email: '',
         supplier_note: ''
      }),
      // правила валидации создаются как объекты с названием моделей из data. Внутрь объектов помещаются подлюченные выше правила валидации
      validations: {
         supplier_name: {required},
         supplier_manager: {required},
         supplier_phone: {required, numeric},
         supplier_email: {required, email}
      },
      methods: {
         async submitHandler() { // Функция отправки формы
            if (this.$v.$invalid) {   // Если форма не валидна
               this.$v.$touch();   //	Sets the $dirty flag of the model and all its children to true recursively.
               return  // отмена
            }

            const formData = {
               supplier_name: this.supplier_name,
               supplier_manager: this.supplier_manager,
               supplier_phone: this.supplier_phone,
               supplier_email: this.supplier_email,
               supplier_note: this.supplier_note,
            };

            try {
               console.log(formData);
               await this.$http.post('wp/v2/suppliers/create-supplier', formData)
                  .then(response => response.json())
                  .then(response => {
                     this.$store.commit('setMessage', response.message)
                  })
                  .catch(function (e) {
                     console.log(e)
                     this.$store.commit('setError', e.data.code)
                     throw e
                  })

            } catch (e) {
               console.log('catch Create-an-object.vue');
               // this.$error('Ошибка');
               console.log(e);
            }
            this.$store.commit('clearMessage')
            this.$store.commit('clearError');
         }
      },
      mounted() {

         console.log('Create-supplier.vue');
         this.$store.commit('change_headerNav', {
            text: 'Создать поставщика',
            colorNav: 'blue',
            colorHome: 'black',
            colorText: 'black'
         });
      }
   }
</script>

<style scoped>

</style>


