<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <h2 class="title" v-show="!loading">Выберите виды работ, которые вы выполняете</h2>

      <Loader size="big" v-if="loading"/>
      <form @submit.prevent="submitHandler">
         <ul v-show="!loading" ref="accordion" class="main-accordion collapsible expandable">
            <li v-for="(type, index) of typeOfWorks" :key="index" class="active main-accordion-item">
               <div class="collapsible-header main-accordion-header">{{type.title}}</div>
               <div class="collapsible-body main-accordion-body">
                  <ul ref="subAccordion" class="sub-accordion collapsible expandable ">
                     <li class="sub-accordion-item wrap" v-for="(subType,subIndex) of type.data" :key="subIndex">
                        <label class="type-checkbox">
                           <input :class="'group'+index+subIndex" @click="parentCheckboxClick" type="checkbox"/><span></span>
                        </label>
                        <div class="collapsible-header sub-accordion-header" :title="subType.subTitle">{{subType.subTitle}}</div>
                        <div class="collapsible-body sub-accordion-body">
                           <ul>
                              <li class="sub-accordion-item" :data-stage="stage.stage_id" data-item
                                  v-for="(stage, stageIndex) of subType.subData"
                                  :key="stageIndex">
                                 <label class="label">
                                    <input :class="'group'+index+subIndex" :checked="stage.stage_selected" type="checkbox"/>
                                    <span class="span">
                                    <div class="item-wrap"><div class="number">{{stageIndex+1}}</div>
                                       <div class="text" :title="(stage.stage_name.length>40) ? stage.stage_name : ''">{{stage.stage_name}}</div>
                                    </div>
                                 </span>
                                 </label>
                              </li>
                           </ul>
                        </div>
                        <button
                           @click.prevent="deleteTechnology(subType.technologyId)"
                           class="btn-delete"
                           title="Удалить технологию"
                           :style="'background-color:'+ $store.state.accentColors.red">X
                        </button>
                     </li>
                  </ul>
               </div>
            </li>
         </ul>
         <router-link
            v-show="!loading"
            class="btn btn-standard btn-large"
            tag="button"
            :style="'background-color:' + this.$store.state.accentColors.blue"
            to="/profile-and-settings/type-of-work/add-new-technology"><img src="@/img/plus_black.png">Создать
            технологию работ
         </router-link>
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
      name: "type-of-work",
      data: () => ({
         loading: true,
         typeOfWorks: [],
         masterTypeOfWorkIds: [],
         selectedStageIds: [],
         accordion: null,
         subAccordion: []
      }),
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
            console.log(this.$store.state.auth.userId);
            await this.$http.get('wp/v2/users/type-of-work', {
               params: {user_id: this.$store.state.auth.userId}
            })
               .then(response => {
                  //Получаем всё содержимое, все хедеры, статус и тд...
                  // console.log(response);
                  return response.json();
               })
               .then(response => {
                  this.masterTypeOfWorkIds = response.master_stages_of_work_ids
                  console.log('response', response)
                  // console.log(response.typeOfWorks);
                  // Создание нового массива с уникальными видами работ type_name
                  let _typeOfWork = [...new Set(response.typeOfWorks.map(item => item.type_id))];
                  let _technologyName = [...new Set(response.typeOfWorks.map(item => item.technology_id))]

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
                  let true_stage_index // индекс для этапа работ
                  // формирование объекта для формы
                  // 1й этап
                  _typeOfWork.forEach((typeId, type_Index) => {
                     // Добавление вида работ
                     this.typeOfWorks.push({
                        title: getNameByKey(response.typeOfWorks, 'type_name', typeId),
                        data: []
                     })
                     true_technology_index = -1
                     // 2й этап
                     _technologyName.forEach((technologyId) => {
                        if (response.typeOfWorks.filter(item => item.type_id === typeId && item.technology_id === technologyId).length !== 0) {
                           true_technology_index++
                           // добавление технологии
                           this.typeOfWorks[type_Index].data.push({
                              subTitle: getNameByKey(response.typeOfWorks, 'technology_name', technologyId),
                              subData: [],
                              technologyId
                           })
                        }
                        // 3й этап
                        true_stage_index = -1
                        response.typeOfWorks.forEach((item) => {
                           if (item.type_id === typeId && item.technology_id === technologyId) {
                              true_stage_index++
                              // Добавление этапа
                              this.typeOfWorks[type_Index].data[true_technology_index].subData.push({
                                 stage_id: item.stage_id,
                                 stage_name: item.stage_name
                              })
                              if (this.masterTypeOfWorkIds.filter(filter => filter.stages_of_work_id === item.stage_id).length > 0) {
                                 this.typeOfWorks[type_Index].data[true_technology_index].subData[true_stage_index].stage_selected = true
                              }
                           }
                        })
                     })
                  })

                  console.log('formData', this.typeOfWorks)

                  setTimeout(() => {
                     // Инициализация аккордионов
                     this.accordion = M.Collapsible.init(this.$refs.accordion, {accordion: false});
                     // console.dir(this.$refs);
                     if (this.$refs.subAccordion) {
                        for (let i = 0; i < this.$refs.subAccordion.length; i++) {
                           this.subAccordion[i] = M.Collapsible.init(this.$refs.subAccordion[i], {accordion: false});
                        }
                     }
                     this.loading = false;
                  }, 10)


               })
               .catch(function (error) {
                  console.log(error);
                  if (error.data.code === '[rest_api_personal_data] no_data_available') {
                     // удаляем этот роут из истории переходов
                     this.$store.commit('deleteRoute')
                     this.$router.push('/profile-and-settings/type-of-work/add-new-technology');
                  } else {
                     this.$store.commit('setError', error.data.code);
                     throw  error;
                  }

               });
            this.$store.commit('clearMessage');
            this.$store.commit('clearError');
         },

         // клик по родительскому чекбоксу
         parentCheckboxClick(item) {
            // console.log(item);
            document.querySelectorAll('.' + item.target.classList.value).forEach(element => {
               if (item.target.checked) {
                  element.checked = true;
               } else {
                  element.checked = false;
               }
            });
         },
         // Удалить технологию работ
         async deleteTechnology(technologyId) {
            if (confirm('Точно удалить?')) {
               await this.$http.delete('wp/v2/users/type-of-work/delete-technology', {
                  params: {
                     technology_id: technologyId
                  }
               })
                  .then(response => response.json())
                  .then(response => {
                     // console.log(response);
                     this.loading = true;
                     this.typeOfWorks = [];
                     this.$message(response.message);
                     this.getTypesOfWorks()
                  })
                  .catch(function (error) {
                     this.$store.commit('setError', error.data.code);
                     throw  error;
                  });
            }
         },
         // Функция сохранения
         async submitHandler() {
            this.selectedStageIds = []
            try {
               //Проходим по всем этапам работ
               document.querySelectorAll('.sub-accordion-item[data-item]').forEach((element) => {
                  if (element.querySelector('input[type=checkbox]').checked) {
                     // формируем массив с выбранными id
                     this.selectedStageIds.push(element.dataset.stage)
                  }
               });
               console.log('selectedStageIds', this.selectedStageIds)

               // Отправка выбранных id на сервер
               await this.$http.post('wp/v2/users/masters-technology-of-work', {
                  user_id: this.$store.state.auth.userId,
                  selected_stage_ids: this.selectedStageIds
               })
                  .then(response => {
                     //Получаем всё содержимое, все хедеры, статус и тд...
                     // console.log(response);
                     return response.json();
                  })
                  .then(response => {
                     // console.log(response);
                     this.$store.commit('setMessage', response.message);
                  })
                  .catch(function (error) {
                     this.$store.commit('setError', error.data.code);
                     throw  error;
                  });

               // this.$message('Сохранено');
            } catch (e) {
               console.log('catch Type-of-work.vue');
               this.$error('Ошибка');
               console.log(e);
            }


         }
      },
      mounted() {

         console.log('Type-of-work.vue');
         this.$store.commit('change_headerNav', {
            text: 'Виды работ',
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
         padding: 0 45px 0 45px;
         overflow: hidden;
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


         &.wrap:after {
            position: absolute;
            width: 10px;
            height: 10px;
            content: '';
            top: 8px;
            right: 30px;
            border: solid #4b4b4b;
            border-width: 0 0 3px 3px;
            transform: rotate(-45deg);
            transition: all .5s ease;
         }

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
      /*color: #000;*/
      /*font-size: 14px;*/
      /*text-transform: none;*/
      /*!*font-weight: bold;*!*/
      /*width: 100%;*/

      /*&-large {*/
      /*   padding: 0 5px;*/
      /*}*/

      img {
         vertical-align: middle;
         margin-right: 10px;
      }
   }

   .btn-delete {
      top: 0;
      right: 0;
      position: absolute;
   }

</style>