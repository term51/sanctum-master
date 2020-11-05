<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <h2 class="title" v-show="!loading"></h2>
      <Loader size="big" v-if="!empty_response" v-show="loading"/>
      <h2 class="warn" v-show="!loading" v-if="empty_response">Сначало нужно выбрать виды работ для локаций</h2>

      <section class="s-locations" v-show="!loading && !empty_response">
         <form @submit.prevent="submitHandler">
            <ul ref="accordion" class="main-accordion collapsible expandable" :class="{allDelivered: (work_residue_is_zero)}">
               <!-- формирование аккордионов -->
               <li v-for="(type, index) in masterTypeOfWorks" :key="index" class="active main-accordion-item">
                  <div class="collapsible-header main-accordion-header">{{type.title}}</div>
                  <div class="collapsible-body main-accordion-body">
                     <ul ref="subAccordion" class="sub-accordion collapsible expandable ">
                        <!-- формирование суб аккордионов -->
                        <li class="sub-accordion-item wrap" v-for="(subType, subIndex) in type.data" :key="subIndex">
                           <div class="collapsible-header sub-accordion-header">{{subType.subTitle}}</div>
                           <div class="collapsible-body sub-accordion-body">
                              <ul>
                                 <!-- формирование этапов -->
                                 <li class="sub-accordion-item" v-for="(stage,stageIndex) in subType.subData"
                                     :key="stageIndex">
                                    <!-- порядковые номера и названия этапов -->
                                    <div class="item-wrap" :class="{finish: !(stage.work_residue > 0)}">
                                       <div class="number">{{stageIndex+1}}</div>
                                       <div class="text"
                                            :title="(stage.stage_name.length>40) ? stage.stage_name : ''">
                                          {{stage.stage_name}}
                                       </div>
                                    </div>
                                    <div v-if="stage.work_residue > 0" class="item-wrap price-wrap">
                                       <!-- формирование селекта, при смене опшина изменится соответсвующий элемент в masterTypeOfWorks -->
                                       <div class="measurement">
                                          <p>Осталось по договору</p>
                                          <input
                                             class="value"
                                             type="number"
                                             :value="stage.work_residue"
                                             disabled/>
                                          {{stage.unit_of_measurement}}
                                       </div>
                                       <div class="measurement">
                                          <p>Заказать на</p>
                                          <input
                                             v-model="stage.work_scope_ordered_materials"
                                             class="value"
                                             type="number"
                                             :max="stage.work_residue"
                                             placeholder="Значение"/>
                                          {{stage.unit_of_measurement}}
                                       </div>
                                    </div>
                                 </li>

                              </ul>
                           </div>
                        </li>
                     </ul>
                  </div>
               </li>
            </ul>
            <div class="delivery-date-wrap">
               <div class="delivery_title">Доставить</div>
               <div class="input-field">
                  <input
                     id="deliveryDate"
                     type="text"
                     v-on:change="setDate"
                     ref="i_delivery_date"
                     class="datepicker">
                  <label for="deliveryDate" :class="{active: (deliveryDate)}">Дата</label>
                  <small
                     class="helper-text invalid"
                     v-if="$v.deliveryDate.$dirty && !$v.deliveryDate.required"
                  >Обязательное поле</small>
               </div>
               <div class="input-field">
                  <input
                     id="deliveryTime"
                     type="text"
                     v-on:change="setTime"
                     ref="i_delivery_time"
                     class="datepicker">
                  <label for="deliveryTime" :class="{active: (deliveryTime)}">Время</label>
                  <small
                     class="helper-text invalid"
                     v-if="$v.deliveryTime.$dirty && !$v.deliveryTime.required"
                  >Обязательное поле</small>
               </div>
            </div>
            <div class="input-field">
               <button
                  :disabled="work_residue_is_zero"
                  class="btn btn-standard btn-large red accent-1 waves-effect waves-light"
                  type="submit">
                  Запросить новую доставку
               </button>
            </div>
         </form>
      </section>
   </div>
</template>

<script>
   import M from "materialize-css/dist/js/materialize.min";
   import {required} from 'vuelidate/lib/validators'

   export default {
      name: "delivery-request",
      data: () => ({
         empty_response: true,
         loading: true,
         deliveryDate: '',
         deliveryTime: '',
         i_delivery_date: null,
         i_delivery_time: null,
         masterTypeOfWorks: [],
         accordion: null,
         subAccordion: [],
         work_residue_is_zero: false
      }),
      validations: {
         deliveryDate: {required},
         deliveryTime: {required},
      },
      created() {
         try {
            this.$store.dispatch('waitToken', this.getLocationTypesOfWorks)
         } catch (e) {
            console.log(e)
         }
      },
      methods: {
         // Задаётся дата
         setDate() {
            this.deliveryDate = this.i_delivery_date.el.value;
         },
         // Задаётся время
         setTime() {
            this.deliveryTime = this.i_delivery_time.el.value;
         },
         // получаем данные с сервера
         async getLocationTypesOfWorks() {
            this.masterTypeOfWorks = []

            await this.$http.get('wp/v2/object-information/delivery-request', {
               params: {
                  user_id: this.$store.state.auth.userId,
                  object_id: this.$route.params.id
               }
            })
               .then(response => {
                  return response.json();
               })
               .then(response => {
                  console.log('in', response.masterTypeOfWorks);

                  if (response.masterTypeOfWorks.every(el => el.work_residue == '0')) this.work_residue_is_zero = true

                  // Получить название по ключу
                  function getNameByKey(arr, key, id) {

                     // берем ключ, заменяем name на id
                     let key_id = key.split('_')
                     key_id = key_id[0] + '_id'
                     //поиск значения
                     for (let i = 0; i < arr.length; i++) {
                        if (arr[i][key_id] === id) {

                           return arr[i][key]
                        }
                     }
                  }

                  if (response.masterTypeOfWorks.length === 0) {
                     this.empty_response = true
                     this.loading = false
                  } else {
                     this.empty_response = false

                     if (response.masterTypeOfWorks.length === 0) {
                        this.empty_response = true
                        this.loading = false
                     } else {


                        this.empty_response = false
                        // Создание нового массива с уникальными видами работ type_name
                        let _locations = [...new Set(response.masterTypeOfWorks.map(item => item.location_id))];
                        let _technologyName = [...new Set(response.masterTypeOfWorks.map(item => item.technology_id))]


                        let true_technology_index // индекс для технологии
                        // формирование объекта для формы
                        // #1 вид работ
                        _locations.forEach((locationId, type_Index) => {
                           // Добавление вида работ
                           this.masterTypeOfWorks.push({
                              title: getNameByKey(response.masterTypeOfWorks, 'location_name', locationId),
                              data: []
                           })

                           true_technology_index = -1
                           // #2 технология
                           _technologyName.forEach((technologyId) => {
                              if (response.masterTypeOfWorks.filter(item => item.location_id === locationId && item.technology_id === technologyId).length !== 0) {
                                 true_technology_index++
                                 // добавление технологии
                                 this.masterTypeOfWorks[type_Index].data.push({
                                    subTitle: getNameByKey(response.masterTypeOfWorks, 'technology_name', technologyId),
                                    subPostCategory: (response.masterTypeOfWorks.find(item => item.technology_id === technologyId))?.category_id,
                                    subData: []
                                 })
                              }
                              // #3 этапы в локации
                              response.masterTypeOfWorks.forEach((item) => {
                                 if (item.location_id === locationId && item.technology_id === technologyId) {
                                    // Добавление этапа
                                    this.masterTypeOfWorks[type_Index].data[true_technology_index].subData.push({
                                       sm_locations_data_id: item.sm_locations_data_id,
                                       master_stage_id: item.master_stage_id,
                                       stage_name: item.stage_name,
                                       work_residue: item.work_residue,
                                       unit_of_measurement: item.unit_of_measurement
                                    })
                                 }
                              })
                           })
                        })

                        console.log('formData', this.masterTypeOfWorks)
                        setTimeout(() => {
                           //materialize inits
                           this.accordion = M.Collapsible.init(this.$refs.accordion, {accordion: false});
                           let i = 0;
                           if (this.$refs.subAccordion) {
                              for (i = 0; i < this.$refs.subAccordion.length; i++) {
                                 this.subAccordion[i] = M.Collapsible.init(this.$refs.subAccordion[i], {accordion: false});
                              }
                           }

                           this.loading = false;
                           // console.log(this.subAccordion);
                        }, 100)
                     }
                  }
               })
               .catch(function (error) {
                  console.log(error);
                  this.$store.commit('setError', error.data.code);
                  throw  error;
               });
         },
         // Отправляем данные
         async submitHandler() {

            if (this.$v.$invalid) {   // Если форма не валидна
               this.$v.$touch();   //	Sets the $dirty flag of the model and all its children to true recursively.
               return  // отмена
            }

            // отправка
            try {
               // Формирование данных для БД (табл. sm_masters_technology_pricing_policy)
               this.formData =
                  {
                     user_id: this.$store.state.auth.userId,
                     object_id: this.$route.params.id,
                     date: this.i_delivery_date.date.toLocaleDateString() + ' ' + this.i_delivery_time.time,
                     sm_locations_data: []
                  }
               console.log(this.masterTypeOfWorks);
               this.masterTypeOfWorks.forEach(
                  (typeOfWorks) => {
                     typeOfWorks.data.forEach(
                        (technologyOfWorks) => {
                           technologyOfWorks.subData.forEach(
                              (item) => {
                                 this.formData.sm_locations_data.push({
                                    location_data_id: item.sm_locations_data_id,
                                    work_scope_ordered_materials: item.work_scope_ordered_materials
                                 })
                              }
                           )
                        }
                     )
                  }
               )

               console.log(this.formData);
               // Отправка формы
               await this.$http.post('wp/v2/object-information/delivery-request', this.formData)
                  .then((response) => {
                     return response.json()
                  })
                  .then((response) => {
                     this.$store.commit('setMessage', response.message)

                     this.loading = true
                     this.getLocationTypesOfWorks()

                  })
                  .catch(function (error) {
                     this.$store.commit('setError', error.data.code);
                     throw  error;
                  })

            } catch (e) {
               console.log('catch Location-measurement-input.vue');
               this.$error('Ошибка');
               console.log(e);
            }
            this.$store.commit('clearMessage');
            this.$store.commit('clearError');
         }
      },
      mounted() {
         // this.s_contracts = M.FormSelect.init(this.$refs.s_contracts);
         this.i_delivery_date = M.Datepicker.init(this.$refs.i_delivery_date, this.$store.state.datePicker.datePickerOptions);
         this.i_delivery_time = M.Timepicker.init(this.$refs.i_delivery_time, this.$store.state.datePicker.timePickerOptions);

         // this.getContracts();
         console.log('Delivery-request.vue');
         this.$store.commit('change_headerNav', {
            text: 'Заявка на доставку строй материалов',
            colorNav: 'red',
            colorHome: 'black',
            colorText: 'black'
         });
      },
      beforeDestroy() {
         // Проверка на существование переменной
         if (this.i_delivery_date && this.i_delivery_date.destroy) {
            this.i_delivery_date.destroy();
         }
         if (this.i_delivery_time && this.i_delivery_time.destroy) {
            this.i_delivery_time.destroy();
         }
      }
   }
</script>

<style lang="scss" scoped>
   .warn {
      color: #ff2626;
      font-size: 26px;
      text-align: center;
   }

   .delivery-date-wrap {
      .delivery_title {
         margin-top: 11px;
      }

      > div {
         vertical-align: top;
         margin-top: 0;
         display: inline-block;
         width: 32%;
      }

      .input-field {
         margin-left: 5px;
      }
   }

   input[type=number]::-webkit-inner-spin-button,
   input[type=number]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
   }

   input[type="number"] {
      -moz-appearance: textfield;
   }

   input[type="number"]:hover,
   input[type="number"]:focus {
      -moz-appearance: number-input;
   }

   * {
      -ms-user-select: none;
      -moz-user-select: none;
      -khtml-user-select: none;
      -webkit-user-select: none;
   }

   .collapsible {
      margin: 0;
   }

   .allDelivered {
      .main-accordion-header {
         background-color: #9ED26A;
      }
   }

   .main-accordion {
      margin: 30px 0;
      border: none;
      overflow-x: hidden;

      &-header {
         justify-content: center;
         font-weight: bold;
         height: 50px;
         background-color: #E4E8EB;
      }

      &-item {

      }

      &-body {
         border: none;
         padding: 0;
      }
   }

   .sub-accordion {
      border: none;

      &-header {
         margin: 5px 0;
         border: none;
         height: 30px;
         padding: 0 0 0 1rem;
         line-height: 30px;
         background-color: #E4E8EB;
         position: relative;
      }

      &-body {
         padding: 0;
         border: none;
      }

      &-item {
         position: relative;
         margin: 5px 0;


         &.wrap:after {
            position: absolute;
            width: 10px;
            height: 10px;
            content: '';
            top: 8px;
            right: 10px;
            border: solid #4b4b4b;
            border-width: 0 0 3px 3px;
            transform: rotate(-45deg);
            transition: all .5s ease;
         }

         &.wrap.active:after {
            top: 11px;
            transform: rotate(-225deg);
         }

         .item-wrap {
            background-color: #E4E8EB;
            white-space: nowrap;
            border-right: 5px solid #e4e8eb;
            /*overflow: hidden;*/
            &.finish {
               background-color: #9ED26A;
               border-right: none
            }
         }

         .price-wrap {
            background-color: #fff;
            border-right: none;
         }

         .measurement {
            &:first-child {
               margin-right: 10%;
            }

            display: inline-block;
            width: 40%;

            p {
               font-size: 14px;
            }
         }

         .value {
            width: 100px;
            font-size: 14px;
         }

         .number {
            height: 30px;
            text-align: center;
            width: 21px;
            color: #fff;
            line-height: 30px;
            display: inline-block;
            background-color: #424852;

         }

         .text {
            display: inline-block;
            padding-left: 5px;
            border-left: 5px solid #fff;
            color: #000000;
            font-size: 14px;
            height: 30px;
            line-height: 30px;
         }
      }
   }
</style>