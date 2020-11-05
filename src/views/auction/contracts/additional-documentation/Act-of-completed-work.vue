<template>
   <div class="col s12 offset-m2 m8 offset-xl3 xl6">

      <h2 class="title">Список актов</h2>
      <Loader size="big" v-show="loading"/>

      <section class="s-acts" v-show="!loading">
         <p v-show="acts.length > 0" class="center">Выберите действие</p>
         <table class="highlight">
            <thead>
            <tr>
               <th>№ акта</th>
               <th>Название</th>
               <th>Дата</th>
               <th>Действие</th>
            </tr>
            </thead>

            <tbody>
            <tr v-show="acts.length > 0"
                v-for="(act,index) in acts"
                :key="index">
               <td>{{act.id}}</td>
               <td>{{act.act_type ==='1' ? 'Акт выполненных работ':'Акт освидетельствования скрытых работ'}}</td>
               <td>{{act.datetime}}</td>
               <td>
                  <button
                     @click="downloadAct(act.id, act.act_type)"
                     class="btn-download">
                     <img src="@/img/download.svg" title="Скачать">
                  </button>
                  <button
                     @click="deleteAct(act.id)"
                     class="btn-delete"
                     :style="'background-color:'+ $store.state.accentColors.red"
                     title="Удалить">X
                  </button>
               </td>
            </tr>
            <tr v-show="acts.length === 0">
               <td style="padding: 10px; text-align: center" colspan="4">Данных нет</td>
            </tr>
            </tbody>
         </table>
         <h2 class="title"></h2>

         <div class="input-field">
            <router-link
               tag="button"
               :to="`/auction/contract-concluded/${$route.params.contract_id}/additional-documentation/acts-of-completed-work/create`"
               class="btn btn-standard btn-large light-green lighten-1 waves-effect waves-light">
               Создать акт (кнопка для мастера)
            </router-link>
         </div>

      </section>
   </div>
</template>

<script>

   export default {
      name: "act-of-completed-work",
      data: () => ({
         loading: true,
         acts: [],
      }),
      created() {
         try {
            this.$store.dispatch('waitToken', this.getActs)
         } catch (e) {
            console.log(e)
         }
      },
      methods: {
         async getActs() {
            this.acts = []

            await this.$http.get('wp/v2/in-work/object-information/act-of-completed-work', {
               params: {
                  contract_id: this.$route.params.contract_id
               }
            })
               .then(response => response.json())
               .then(response => {
                  console.log('in', response)
                  this.acts = response
                  this.loading = false
               })
               .catch(function (e) {
                  throw e;
               })
         },
         downloadAct(act_id, act_type) {
            this.$message('Скачивается акт выполненных работ');
            location.href = `${this.$http.options.root}/wp/v2/document/download-act-of-work-master?act_id=${act_id}&act_type=${act_type}`;
         },
         async deleteAct(act_id) {
            if (confirm('Точно удалить?')) {
               this.loading = true
               await this.$http.delete('wp/v2/in-work/object-information/act-of-completed-work', {
                  params: {
                     act_id
                  }
               })
                  .then(response => {
                     return response.json();
                  })
                  .then(response => {
                     this.getActs()
                     this.$store.commit('setMessage', response.message)
                  })
                  .catch(function (error) {
                     console.log(error);
                     throw  error;
                  });
               this.$store.commit('clearMessage')
               this.$store.commit('clearError')
            }
         }
      },
      mounted() {
         console.log('auction/Act-of-completed-work.vue');
         this.$store.commit('change_headerNav', {
            text: 'Создание акта',
            colorNav: 'red',
            colorHome: 'black',
            colorText: 'black'
         });
      }
   }
</script>

<style lang="scss" scoped>
   .warn {
      color: #ff2626;
      font-size: 26px;
      text-align: center;
   }

   table {
      thead {
         background-color: #E4E8EB;

         th {
            border-radius: 0;
            text-align: center;
         }
      }

      tr {
         cursor: pointer;
      }

      td {
         font-size: 14px;

         button {
            vertical-align: middle;
            margin-right: 15px;

            &:last-child {
               margin-right: 0;
            }
         }

         &:last-child {
            text-align: center;
         }
      }

      td:last-child {
         padding: 0;
      }
   }

   .btn-download {
      position: relative;
      border: none;
      color: #000000;
      cursor: pointer;
      line-height: 0;
      height: 30px;
      width: 30px;
      background-color: transparent;

      &:hover {
         background-color: rgba(0, 0, 0, 0.1);
      }

      img {
         padding: 5px;
         position: absolute;
         top: 0px;
         left: 0px;
         width: 100%;
         height: 100%;

      }
   }

   @media screen and (max-width: 370px) {
      th, td {
         padding: 5px 1px;
      }
   }

</style>