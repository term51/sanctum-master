<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl4 xl4">
      <Loader size="big" v-if="loading"/>
      <h2 class="title"></h2>
      <ul v-show="!loading" ref="accordion" class="main-accordion collapsible expandable">
         <li v-for="(object, index) in contractsWithMasters" :key="index" class="main-accordion-item">
            <div class="collapsible-header main-accordion-header">{{object.object_title}}</div>
            <div class="collapsible-body main-accordion-body">
               <ul class="sub-accordion expandable ">
                  <router-link
                     tag="li"
                     :to="'/auction/contract-concluded/'+contract.contract_id"
                     class="sub-accordion-item wrap"
                     v-for="(contract,contractIndex) in object.contracts"
                     :key="contractIndex">
                     <div class="collapsible-header sub-accordion-header">
                        <div class="value">
                           <label>Номер договора</label>
                           {{contract.contract_number}}
                        </div>
                        <div class="value">
                           <label>Дата заключения</label>
                           {{contract.contract_date}}
                        </div>
                     </div>
                  </router-link>
               </ul>
            </div>
         </li>
      </ul>
      <div v-if="emptyData" class="warn">Заключенных договоров не найдено</div>
   </div>
</template>

<script>
   import M from "materialize-css/dist/js/materialize.min";

   export default {
      name: "contracts-concluded-list",
      data: () => ({
         loading: true,
         contractsWithMasters: [],
         accordion: null,
         emptyData: false
      }),
      created() {
         try {
            this.$store.dispatch('waitToken', this.getContracts)
         } catch (e) {
            console.log(e)
         }
      },
      methods: {
         async getContracts() {
            this.contractsWithMasters = []
            await this.$http.get('wp/v2/auction/contracts-concluded-list')
               .then(response => {
                  return response.json();
               })
               .then(response => {

                  console.log('in', response)


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


                  if (response.length > 0) {
                     // массив id технологий на которые уже заключен договор
                     // this.masterTechnologyOfWorkIds = response.master_technology_of_work_ids


                     // Создание нового массива с уникальными id объектов
                     let _object_ids = [...new Set(response.map(item => item.object_id))];

                     // формирование объекта для формы
                     // 1й этап
                     _object_ids.forEach((objectId, objectIndex) => {
                        // Добавление объекта
                        this.contractsWithMasters.push({
                           object_title: getNameByKey(response, 'object_name', objectId),
                           contracts: []
                        })

                        // 2й этап
                        response.forEach((contract) => {
                           if (contract.object_id === objectId) {
                              // добавление договора
                              this.contractsWithMasters[objectIndex].contracts.push({
                                 contract_id: contract.contract_id,
                                 contract_number: contract.contract_number,
                                 contract_date: contract.contract_date
                              })
                           }

                        })
                     })

                     console.log('formData', this.contractsWithMasters)

                     setTimeout(() => {
                        // Инициализация аккордионов
                        this.accordion = M.Collapsible.init(this.$refs.accordion, {accordion: false});

                        this.loading = false;
                     }, 100)

                     this.emptyData = false
                  } else {
                     this.loading = false;
                     this.emptyData = true
                  }

               })
               .catch(function (error) {
                  console.log(error);

                  this.$store.commit('setError', error.data.code);
                  throw  error;
               });
            this.$store.commit('clearMessage');
            this.$store.commit('clearError');
         }
      },
      mounted() {
         console.log('Contracts-concluded-list.vue');
         this.$store.commit('change_headerNav', {
            showBack: true,
            showHome: true,
            text: 'Список заключенных договоров',
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
         justify-content: center;
      }

      &-item {

      }

      &-body {
         border: none;
         padding: 0;
      }
   }

   .sub-accordion-header {
      border: none;
      margin: 5px 0;

      padding: 0 10px;
      line-height: 30px;
      background-color: #f0f4f7;


      .value {
         width: 50%;
         display: inline-block;

         label {
            text-decoration: underline;
            color: #000000;
            display: block;
            text-align: center;
            cursor: pointer;
         }
      }

      &:hover {
         background-color: #d2d5d8;
         cursor: pointer;
      }
   }

   .warn {
      font-size: 17px;
      color: red;
      text-align: center;
   }

</style>