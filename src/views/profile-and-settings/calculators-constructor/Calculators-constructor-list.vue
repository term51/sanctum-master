<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <h2 class="title"></h2>
      <Loader size="big" v-if="loading"/>
      <form>
         <ul v-show="!loading" ref="accordion" class="main-accordion collapsible expandable">
            <li v-for="(type, index) in masterTypeOfWorks" :key="index"
                class="active main-accordion-item">
               <div class="collapsible-header main-accordion-header">{{type.title}}</div>
               <div class="collapsible-body main-accordion-body">
                  <ul ref="subAccordion" class="sub-accordion collapsible expandable ">
                     <li class="sub-accordion-item wrap" v-for="(subType, subIndex) in type.data"
                         :key="subIndex">
                        <div class="collapsible-header sub-accordion-header" :title="subType.subTitle">{{subType.subTitle}}</div>
                        <div class="collapsible-body sub-accordion-body">
                           <ul>
                              <li class="sub-accordion-item" v-for="(stage, stageIndex) in subType.subData"
                                  :key="stageIndex">
                                 <div class="item-wrap">
                                    <div class="number">{{stageIndex+1}}</div>
                                    <div class="text" :title="(stage.stage_name.length > 40) ? stage.stage_name : ''">
                                       {{stage.stage_name}}
                                    </div>
                                 </div>
                                 <div v-for="(material, materialIndex) in stage.materials" :key="materialIndex"
                                      class="item-wrap">
                                    <div class="material-wrap">
                                       <div class="policy">
                                          {{material.policy_title}}
                                       </div>
                                       <div
                                          @click.prevent="findCalculators(stage.master_stage_id, material.id)"
                                          data-target="modal1"
                                          class="title modal-trigger">
                                          {{material.material_title}}
                                       </div>
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

         <!-- Добавить новый товар -->

         <!-- Modal Structure -->
         <div ref="modal" id="modal1" class="modal">
            <div class="modal-content">
               <Loader size="small" v-if="modalLoading"/>
               <h2 v-else class="title">{{calculators.length > 0 ? 'Выберите калькуляор': 'Для выбранного материала нет созданных калькуляторов'}}</h2>
               <router-link
                  v-for="(calculator, index) in calculators"
                  :key="index"
                  class="btn btn-standard btn-large btn-dark"
                  tag="button"
                  :to="`/profile-and-settings/calculators-constructor-list/edit-calculator/${calculator.id}`">{{calculator.title}}
               </router-link>

               <router-link
                  tag="button"
                  v-show="!loading"
                  :to="`/profile-and-settings/calculators-constructor-list/create-calculator/${selectCalculator}`"
                  class="btn btn-standard btn-large light-green lighten-1 waves-effect waves-light">
                  Создать калькулятор
               </router-link>
               <button
                  class="btn btn-standard btn-large red accent-1"
                  @click.prevent="modal.close()">
                  Отмена
               </button>
            </div>
         </div>
         <!--/////////-->

      </form>
      <div v-if="emptyData" class="warn">Созданных калькуляторов не найдено</div>
   </div>
</template>

<script>
   import M from "materialize-css/dist/js/materialize.min";

   export default {
      name: "calculators-constructor-list",
      data: () => ({
         loading: true,
         modalLoading: true,
         masterTypeOfWorks: [],
         accordion: null,
         subAccordion: [],
         formData: {},
         name: '',
         modal: null,
         calculators: [],
         selectCalculator: '',
         emptyData: false
      }),
      created() {
         // Получить все виды работ
         try {
            this.$store.dispatch('waitToken', this.getTypesOfWorks)
         } catch (e) {
            console.log(e)
         }
      },
      methods: {
         // найти калькуляторы для выбранного материала
         async findCalculators(master_stage_id, material_id) {
            console.log(master_stage_id);
            this.selectCalculator = master_stage_id + '&' + material_id


            this.calculators = []
            this.modalLoading = true

            await this.$http.get('wp/v2/users/calculators/selected-material', {
               params: {
                  master_stage_id: master_stage_id,
                  material_id: material_id
               }
            })
               .then(response => {
                  return response.json();
               })
               .then(response => {
                  console.log('calculators', response);
                  this.calculators = response.calculators
                  this.modalLoading = false
               })
               .catch(function (error) {
                  console.log(error);
                  throw  error;
               });
         },
         // получаем данные с сервера
         async getTypesOfWorks() {
            this.masterTypeOfWorks = []

            await this.$http.get('wp/v2/users/calculators/materials', {
               params: {
                  user_id: this.$store.state.auth.userId
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


                  if (response.masterTypeOfWorks.length > 0) {

                     // Создание нового массива с уникальными видами работ type_name
                     let _typeOfWork = [...new Set(response.masterTypeOfWorks.map(item => item.type_id))];
                     let _technologyName = [...new Set(response.masterTypeOfWorks.map(item => item.technology_id))]


                     let true_technology_index // индекс для технологии
                     let true_stage_index // индекс для материала
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
                                 subData: []
                              })
                           }
                           true_stage_index = -1
                           // #3 этапы
                           response.masterTypeOfWorks.forEach((item) => {
                              if (item.type_id === typeId && item.technology_id === technologyId) {
                                 true_stage_index++
                                 // Добавление этапа
                                 this.masterTypeOfWorks[type_Index].data[true_technology_index].subData.push({
                                    master_stage_id: item.master_stage_id,
                                    stage_name: item.stage_name,
                                    materials: []
                                 })
                                 //#4 материалы
                                 item.materials.forEach((material) => {
                                    // Добавление материала в этап
                                    this.masterTypeOfWorks[type_Index].data[true_technology_index].subData[true_stage_index].materials.push({
                                       id: material.material_id,
                                       material_title: material.material_title === null ? '(материал удален из системы)' : material.material_title,
                                       policy_title: material.policy_title
                                    })
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
                        this.modal = M.Modal.init(this.$refs.modal, {});
                        this.loading = false;
                        // console.log(this.subAccordion);
                     }, 10)

                     this.emptyData = false
                  } else {
                     this.loading = false;
                     this.emptyData = true
                  }

               })
               .catch(function (error) {
                  console.log(error);

                  throw  error;
               });
         }
      },
      mounted() {
         M.FormSelect.init(this.$refs.s_autocomplete, {});

         console.log('Calculator-constructor-list.vue');
         this.$store.commit('change_headerNav', {
            text: 'Конструктор калькуляторов',
            colorNav: 'blue',
            colorHome: 'black',
            colorText: 'black'
         });
      },
      beforeDestroy() {
         if (this.modal) {
            this.modal.close()
         }

         // Проверка на существование переменной
         if (this.accordion && this.accordion.destroy) {
            this.accordion.destroy();
         }

         if (this.subAccordion && this.subAccordion.length > 0) {
            for (let i = 0; i < this.subAccordion.length; i++) {
               this.subAccordion[i].destroy();
            }
         }

         if (this.modal && this.modal.destroy) {
            this.modal.destroy();
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
         padding: 0 20px 0 1rem;
         line-height: 30px;
         background-color: #E4E8EB;
         position: relative;
         overflow: hidden;
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


         }

         .material-wrap {
            margin-top: 5px;
            display: flex;
            justify-content: space-between;

            .policy, .title {
               display: inline-block;
               font-weight: normal;
               line-height: 16px;
               border: none;
               vertical-align: top;
               text-align: left;
               white-space: normal;
               padding: 5px;
               font-size: 12px;
            }


            .policy {
               width: 30%;
               color: #000;
            }

            .title {
               color: #fff;
               width: 70%;
               border-left: 5px solid #fff;
               background-color: #424852;
               cursor: pointer;
            }

         }

         .btn-standard {
            color: #fff !important;
            margin-top: 5px;
         }

         .price-wrap {
            background-color: #fff;
            border-right: none;
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

   .warn {
      font-size: 17px;
      color: red;
      text-align: center;
   }

   .modal {
      width: 40%;
      overflow-y: hidden;
   }

   @media screen and (max-width: 1200px) {
      .modal {
         width: 60%;
      }
   }

   @media screen and (max-width: 900px) {
      .modal {
         width: 80%;
      }
   }

   @media screen and (max-width: 600px) {
      .modal {
         width: 98%;
      }
   }
</style>