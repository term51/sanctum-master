<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <h2 class="title">При добавлении новой технологии в административной панеле появится рубрика для статей с
         аналогичным названием. При создании новой статьи нужно выбрать соответсвующую рубрику</h2>
      <br>
      <form @submit.prevent="submitHandler">

         <div class="input-field">
            <select ref="s_typeOfworks">
               <option value="1">Внутренние работы</option>
               <option value="2">Наружные работы</option>
            </select>
            <label>Выберите вид работ</label>
         </div>

         <div class="input-field">
            <input
               id="name"
               type="text"
               v-model.trim="name"
               :class="{invalid: ($v.name.$dirty && !$v.name.required)}"
               class="validate">
            <label for="name">Введите название технологии</label>
            <small
               class="helper-text invalid"
               v-if="$v.name.$dirty && !$v.name.required"
            >Обязательное поле</small>
         </div>
         <!--   Новая проверка для динамических полей формы -->
         <div v-for="(stage, index) in $v.technologyStages.$each.$iter" :key="index" class="input-field">
            <div class="item-wrap">
               <div class="number">{{+index + 1 }}</div>
               <input
                  type="text"
                  v-model.trim="stage.stageName.$model"
                  :class="{invalid:(stage.stageName.$dirty && !stage.stageName.required)}"
                  placeholder="Опишите этап"
                  :datafld="index">
               <button @click.prevent="technologyStages.splice(+index, 1)" class="number btn-delete"
                       :style="'background-color:'+ $store.state.accentColors.red">X
               </button>
               <small
                  class="helper-text invalid"
                  v-if="stage.stageName.$dirty && !stage.stageName.required">Обязательное поле
               </small>
            </div>
         </div>

         <div class="input-field">
            <button @click.prevent="technologyStages.push({stageName:''})"
                    class="btn lighten-1 waves-effect waves-light"
                    :style="'background-color:' + this.$store.state.accentColors.blue">
               Добавить этап технологии
            </button>
         </div>

         <div class="input-field">
            <textarea
               id="description"
               v-model.trim="description"
               class="materialize-textarea"></textarea>
            <label for="description">Введите описание данной технологии</label>
         </div>

         <div class="input-field">
            <input id="url"
                   type="text"
                   v-model.trim="url">
            <label for="url">Введите электронную ссылку на материал для подтверждения существования технологии</label>
         </div>
         <div class="input-field">
            <button
               class="btn btn-large light-green lighten-1 waves-effect waves-light"
               type="submit">
               Отправить на согласование
            </button>
         </div>
      </form>
   </div>
</template>

<script>
   import {required} from "vuelidate/lib/validators";
   import M from 'materialize-css/dist/js/materialize.min';

   export default {
      name: "add-new-technology",
      data: () => ({
         name: '',
         technologyStages: [{stageName: ''}],
         description: '',
         url: '',
         s_typeOfworks: null,
         formData: {}
      }),
      validations: {
         name: {required},
         technologyStages: {
            required,
            $each: {stageName: {required}}
         }
      },
      methods: {

         async submitHandler() {

            if (this.$v.$invalid) {   // Если форма не валидна
               this.$v.$touch();   //	Sets the $dirty flag of the model and all its children to true recursively.
               return  // отмена
            }
            // Формирование данных
            this.formData = {
               user_id: this.$store.state.auth.userId,
               type_id: this.s_typeOfworks.el.value,
               technology_title: this.name,
               stages: this.technologyStages,
               description: this.description,
               url: this.url
            }
            // отправка
            try {
               console.log(this.formData);
               await this.$http.post('wp/v2/users/type-of-work/add-new-technology', this.formData)
                  .then((response) => {
                     return response.json()
                  })
                  .then((response) => {
                     this.$store.commit('setMessage', response.message)
                     // сброс введенных данных
                     this.name = ''
                     this.technologyStages = [{stageName: ''}]
                     this.description = ''
                     this.url = ''
                     this.$router.push({name: 'type-of-work'})
                  })
                  .catch(function (error) {
                     this.$store.commit('setError', error.data.code);
                     throw  error;
                  })


            } catch (e) {
               console.log('catch Add-new-technology.vue');
               this.$error('Ошибка');
               console.log(e);
            }
            this.$store.commit('clearMessage');
            this.$store.commit('clearError');
         }
      },
      mounted() {

         this.s_typeOfworks = M.FormSelect.init(this.$refs.s_typeOfworks);
         console.log('Add-new-technology.vue');
         this.$store.commit('change_headerNav', {
            text: 'Создание новой технологии работ',
            colorNav: 'blue',
            colorHome: 'black',
            colorText: 'black'
         });
      },
      // очищаем память
      beforeDestroy() {
         // Проверка на существование переменной
         if (this.s_typeOfworks && this.s_typeOfworks.destroy) {
            this.s_typeOfworks.destroy();
         }
      }
   }
</script>

<style lang="scss" scoped>
   .materialize-textarea {
      height: 6rem;
   }


   .item-wrap {
      white-space: nowrap;

      .number {
         height: 30px;
         text-align: center;
         width: 6%;
         color: #fff;
         line-height: 30px;
         display: inline-block;
         background-color: #424852;
         /*margin-right: 5px;*/
      }

      input {
         width: 88%;
         text-indent: 15px;;
      }

      .btn-delete {
         border: none;
         color: #000000;
         cursor: pointer;
         line-height: 0;
      }

      .btn-delete:hover {
         background-color: #ff4038 !important;
      }
   }


   #url {
      height: 4rem;
   }

   .btn {
      color: #000;
      font-size: 14px;
      text-transform: none;
      /*font-weight: bold;*/
      width: 100%;

      &-large {
         padding: 0 5px;
      }
   }
</style>