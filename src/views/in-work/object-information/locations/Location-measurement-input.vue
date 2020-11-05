<template>
   <!-- Опасно менять верстку в разделе  "формировани аккордиона для статей" (зависимости в JS) -->
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <Loader size="big" v-if="loading"/>
      <h2 class="title" v-if="!empty_response" v-show="!loading">Введите замеры для данной локации</h2>
      <h2 class="warn" v-show="!loading" v-if="empty_response">Сначало нужно выбрать виды работ для данной локации</h2>
      <form @submit.prevent="submitHandler">
         <ul v-show="!loading" ref="accordion" class="main-accordion collapsible expandable">
            <!-- формирование аккордионов -->
            <li v-for="(type, index) in masterTypeOfWorks" :key="index" class="active main-accordion-item">
               <div class="collapsible-header main-accordion-header">{{type.title}}</div>
               <div class="collapsible-body main-accordion-body">
                  <ul ref="subAccordion" class="sub-accordion collapsible expandable">
                     <!-- формирование суб аккордионов -->
                     <li class="sub-accordion-item wrap" v-for="(subType, subIndex) in type.data" :key="subIndex">
                        <div class="collapsible-header sub-accordion-header">{{subType.subTitle}}</div>
                        <div class="collapsible-body sub-accordion-body">
                           <ul>
                              <!--  !формирование аккордиона для статей!  -->
                              <ul ref="postAccordion" class="post-accordion collapsible expandable">
                                 <li class="wrap">
                                    <div class="collapsible-header post-accordion-header"
                                         @click.prevent="getPosts($event.target, subType.subPostCategory)">Статьи по
                                       технологии
                                    </div>
                                    <div class="collapsible-body post-accordion-body">
                                       <div class="post-list-wrap"></div>
                                       <div class="post-wrap hide">
                                          <a @click.prevent="closePost($event.target)"
                                             class="waves-effect waves-dark btn-back">
                                             <img src="@/img/left_arrow.svg">
                                          </a>
                                          <div class="post-content"></div>
                                       </div>
                                    </div>
                                 </li>
                              </ul>
                              <!-- формирование этапов -->
                              <li class="loc-mea-inp sub-accordion-item" v-for="(stage,stageIndex) in subType.subData"
                                  :key="stageIndex">
                                 <!-- порядковые номера и названия этапов -->
                                 <div class="item-wrap">
                                    <div class="number">{{stageIndex+1}}</div>
                                    <div class="text"
                                         :title="(stage.stage_name.length>40) ? stage.stage_name : ''">
                                       {{stage.stage_name}}
                                    </div>
                                 </div>
                                 <div class="item-wrap auction-info-wrap">

                                    <input
                                       class="hide"
                                       :locations_data_id="stage.sm_locations_data_id"
                                       type="file"
                                       accept="image/*">
                                    <button class="btn btn-standard waves-effect waves-light"
                                            @click.prevent="addPhoto($event.target)">
                                       <img src="@/img/plus_black.png">
                                       {{ stage.photo_id === null ?
                                       'Добавить фотографию к технологии' : 'Изменить фотографию' }}
                                    </button>

                                    <textarea
                                       v-model="stage.description"
                                       rows="10"
                                       placeholder="Введите описание данной технологии"></textarea>
                                 </div>
                                 <div class="item-wrap price-wrap">
                                    <div class="value">
                                       <label>Объем работ</label>
                                       <input
                                          v-model="stage.work_scope"
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
                                       <label>Цена за ед. по смете</label>
                                       <!-- Цена за единицу по выбранной мастером категории работ -->
                                       <input
                                          disabled
                                          v-model="stage.master_price"/>
                                    </div>
                                    <div class="for"></div>
                                    <div class="value">
                                       <label>Мин. за ед. от мастера</label>
                                       <input
                                          style="background-color: #fffac8;"
                                          v-model="stage.min_money_from_master"
                                          type="number"
                                          placeholder="Значение"/>
                                    </div>
                                 </div>
                                 <div class="item-wrap additional_material-wrap">
                                    <button
                                       @click.prevent="showCalculation($event.target.nextElementSibling)"
                                       class="btn btn-standard lighten-1 waves-effect waves-light"
                                       :style="'background-color:' + $store.state.accentColors.black">
                                       Дополнительный расход материала
                                    </button>
                                    <div class="units_of_calculation-wrap">
                                       <div class="row">
                                          <div class="col s6">
                                             <div class="vertical-text">% фракционности</div>
                                          </div>
                                          <div class="col s6">
                                             <input
                                                v-model="stage.factionalism"
                                                class="value full-w"
                                                type="number"
                                                placeholder="Введите значение"/>
                                          </div>
                                       </div>
                                       <div class="row">
                                          <div class="col s6">
                                             <div class="vertical-text">диапазон, мм</div>
                                          </div>
                                          <div class="col s6">
                                             <input
                                                v-model="stage.range_from"
                                                class="value"
                                                type="number"
                                                placeholder="Введите"/>
                                             <div class="for"></div>
                                             <input
                                                v-model="stage.range_to"
                                                class="value"
                                                type="number"
                                                placeholder="Введите"/>
                                          </div>
                                       </div>
                                       <div class="row">
                                          <div class="col s6">
                                             <div class="vertical-text">соотношение №%</div>
                                          </div>
                                          <div class="col s6">
                                             <input
                                                v-model="stage.relation"
                                                class="value full-w"
                                                type="number"
                                                placeholder="Введите значение"/>
                                          </div>
                                       </div>
                                       <div class="row">
                                          <div class="col s6">
                                             <div class="vertical-text">перерасход</div>
                                          </div>
                                          <div class="col s6">
                                             <input
                                                v-model="stage.overrun"
                                                class="value full-w"
                                                type="number"
                                                placeholder="Введите значение"/>
                                          </div>
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
         <div class="input-field">
            <button
               v-show="!loading"
               v-if="!empty_response"
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
         posts: [],
         empty_response: true,
         show_additional_material: false,
         masterTypeOfWorks: [],
         accordion: null,
         s_unitOfMeasurement: [],
         subAccordion: [],
         postAccordion: []
      }),
      created() {
         try {
            this.$store.dispatch('waitToken', this.getLocationTypesOfWorks)
         } catch (e) {
            console.log(e)
         }
      },
      methods: {
         // получить посты для технологии
         getPosts(item, category_id) {

            if (!item.classList.contains('loaded')) {
               console.log(this.posts);
               // фильтруем посты
               let filtered_posts = this.posts.filter(post => post.category_id === category_id)
               console.log(filtered_posts);

               let post_wrapper = document.createElement('ul')

               //если есть посты в группе - добавить
               if (filtered_posts.length > 0) {
                  filtered_posts.forEach(post => {
                     let post_item = document.createElement('li')
                     post_item.classList.add('post-link')
                     post_item.setAttribute('post-id', post.post_id)
                     post_item.addEventListener('click', this.openPost)
                     post_item.innerText = post.post_title
                     post_wrapper.append(post_item)
                  })
               } else {
                  let post_item = document.createElement('li')
                  post_item.innerText = 'Статьи отсутствуют'
                  post_wrapper.append(post_item)
               }
               item.nextElementSibling.querySelector('.post-list-wrap').append(post_wrapper)

               // console.dir()
               console.log(category_id)
               item.classList.add('loaded')
            }
         },
         // открыть пост
         openPost(item) {
            // получить id поста
            let post_id = item.target.getAttribute('post-id')
            //берем родителя
            let parentNode = item.target.parentNode.parentNode
            // скрыть список постов
            parentNode.classList.add('hide')
            console.dir(parentNode);
            //отфильтровать общий массив постов и добавить содержимое статьи
            let post = this.posts.filter(post => post.post_id === post_id)
            parentNode.nextElementSibling.querySelector('.post-content').innerHTML = post[0].post_content
            // показать содержимое статьи
            parentNode.nextElementSibling.classList.remove('hide')
         },
         // закрыть пост
         closePost(item) {
            // очистка контейнера со статьей
            item.nextSibling.innerHTML = ''
            let parentNode = item.parentNode
            // спрятать контейнер со статьей , показать контейнер с названиями
            parentNode.classList.add('hide')
            parentNode.previousSibling.classList.remove('hide')
            // console.log(item);
            // parentNode.classList.add(hide)
         },
         // клик по кнопке добавить фотографию
         addPhoto(target) {
            target.classList.add('clicked')
            // кликнуть по рядом стоящему input type=file
            target.previousElementSibling.click()
         },
         // покзаать дополнительные поля
         showCalculation(item) {
            item.classList.toggle('show')
         },
         // получаем данные с сервера
         async getLocationTypesOfWorks() {
            this.masterTypeOfWorks = []

            await this.$http.get('wp/v2/object-information/location-measurement-input', {
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
                  // получить все посты
                  this.posts = response.posts

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
                                    photo_id: item.photo_id,
                                    description: item.description,
                                    unit_of_measurement: item.unit_of_measurement,
                                    master_price: item.master_price,
                                    min_money_from_master: item.min_money_from_master,
                                    factionalism: item.factionalism,
                                    range_from: item.range_from,
                                    range_to: item.range_to,
                                    relation: item.relation,
                                    overrun: item.overrun
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

                        if (this.$refs.postAccordion) {
                           for (i = 0; i < this.$refs.postAccordion.length; i++) {
                              this.postAccordion[i] = M.Collapsible.init(this.$refs.postAccordion[i], {accordion: false});
                           }
                        }

                        if (this.$refs.s_unitOfMeasurement) {
                           for (i = 0; i < this.$refs.s_unitOfMeasurement.length; i++) {
                              this.s_unitOfMeasurement[i] = M.FormSelect.init(this.$refs.s_unitOfMeasurement[i], {});
                           }
                        }

                        this.loading = false;
                        // console.log(this.subAccordion);
                     }, 200)
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
                                    work_scope: item.work_scope,
                                    photo_id: item.photo_id,
                                    description: item.description,
                                    min_money_from_master: item.min_money_from_master,
                                    factionalism: item.factionalism,
                                    range_from: item.range_from,
                                    range_to: item.range_to,
                                    relation: item.relation,
                                    overrun: item.overrun
                                 })
                              }
                           )
                        }
                     )
                  }
               )

               console.log(this.formData);
               // Отправка формы
               await this.$http.post('wp/v2/object-information/location-measurement-input', this.formData)
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

               this.$store.commit('clearMessage');
               this.$store.commit('clearError');

               // подготовка массива с файлами
               let fileData = new FormData()
               let form_file_inputs = document.querySelectorAll('input[type=file]')
               form_file_inputs.forEach(item => {
                  // console.dir(item);
                  // если есть файл, добавить
                  if (item.files.length > 0) {
                     fileData.append("locations_data_id[]", item.getAttribute('locations_data_id'));
                     // Файл, выбранный пользователем
                     fileData.append("user_file[]", item.files[0]);
                  }
               })

               console.log(form_file_inputs);

               // если имеются файлы - отправить
               if (fileData.has('user_file[]')) {
                  await this.$http.post('wp/v2/object-information/location-measurement-input-file', fileData)
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
               }

            } catch (e) {
               console.log('catch Location-measurement-input.vue');
               this.$error('Ошибка');
               console.log(e);
            }
            this.$store.commit('clearMessage');
            this.$store.commit('clearError');

            try {
               this.loading = true
               this.getLocationTypesOfWorks()
            } catch (e) {
               console.log(e)
            }
         }
      },
      mounted() {
         console.log('Location-measurement-input.vue');
         this.$store.commit('change_headerNav', {
            text: `Объект ${this.$store.state.objectInfo.object_name}, локация ${this.$store.state.objectInfo.location_name}`,
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

         if (this.postAccordion && this.postAccordion.length > 0) {
            for (let i = 0; i < this.postAccordion.length; i++) {
               this.postAccordion[i].destroy();
            }
         }
         if (this.s_unitOfMeasurement && this.s_unitOfMeasurement.length > 0) {
            for (let i = 0; i < this.s_unitOfMeasurement.length; i++) {
               this.s_unitOfMeasurement[i].destroy();
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
      font-size: 26px;
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
         }

         .value {
            width: 20%;

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
            width: 6.7%;
            padding-left: 10px;
         }

         .auction-info-wrap {
            background-color: #fff;
            border-right: none;

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

   .post-accordion {
      border: none;

      &-header {
         margin: 5px 0;
         border: none;
         height: 30px;
         padding: 0 0 0 1rem;
         line-height: 30px;
         background-color: #FDCD56;
         position: relative;
         justify-content: center;
      }

      &-body {
         padding: 10px 10px 20px 10px;
         border: none;
         background-color: #fffac8;
      }

      .wrap {
         position: relative;

         &:after {
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

         &.active:after {
            top: 11px;
            transform: rotate(-225deg);
         }
      }

      .post-content {
         background-color: #fffac8;
      }

      .btn-back {
         width: 32px;
         height: 32px;
         line-height: 32px;
         color: #000;
         font-size: 20px;
         text-align: center;
         background-color: #FDCD56;
      }

   }

   /*.auction-accordion{*/
   /*   &-header {*/
   /*      background-color: #9ED26A;*/
   /*   }*/
   /*   &-body{*/
   /*      background-color: #e2f9cc;*/
   /*   }*/
   /*}*/

</style>
<style lang="scss">
   .loc-mea-inp.sub-accordion-item .item-wrap > .select-wrapper {
      display: inline-block;
      width: 45%;

      input {
         height: 3rem;
      }

   }

   .post-link {
      margin-bottom: 10px;
      cursor: pointer;
      text-decoration: underline;
   }
</style>