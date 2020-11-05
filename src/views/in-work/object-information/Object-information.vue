<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <h2 class="title"></h2>
      <Loader size="big" v-show="loading"/>
      <section class="s-statistics" v-show="!loading">

         <form @submit.prevent="submitHandler">

            <div class="input-field">
               <input
                  id="object_address"
                  type="text"
                  v-model.trim="object_address"
                  :class="{invalid: ($v.object_address.$dirty && !$v.object_address.required)}"
               >
               <label for="object_address" :class="{active: (object_address)}">Адрес объекта</label>
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
               <label for="object_name" :class="{active: (object_name)}">Имя объекта</label>
               <small
                  class="helper-text invalid"
                  v-if="$v.object_name.$dirty && !$v.object_name.required"
               >Обязательное поле</small>
            </div>

            <div class="input-field">
               <select ref="s_priority" v-model="object_priority" class="">
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
               <label for="customer_name" :class="{active: (customer_name)}">Имя заказчика</label>
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
               <label for="customer_phone" :class="{active: (customer_phone)}">Телефон заказчика</label>
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
                  :class="{invalid: ($v.customer_email.$dirty && !$v.customer_email.required) || ($v.customer_email.$dirty && !$v.customer_email.email)}">
               <label for="customer_email" :class="{active: (customer_email)}">Email заказчика</label>

               <small
                  class="helper-text invalid"
                  v-if="$v.customer_email.$dirty && !$v.customer_email.email"
               >Введите корректный Email</small>
            </div>

            <div class="input-field">
               <textarea
                  id="note"
                  v-model.trim="note"
                  class="validate materialize-textarea">
               </textarea>
               <label for="note" :class="{active: (note)}">Комментарий к объекту</label>
            </div>

            <h2 class="title">Аукцион</h2>
            <div class="input-field">
               <input
                  id="auction_address"
                  type="text"
                  v-model.trim="auction_address">
               <label for="auction_address" :class="{active: (auction_address)}">Адрес для лота</label>
            </div>
            <div class="input-field">
               <input
                  id="auction_description"
                  type="text"
                  v-model.trim="auction_description">
               <label for="auction_description" :class="{active: (auction_description)}">Комментарий для аукциона</label>
            </div>
            <div class="auction-wrap">
               <p>Добавить на аукцион</p>
               <div class="switch">
                  <label>
                     Выкл
                     <input @click="auction_status = !auction_status" :checked="auction_status" type="checkbox">
                     <span class="lever"></span>
                     Вкл
                  </label>
               </div>
            </div>

            <div class="input-field">
               <button @click.prevent="saveObject()" class="btn waves-effect waves-light">Обновить информацию
               </button>
            </div>
            <div class="input-field">
               <router-link
                  class="btn waves-effect waves-light"
                  tag="button"
                  :to="`/in-work/object-information/${$route.params.id}/locations`">Локации объекта
               </router-link>
            </div>
            <!--            <div class="input-field">-->
            <!--               <router-link-->
            <!--                  class="btn waves-effect waves-light"-->
            <!--                  tag="button"-->
            <!--                  to="/history/objects">Ознакомительная смета-->
            <!--               </router-link>-->
            <!--            </div>-->
            <div class="input-field">
               <router-link
                  class="btn waves-effect waves-light"
                  tag="button"
                  :to="`/in-work/object-information/${$route.params.id}/${default_url}`">Сопроводительная
                  документация
               </router-link>
            </div>
            <div class="input-field">
               <router-link
                  class="btn waves-effect waves-light"
                  tag="button"
                  to=""
                  ref="b_tooltipped"
                  :class="{tooltipped: true, disabled: true}"
               >Доставка строй материалов
               </router-link>
            </div>

            <div class="input-field">
               <button
                  class="btn-standard btn-large light-green lighten-1 waves-effect waves-light"
                  type="submit">
                  Завершить объект
               </button>
            </div>
         </form>
      </section>
   </div>
</template>

<script>
   //забираем правила валидации из vuelidate (minLength - правило минимальной длинны для пароля)
   import {required, numeric, minLength, email} from 'vuelidate/lib/validators';

   import M from "materialize-css/dist/js/materialize.min";

   export default {
      name: "Object-information",
      data: () => ({
         loading: true,
         // хранит ссылку для сопровод. док.
         default_url: 'accompanying-documentation',
         //поля формы
         object_id: '',
         object_address: '',
         object_name: '',
         s_priority: null,
         object_priority: '',
         customer_name: '',
         customer_phone: '',
         customer_email: '',
         note: '',
         toolTip: null,
         auction_status: false,
         auction_address: '',
         auction_description: ''
      }),
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
      created() {
         try {
            // this.loading = false
            this.$store.dispatch('waitToken', this.getObject)
         } catch (e) {
            console.log(e);
         }
      },
      methods: {
         // changeAuctionStatus() {
         //    // this.$store.state.auth.notifications;
         //    this.auction_status = !this.auction_status
         // },
         async getObject() {
            await this.$http.get('wp/v2/object-information', {
               params: {
                  id: this.$route.params.id
               }
            })
               .then(response => response.json())
               .then(response => {
                  console.log('in', response)
                  this.object_id = response.object_id
                  this.object_address = response.object_address
                  this.object_name = response.object_name
                  this.object_priority = response.object_priority
                  this.customer_name = response.customer_full_name
                  this.customer_phone = response.customer_phone
                  this.customer_email = response.customer_email
                  this.note = response.note
                  this.auction_address = response.auction_address
                  this.auction_description = response.auction_description
                  this.auction_status = response.auction_status == 1
                  if (response.contract_number) this.default_url = 'accompanying-documentation-in-work'

                  this.loading = false
               })
               .catch(function (e) {
                  throw e;
               })

            setTimeout(() => {
               this.s_priority = M.FormSelect.init(this.$refs.s_priority, {})
               this.toolTip = M.Tooltip.init(this.$refs.b_tooltipped.$el, {
                  position: 'bottom',
                  enterDelay: 200,
                  html: 'Будет доступно после заполнения сопр. документации'
               });

            }, 100)

         },
         async saveObject() { // Функция отправки формы
            if (this.$v.$invalid) {   // Если форма не валидна
               this.$v.$touch();
               return  // отмена
            }

            const formData = {
               id: this.$route.params.id,
               object_address: this.object_address,
               object_name: this.object_name,
               object_priority: this.object_priority,
               customer_name: this.customer_name,
               customer_phone: this.customer_phone,
               customer_email: this.customer_email,
               note: this.note,
               auction_address: this.auction_address,
               auction_description: this.auction_description,
               auction_status: this.auction_status
            };
            console.log('formData from Object-information.vue');
            try {
               console.log(formData);
               await this.$http.post('wp/v2/object-information', formData)
                  .then(response => response.json())
                  .then(response => {
                     this.$store.commit('setMessage', response.message);
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
         },
         // завершить объект
         async submitHandler() {
            if (confirm('Вы уверены?')) {
               await this.$http.post('wp/v2/object-information/finish-object', {
                  object_id: this.$route.params.id
               })
                  .then(response => response.json())
                  .then(response => {
                     this.$store.commit('setMessage', response.message)
                     // перекинуть на страницу с объектами
                     setTimeout(() => this.$router.push('/in-work'), 100)
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
         console.log('Object-information.vue');
         this.$store.commit('change_headerNav', {
            text: 'Информация по объекту ' + this.$store.state.objectInfo.object_name,
            colorNav: 'red',
            colorHome: 'black',
            colorText: 'black'
         });
      },
      //очищаем память
      beforeDestroy() {
         // Проверка на существование переменной
         if (this.s_priority && this.s_priority.destroy) {
            this.s_priority.destroy();
         }

         if (this.toolTip && this.toolTip.destroy) {
            this.toolTip.destroy();
         }
      }
   }
</script>

<style lang="scss" scoped>
   #note {
      height: 100%;
   }

   .btn {
      background-color: #424852;
      color: #fff;
      text-transform: none;
      width: 100%;
   }

   .auction-wrap {
      text-align: center;
      margin: 20px 0px;
   }
</style>