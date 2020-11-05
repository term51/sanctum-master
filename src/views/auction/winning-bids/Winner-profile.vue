<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <Loader size="big" v-if="loading"/>

      <form v-show="!loading" @submit.prevent="submitHandler">

         <h2 class="title">Данные мастера</h2>
         <div class="input-field">
            <input
               id="full_name"
               type="text"
               :value="master_full_name"
               disabled>
            <label for="full_name" class="active">ФИО мастера</label>
         </div>
         <div class="input-field">
            <input
               id="phone"
               type="text"
               :value="master_phone"
               disabled>
            <label for="phone" class="active">Телефон мастера</label>
         </div>
         <div class="input-field">
            <input
               id="email"
               type="text"
               :value="master_email"
               disabled>
            <label for="email" class="active">Email</label>
         </div>

         <h2 class="title">Оговорки по договору</h2>
         <div class="input-field">
            <input
               id="contract_number"
               type="text"
               v-model.trim="contract_number"
               :class="{invalid: ($v.contract_number.$dirty && !$v.contract_number.required)}">
            <label for="contract_number" :class="{active:(contract_number)}">Номер договора</label>
            <small
               class="helper-text invalid"
               v-if="$v.contract_number.$dirty && !$v.contract_number.required"
            >Обязательное поле</small>
         </div>
         <div class="input-field">
            <input
               id="contract_date"
               v-on:change="setContractDate"
               type="text"
               ref="contractDateFromInput"
               class="datepicker">
            <label for="contract_date" :class="{active:(contract_date)}">Дата составления</label>
            <small
               class="helper-text invalid"
               v-if="$v.contract_date.$dirty && !$v.contract_date.required"
            >Обязательное поле</small>
         </div>
         <div class="input-field">
            <input
               id="contract_amount_estimate"
               type="text"
               v-model.trim="contract_amount_estimate"
               :class="{invalid: ($v.contract_amount_estimate.$dirty && !$v.contract_amount_estimate.required)}">
            <label for="contract_amount_estimate" :class="{active:(contract_amount_estimate)}">Сумма в смете</label>
            <small
               class="helper-text invalid"
               v-if="$v.contract_amount_estimate.$dirty && !$v.contract_amount_estimate.required"
            >Обязательное поле</small>
         </div>
         <div class="input-field">
            <input
               id="contract_percentage_prepaid_amount"
               type="text"
               v-model.trim="contract_percentage_prepaid_amount"
               :class="{invalid: ($v.contract_percentage_prepaid_amount.$dirty && !$v.contract_percentage_prepaid_amount.required)}">
            <label for="contract_percentage_prepaid_amount" :class="{active:(contract_percentage_prepaid_amount)}">%
               аванса от суммы</label>
            <small
               class="helper-text invalid"
               v-if="$v.contract_percentage_prepaid_amount.$dirty && !$v.contract_percentage_prepaid_amount.required"
            >Обязательное поле</small>
         </div>

         <h2 class="title">Срок выполнения работ по договору</h2>
         <div class="input-field">
            <input
               id="contract_date_start"
               v-on:change="setDateStart"
               ref="dateStartFromInput"
               type="text"
               class="datepicker">
            <label for="contract_date_start" :class="{active: (contract_date_start)}">Начало работ</label>
            <small
               class="helper-text invalid"
               v-if="$v.contract_date_start.$dirty && !$v.contract_date_start.required"
            >Обязательное поле</small>
         </div>

         <div class="input-field">
            <input
               id="contract_date_deadline"
               v-on:change="setDateDeadLine"
               ref="dateDeadlineFromInput"
               type="text"
               class="datepicker">
            <label for="contract_date_deadline" :class="{active: (contract_date_deadline)}">Окончание работ</label>
            <small
               class="helper-text invalid"
               v-if="$v.contract_date_deadline.$dirty && !$v.contract_date_deadline.required"
            >Обязательное поле</small>
         </div>


         <h2 class="title">Сроки АВР и срок гарантии на выполненные работы</h2>

         <div class="input-field">
            <input
               id="days_for_submitting_ACW"
               type="number"
               v-model.trim="days_for_submitting_ACW"
               :class="{invalid: ($v.days_for_submitting_ACW.$dirty && !$v.days_for_submitting_ACW.required)}">
            <label for="days_for_submitting_ACW" :class="{active:(days_for_submitting_ACW)}">Срок предъявления
               АВР</label>
            <small
               class="helper-text invalid"
               v-if="$v.days_for_submitting_ACW.$dirty && !$v.days_for_submitting_ACW.required"
            >Обязательное поле</small>
         </div>
         <div class="input-field">
            <input
               id="days_for_warranty"
               type="number"
               v-model.trim="days_for_warranty"
               :class="{invalid: ($v.days_for_warranty.$dirty && !$v.days_for_warranty.required)}">
            <label for="days_for_warranty" :class="{active:(days_for_warranty)}">Гарантия на срок</label>
            <small
               class="helper-text invalid"
               v-if="$v.days_for_warranty.$dirty && !$v.days_for_warranty.required"
            >Обязательное поле</small>
         </div>

         <h2 class="title">Выберите какие работы поручить мастеру</h2>
         <p v-if="!workAvailable" class="info">Список работ пуст</p>
         <ul v-show="!loading" ref="accordion" class="main-accordion collapsible expandable">
            <li v-for="(location, index) of masterWinningBids" :key="index" class="active main-accordion-item">
               <div class="collapsible-header main-accordion-header">{{location.location_title}}</div>
               <div class="collapsible-body main-accordion-body">
                  <ul class="sub-accordion collapsible expandable ">
                     <li class="sub-accordion-item wrap" v-for="(technology,technologyIndex) of location.technologies" :key="technologyIndex"
                         :data-location="technology.location_id"
                         :data-technology="technology.technology_id"
                         data-item>
                        <label class="type-checkbox">
                           <input :checked="technology.technology_selected" type="checkbox"/><span></span>
                        </label>
                        <div class="collapsible-header sub-accordion-header">{{technology.technology_title}}</div>
                     </li>
                  </ul>
               </div>
            </li>
         </ul>


<!--         <div v-if="workAvailable" class="input-field">-->
<!--            <button @click.prevent="downloadFamiliarizedEstimate"-->
<!--                    class="btn btn-dark waves-effect waves-light">-->
<!--               Ознакомительная смета-->
<!--            </button>-->
<!--         </div>-->


<!--         <div class="input-field">-->
<!--            <button @click.prevent="downloadAccompanyingDocumentation"-->
<!--                    class="btn btn-dark waves-effect waves-light">-->
<!--               Сопроводительная документация-->
<!--            </button>-->
<!--         </div>-->


<!--         <div class="input-field">-->
<!--            <router-link-->
<!--               class="btn  btn-dark waves-effect waves-light"-->
<!--               tag="button"-->
<!--               :to="`/in-work/object-information/${$route.params.id}/accompanying-documentation-in-work/additional-documentation`">-->
<!--               Дополнительная документация-->
<!--            </router-link>-->
<!--         </div>-->

         <div class="input-field">
            <button
               v-show="!loading"
               class="btn btn-standard btn-large light-green lighten-1 waves-effect waves-light"
               title="Снять выбранные технологии с аукциона"
               type="submit">
               {{ workAvailable ? 'Заключить договор' : 'Обновить договор' }}
            </button>
         </div>
      </form>
   </div>
</template>

<script>
   import M from "materialize-css/dist/js/materialize.min";
   import {required} from "vuelidate/lib/validators";

   export default {
      name: "winner-profile",
      data: () => ({
         loading: true,
         workAvailable: true,
         masterWinningBids: [],
         accordion: null,
         contractTechnologyOfWorkIds: [],
         // selectedTechnologyIds: [],
         master_full_name: '',
         master_phone: '',
         master_email: '',
         // оговорки по договору
         contract_number: '', //Номер договора
         contract_date: '',// Дата составления договора
         contract_amount_estimate: '',// Сумма в смете
         contract_percentage_prepaid_amount: '',// % аванса от суммы

         // срок выполнения работ по договору
         contract_date_start: '', // Начало работ
         contract_date_deadline: '', // Окончание работ
         //инициализация датапикеров
         contractDateFromInput: null, // Дата составления договора
         dateStartFromInput: null, // Начало работ
         dateDeadlineFromInput: null, // окончание работ

         //Сроки АВР и срок гарантии на выполненные работы
         days_for_submitting_ACW: '', // дней для предъявления АВР
         days_for_warranty: '' // дней на гарантию
      }),
      // правила валидации создаются как объекты с названием моделей из data. Внутрь объектов помещаются подлюченные выше правила валидации
      validations: {
         contract_number: {required}, //Номер договора
         contract_date: {required},// Дата составления договора
         contract_amount_estimate: {required},// Сумма в смете
         contract_percentage_prepaid_amount: {required},// % аванса от суммы

         // срок выполнения работ по договору
         contract_date_start: {required}, // Начало работ
         contract_date_deadline: {required},

         //Сроки АВР и срок гарантии на выполненные работы
         days_for_submitting_ACW: {required}, // дней для предъявления АВР
         days_for_warranty: {required} // дней на гарантию
      },
      created() {
         try {
            this.$store.dispatch('waitToken', this.getContractInfo)
         } catch (e) {
            console.log(e)
         }
      },
      methods: {
         // задаются данные из datapickers
         setContractDate() {
            this.contract_date = this.contractDateFromInput.el.value;
         },
         setDateStart() {
            this.contract_date_start = this.dateStartFromInput.el.value;
         },
         setDateDeadLine() {
            this.contract_date_deadline = this.dateDeadlineFromInput.el.value;
         },
         //Скачать ознакомительную смету
         // downloadFamiliarizedEstimate() {
         //
         //    let selected_technologies = []
         //    this.getCheckedInputs(selected_technologies)
         //    // console.log(selected_technologies);
         //    if (selected_technologies.length > 0) {
         //       this.$message('Скачивается ознокомительная смета')
         //       // запрос на скачивание сметы
         //       location.href = `${this.$http.options.root}/wp/v2/document/download-familiarized-estimate-with-master?user_id=${this.$store.state.auth.userId}&object_id=${this.$route.params.object_id}&master_id=${this.$route.params.master_id}&works=${encodeURIComponent(JSON.stringify(selected_technologies))}`;
         //    } else {
         //       this.$error('Не выбраны работы для мастера')
         //    }
         //
         // },
         //Скачать сопроводительную документацию
         // downloadAccompanyingDocumentation() {
         //    this.$message('Скачивается сопроводительная документация');
         // },
         // получить id выбранных технологий (принимается массив для заполнения)
         getCheckedInputs(array) {
            //Проходим по всем этапам работ
            document.querySelectorAll('.sub-accordion-item[data-item]').forEach((element) => {
               if (element.querySelector('input[type=checkbox]').checked) {
                  // формируем массив с выбранными id
                  array.push({location_id: element.dataset.location, technology_id: element.dataset.technology})
               }
            });
            return array
         },
         async getContractInfo() {
            this.masterWinningBids = []

            await this.$http.get('wp/v2/auction/winner-profile', {
               params: {
                  user_id: this.$store.state.auth.userId,
                  master_id: this.$route.params.master_id,
                  object_id: this.$route.params.object_id
               }
            })
               .then(response => {
                  return response.json();
               })
               .then(response => {
                  this.master_full_name = response.masterInfo.full_name
                  this.master_phone = response.masterInfo.phone_number
                  this.master_email = response.masterInfo.email

                  // оговорки по договору
                  if (response.contractWithMaster) {
                     this.contract_number = response.contractWithMaster?.contract_number
                     this.contract_date = response.contractWithMaster?.contract_date
                     this.contractDateFromInput.el.value = response.contractWithMaster?.contract_date
                     this.contract_amount_estimate = response.contractWithMaster?.contract_amount_estimate
                     this.contract_percentage_prepaid_amount = response.contractWithMaster?.contract_percentage_prepaid_amount
                     // срок выполнения работ по договору
                     this.contract_date_start = response.contractWithMaster?.contract_date_start
                     this.dateStartFromInput.el.value = response.contractWithMaster?.contract_date_start
                     this.contract_date_deadline = response.contractWithMaster?.contract_date_deadline
                     this.dateDeadlineFromInput.el.value = response.contractWithMaster?.contract_date_deadline

                     this.days_for_submitting_ACW = response.contractWithMaster?.days_for_submitting_ACW
                     this.days_for_warranty = response.contractWithMaster?.days_for_warranty
                  }
                  // удаление проигрышных ставок
                  response.masterWinningBids = response.masterWinningBids.filter(item => parseFloat(item.sum_master_income) >= parseFloat(item.sum_min_money_from_master))
                  console.log('after filter', response)
                  // массив id технологий на которые уже заключен договор
                  // this.masterTechnologyOfWorkIds = response.master_technology_of_work_ids


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

                  // Если список работ для объекта пуст
                  if (response.masterWinningBids.length !== 0) {

                     // Создание нового массива с уникальными видами работ type_name
                     let _location_ids = [...new Set(response.masterWinningBids.map(item => item.location_id))];
                     let _technology_ids = [...new Set(response.masterWinningBids.map(item => item.technology_id))]


                     // let true_technology_index // индекс для технологии
                     // let true_stage_index // индекс для этапа работ
                     // формирование объекта для формы
                     // 1й этап
                     _location_ids.forEach((locationId, locationIndex) => {
                        // Добавление вида работ
                        this.masterWinningBids.push({
                           location_title: getNameByKey(response.masterWinningBids, 'location_name', locationId),
                           technologies: []
                        })
                        // true_technology_index = -1
                        // 2й этап
                        _technology_ids.forEach((technologyId) => {
                           if (response.masterWinningBids.filter(item => item.location_id === locationId && item.technology_id === technologyId).length !== 0) {
                              // true_technology_index++
                              // добавление технологии
                              this.masterWinningBids[locationIndex].technologies.push({
                                 technology_title: getNameByKey(response.masterWinningBids, 'technology_name', technologyId),
                                 location_id: locationId,
                                 technology_id: technologyId,
                                 technology_selected: (response.contractTechnologyOfWorkIds.filter(filter => (filter.technology_of_work_id === technologyId &&
                                    filter.location_id === locationId)).length > 0)
                              })
                           }

                        })
                     })

                     console.log('formData', this.masterWinningBids)
                  } else {

                     this.workAvailable = false
                  }
                  setTimeout(() => {
                     // Инициализация аккордионов
                     this.accordion = M.Collapsible.init(this.$refs.accordion, {accordion: false});

                     this.loading = false;
                  }, 100)


               })
               .catch(function (error) {
                  console.log(error);

                  this.$store.commit('setError', error.data.code);
                  throw  error;
               });
            this.$store.commit('clearMessage');
            this.$store.commit('clearError');
         },
         // Функция сохранения договора
         async submitHandler() {

            if (this.$v.$invalid) {   // Если форма не валидна
               this.$v.$touch();   //	Sets the $dirty flag of the model and all its children to true recursively.
               return  // отмена
            }

            let selected_technologies = []
            // если не выбраны работы и работы для выбора имеются
            this.getCheckedInputs(selected_technologies)
            if (selected_technologies.length === 0 && this.workAvailable) {
               this.$error('Не выбраны работы для мастера')
               return  // отмена
            }


            const formData = {
               user_id: this.$store.state.auth.userId,
               master_id: this.$route.params.master_id,
               object_id: this.$route.params.object_id,

               // оговорки по договору
               contract_number: this.contract_number,
               contract_date: this.contract_date,
               contract_amount_estimate: this.contract_amount_estimate,
               contract_percentage_prepaid_amount: this.contract_percentage_prepaid_amount,
               // срок выполнения работ по договору
               contract_date_start: this.contract_date_start,
               contract_date_deadline: this.contract_date_deadline,

               days_for_submitting_ACW: this.days_for_submitting_ACW,
               days_for_warranty: this.days_for_warranty,
               selectedTechnologyIds: []
            }

            this.selectedTechnologyIds = []
            try {

               // получить id выбранных технологий (отправляется массив для заполнения)
               this.getCheckedInputs(formData.selectedTechnologyIds)

               console.log('formData', formData)

               // Отправка выбранных id на сервер
               await this.$http.post('wp/v2/auction/winner-profile', formData)
                  .then(response => {
                     //Получаем всё содержимое, все хедеры, статус и тд...
                     return response.json();
                  })
                  .then(response => {
                     this.$store.commit('setMessage', response.message);
                  })
                  .catch(function (error) {
                     this.$store.commit('setError', error.data.code);
                     throw  error;
                  });


            } catch (e) {
               console.log('catch Type-of-work.vue');
               this.$error('Ошибка');
               console.log(e);
            }
            this.$store.commit('clearMessage');
            this.$store.commit('clearError');

            try {
               this.loading = true
               this.getContractInfo()
            } catch (e) {
               console.log(e)
            }

         }
      },
      mounted() {
         this.contractDateFromInput = M.Datepicker.init(this.$refs.contractDateFromInput, this.$store.state.datePicker.datePickerOptions);
         this.dateStartFromInput = M.Datepicker.init(this.$refs.dateStartFromInput, this.$store.state.datePicker.datePickerOptions);
         this.dateDeadlineFromInput = M.Datepicker.init(this.$refs.dateDeadlineFromInput, this.$store.state.datePicker.datePickerOptions);


         console.log('Winner-profile.vue');
         this.$store.commit('change_headerNav', {
            showBack: true,
            showHome: true,
            text: 'Работа с мастером',
            colorNav: 'lightBlue',
            colorHome: 'black',
            colorText: 'black'
         });
      },
      beforeDestroy() {
         // Проверка на существование переменной
         if (this.accordion && this.accordion.destroy) {
            this.accordion.destroy();
         }

         if (this.contractDateFromInput && this.contractDateFromInput.destroy) {
            this.contractDateFromInput.destroy();
         }
         if (this.dateStartFromInput && this.dateStartFromInput.destroy) {
            this.dateStartFromInput.destroy();
         }
         if (this.dateDeadlineFromInput && this.dateDeadlineFromInput.destroy) {
            this.dateDeadlineFromInput.destroy();
         }
      }
   }
</script>

<style lang="scss" scoped>

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
         padding: 0 10px 0 70px;
         line-height: 30px;
         background-color: #E4E8EB;
      }

      &-body {
         padding: 0 0 0 15px;
         border: none;
      }

      &-item {
         position: relative;
         margin: 5px 0;

         /*
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
                  */

         &.wrap.active:after {
            top: 11px;
            transform: rotate(-225deg);
         }

         .span {
            height: 30px;
            line-height: 30px;
            width: 100%;

         }

         .label {
            width: 100%;
         }

         .item-wrap {
            background-color: #E4E8EB;
            white-space: nowrap;
            border-right: 5px solid #e4e8eb;
            /*overflow: hidden;*/
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
         }
      }
   }

   p.info {
      text-align: center;
   }

   [type="checkbox"]:not(:checked) + span:not(.lever):before {
      background-color: #fff;
   }

   [type="checkbox"]:checked + span:not(.lever):before {
      background-color: transparent;
      border-right: 3px solid #9ED26A;
      border-bottom: 3px solid #9ED26A;
   }

   .type-checkbox {
      position: absolute;
      top: 3px;
      left: 15px;
   }

   .btn {

      img {
         vertical-align: middle;
         margin-right: 10px;
      }
   }

</style>