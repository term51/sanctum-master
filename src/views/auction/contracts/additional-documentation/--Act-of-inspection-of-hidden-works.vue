<template>
   <div class="col s12 offset-m2 m8 offset-xl3 xl6">

      <h2 class="title">Локации объекта {{$store.state.objectInfo.object_name}}</h2>
      <Loader size="big" v-show="loading"/>
      <h2 class="warn" v-show="!loading" v-if="empty_response">У вас нет созданных локаций</h2>
      <section class="s-locations" v-else v-show="!loading">
         <p class="center">Выберите локацию и укажите выполненные работы</p>
         <table class="highlight">
            <thead>
            <tr>
               <th>Название</th>
               <th>Ценовая категория</th>
               <th>Материалы</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(location,index) in locations"
                :key="index"
                @click="selectLocation(location.id)">
               <td>{{location.title}}</td>
               <td>{{location.technology_pricing_policy}}</td>
               <td>{{location.materials_pricing_policy}}</td>
            </tr>

            </tbody>
         </table>


         <div class="input-field">
            <button @click.prevent="downloadAct" class="btn btn-dark lighten-1 waves-effect waves-light">
               Скачать акт скрытых работ
            </button>
         </div>

         <!--         <div class="input-field">-->
         <!--            <button-->
         <!--               @click.prevent="$router.push({name:'delivery-of-building-materials'})"-->
         <!--               class="btn btn-large btn-standard red accent-1  waves-effect waves-light"-->
         <!--               type="submit">-->
         <!--               Перейти в доставку-->
         <!--            </button>-->
         <!--         </div>-->

      </section>
   </div>
</template>

<script>

   export default {
      name: "act-of-completed-work",
      data: () => ({
         empty_response: true,
         loading: true,
         locations: [],
      }),
      created() {
         try {
            this.$store.dispatch('waitToken', this.getLocations) // получить название объекта и локации
         } catch (e) {
            console.log(e)
         }
      },
      methods: {
         async getLocations() {
            this.locations = []
            // обращение тудаже, куда обращается акт выполненных работ
            await this.$http.get('wp/v2/auction/act-of-completed-work', {
               params: {
                  contract_id: this.$route.params.id
               }
            })
               .then(response => response.json())
               .then(response => {
                  console.log('in', response)
                  // если данных нет
                  if (response.length === 0) {
                     this.empty_response = true
                     this.loading = false
                  } else {
                     this.empty_response = false
                     this.locations = response
                     this.loading = false
                  }
               })
               .catch(function (e) {
                  throw e;
               })
         },
         // запомнить имя локации, по который призведен клик
         selectLocation(location_id) {
            this.$store.commit('setLocationName', location.title)
            this.$router.push(`/auction/contract-concluded/${this.$route.params.id}/additional-documentation/act-of-inspection-of-hidden-works/` + location_id)
         },
         // скачивание акта скрытых работ
         async downloadAct() {
            this.$message('Скачивается акт скрытых работ');
            location.href = `${this.$http.options.root}/wp/v2/document/download-act-of-inspection-of-hidden-works-master?contract_id=${this.$route.params.id}`
         }
      },
      mounted() {
         this.getLocations();
         console.log('auction/Act-of-inspection-of-hidden-works.vue');
         this.$store.commit('change_headerNav', {
            text: 'Создание АВР',
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
      }

      td:last-child {
         padding: 0;
      }
   }
</style>
