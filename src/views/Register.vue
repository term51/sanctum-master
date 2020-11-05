<!--<template>-->
<!--   <form class="col s12 offset-m3 m6 offset-l3 l6 offset-xl4 xl4 authorization" @submit.prevent="submitHandler">-->
<!--      <div class="input-field col s12">-->
<!--         <Notification notification="userApproved"/>-->
<!--      </div>-->
<!--      <div class="input-field col s12">-->
<!--         <h6 class="authorization-title">Тип пользователя</h6>-->
<!--         <select ref="s_role" class="">-->
<!--            <option value="master">Мастер</option>-->
<!--            <option value="driver">Водитель</option>-->
<!--         </select>-->
<!--      </div>-->
<!--      <div class="input-field col s12">-->
<!--         <h6 class="authorization-title">Данные для входа в личный кабинет</h6>-->
<!--      </div>-->
<!--      <div class="input-field col s12">-->
<!--         <input-->
<!--            id="username"-->
<!--            type="text"-->
<!--            v-model.trim="username"-->
<!--            :class="{invalid: ($v.username.$dirty && !$v.username.required) || ($v.username.$dirty && !$v.username.numeric) || ($v.username.$dirty && !$v.username.minLength)}"-->
<!--         >-->
<!--         <label for="username">Введите ваш телефон</label>-->
<!--         <small-->
<!--            class="helper-text invalid"-->
<!--            v-if="$v.username.$dirty && !$v.username.required"-->
<!--         >Введите телефон</small>-->
<!--         <small-->
<!--            class="helper-text invalid"-->
<!--            v-else-if="$v.username.$dirty && !$v.username.numeric"-->
<!--         >Разрешено вводить только числа</small>-->
<!--         <small-->
<!--            class="helper-text invalid"-->
<!--            v-else-if="$v.username.$dirty && !$v.username.minLength"-->
<!--         >Номер должен состоять минимум из {{ $v.username.$params.minLength.min }} символов. Сейчас он-->
<!--            {{username.length}} </small>-->
<!--      </div>-->
<!--      <div class="input-field col s12">-->
<!--         <input-->
<!--            id="email"-->
<!--            type="text"-->
<!--            v-model.trim="email"-->
<!--            :class="{invalid: ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email)}"-->
<!--         >-->
<!--         <label for="email">Введите ваш Email</label>-->
<!--         <small-->
<!--            class="helper-text invalid"-->
<!--            v-if="$v.email.$dirty && !$v.email.required"-->
<!--         >Поле Email не должно быть пустым</small>-->
<!--         <small-->
<!--            class="helper-text invalid"-->
<!--            v-else-if="$v.email.$dirty && !$v.email.email"-->
<!--         >Введите корректный Email</small>-->
<!--         <small>На почту придет сообщение для подтверждения</small>-->
<!--      </div>-->

<!--      <div class="input-field col s12">-->
<!--         <input-->
<!--            id="password"-->
<!--            type="password"-->
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
<!--         <input-->
<!--            id="password_repeat"-->
<!--            type="password"-->
<!--            class="validate"-->
<!--            v-model.trim="repeatPassword"-->
<!--            :class="{invalid:($v.repeatPassword.$dirty && !$v.repeatPassword.required ) || ($v.repeatPassword.$dirty && $v.repeatPassword.sameAsPassword)}"-->
<!--         >-->
<!--         <label for="password_repeat">Введите ваш пароль еще раз</label>-->
<!--         <small-->
<!--            class="helper-text invalid"-->
<!--            v-if="$v.repeatPassword.$dirty && !$v.repeatPassword.required"-->
<!--         >Повторите пароль</small>-->
<!--         <small-->
<!--            class="helper-text invalid"-->
<!--            v-else-if="$v.repeatPassword.$dirty && repeatPassword !== password"-->
<!--         >Пароли не совпадают</small>-->
<!--      </div>-->
<!--      <div class="input-field col s12">-->
<!--         <button-->
<!--            class="btn-large light-green lighten-1 waves-effect waves-light"-->
<!--            type="submit">-->
<!--            Создать личный кабинет-->
<!--         </button>-->
<!--      </div>-->
<!--      <div class="input-field col s12">-->
<!--         <p class="center">-->
<!--            Уже есть аккаунт?-->
<!--            <router-link to="/login">Войти!</router-link>-->
<!--         </p>-->
<!--      </div>-->
<!--   </form>-->
<!--</template>-->

<!--<script>-->
<!--   import {email, minLength, numeric, required, sameAs} from "vuelidate/lib/validators";-->
<!--   import M from 'materialize-css/dist/js/materialize.min';-->

<!--   export default {-->
<!--      name: 'register',-->
<!--      data: () => ({-->
<!--         username: '',-->
<!--         email: '',-->
<!--         password: '',-->
<!--         repeatPassword: '',-->
<!--         role: null-->
<!--      }),-->
<!--      validations: {-->
<!--         username: {-->
<!--            required,-->
<!--            numeric,-->
<!--            // minLength: minLength(11),-->
<!--            minLength: minLength(3)-->
<!--         },-->
<!--         email: {email, required},-->
<!--         password: {-->
<!--            required, minLength: minLength(3)-->
<!--         },-->
<!--         repeatPassword: {required, sameAsPassword: sameAs('password')}-->
<!--      },-->
<!--      methods: {-->
<!--         async submitHandler() { // Функция отправки формы-->
<!--            if (this.$v.$invalid) {   // Если форма не валидна-->
<!--               this.$v.$touch();   //	Sets the $dirty flag of the model and all its children to true recursively.-->
<!--               return  // отмена-->
<!--            }-->
<!--            // формирование объекта с данными-->
<!--            const formData = {-->
<!--               username: this.username,-->
<!--               email: this.email,-->
<!--               password: this.password,-->
<!--               role: this.role.el.value-->
<!--            };-->
<!--            console.log('formData from Register.vue');-->
<!--            console.log(formData);-->

<!--            //отправка запроса на создание пользователя-->
<!--            try {-->
<!--               await this.$store.dispatch('register', formData);-->
<!--               await this.$store.dispatch('login', formData);-->
<!--               this.$router.push('/');-->
<!--               this.$store.commit('clearMessage');-->
<!--            } catch (e) {-->
<!--               console.log('catch register.vue');-->
<!--               console.log(e);-->
<!--            }-->
<!--            this.$store.commit('clearError');-->
<!--         }-->
<!--      },-->
<!--      mounted() {-->
<!--         // Инициализация select из materializecss с помощью референций Vue, присваиваем переменной для очистки памяти-->
<!--         this.role = M.FormSelect.init(this.$refs.s_role);-->
<!--         console.log('Register.vue');-->
<!--         this.$store.commit('change_headerNav', {-->
<!--            showBack: false,-->
<!--            text: 'Регистрация личного кабинета',-->
<!--            colorNav: 'black',-->
<!--            colorHome: 'white',-->
<!--            colorText: 'white'-->
<!--         });-->
<!--      },-->
<!--      // После ухода со страницы очищаем память-->
<!--      beforeDestroy() {-->
<!--         // Проверка на существование переменной-->
<!--         if (this.role && this.role.destroy) {-->
<!--            this.role.destroy();-->
<!--         }-->
<!--      }-->
<!--   }-->

<!--</script>-->

<!--<style lang="scss" scoped>-->

<!--</style>-->