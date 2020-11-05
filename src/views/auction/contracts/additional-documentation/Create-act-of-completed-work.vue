<template>
   <!-- Опасно менять верстку в разделе  "формировани аккордиона для статей" (зависимости в JS) -->
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <Loader size="big" v-if="loading"/>
      <h2 class="title" v-show="!loading">Укажите данные для формирования акта</h2>
      <div v-show="!loading" class="input-field">
         <select ref="s_act_type" v-model="act_type">
            <option value="1">Акт выполненных работ</option>
            <option value="2">Акт освидетельствования скрытых работ</option>
         </select>
         <label>Вид акта</label>
      </div>

      <form @submit.prevent="submitHandler">
         <ul v-show="!loading" ref="location_accordion" class="main-accordion collapsible expandable">
            <!-- формирование суб аккордионов -->
            <li v-for="(location, index) in masterTypeOfWorks" :key="index" class="active main-accordion-item">
               <div class="collapsible-header main-accordion-header">{{location.location_name}}</div>
               <div class="collapsible-body main-accordion-body">
                  <ul ref="type_accordion" class="sub-accordion collapsible expandable">
                     <!-- формирование суб аккордионов типов -->
                     <li class="active sub-accordion-item wrap" v-for="(type, typeIndex) in location.location_data" :key="typeIndex">
                        <div class="collapsible-header sub-accordion-header">{{type.type_name}}</div>
                        <div class="collapsible-body sub-accordion-body">

                           <ul ref="technology_accordion" class="sub-accordion collapsible expandable">
                              <!-- формирование суб аккордионов технологий -->
                              <li class="active sub-accordion-item wrap" v-for="(technology, technologyIndex) in type.type_data" :key="technologyIndex">
                                 <div class="collapsible-header techonology-title  sub-accordion-header">{{technology.technology_name}}</div>
                                 <div class="collapsible-body sub-accordion-body">
                                    <ul>
                                       <!-- формирование  этапов -->
                                       <li class="loc-mea-inp sub-accordion-item" v-for="(stage,stageIndex) in technology.technology_data"
                                           :key="stageIndex">
                                          <!-- порядковые номера и названия этапов -->
                                          <div class="item-wrap" :class="{finish: (stage.work_residue === '0')}">
                                             <div class="number">{{stageIndex+1}}</div>
                                             <div class="text"
                                                  :title="(stage.stage_name.length>40) ? stage.stage_name : ''">
                                                {{stage.stage_name}}
                                             </div>
                                          </div>

                                          <div class="item-wrap price-wrap">
                                             <div class="value">
                                                <label>Оставшийся объем работ</label>
                                                <input
                                                   disabled
                                                   v-model="stage.work_residue"
                                                   type="number"
                                                   placeholder="Значение"/>
                                             </div>
                                             <div class="for"></div>
                                             <div class="value">
                                                <label>Единица измерения</label>
                                                <input
                                                   disabled
                                                   v-model="stage.unit_of_measurement"/>
                                             </div>
                                             <div class="for"></div>
                                             <div class="value">
                                                <label>Цена за ед. по смете (руб.)</label>
                                                <!-- Цена за единицу по выбранной мастером категории работ -->
                                                <input
                                                   disabled
                                                   v-model="stage.bet"/>
                                             </div>
                                             <div class="for"></div>
                                             <div class="value">
                                                <label>Выполнено работы</label>
                                                <input
                                                   :disabled="stage.work_residue === '0'"
                                                   style="background-color: #fffac8;"
                                                   v-model="stage.completed_work_scope"
                                                   type="number"
                                                   :max="stage.work_residue"
                                                   placeholder="Значение"/>
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
               </div>
            </li>
         </ul>
         <p v-if="warn" class="warn">Заполните хотябы одно поле "Выполнено работы"</p>
         <div class="input-field">
            <button
               :disabled="all_completed"
               v-show="!loading"
               class="btn btn-standard btn-large light-green lighten-1 waves-effect waves-light"
               type="submit">
               Создать {{s_act_type_text}}
            </button>
         </div>
      </form>
   </div>
</template>

<script>
   import M from "materialize-css/dist/js/materialize.min";

   export default {
      name: "create-act-of-completed-work",
      data: () => ({
         loading: true,
         act_type: 1,
         s_act_type: null,
         s_act_type_text: '',
         masterTypeOfWorks: [],
         location_accordion: null,
         type_accordion: [],
         technology_accordion: [],
         warn: false,
         all_completed: false
      }),
      created() {
         try {
            this.$store.dispatch('waitToken', this.getLocationTypesOfWorks)
         } catch (e) {
            console.log(e)
         }
      },
      watch: {
         act_type: function () {
            this.setActTypeText()
         }
      },
      methods: {
         // взять текст из селекта
         setActTypeText() {
            this.s_act_type_text = (this.s_act_type.el.options[this.s_act_type.el.selectedIndex].text).toLowerCase()
         },
         // получаем данные с сервера
         async getLocationTypesOfWorks() {
            this.masterTypeOfWorks = []

            await this.$http.get('wp/v2/in-work/object-information/create-act-of-completed-work', {
               params: {
                  contract_id: this.$route.params.contract_id
               }
            })
               .then(response => {
                  return response.json();
               })
               .then(response => {
                  console.log('in', response.masterTypeOfWorks);

                  // если все работы выполнены - заблокировать кнопку "Создать АВР"
                  if (response.masterTypeOfWorks.every(item => item.work_residue === '0')) this.all_completed = true

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

                  // Создание новых массивов с уникальными локациями, видами и технологиями работ

                  let _locations = [...new Set(response.masterTypeOfWorks.map(item => item.location_id))];
                  let _typeOfWork = [...new Set(response.masterTypeOfWorks.map(item => item.type_id))];
                  let _technologyName = [...new Set(response.masterTypeOfWorks.map(item => item.technology_id))]

                  let true_type_index // индекс для типа работ
                  let true_technology_index // индекс для технологии

                  // формирование объекта для формы
                  // #1 Локация
                  _locations.forEach((locationId, location_index) => {
                     // Добавление локации
                     this.masterTypeOfWorks.push({
                        location_name: getNameByKey(response.masterTypeOfWorks, 'location_name', locationId),
                        location_data: []
                     })

                     true_type_index = -1
                     // #2 вид работ
                     _typeOfWork.forEach(typeId => {
                        if (response.masterTypeOfWorks.filter(item => item.type_id === typeId && item.location_id === locationId).length !== 0) {
                           true_type_index++
                           // Добавление вида работ
                           this.masterTypeOfWorks[location_index].location_data.push({
                              type_name: getNameByKey(response.masterTypeOfWorks, 'type_name', typeId),
                              type_data: []
                           })
                        }

                        true_technology_index = -1
                        // #3 технология
                        _technologyName.forEach(technologyId => {
                           if (response.masterTypeOfWorks.filter(item => item.type_id === typeId && item.technology_id === technologyId
                              && item.location_id === locationId).length !== 0) {
                              true_technology_index++

                              // добавление технологии
                              this.masterTypeOfWorks[location_index].location_data[true_type_index].type_data.push({
                                 technology_name: getNameByKey(response.masterTypeOfWorks, 'technology_name', technologyId),
                                 technology_data: []
                              })

                           }

                           // #4 этапы в локации
                           response.masterTypeOfWorks.forEach(item => {
                              if (item.type_id === typeId && item.technology_id === technologyId && item.location_id === locationId) {
                                 // Добавление этапа
                                 this.masterTypeOfWorks[location_index].location_data[true_type_index].type_data[true_technology_index].technology_data.push({
                                    location_data_id: item.locations_data_id,
                                    stage_name: item.stage_name,
                                    work_residue: item.work_residue,
                                    unit_of_measurement: item.unit_of_measurement,
                                    bet: item.bet
                                 })
                              }
                           })
                        })
                     })
                  })

                  console.log('formData', this.masterTypeOfWorks)
                  setTimeout(() => {
                     //materialize inits
                     this.s_act_type = M.FormSelect.init(this.$refs.s_act_type, {})
                     // взять текст из селекта
                     this.setActTypeText()

                     this.location_accordion = M.Collapsible.init(this.$refs.location_accordion, {accordion: false});

                     if (this.$refs.type_accordion) {
                        for (let i = 0; i < this.$refs.type_accordion.length; i++) {
                           this.type_accordion[i] = M.Collapsible.init(this.$refs.type_accordion[i], {accordion: false});
                        }
                     }

                     if (this.$refs.technology_accordion) {
                        for (let i = 0; i < this.$refs.technology_accordion.length; i++) {
                           this.technology_accordion[i] = M.Collapsible.init(this.$refs.technology_accordion[i], {accordion: false});
                        }
                     }

                     this.loading = false;
                     // console.log(this.subAccordion);
                  }, 200)

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
               // this.formData =
               //    {
               //       user_id: this.$store.state.auth.userId,
               //       locations_auction_data: []
               //    }
               const formData = []

               this.masterTypeOfWorks.forEach(location => {
                  location.location_data.forEach(typeOfWorks => {
                        typeOfWorks.type_data.forEach(technologyOfWorks => {
                              technologyOfWorks.technology_data.forEach(item => {
                                    formData.push({
                                       location_data_id: item.location_data_id,
                                       completed_work_scope: item.completed_work_scope
                                    })
                                 }
                              )
                           }
                        )
                     }
                  )
               })

               console.log(formData)
               // проверка на пустой ввод
               if (formData.filter(item => item.completed_work_scope !== undefined && item.completed_work_scope !== '').length > 0) {
                  // если есть заполненное поле - убрать ошибку
                  this.warn = false
                  // Отправка формы
                  await this.$http.post('wp/v2/in-work/object-information/create-act-of-completed-work', {
                     contract_id: this.$route.params.contract_id,
                     act_type: this.act_type,
                     formData
                  })
                     .then((response) => {
                        return response.json()
                     })
                     .then((response) => {
                        this.$store.commit('setMessage', response.message)
                        this.$router.push(`/auction/contract-concluded/${this.$route.params.contract_id}/additional-documentation/acts-of-completed-work`)
                     })
                     .catch(function (error) {
                        this.$store.commit('setError', error.data.code);
                        throw  error;
                     })

               } else {
                  // если все поля пустые - вывести ошибку
                  this.warn = true
               }


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

         console.log('Create-act-of-completed-work.vue');
         this.$store.commit('change_headerNav', {
            showBack: true,
            showHome: true,
            text: `Создание акта`,
            colorNav: 'red',
            colorHome: 'black',
            colorText: 'black'
         });
      },
      beforeDestroy() {
         // Проверка на существование переменной
         if (this.s_act_type && this.s_act_type.destroy) {
            this.s_act_type.destroy();
         }
         if (this.location_accordion && this.location_accordion.destroy) {
            this.location_accordion.destroy();
         }
         if (this.type_accordion && this.type_accordion.length > 0) {
            for (let i = 0; i < this.type_accordion.length; i++) {
               this.type_accordion[i].destroy();
            }
         }
         if (this.technology_accordion && this.technology_accordion.length > 0) {
            for (let i = 0; i < this.technology_accordion.length; i++) {
               this.technology_accordion[i].destroy();
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

   .warn {
      color: #ff2626;
      text-align: center;
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

      .techonology-title {
         justify-content: center;
         font-weight: bold;
      }

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

         .btn-standard {
            color: #fff !important;
            margin-top: 5px;
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

         .value {
            width: 22%;

            display: inline-block;
            position: relative;

            input {
               height: 3rem;
               font-size: 14px;
               text-indent: 8px;
            }
         }

         .full-w {
            width: 100%;
         }

         .for {
            display: inline-block;
            width: 4%;
            padding-left: 10px;
         }

         .item-wrap.acts {
            .value {
               width: 100%;
            }

            /*.for{*/
            /*   width: 10%;*/
            /*}*/
         }


         .auction-info-wrap {
            background-color: #fff;
            border-right: none;

            .description {
               white-space: normal;
               padding: 5px 12px;
               background-color: #E4E8EB;
            }

            .img-wrap {
               text-align: center;
            }

            > * {
               display: block;
               margin: 10px 0;
            }

            .btn-standard {
               position: relative;
               background-color: #5E9CEA;

               img {
                  position: absolute;
                  top: 0px;
                  left: 0px;
                  vertical-align: top;
                  width: 36px;
                  height: 36px;
                  padding: 10px;
                  background-color: rgba(0, 0, 0, 0.1);
               }

               &.clicked {
                  background-color: #1564ea;
               }
            }

            textarea {
               border: 1px solid #ececec;
               outline: none;

               &:focus {
                  border: 1px solid #9ED26A;
               }
            }
         }

         .price-wrap {
            padding-top: 5px;
            background-color: #fff;
            border-right: none;

            label {
               display: block;
               white-space: normal;
               text-align: center;
               color: #000;
            }
         }

         .additional_material-wrap {
            background-color: #fff;
            border-right: none;

            .units_of_calculation-wrap {
               display: none;
               margin-bottom: 20px;

               &.show {
                  display: block;
               }

               & .row {
                  margin-bottom: 0px;
               }

               & .value {
                  height: 2rem;
                  font-size: 14px;
                  width: 45%;

                  &.full-w {
                     width: 100%;
                  }
               }

               & .for {
                  width: 10%;
               }

            }
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