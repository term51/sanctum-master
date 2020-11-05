<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <h2 class="title"></h2>
      <Loader size="big" v-if="loading"/>
      <form v-else @submit.prevent="submitHandler">
         <div class="input-field">
            <input
               maxlength="100"
               id="title"
               type="text"
               v-model.trim="title"
               :class="{invalid: ($v.title.$dirty && !$v.title.required)}"
               class="validate">
            <label for="title" :class="{active:(title)}">Введите название калькулятора</label>
            <small
               class="helper-text invalid"
               v-if="$v.title.$dirty && !$v.title.required"
            >Обязательное поле</small>
         </div>

         <div class="card">
            <div class="card-content">
               <span class="card-title">Выберите ед. измерения строй материала</span>
               <div class="card-inner-wrap">
                  <div class="inner-title">Базовые</div>
                  <div class="inner-content">
                     <label class="label">
                        <input value="kilogram" v-model="material_unit_of_measurement" type="radio"/>
                        <span class="span">кг</span>
                     </label>
                     <label class="label">
                        <input value="liter" v-model="material_unit_of_measurement" type="radio"/>
                        <span class="span">л</span>
                     </label>
                     <!-- izm  ??? -->
                     <label class="label">
                        <input value="m2" v-model="material_unit_of_measurement" type="radio"/>
                        <span>м2</span>
                     </label>
                     <label class="label">
                        <input value="m3" v-model="material_unit_of_measurement" type="radio"/>
                        <span>м3</span>
                     </label>
                     <label class="label">
                        <input value="unit" v-model="material_unit_of_measurement" type="radio"/>
                        <span class="span">ед</span>
                     </label>

<!--                     <label v-if="show_additional_material_unit_of_measurement" class="label">-->
<!--                        <input value="unit_running_meter" v-model="material_unit_of_measurement" type="radio"/>-->
<!--                        <span class="span">[п.м.]</span>-->
<!--                     </label>-->
<!--                     <label v-if="show_additional_material_unit_of_measurement" class="label">-->
<!--                        <input value="unit_m2" v-model="material_unit_of_measurement" type="radio"/>-->
<!--                        <span class="span">[м2]</span>-->
<!--                     </label>-->

                  </div>
               </div>
               <div class="card-inner-wrap">
                  <div class="inner-title">Комбинированные</div>
                  <div class="inner-content">
                     <label class="label">
                        <input value="packing_unit" v-model="material_unit_of_measurement" type="radio"/>
                        <span class="span">уп/ед</span>
                     </label>
                     <label class="label">
                        <input value="packing_kilogram" v-model="material_unit_of_measurement" type="radio"/>
                        <span class="span">уп/кг</span>
                     </label>
                     <label class="label">
                        <input value="packing_liter" v-model="material_unit_of_measurement" type="radio"/>
                        <span class="span">уп/л</span>
                     </label>
                  </div>
               </div>
               <div class="card-inner-wrap">
                  <div class="inner-title">Комплект</div>
                  <div class="inner-content">
                     <label class="label full-place">
                        <input value="set_units" v-model="material_unit_of_measurement" type="radio"/>
                        <span>Комп/ед</span>
                     </label>
                  </div>
               </div>
               <small
                  class="helper-text invalid"
                  v-if="$v.material_unit_of_measurement.$dirty && !$v.material_unit_of_measurement.required"
               >Необходимо выбрать ед. измерения</small>
            </div>
         </div>

         <div class="card">
            <div class="card-content">
               <span class="card-title">Выберите меру расхода строй материала</span>
               <div class="card-inner-wrap">
                  <div class="inner-title">Базовые</div>
                  <div class="inner-content">
                     <label class="label">
                        <input value="running_meter" v-model="expenditure_measurement" type="radio"/>
                        <span>п.м.</span>
                     </label>
                     <label class="label">
                        <input value="m2" v-model="expenditure_measurement" type="radio"/>
                        <span>м2</span>
                     </label>
                     <label class="label">
                        <input value="m2_layer" v-model="expenditure_measurement" type="radio"/>
                        <span>м2/слой</span>
                     </label>
                     <label class="label">
                        <input value="m3" v-model="expenditure_measurement" type="radio"/>
                        <span>м3</span>
                     </label>
                  </div>
               </div>
               <div class="card-inner-wrap">
                  <div class="inner-title">Габаритные</div>
                  <div class="inner-content">
                     <label class="label full-place">
                        <input value="height_width_length" v-model="expenditure_measurement" type="radio"/>
                        <span>высота, ширина, длина</span>
                     </label>
                  </div>
               </div>
               <small
                  class="helper-text invalid"
                  v-if="$v.expenditure_measurement.$dirty && !$v.expenditure_measurement.required"
               >Необходимо выбрать меру расхода</small>
            </div>
         </div>

         <div class="card">
            <div class="card-content">
               <span class="card-title">Выберите ед. измерения сроительных работ</span>
               <div class="card-inner-wrap">
                  <div class="inner-title">Базовые</div>
                  <div class="inner-content">
                     <label class="label">
                        <input value="running_meter" v-model="work_unit_of_measurement" type="radio"/>
                        <span>п.м.</span>
                     </label>
                     <label class="label">
                        <input value="m2" v-model="work_unit_of_measurement" type="radio"/>
                        <span>м2</span>
                     </label>
                     <label class="label">
                        <input value="m3" v-model="work_unit_of_measurement" type="radio"/>
                        <span>м3</span>
                     </label>
                  </div>
               </div>
               <div class="card-inner-wrap">
                  <div class="inner-title">Габаритные</div>
                  <div class="inner-content">
                     <label class="label full-place">
                        <input value="height_width_length" v-model="work_unit_of_measurement" type="radio"/>
                        <span>высота, ширина, длина</span>
                     </label>
                  </div>
               </div>
               <small
                  class="helper-text invalid"
                  v-if="$v.work_unit_of_measurement.$dirty && !$v.work_unit_of_measurement.required"
               >Необходимо выбрать ед. измерения</small>
            </div>
         </div>

         <div class="input-field">
            <button
               type="submit"
               class="btn btn-standard btn-large light-green lighten-1 waves-effect waves-light">
               Сохранить калькулятор
            </button>
         </div>

         <router-link
            :style="'background-color:' + this.$store.state.accentColors.blue"
            tag="button"
            :to="`/profile-and-settings/calculators-constructor-list/calculator/${$route.params.calculator_id}`"
            class="btn btn-standard waves-effect waves-light">
            Задать свойства товара
         </router-link>

         <div class="input-field">
            <button
               @click.prevent="deleteCalculator"
               type="submit"
               :style="'background-color:'+$store.state.accentColors.red"
               class="btn btn-standard waves-effect waves-light">
               Удалить калькулятор
            </button>
         </div>

      </form>
   </div>
</template>

<script>

   import {required} from "vuelidate/lib/validators";

   export default {
      name: "calculator",
      data: () => ({
         loading: true,
         title: '',
         material_unit_of_measurement: '',
         // show_additional_material_unit_of_measurement: false,
         expenditure_measurement: '',
         work_unit_of_measurement: ''
      }),
      validations: {
         title: {required},
         material_unit_of_measurement: {required},
         expenditure_measurement: {required},
         work_unit_of_measurement: {required},
      },
      created() {
         // Получить калькулятор
         try {
            this.$store.dispatch('waitToken', this.getCalculator)
         } catch (e) {
            console.log(e)
         }
      },
      // watch: {
      //    // слежка за ед измерения строй материала
      //    material_unit_of_measurement: function (value) {
      //       this.check_material_unit_of_measurement(value)
      //    }
      // },
      methods: {
         // проверка ед измерения строй материала
         // check_material_unit_of_measurement(value) {
            // return this.show_additional_material_unit_of_measurement = value === 'unit' || value === 'unit_m2' || value === 'unit_running_meter'
         // },
         // получить данные об калькуляторе
         async getCalculator() {

            await this.$http.get('wp/v2/users/calculators/edit-calculator', {
               params: {
                  calculator_id: this.$route.params.calculator_id
               }
            })
               .then(response => {
                  return response.json();
               })
               .then(response => {
                  this.title = response.title
                  this.material_unit_of_measurement = response.material_unit_of_measurement
                  this.expenditure_measurement = response.expenditure_measurement
                  this.work_unit_of_measurement = response.work_unit_of_measurement

                  this.loading = false
               })
               .catch(function (error) {
                  console.log(error);
                  throw  error;
               });
            this.$store.commit('clearMessage')
            this.$store.commit('clearError')
         },
         // Функция удаления
         async deleteCalculator() {
            if (confirm('Точно удалить?')) {
               await this.$http.delete('wp/v2/users/calculators/edit-calculator', {
                  params: {
                     calculator_id: this.$route.params.calculator_id
                  }
               })
                  .then(response => {
                     return response.json();
                  })
                  .then(response => {
                     this.$store.commit('setMessage', response.message)
                  })
                  .catch(function (error) {
                     console.log(error);
                     throw  error;
                  });
               this.$store.commit('clearMessage')
               this.$store.commit('clearError')
            }
         },
         // Функция сохранения
         async submitHandler() {
            if (this.$v.$invalid) {   // Если форма не валидна
               this.$v.$touch();   //	Sets the $dirty flag of the model and all its children to true recursively.
               return  // отмена
            }

            // Отправка выбранных id на сервер
            await this.$http.post('wp/v2/users/calculators/edit-calculator', {
               calculator_id: this.$route.params.calculator_id,
               title: this.title,
               material_unit_of_measurement: this.material_unit_of_measurement,
               expenditure_measurement: this.expenditure_measurement,
               work_unit_of_measurement: this.work_unit_of_measurement
            })
               .then(response => {
                  //Получаем всё содержимое, все хедеры, статус и тд...
                  // console.log(response);
                  return response.json();
               })
               .then(response => {
                  this.$store.commit('setMessage', response.message)
               })
               .catch(function (error) {
                  this.$store.commit('setError', error.data.code)
                  throw  error;
               });
            this.$store.commit('clearMessage')
            this.$store.commit('clearError')
         }
      },
      mounted() {
         console.log('Edit-calculator.vue');
         this.$store.commit('change_headerNav', {
            text: 'Калькулятор ' + this.title,
            colorNav: 'blue',
            colorHome: 'black',
            colorText: 'black'
         });
      },
   }
</script>

<style lang="scss" scoped>

   * {
      -ms-user-select: none;
      -moz-user-select: none;
      -khtml-user-select: none;
      -webkit-user-select: none;
   }

   .card {
      .card-content {
         padding: 10px;
         border: solid 8px #cfd8dc;

         .card-title {
            line-height: 16px;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 20px;
         }

         .inner-title {
            margin-bottom: 5px;
            text-decoration: underline;
         }

         .inner-content {

            label {
               display: inline-block;
               width: 33%;
               font-size: 16px;
               margin-bottom: 10px;

               span {
                  color: #000000;
               }
            }

            .full-place {
               width: 100%;
            }
         }
      }

   }

   [type="checkbox"]:not(:checked) + span:not(.lever):before {
      background-color: #fff;
   }

   [type="checkbox"]:checked + span:not(.lever):before {
      background-color: transparent;
      border-right: 3px solid #9ED26A;
      border-bottom: 3px solid #9ED26A;
   }

</style>