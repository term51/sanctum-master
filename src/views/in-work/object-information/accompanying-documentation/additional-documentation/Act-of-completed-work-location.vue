<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <h2 class="title">Введите замеры для локации {{$store.state.objectInfo.location_name}}</h2>
      <Loader size="big" v-if="loading"/>
      <form @submit.prevent="submitHandler">
         <ul v-show="!loading" ref="accordion" class="main-accordion collapsible expandable">
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
                                 <div class="item-wrap">
                                    <div class="number">{{stageIndex+1}}</div>
                                    <div class="text"
                                         :title="(stage.stage_name.length>40) ? stage.stage_name : ''">
                                       {{stage.stage_name}}
                                    </div>
                                 </div>
                                 <div class="item-wrap price-wrap">
                                    <!-- формирование селекта, при смене опшина изменится соответсвующий элемент в masterTypeOfWorks -->
                                    <div class="measurement">
                                       <p>Замеры по договору</p>
                                       <input
                                          v-model="stage.work_scope"
                                          class="value"
                                          type="number"
                                          disabled/>
                                       {{stage.unit_of_measurement}}
                                    </div>
                                    <div class="measurement">
                                       <p>Выполнено</p>
                                       <input
                                          v-model="stage.completed_work_scope"
                                          class="value"
                                          type="number"
                                          :max="stage.work_scope"
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
         <div class="input-field">
            <button
               class="btn btn-standard btn-large light-green lighten-1 waves-effect waves-light"
               type="submit">
               Сохранить
            </button>
         </div>
      </form>
   </div>
</template>

<script>
   import M from "materialize-css/dist/js/materialize.min";

   export default {
      name: "location-measurement-input",
      data: () => ({
         loading: true,
         masterTypeOfWorks: [],
         accordion: null,
         subAccordion: []
      }),
      created() {
         try {
            this.$store.dispatch('waitToken', this.getLocationTypesOfWorks)
         } catch (e) {
            console.log(e)
         }
      },
      methods: {
         // получаем данные с сервера
         async getLocationTypesOfWorks() {
            this.masterTypeOfWorks = []

            await this.$http.get('wp/v2/additional-documentation/act-of-completed-work-location', {
               params: {
                  user_id: this.$store.state.auth.userId,
                  location_id: this.$route.params.location_id
               }
            })
               .then(response => {
                  return response.json();
               })
               .then(response => {
                  console.log('in', response.masterTypeOfWorks);

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
                     // Создание нового массива с уникальными видами работ type_name
                     let _typeOfWork = [...new Set(response.masterTypeOfWorks.map(item => item.type_id))];
                     let _technologyName = [...new Set(response.masterTypeOfWorks.map(item => item.technology_id))]


                     let true_technology_index // индекс для технологии
                     // формирование объекта для формы
                     // #1 вид работ
                     _typeOfWork.forEach((typeId, type_Index) => {
                        // Добавление вида работ
                        this.masterTypeOfWorks.push({
                           title: getNameByKey(response.masterTypeOfWorks, 'type_name', typeId),
                           data: []
                        })

                        true_technology_index = -1
                        // #2 технология
                        _technologyName.forEach((technologyId) => {
                           if (response.masterTypeOfWorks.filter(item => item.type_id === typeId && item.technology_id === technologyId).length !== 0) {
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
                              if (item.type_id === typeId && item.technology_id === technologyId) {
                                 // Добавление этапа
                                 this.masterTypeOfWorks[type_Index].data[true_technology_index].subData.push({
                                    sm_locations_data_id: item.sm_locations_data_id,
                                    master_stage_id: item.master_stage_id,
                                    stage_name: item.stage_name,
                                    work_scope: item.work_scope,
                                    completed_work_scope: item.completed_work_scope,
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
                     }, 50)
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
            // отправка
            try {
               // Формирование данных для БД (табл. sm_masters_technology_pricing_policy)
               this.formData =
                  {
                     user_id: this.$store.state.auth.userId,
                     sm_locations_data: []
                  }

               this.masterTypeOfWorks.forEach(
                  (typeOfWorks) => {
                     typeOfWorks.data.forEach(
                        (technologyOfWorks) => {
                           technologyOfWorks.subData.forEach(
                              (item) => {
                                 this.formData.sm_locations_data.push({
                                    sm_locations_data_id: item.sm_locations_data_id,
                                    completed_work_scope: item.completed_work_scope
                                 })
                              }
                           )
                        }
                     )
                  }
               )

               console.log(this.formData);
               // Отправка формы
               await this.$http.post('wp/v2/additional-documentation/act-of-completed-work-location', this.formData)
                  .then((response) => {
                     return response.json()
                  })
                  .then((response) => {
                     this.$store.commit('setMessage', response.message)
                  })
                  .catch(function (error) {
                     this.$store.commit('setError', error.data.code);
                     throw  error;
                  })
               this.$store.commit('clearMessage')
               this.$store.commit('clearError')

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
         console.log('Act-of-completed-work-location.vue');
         this.$store.commit('change_headerNav', {
            text: 'Создание АВР',
            colorNav: 'red',
            colorHome: 'black',
            colorText: 'black'
         });
      },
      // После ухода со страницы очищаем память
      beforeDestroy() {
         // Проверка на существование переменной
         if (this.accordion && this.accordion.destroy) {
            this.accordion.destroy();
         }
         if (this.subAccordion && this.subAccordion.length > 0) {
            for (let i = 0; i < this.subAccordion.length; i++) {
               this.subAccordion[i].destroy();
            }
         }
      }
   }
</script>

<style lang="scss" scoped>

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

   .main-accordion {
      margin: 30px 0;
      border: none;
      overflow-x: hidden;

      &-header {
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
<style lang="scss">
   .sub-accordion-item .item-wrap > .select-wrapper {
      display: inline-block;
      width: 60px;

      input {
         height: 3rem;
      }
   }
</style>