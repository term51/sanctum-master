<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">

      <form @submit.prevent="submitHandler">
         <h2 class="title">Значение ед. измерения строй материала</h2>
         <div v-if="(work_unit_of_measurement === 'height_width_length') || (work_unit_of_measurement === 'm2' && material_unit_of_measurement === 'm2')">
            Отсутсвует
         </div>
         <div v-else class="input-field">
            <input
               id="material_quantity"
               v-model.trim="material_quantity"
               :class="{invalid: ($v.material_quantity.$dirty && !$v.material_quantity.required)}">
            <label for="material_quantity" :class="{active:(material_quantity)}">{{transcript_material_unit_of_measurement}}</label>
            <small
               class="helper-text invalid"
               v-if="$v.material_quantity.$dirty && !$v.material_quantity.required"
            >Обязательное поле</small>
         </div>


         <h2 class="title">Мера расхода строй материала</h2>
         <div v-if="expenditure_measurement === 'm2_layer'">
            <div class="input-field">
               <input
                  id="expenditure.layer"
                  v-model.trim="expenditure.layer"
                  :class="{invalid: ($v.expenditure.layer.$dirty && !$v.expenditure.layer.decimal)}"
               >
               <label for="expenditure.layer" :class="{active:(expenditure.layer)}">слой, мм</label>
               <small
                  class="helper-text invalid"
                  v-if="$v.expenditure.layer.$dirty && !$v.expenditure.layer.decimal"
               >Поле содержит недопустимый символ</small>
            </div>
            <div class="input-field">
               <input
                  id="expenditure.consumption"
                  v-model.trim="expenditure.consumption"
                  :class="{invalid: ($v.expenditure.consumption.$dirty && !$v.expenditure.consumption.decimal)}"
               >
               <label for="expenditure.consumption" :class="{active:(expenditure.consumption)}">расход, кг</label>
               <small
                  class="helper-text invalid"
                  v-if="$v.expenditure.consumption.$dirty && !$v.expenditure.consumption.decimal"
               >Поле содержит недопустимый символ</small>
            </div>
            <div class="input-field">
               <input
                  id="expenditure.consumption_layer"
                  v-model.trim="expenditure.consumption_layer"
                  :class="{invalid: ($v.expenditure.consumption_layer.$dirty && !$v.expenditure.consumption_layer.decimal)}"
               >
               <label for="expenditure.consumption_layer" :class="{active:(expenditure.consumption_layer)}">слой расход</label>
               <small
                  class="helper-text invalid"
                  v-if="$v.expenditure.consumption_layer.$dirty && !$v.expenditure.consumption_layer.decimal"
               >Поле содержит недопустимый символ</small>
            </div>
         </div>

         <div v-else-if="(material_unit_of_measurement === 'packing_unit' && expenditure_measurement === 'm2')
|| (material_unit_of_measurement === 'm2' && expenditure_measurement === 'm2')
|| (work_unit_of_measurement === 'm3' && expenditure_measurement === 'm3' && material_unit_of_measurement === 'm3')
|| (work_unit_of_measurement === 'running_meter' && expenditure_measurement === 'm3' && material_unit_of_measurement === 'm3')">
            <div class="input-field">
               <input
                  id="expenditure_side_A"
                  @input="inputExpenditureSides"
                  v-model.trim="expenditure_side_A"
                  :class="{invalid: ($v.expenditure_side_A.$dirty && !$v.expenditure_side_A.decimal)}"
               >
               <label for="expenditure_side_A" :class="{active:(expenditure_side_A)}">Сторона А</label>
               <small
                  class="helper-text invalid"
                  v-if="$v.expenditure_side_A.$dirty && !$v.expenditure_side_A.decimal"
               >Поле содержит недопустимый символ</small>
            </div>
            <div class="input-field">
               <input
                  id="expenditure_side_B"
                  @input="inputExpenditureSides"
                  v-model.trim="expenditure_side_B"
                  :class="{invalid: ($v.expenditure_side_B.$dirty && !$v.expenditure_side_B.decimal)}"
               >
               <label for="expenditure_side_B" :class="{active:(expenditure_side_B)}">Сторона Б</label>
               <small
                  class="helper-text invalid"
                  v-if="$v.expenditure_side_B.$dirty && !$v.expenditure_side_B.decimal"
               >Поле содержит недопустимый символ</small>
            </div>

            <div class="input-field">
               <input
                  v-model.trim="expenditure.units"
                  disabled
                  :placeholder="'Расход на 1 '+ transcript_expenditure_measurement"
               >
            </div>
         </div>

         <div v-else-if="(work_unit_of_measurement === 'm2' && expenditure_measurement === 'm3')">
            <div class="input-field">
               <input
                  id="expenditure_layer_TZ"
                  @input="inputExpenditureSides"
                  v-model.trim="expenditure_layer_TZ"
                  :class="{invalid: ($v.expenditure_layer_TZ.$dirty && !$v.expenditure_layer_TZ.decimal)}"
               >
               <label for="expenditure_layer_TZ" :class="{active:(expenditure_layer_TZ)}">Слой ТЗ</label>
               <small
                  class="helper-text invalid"
                  v-if="$v.expenditure_layer_TZ.$dirty && !$v.expenditure_layer_TZ.decimal"
               >Поле содержит недопустимый символ</small>
            </div>
            <div class="input-field">
               <input
                  v-model.trim="expenditure.units"
                  disabled
                  :placeholder="'Расход на 1 '+ transcript_expenditure_measurement"
               >
            </div>
         </div>

         <div v-else-if="work_unit_of_measurement ==='m2' && material_unit_of_measurement === 'packing_unit' && expenditure_measurement === 'running_meter'">
            <div class="input-field">
               <input
                  id="expenditure_length"
                  @input="inputExpenditureRunningMeter"
                  v-model.trim="expenditure_length"
                  :class="{invalid: ($v.expenditure_length.$dirty && !$v.expenditure_length.decimal)}"
               >
               <label for="expenditure_length" :class="{active:(expenditure_length)}">Длинна ед материала</label>
               <small
                  class="helper-text invalid"
                  v-if="$v.expenditure_length.$dirty && !$v.expenditure_length.decimal"
               >Поле содержит недопустимый символ</small>
            </div>
            <div class="input-field">
               <input
                  id="expenditure_per_running_meter"
                  @input="inputExpenditureRunningMeter"
                  v-model.trim="expenditure_per_running_meter"
                  :class="{invalid: ($v.expenditure_per_running_meter.$dirty && !$v.expenditure_per_running_meter.decimal)}"
               >
               <label for="expenditure_per_running_meter" :class="{active:(expenditure_per_running_meter)}">Расход на м2</label>
               <small
                  class="helper-text invalid"
                  v-if="$v.expenditure_per_running_meter.$dirty && !$v.expenditure_per_running_meter.decimal"
               >Поле содержит недопустимый символ</small>
            </div>

            <div class="input-field">
               <input
                  v-model.trim="expenditure.units"
                  disabled
                  :placeholder="'Расход на 1 '+ transcript_expenditure_measurement"
               >
               <!--               <label for="expenditure-m2-result" class="active">Расход на 1 {{transcript_expenditure_measurement}}</label>-->
            </div>
         </div>

         <div v-else-if="work_unit_of_measurement === 'm3' && expenditure_measurement === 'm3'
         && (material_unit_of_measurement === 'liter' || material_unit_of_measurement === 'packing_liter')">
            Отсутсвует
         </div>

         <div v-else-if="work_unit_of_measurement === 'height_width_length'">
            <div class="input-field">
               <input
                  id="expenditure_A"
                  @input="inputExpenditureSize"
                  v-model.trim="expenditure_A"
                  :class="{invalid: ($v.expenditure_A.$dirty && !$v.expenditure_A.decimal)}"
               >
               <label for="expenditure_A" :class="{active:(expenditure_A)}">A</label>
               <small
                  class="helper-text invalid"
                  v-if="$v.expenditure_A.$dirty && !$v.expenditure_A.decimal"
               >Поле содержит недопустимый символ</small>
            </div>
            <div class="input-field">
               <input
                  id="expenditure_B"
                  @input="inputExpenditureSize"
                  v-model.trim="expenditure_B"
                  :class="{invalid: ($v.expenditure_B.$dirty && !$v.expenditure_B.decimal)}"
               >
               <label for="expenditure_B" :class="{active:(expenditure_B)}">B</label>
               <small
                  class="helper-text invalid"
                  v-if="$v.expenditure_B.$dirty && !$v.expenditure_B.decimal"
               >Поле содержит недопустимый символ</small>
            </div>
            <div class="input-field">
               <input
                  id="expenditure_C"
                  @input="inputExpenditureSize"
                  v-model.trim="expenditure_C"
                  :class="{invalid: ($v.expenditure_C.$dirty && !$v.expenditure_C.decimal)}"
               >
               <label for="expenditure_C" :class="{active:(expenditure_C)}">C</label>
               <small
                  class="helper-text invalid"
                  v-if="$v.expenditure_C.$dirty && !$v.expenditure_C.decimal"
               >Поле содержит недопустимый символ</small>
            </div>
         </div>

         <div v-else>
            <div class="input-field">
               <input
                  id="expenditure.units"
                  v-model.trim="expenditure.units"
                  :class="{invalid: ($v.expenditure.units.$dirty && !$v.expenditure.units.decimal)}"
               >
               <label for="expenditure.units" :class="{active:(expenditure.units)}">{{transcript_expenditure_measurement}}</label>
               <small
                  class="helper-text invalid"
                  v-if="$v.expenditure.units.$dirty && !$v.expenditure.units.decimal"
               >Поле содержит недопустимый символ</small>
            </div>
         </div>

         <div style="margin-top: 20px;text-align: center;">
            <label class="label">
               <input v-model="checked_additional_calculation_units" type="checkbox"/>
               <span>Доп единицы</span>
            </label>

         </div>

         <div v-if="checked_additional_calculation_units">
            <h2 class="title">Доп. единицы расчета</h2>
            <div class="input-field">
               <!-- $dirty говорит о том, что пользователь уже что-то неправильное ввел -->
               <input
                  id="additional_calculation_units.factionalism"
                  v-model.trim="additional_calculation_units.factionalism">
               <label for="additional_calculation_units.factionalism" :class="{active:(additional_calculation_units.factionalism)}">% фракционности</label>
            </div>
            <div class="row" style="margin-bottom: 0">
               <div class="col s6">
                  <div class="input-field">
                     <input
                        id="additional_calculation_units.range_from"
                        type="number"
                        v-model.trim="additional_calculation_units.range_from">
                     <label for="additional_calculation_units.range_from" :class="{active:(additional_calculation_units.range_from)}">диапазон, мм, от</label>
                  </div>
               </div>
               <div class="col s6">
                  <div class="input-field">
                     <input
                        id="additional_calculation_units.range_to"
                        type="number"
                        v-model.trim="additional_calculation_units.range_to">
                     <label for="additional_calculation_units.range_to" :class="{active:(additional_calculation_units.range_to)}">диапазон, мм, до</label>
                  </div>
               </div>
            </div>
            <div class="input-field">
               <input
                  id="additional_calculation_units.relation"
                  type="number"
                  v-model.trim="additional_calculation_units.relation">
               <label for="additional_calculation_units.relation" :class="{active:(additional_calculation_units.relation)}">соотношение №%</label>
            </div>

            <div class="input-field">
               <input
                  id="additional_calculation_units.overrun"
                  type="number"
                  v-model.trim="additional_calculation_units.overrun">
               <label for="additional_calculation_units.overrun" :class="{active:(additional_calculation_units.overrun)}">перерасход</label>
            </div>
         </div>

         <h2 class="title">Проверка калькулятора</h2>

         <div v-if="work_unit_of_measurement === 'height_width_length'">
         </div>

         <div v-else class="input-field">
            <input
               style="width:56%"
               id="work_scope"
               v-model.trim="work_scope"
               :class="{invalid: ($v.work_scope.$dirty && !$v.work_scope.required)}">
            <label for="work_scope" class="active">Введите значение</label>
            {{transcript_work_unit_of_measurement}}
         </div>

         <div class="input-field">
            <button
               @click.prevent="getCalculation"
               :style="'background-color:' + this.$store.state.accentColors.blue"
               class="btn btn-standard waves-effect waves-light">
               Проверить калькулятор
            </button>
         </div>
         <Loader size="small" v-if="loading"/>
         <div class="input-field">
            <div class="calculation">{{calculation}}</div>
         </div>
         <div class="input-field">
            <button
               class="btn btn-standard btn-large light-green lighten-1 waves-effect waves-light"
               type="submit">Сохранить калькулятор
            </button>
         </div>

      </form>


   </div>
</template>

<script>
   import {decimal} from 'vuelidate/lib/validators'
   import transcript from '@/plugins/transcriptsOfMaterials'

   export default {
      name: "calculator",
      data: () => ({
         loading: false,
         //поля формы

         // =ввод=
         material_quantity: '',  //количество материала в уп
         material_unit_of_measurement: '', //ед измерения материала
         transcript_material_unit_of_measurement: '',// перевод ед измерения материала

         // =ввод=
         expenditure: {
            units: '',            //количества мер расхода (прим. длинна 1-го плинтуса)
            layer: '',            //слой
            consumption: '',      //расход
            consumption_layer: '', //слой расход
            height_width_length: '' // габариты
         },
         expenditure_value: null, //количества мер расхода вычисленное значение для БД
         expenditure_measurement: '', //мера расхода
         transcript_expenditure_measurement: '', // перевод мера расхода


         work_unit_of_measurement: '',    // ед. измерения сроительных работ
         transcript_work_unit_of_measurement: '', // перевод ед. измерения сроительных работ

         checked_additional_calculation_units: false,
         // =ввод=
         additional_calculation_units: { //ед измерения строительных работ
            factionalism: '', //% фракционности
            range_from: '',   //диапазон, мм от
            range_to: '',     //диапазон, мм до
            relation: '',     //соотношение №%
            overrun: ''       // перерасход
         },

         // =ввод=
         work_scope: '',   //обьема работ

         calculation: '', //расчет по калькулятору

         //  переменные для расчета площади/объема
         expenditure_side_A: null,
         expenditure_side_B: null,

         // слой ТЗ
         expenditure_layer_TZ: null,

         // если выбрано УП/ЕД и расход пм, подключаем переменные для расчета на ПМ
         expenditure_length: null,
         expenditure_per_running_meter: null,

         // если выбраны габариты
         expenditure_A: null,
         expenditure_B: null,
         expenditure_C: null

      }),
      // правила валидации создаются как объекты с названием моделей из data. Внутрь объектов помещаются подлюченные выше правила валидации
      validations: {
         expenditure: {
            units: {decimal},
            layer: {decimal},
            consumption: {decimal},
            consumption_layer: {decimal}
         },
         expenditure_side_A: {decimal},
         expenditure_side_B: {decimal},

         expenditure_layer_TZ: {decimal},

         expenditure_length: {decimal},
         expenditure_per_running_meter: {decimal},

         material_quantity: {decimal},
         work_scope: {decimal},

         expenditure_A: {decimal},
         expenditure_B: {decimal},
         expenditure_C: {decimal}
      },
      created() {
         try {
            this.$store.dispatch('waitToken', this.getMaterialInfo)
         } catch (e) {
            console.log(e);
         }
      },
      methods: {
         // при вводе сторон считается мера расхода
         inputExpenditureSides() {
            // если выбраны кубы
            if (this.work_unit_of_measurement === 'running_meter' && this.expenditure_measurement === 'm3') {
               console.log('her')
               this.expenditure.units = (1 / (this.expenditure_side_A * this.expenditure_side_B)).toFixed(4)
               // если нужно посчитать слой по ТЗ
            } else if (this.work_unit_of_measurement === 'm2' && this.expenditure_measurement === 'm3') {
               this.expenditure.units = (1 / (this.expenditure_layer_TZ * 0.01)).toFixed(4)
            } else {
               this.expenditure.units = (this.expenditure_side_A * this.expenditure_side_B).toFixed(4)
            }
         },
         // при вводе расхода материала исчисляемого в П.М. считается мера расхода
         inputExpenditureRunningMeter() {
            this.expenditure.units = (this.expenditure_per_running_meter / this.expenditure_length).toFixed(4)
         },
         // при вводе ед изм строительных работ в габаритах
         inputExpenditureSize() {
            this.expenditure.height_width_length = `${this.expenditure_A},${this.expenditure_B},${this.expenditure_C}`
         },
         calculateExpenditure() {
            // вычисляем меру расхода материала
            if (this.expenditure.height_width_length) {
               this.expenditure_value = this.expenditure.height_width_length
            } else if (this.expenditure.units) {
               this.expenditure_value = this.expenditure.units
            } else {
               const expenditure_calculate = parseFloat(this.expenditure.layer)
                  / parseFloat(this.expenditure.consumption_layer)
                  * parseFloat(this.expenditure.consumption)

               if (!isNaN(expenditure_calculate)) {
                  this.expenditure_value = expenditure_calculate
               }
            }
         },
         async getMaterialInfo() {

            await this.$http.get('wp/v2/users/calculators/calculator', {
               params: {
                  calculator_id: this.$route.params.calculator_id
               }
            })
               .then(response => {
                  console.log(response);
                  return response.json();
               })
               .then(response => {
                  console.log('in', response);
                  this.material_unit_of_measurement = response.material_unit_of_measurement
                  this.material_quantity = response.material_unit_value || ''
                  this.expenditure_measurement = response.expenditure_measurement
                  this.expenditure_value = response.expenditure_value || ''

                  this.work_unit_of_measurement = response.work_unit_of_measurement
                  this.checked_additional_calculation_units = (response.additional_units === '0' ? false : response.additional_units) || false

                  this.transcript_material_unit_of_measurement = transcript[response.material_unit_of_measurement]
                  this.transcript_expenditure_measurement = transcript[response.expenditure_measurement]
                  this.transcript_work_unit_of_measurement = transcript[response.work_unit_of_measurement]

               })
               .catch(function (error) {
                  console.log(error);
                  throw  error;
               });
            this.$store.commit('clearMessage')
            this.$store.commit('clearError')

         },
         async getCalculation() {

            if (this.$v.$invalid) {   // Если форма не валидна
               this.$v.$touch();   //	Sets the $dirty flag of the model and all its children to true recursively.
               return  // отмена
            }

            this.loading = true

            // вычисляем меру расхода материала
            this.calculateExpenditure()

            // сбор всех введенных значений
            const args = {
               material_quantity: this.material_quantity,
               material_unit_of_measurement: this.material_unit_of_measurement,
               expenditure: this.expenditure_value,
               expenditure_measurement: this.expenditure_measurement,
               work_scope: this.work_scope,
               work_unit_of_measurement: this.work_unit_of_measurement,
               additional_units: this.checked_additional_calculation_units,
               additional_calculation_units: this.additional_calculation_units
            }
            console.log(args);
            await this.$http.get('wp/v2/users/calculators/calculation', {
               params: {
                  args
               }
            })
               .then(response => {
                  return response.json();
               })
               .then(response => {
                  console.log('calculation response', response);
                  this.calculation = `Затраты строительного материала - ${response.calculation} уп.`
               })
               .catch(function (error) {
                  console.log(error);
                  this.calculation = error.body.message
               });
            this.$store.commit('clearMessage')
            this.$store.commit('clearError')
            this.loading = false
         },
         // отправка данных в бд
         async submitHandler() {

            if (this.$v.$invalid) {   // Если форма не валидна
               this.$v.$touch();   //	Sets the $dirty flag of the model and all its children to true recursively.
               return  // отмена
            }

            // вычисляем меру расхода материала
            this.calculateExpenditure()

            // console.log( {
            //    calculator_id: this.$route.params.calculator_id,
            //    material_quantity: this.material_quantity,
            //    expenditure: this.expenditure_value,
            //    additional_calculation_units: this.checked_additional_calculation_units,
            //    height_width_length: this.expenditure.height_width_length
            // })
            // return
            await this.$http.post('wp/v2/users/calculators/calculator', {
               calculator_id: this.$route.params.calculator_id,
               material_quantity: this.material_quantity,
               expenditure: this.expenditure_value,
               additional_calculation_units: this.checked_additional_calculation_units
            })
               .then(response => {
                  return response.json();
               })
               .then(response => {
                  this.$store.commit('setMessage', response.message);
               })
               .catch(function (error) {
                  this.$store.commit('setError', error.data.code);
                  throw  error;
               });
            this.$store.commit('clearMessage')
            this.$store.commit('clearError')
         }
      },
      mounted() {
         console.log('Edit-calculator.vue');
         this.$store.commit('change_headerNav', {
            text: 'Свойства товара',
            colorNav: 'blue',
            colorHome: 'black',
            colorText: 'black'
         });
      },
   }
</script>

<style lang="scss" scoped>
   .app-loader {
      margin: 0;
   }

   .input-field {
      margin: 0.5rem;
   }

   .calculation {
      padding: 5px;
      height: 30px;
      margin-bottom: 30px;
      background-color: #E4E8EB;
   }
</style>