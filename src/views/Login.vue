<!--<template>-->

<!--   <form class="col s12 offset-m3 m6 offset-l3 l6 offset-xl4 xl4 mt-5 authorization" @submit.prevent="submitHandler">-->

<!--      <div class="input-field col s12">-->
<!--         &lt;!&ndash; $dirty говорит о том, что пользователь уже что-то неправильное ввел &ndash;&gt;-->
<!--         <input-->
<!--            id="phone"-->
<!--            type="text"-->
<!--            v-model.trim="phone"-->
<!--            :class="{invalid: ($v.phone.$dirty && !$v.phone.required) || ($v.phone.$dirty && !$v.phone.numeric) || ($v.phone.$dirty && !$v.phone.minLength)}"-->
<!--         >-->
<!--         <label for="phone">Введите ваш телефон</label>-->
<!--         <small-->
<!--            class="helper-text invalid"-->
<!--            v-if="$v.phone.$dirty && !$v.phone.required"-->
<!--         >Введите телефон</small>-->
<!--         <small-->
<!--            class="helper-text invalid"-->
<!--            v-else-if="$v.phone.$dirty && !$v.phone.numeric"-->
<!--         >Разрешено вводить только числа</small>-->
<!--         <small-->
<!--            class="helper-text invalid"-->
<!--            v-else-if="$v.phone.$dirty && !$v.phone.minLength"-->
<!--         >Номер должен состоять минимум из {{ $v.phone.$params.minLength.min }} символов. Сейчас он-->
<!--            {{phone.length}} </small>-->
<!--      </div>-->
<!--      <div class="input-field col s12">-->
<!--         <input-->
<!--            id="password"-->
<!--            type="text"-->
<!--            v-model.trim="password"-->
<!--            :class="{invalid: ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength)}"-->
<!--         >-->
<!--         <label for="password">Введите ваш пароль</label>-->
<!--         <small-->
<!--            class="helper-text invalid"-->
<!--            v-if="$v.password.$dirty && !$v.password.required"-->
<!--         >Введите пароль</small>-->
<!--         <small-->
<!--            class="helper-text invalid"-->
<!--            v-else-if="$v.password.$dirty && !$v.password.minLength"-->
<!--         >Пароль должен состоять из {{ $v.password.$params.minLength.min }} символов. Сейчас он-->
<!--            {{password.length}} </small>-->
<!--      </div>-->

<!--      <div class="input-field col s12">-->
<!--         <button-->
<!--            class="btn-large light-green lighten-1 waves-effect waves-light"-->
<!--            type="submit">-->
<!--            Войти в личный кабинет-->
<!--         </button>-->
<!--      </div>-->
<!--      <div class="input-field col s12">-->
<!--         <p class="center">-->
<!--            Нет аккаунта?-->
<!--            <router-link to="/register">Зарегистрироваться</router-link>-->
<!--         </p>-->
<!--      </div>-->
<!--   </form>-->
<!--</template>-->

<!--<script>-->
<!--   //забираем правила валидации из vuelidate (minLength - правило минимальной длинны для пароля)-->
<!--   import {required, numeric, minLength} from 'vuelidate/lib/validators'-->
<!--   //импортируем сообщения-->
<!--   import messages from '@/plugins/toastsMessages';-->

<!--   export default {-->
<!--      name: 'login',-->
<!--      data: () => ({-->
<!--         //создаем 2 модели к полям формы-->
<!--         phone: '',-->
<!--         password: '',-->

<!--         // resource: null-->
<!--      }),-->
<!--      // правила валидации создаются как объекты с названием моделей из data. Внутрь объектов помещаются подлюченные выше правила валидации-->
<!--      validations: {-->
<!--         phone: {-->
<!--            required,-->
<!--            numeric,-->
<!--            // minLength: minLength(11)-->
<!--            minLength: minLength(3)-->
<!--         },-->
<!--         password: {-->
<!--            required,-->
<!--            minLength: minLength(3)-->
<!--         }-->
<!--      },-->
<!--      methods: {-->
<!--         async submitHandler() { // Функция отправки формы-->
<!--            if (this.$v.$invalid) {   // Если форма не валидна-->
<!--               this.$v.$touch();   //	Sets the $dirty flag of the model and all its children to true recursively.-->
<!--               return  // отмена-->
<!--            }-->
<!--            const formData = {username: this.phone, password: this.password};-->
<!--            console.log('formData from login.vue');-->
<!--            console.log(formData);-->

<!--            try {-->
<!--               await this.$store.dispatch('login', formData);-->
<!--               console.log(this.$store.state.auth);-->
<!--               this.$router.push('/')-->
<!--            } catch (e) {-->
<!--               console.log('catch login.vue');-->
<!--               console.log(e);-->
<!--            }-->
<!--            this.$store.commit('clearError');-->
<!--         }-->
<!--         //НОвый способ запроса данных-->
<!--         //    this.resource.get().then(response => response.json().then(cars => this.cars = cars));-->
<!--         // }-->
<!--      },-->

<!--      created() {-->

<!--      },-->
<!--      // компонент загружен-->
<!--      mounted() {-->

<!--         // для плагина toastsMessage сверяемся, что в ключе адресной строки есть совпадение с файлом сообщений-->
<!--         if (messages[this.$route.query.message]) {-->
<!--            this.$message(messages[this.$route.query.message]);-->
<!--         }-->

<!--         console.log('Login.vue');-->
<!--         this.$store.commit('change_headerNav', {-->
<!--            showBack: false,-->
<!--            text: 'Войти в личный кабинет',-->
<!--            colorNav: 'black',-->
<!--            colorHome: 'white',-->
<!--            colorText: 'white'-->
<!--         });-->
<!--      },-->
<!--      // После ухода со страницы очищаем память-->
<!--      beforeDestroy() {-->
<!--         console.log('beforeDestroy');-->
<!--      }-->
<!--   }-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->