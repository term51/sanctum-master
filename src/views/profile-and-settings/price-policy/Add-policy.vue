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
                     <li class="sub-accordion-item wrap active" v-for="(subType, subIndex) in type.data"
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
                                 <div class="item-wrap price-wrap">
                                    <input class="price" type="number" v-model="stage.price"
                                           placeholder="Введите цену этапа в рублях"/>
                                    <div class="for">за</div>
                                    <select ref="s_unitOfMeasurement" v-model="stage.unitOfMeasurement">
                                       <option value="m2">M<sup>2</sup></option>
                                       <option value="m3">M<sup>3</sup></option>
                                    </select>
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
            <input
               v-show="!loading"
               id="name"
               type="text"
               v-model.trim="name"
               :class="{invalid: ($v.name.$dirty && !$v.name.required)}"
               class="validate">
            <label for="name" v-show="!loading">Введите название ценовой категории</label>
            <small
               class="helper-text invalid"
               v-if="$v.name.$dirty && !$v.name.required"
            >Обязательное поле</small>
            <!--            <small-->
            <!--               class="helper-text invalid"-->
            <!--               v-if="checkFormPrice"-->
            <!--            >В разделе имеются не заполненные поля с ценой</small>-->
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
   import {required} from "vuelidate/lib/validators";

   import M from "materialize-css/dist/js/materialize.min";

   export default {
      name: "add-policy",
      data: () => ({
         loading: true,
         masterTypeOfWorks: [],
         accordion: null,
         s_unitOfMeasurement: [],
         subAccordion: [],
         formData: {},
         name: ''
         // checkFormPrice: false
      }),
      validations: {
         name: {required}
      },
      created() {
         // Получить все виды работ
         try {
            this.$store.dispatch('waitToken', this.getTypesOfWorks)
         } catch (e) {
            console.log(e);
         }
      },
      methods: {
         // получаем данные с сервера
         async getTypesOfWorks() {
            await this.$http.get('wp/v2/users/price-policy/add-policy', {
               params: {user_id: this.$store.state.auth.userId}
            })
               .then(response => {
                  return response.json();
               })
               .then(response => {
                  console.log(response.masterTypeOfWorks);
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
                  // формирование объекта для формы
                  // 1й этап вложенности
                  _typeOfWork.forEach((typeId, type_Index) => {
                     // Добавление вида работ
                     this.masterTypeOfWorks.push({
                        title: getNameByKey(response.masterTypeOfWorks, 'type_name', typeId),
                        data: []
                     })
                     true_technology_index = -1
                     // 2й этап
                     _technologyName.forEach((technologyId) => {
                        if (response.masterTypeOfWorks.filter(item => item.type_id === typeId && item.technology_id === technologyId).length !== 0) {
                           true_technology_index++
                           // добавление технологии
                           this.masterTypeOfWorks[type_Index].data.push({
                              subTitle: getNameByKey(response.masterTypeOfWorks, 'technology_name', technologyId),
                              subData: []
                           })
                        }
                        // 3й этап
                        response.masterTypeOfWorks.forEach((item) => {
                           if (item.type_id === typeId && item.technology_id === technologyId) {
                              // Добавление этапа
                              this.masterTypeOfWorks[type_Index].data[true_technology_index].subData.push({
                                 master_stage_id: item.master_stage_id,
                                 stage_name: item.stage_name,
                                 price: '',
                                 unitOfMeasurement: 'm2'
                              })

                           }
                        })
                     })
                  })

                  console.log('formData', this.masterTypeOfWorks)

                  setTimeout(() => {
                     // Инициализация аккордионов
                     this.accordion = M.Collapsible.init(this.$refs.accordion, {accordion: false});
                     // console.dir(this.$refs);
                     if (this.$refs.subAccordion) {
                        for (let i = 0; i < this.$refs.subAccordion.length; i++) {
                           this.subAccordion[i] = M.Collapsible.init(this.$refs.subAccordion[i], {accordion: false});
                        }
                     }
                     if (this.$refs.s_unitOfMeasurement) {
                        for (let i = 0; i < this.$refs.s_unitOfMeasurement.length; i++) {
                           this.s_unitOfMeasurement[i] = M.FormSelect.init(this.$refs.s_unitOfMeasurement[i], {});
                        }
                     }

                     this.loading = false;
                  }, 100)

               })
               .catch(function (error) {
                  console.log(error);
                  // this.$store.dispatch('setError', error.data.code);
                  // this.$store.getters.error
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
                     pricing_policy_title: this.name,
                     pricing_policy_variant: 0,
                     masters_technology_data: []
                  }
               // this.checkFormPrice = false
               this.masterTypeOfWorks.forEach(
                  (typeOfWorks) => {
                     typeOfWorks.data.forEach(
                        (technologyOfWorks) => {
                           technologyOfWorks.subData.forEach(
                              (item) => {
                                 // if (item.price === '') {
                                 //    this.checkFormPrice = true
                                 // } else {
                                 this.formData.masters_technology_data.push({
                                    masters_technology_of_work_id: item.master_stage_id,
                                    unit_of_measurement: item.unitOfMeasurement,
                                    price: item.price
                                 })
                                 // }
                              }
                           )
                        }
                     )
                  }
               )
               // Валидация полей с ценой
               // if (this.checkFormPrice) {
               //    return
               // }
               console.log(this.formData);
               // Отправка формы
               await this.$http.post('wp/v2/users/price-policy/add-policy', this.formData)
                  .then((response) => {
                     return response.json()
                  })
                  .then((response) => {
                     this.$router.push({path: '/profile-and-settings/price-policy', query: {message: response.message}})
                  })
                  .catch(function (error) {
                     this.$store.commit('setError', error.data.code);
                     throw  error;
                  })

            } catch (e) {
               console.log('catch Edit-policy.vue');
               this.$error('Ошибка');
               console.log(e);
            }
         }
      },
      mounted() {

         console.log('Add-policy.vue');
         this.$store.commit('change_headerNav', {
            text: 'Новая ценовая категория',
            colorNav: 'blue',
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

            .price {
               width: 60%;
               text-indent: 15px;
               height: 3rem;
               font-size: 14px;
            }

            .for {
               display: inline-block;
               width: 10%;
               padding-left: 10px;
            }
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