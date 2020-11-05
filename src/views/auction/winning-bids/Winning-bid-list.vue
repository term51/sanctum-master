<template>
   <!-- Опасно менять верстку в разделе  "формировани аккордиона для статей" (зависимости в JS) -->
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <Loader size="big" v-if="loading"/>
      <h2 class="title" v-show="!loading">{{ winningBids.length > 0 ? 'Выберите победителя' : 'Ставок нет' }}</h2>

      <div class="input-field" v-show="!loading">
         <button
            data-target="modal1"
            class="modal-trigger btn btn-dark waves-effect waves-light"
            title="Снять выбранные технологии с аукциона"
         >Выбрать портфолио
         </button>
      </div>

      <!-- Modal Structure -->
      <div ref="modal" id="modal1" class="modal">
         <div class="modal-content">
            <h2 class="title">Выберите кандидатов</h2>

            <table class="highlight">
               <thead>
               <tr>
                  <th>Выбрать</th>
                  <th>ФИО</th>
                  <th>Ссылка на портфолио</th>
               </tr>
               </thead>
               <tbody>
               <tr v-for="(master, index) in masters_portfolio" :key="index">
                  <td>
                     <label class="label">
                        <input
                           v-model="master.selected"
                           type="checkbox"/>
                        <span class="span"></span>
                     </label>
                  </td>
                  <td>{{master.full_name}}</td>
                  <td>{{master.portfolio_link}}</td>
               </tr>
               </tbody>
            </table>
            <h2 class="title"></h2>
            <button
               class="btn btn-standard btn-dark"
               @click="copyPortfolio"
            >Скопировать
            </button>
            <button
               class="btn btn-standard red accent-1"
               @click="modal.close()"
            >Отмена
            </button>
         </div>
      </div>

      <!--/////////-->

      <ul v-show="!loading" ref="accordion" class="main-accordion collapsible expandable">
         <!-- формирование аккордионов -->
         <li v-for="(object, index) in winningBids" :key="index" class="active main-accordion-item">
            <div class="collapsible-header main-accordion-header">{{object.objectTitle}}</div>
            <div class="collapsible-body main-accordion-body">
               <ul ref="subAccordion" class="sub-accordion collapsible expandable">
                  <!-- формирование локаций -->
                  <li class="sub-accordion-item wrap" v-for="(location, locationIndex) in object.locations" :key="locationIndex">
                     <div class="collapsible-header sub-accordion-header">{{location.locationTitle}}</div>
                     <div class="collapsible-body sub-accordion-body">
                        <ul ref="subAccordion" class="sub-accordion collapsible expandable accordion-technology">
                           <!-- формирование технологий -->
                           <li class="sub-accordion-item wrap" v-for="(technology, technologyIndex) in location.technologies" :key="technologyIndex">
                              <div class="collapsible-header sub-accordion-header">{{technology.technologyTitle}}</div>
                              <div class="collapsible-body sub-accordion-body">

                                 <ul ref="subAccordionTechnology" class="sub-accordion collapsible expandable">
                                    <!-- формирование этапов -->
                                    <!--  <li class="sub-accordion-item item-user" v-for="(user, userIndex) in location.users"  @click="selectWinner(user.user_id, object.object_id)" -->
                                    <router-link
                                       :to="{name: 'winner-profile',params: { master_id: user.user_id , object_id: object.object_id}}"
                                       class="sub-accordion-item item-user"
                                       v-for="(user, userIndex) in technology.users"
                                       :key="userIndex">
                                       <!-- порядковые номера и названия этапов -->
                                       <div class="item-wrap">
                                          <div class="number">{{userIndex+1}}</div>
                                          <div class="text">{{user.full_name}}</div>
                                       </div>
                                       <div class="item-wrap price-wrap">
                                          <div class="value">
                                             <label>Минимальная сумма</label>
                                             <input
                                                disabled
                                                v-model="user.sum_min_money_from_master"/>
                                          </div>
                                          <div class="for"></div>
                                          <div class="value">
                                             <label>Мастер готов дать</label>
                                             <input
                                                disabled
                                                v-model="user.sum_master_income"/>
                                          </div>
                                       </div>
                                    </router-link>
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

   </div>
</template>

<script>
   import M from "materialize-css/dist/js/materialize.min";

   export default {
      name: "winning-bid-list",
      data: () => ({
         loading: true,
         winningBids: [],
         accordion: null,
         subAccordion: [],
         subAccordionTechnology: [],
         modal: null,
         masters_portfolio: []
      }),
      created() {
         try {
            this.$store.dispatch('waitToken', this.getWinningBids)
         } catch (e) {
            console.log(e)
         }
      },
      methods: {
         // копирование в буфер
         copyPortfolio() {
            // получить выбранных мастеров
            let selected_portfolio = this.masters_portfolio.filter(item => item.selected)
            console.log('selected_portfolio', selected_portfolio);
            // переменная для буфера
            let clipboard_portfolio = ''
            // запись в переменную
            selected_portfolio.forEach((item, index) => {
               clipboard_portfolio += (index + 1) + '. ' + item.full_name + ' ' + item.portfolio_link + '\n\r'
            })
            // скопировать в буфер
            navigator.clipboard.writeText(clipboard_portfolio)
               .then(() => {
                  if (selected_portfolio.length > 0) {
                     this.$message('Скопировано')
                  } else {
                     this.$error('Выберите мастера')
                  }
               })
               .catch(err => {
                  console.log('Something went wrong', err)
                  this.$error('Ошибка копирования')
               });
         },
         async getWinningBids() {

            this.winningBids = []

            await this.$http.get('wp/v2/auction/winning-bid-list', {
               params: {
                  // user_id: this.$store.state.auth.userId
               }
            })
               .then(response => {
                  return response.json();
               })
               .then(response => {
                  console.log('in', response)

                  // удаление проигрышных ставок
                  response.allBids = response.allBids.filter(item => parseFloat(item.sum_master_income) >= parseFloat(item.sum_min_money_from_master))

                  response.allBids = response.allBids.sort((item1, item2) => {
                     return parseFloat(item2.sum_master_income) - parseFloat(item1.sum_master_income)
                  })
                  console.log('filter', response);

                  // выбрать уникальных мастеров
                  const master_ids = [...new Set(response.allBids.map(item => item.user_id))]
                  master_ids.forEach(master_id => {
                     this.masters_portfolio.push(response.allBids.find(item => item.user_id === master_id))
                  })
                  console.log(this.masters_portfolio)

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

                  // Уникальные id обектов
                  const _object_ids = [...new Set(response.allBids.map(item => item.object_id))]
                  // Уникальные id локаций
                  const _location_ids = [...new Set(response.allBids.map(item => item.location_id))]

                  // Уникальные id технологий
                  const _technology_ids = [...new Set(response.allBids.map(item => item.technology_id))]

                  let true_location_index // индекс для локации
                  let true_technology_index // индекс для технологии
                  // формирование объекта для формы
                  // #1 Объекты
                  _object_ids.forEach((object_id, object_Index) => {
                     // Добавление вида работ
                     this.winningBids.push({
                        objectTitle: getNameByKey(response.allBids, 'object_name', object_id),
                        object_id: object_id,
                        locations: []
                     })

                     true_location_index = -1
                     // #2 Локации
                     _location_ids.forEach((location_id) => {
                        if (response.allBids.filter(item => item.object_id === object_id && item.location_id === location_id).length !== 0) {
                           true_location_index++
                           // добавление технологии
                           this.winningBids[object_Index].locations.push({
                              locationTitle: getNameByKey(response.allBids, 'location_name', location_id),
                              technologies: []
                           })
                        }
                        true_technology_index = -1
                        // #3 Технологии
                        _technology_ids.forEach((technology_id) => {
                           if (response.allBids.filter(item => item.object_id === object_id && item.location_id === location_id && item.technology_id === technology_id).length !== 0) {
                              true_technology_index++
                              this.winningBids[object_Index].locations[true_location_index].technologies.push({
                                 technologyTitle: getNameByKey(response.allBids, 'technology_name', technology_id),
                                 users: []
                              })
                           }

                           // #4 Мастера
                           response.allBids.forEach((item) => {
                              if (item.object_id === object_id && item.location_id === location_id && item.technology_id === technology_id) {
                                 // Добавление мастера
                                 this.winningBids[object_Index].locations[true_location_index].technologies[true_technology_index].users.push({
                                    locations_auction_data_id: item.locations_auction_data_id,
                                    user_id: item.user_id,
                                    full_name: item.full_name,
                                    sum_master_income: item.sum_master_income,
                                    sum_min_money_from_master: item.sum_min_money_from_master
                                 })
                              }
                           })
                        })
                     })
                  })

                  console.log('finalObject', this.winningBids)

                  setTimeout(() => {

                     this.modal = M.Modal.init(this.$refs.modal, {})
                     //materialize inits
                     this.accordion = M.Collapsible.init(this.$refs.accordion, {accordion: false});
                     let i = 0;
                     if (this.$refs.subAccordion) {
                        for (i = 0; i < this.$refs.subAccordion.length; i++) {
                           this.subAccordion[i] = M.Collapsible.init(this.$refs.subAccordion[i], {accordion: false});
                        }
                     }
                     if (this.$refs.subAccordionTechnology) {
                        for (i = 0; i < this.$refs.subAccordionTechnology.length; i++) {
                           this.subAccordionTechnology[i] = M.Collapsible.init(this.$refs.subAccordionTechnology[i], {accordion: false});
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

         }
      },
      mounted() {
         console.log('Winning-bid-list.vue');
         this.$store.commit('change_headerNav', {
            showBack: true,
            showHome: true,
            text: 'Список выигрышных ставок',
            colorNav: 'lightBlue',
            colorHome: 'black',
            colorText: 'black'
         });
      },
      beforeDestroy() {
         if (this.modal) {
            this.modal.close()
         }
         // Проверка на существование переменной
         if (this.modal && this.modal.destroy) {
            this.modal.destroy();
         }
         if (this.accordion && this.accordion.destroy) {
            this.accordion.destroy();
         }
         if (this.subAccordion && this.subAccordion.length > 0) {
            for (let i = 0; i < this.subAccordion.length; i++) {
               this.subAccordion[i].destroy();
            }
         }
         if (this.subAccordionTechnology && this.subAccordionTechnology.length > 0) {
            for (let i = 0; i < this.subAccordionTechnology.length; i++) {
               this.subAccordionTechnology[i].destroy();
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

   .accordion-technology {
      margin-bottom: 20px;

      .sub-accordion-header {
         background-color: #c7c8ca;
      }

      .sub-accordion-item.wrap:after {
         border: solid #000;
         border-width: 0 0 3px 3px;
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
            cursor: pointer;
            /*overflow: hidden;*/
         }

         .item-user:hover .item-wrap:first-child {
            background-color: #a6a6a7;
            border-right: 5px solid #a6a6a7;
         }

         .value {
            width: 45%;

            display: inline-block;
            position: relative;

            input {
               height: 2rem;
               font-size: 14px;
               text-indent: 8px;
               cursor: pointer;
            }
         }

         .for {
            display: inline-block;
            width: 10%;
            padding-left: 10px;
         }


         .price-wrap {
            padding-top: 5px;
            background-color: #fff;
            border-right: none;

            label {
               cursor: pointer;
               display: block;
               white-space: normal;
               text-align: center;
               color: #000;
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

   @media only screen and (min-width: 993px) {
      .modal {
         width: 40%;
      }
   }

   @media only screen and (max-width: 992px) {
      .modal {
         width: 90%;
      }
   }
</style>