<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <h2 class="title"></h2>
      <Loader size="big" v-if="loading"/>
      <form @submit.prevent="submitHandler">
         <ul v-show="!loading" ref="accordion" class="main-accordion collapsible expandable">
            <li v-for="(type, index) in masterTypeOfWorks" :key="index"
                class="active main-accordion-item">
               <div class="collapsible-header main-accordion-header">{{type.title}}</div>
               <div class="collapsible-body main-accordion-body">
                  <ul ref="subAccordion" class="sub-accordion collapsible expandable ">
                     <li class="sub-accordion-item wrap" v-for="(subType, subIndex) in type.data"
                         :key="subIndex">
                        <div class="collapsible-header sub-accordion-header">{{subType.subTitle}}</div>
                        <div class="collapsible-body sub-accordion-body">
                           <ul>
                              <li class="sub-accordion-item" v-for="(stage, stageIndex) in subType.subData"
                                  :key="stageIndex">
                                 <div class="item-wrap">
                                    <div class="number">{{stageIndex+1}}</div>
                                    <div class="text" :title="(stage.stage_name.length>40) ? stage.stage_name : ''">
                                       {{stage.stage_name}}
                                    </div>
                                 </div>
                                 <div v-for="(material, materialIndex) in stage.materials" :key="materialIndex"
                                      class="item-wrap">
                                    <div class="material-wrap">
                                       <div class="check"
                                            :style="'background-color:'+ $store.state.accentColors.green"
                                       ></div>
                                       <div class="title" :title="material.title.length>45 ? material.title:''">
                                          {{material.title}}
                                       </div>
                                       <!--   удаление материала из всего полученного объекта с данными-->
                                       <button @click.prevent="$delete(stage.materials, materialIndex)"
                                               class="btn-delete"
                                               :style="'background-color:'+ $store.state.accentColors.red">X
                                       </button>
                                    </div>
                                    <div class="price-wrap">
                                       <div class="price">{{material.price}} р</div>
                                       <div class="for">за</div>
                                       <div class="unitOfMeasurement">{{material.unitOfMeasurement}}</div>
                                    </div>
                                 </div>
                                 <button
                                    @click.prevent="selectModalButton = stage.materials"

                                    data-target="modal1"
                                    class="btn modal-trigger btn-standard lighten-1 waves-effect waves-light"
                                    :style="'background-color:' + $store.state.accentColors.black">
                                    Выбрать из общего списка
                                 </button>
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
               <Modal-list-autocomplete v-on:select-item="selectItemAutocomplete"/>
            </div>
         </div>
         <!--/////////-->
         <div class="input-field">
            <input
               v-show="!loading"
               id="title"
               type="text"
               v-model.trim="title">
            <label for="title" :class="{active:(title)}" v-show="!loading">Название ценовой категории</label>
         </div>
         <div class="input-field">
            <button
               @click.prevent="deletePolicy()"
               v-show="!loading"
               class="btn btn-standard waves-effect waves-light"
               :style="'background-color:'+$store.state.accentColors.red"
               type="submit">
               Удалить политику
            </button>
         </div>
         <div class="input-field">
            <button
               v-show="!loading"
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
      name: "edit-used-materials",
      data: () => ({
         loading: true,
         masterTypeOfWorks: [],
         accordion: null,
         subAccordion: [],
         formData: {},
         title: '',
         // allMaterials: [],
         modal: null,
         // Хранит область определенного этапа для добавления нового элемента из модального окна
         selectModalButton: null
      }),
      created() {
         // Получить все виды работ
         try {
            this.$store.dispatch('waitToken',this.getTypesOfWorks)
         } catch (e) {
            console.log(e)
         }
      },
      methods: {
         // получаем данные с сервера
         async getTypesOfWorks() {
            this.masterTypeOfWorks = []

            await this.$http.get('wp/v2/users/used-materials/edit-policy', {
               params: {
                  user_id: this.$store.state.auth.userId,
                  price_policy_id: this.$route.params.id
               }
            })
               .then(response => {
                  return response.json();
               })
               .then(response => {
                  console.log('in', response);

                  this.title = response.policy_title

                  // Создание нового массива с уникальными видами работ type_name
                  let _typeOfWork = [...new Set(response.masterTypeOfWorks.map(item => item.type_id))];
                  let _technologyName = [...new Set(response.masterTypeOfWorks.map(item => item.technology_id))]

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
                                    masters_materials_pricing_policy_id: material.masters_materials_pricing_policy_id,
                                    id: material.material_id,
                                    title: material.title === null ? '(материал удален из системы)' : material.title,
                                    price: material.price === null ? '(0)' : material.price,
                                    unitOfMeasurement: material.unitOfMeasurement
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
               })
               .catch(function (error) {
                  console.log(error);
                  // this.$store.dispatch('setError', error.data.code);
                  // this.$store.getters.error
                  throw  error;
               });
         },
         // Удалить технологию работ
         async deletePolicy() {
            if (confirm('Точно удалить?')) {
               await this.$http.delete('wp/v2/users/used-materials/delete-policy', {
                  params: {
                     policy_id: this.$route.params.id
                  }
               })
                  .then(response => response.json())
                  .then(response => {
                     this.$message(response.message)
                     this.$router.push({name: 'used-materials'})
                  })
                  .catch(function (error) {
                     this.$store.commit('setError', error.data.code);
                     throw  error;
                  });
            }
         },
         // Отправляем данные
         async submitHandler() {

            // отправка
            try {
               // Формирование данных для БД (табл. sm_masters_materials_pricing_policy)
               this.formData =
                  {
                     user_id: this.$store.state.auth.userId,
                     pricing_policy_id: this.$route.params.id,
                     pricing_policy_title: this.title,
                     masters_materials_data: []
                  }
               //для правильного индекса при записи в массив с id материала
               // let true_index_for_material_array = 0

               this.masterTypeOfWorks.forEach(
                  (typeOfWorks) => {
                     typeOfWorks.data.forEach(
                        (technologyOfWorks) => {
                           technologyOfWorks.subData.forEach(
                              (item) => {
                                 item.materials.forEach((material) => {
                                    this.formData.masters_materials_data.push({
                                       masters_technology_of_work_id: item.master_stage_id,
                                       masters_materials_pricing_policy_id: material.masters_materials_pricing_policy_id,
                                       materials_id: material.id
                                    })
                                    // this.formData.masters_materials_data.push({
                                    //    masters_technology_of_work_id: item.master_stage_id,
                                    //    materials_id: ''
                                    // })
                                    //
                                    //
                                    //
                                    //
                                    // if (this.formData.masters_materials_data[true_index_for_material_array].materials_id === '') {
                                    //    this.formData.masters_materials_data[true_index_for_material_array].materials_id = material.id
                                    // } else {
                                    //    this.formData.masters_materials_data.push({
                                    //       masters_technology_pricing_policy_id: item.masters_technology_pricing_policy_id,
                                    //       materials_id: material.id
                                    //    })
                                    // }
                                 })
                                 // true_index_for_material_array++
                              }
                           )
                        }
                     )
                  }
               )

               console.log(this.formData);
               // Отправка формы
               await this.$http.post('wp/v2/users/used-materials/edit-policy', this.formData)
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

               // Получить все виды работ

               this.loading = true
               this.getTypesOfWorks();


            } catch (e) {
               console.log('catch Edit-policy.vue');
               this.$error('Ошибка');
               console.log(e);
            }
            this.$store.commit('clearMessage');
            this.$store.commit('clearError');
         },
         // Получаем ответ от модального окна с id выбранного материала
         selectItemAutocomplete(item) {
            console.log(this.selectModalButton);
            // console.log(item);
            this.selectModalButton.push(JSON.parse(item));
         }
      },
      mounted() {
         M.FormSelect.init(this.$refs.s_autocomplete, {});

         console.log('Edit-used-materials.vue');
         this.$store.commit('change_headerNav', {
            text: 'Изменить ценовую категорию',
            colorNav: 'blue',
            colorHome: 'black',
            colorText: 'black'
         });
      },
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

            .price, .unitOfMeasurement {
               width: 40%;
               display: inline-block;
               background-color: #e4e8eb;
               margin-top: 5px;
               text-align: center;
               padding: 3px 0;
            }

            .for {
               display: inline-block;
               width: 20%;
               text-align: center;
            }


         }

         .material-wrap {
            margin-top: 5px;
            display: flex;
            justify-content: space-between;

            .check, .btn-delete, .title {
               display: inline-block;
               height: 30px;
               text-align: center;

               color: #000;
               line-height: 30px;
               border: none;
               vertical-align: top;
            }

            .check {
               width: 21px;
               min-width: 21px;
               position: relative;
            }

            .check:after {
               position: absolute;
               width: 15px;
               height: 10px;
               content: '';
               top: 8px;
               right: 3px;
               border: solid #000;
               border-width: 0 0 4px 3px;
               -webkit-transform: rotate(-45deg);
               transform: rotate(-45deg);
            }

            .title {
               width: 100%;
               border-right: 5px solid #fff;
               border-left: 5px solid #fff;
               overflow: hidden;
               font-size: 12px;
            }

            .btn-delete {
               width: 21px;
               min-width: 21px;
               border: none;
               color: #000000;
               cursor: pointer;
               line-height: 0;
            }

            .btn-delete:hover {
               background-color: #ff4038 !important;
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