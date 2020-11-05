<template>
   <div class="btn-wrap col s12 offset-m2 m8 offset-xl2 xl8">
      <h2 class="title"></h2>
      <Loader size="big" v-if="loading"/>
      <section class="s-statistics" v-else>
         <div class="info-wrap">
            <div class="info-text">Общий денежный оборот</div>
            <div class="info-amount">{{statistics.total_cash_flow}} ₽</div>
         </div>

         <h2 class="title">Соотношение выполненных работ</h2>

         <apexchart type="donut" :options="donutChartOptions" :series="donutSeries"></apexchart>

         <h2 class="title">Прибыль</h2>
         <div class="info-wrap">
            <div class="info-text">Доход с работы мастеров</div>
            <div class="info-amount">{{statistics.auction_profit}} ₽</div>
         </div>

         <h2 class="title">Расходы</h2>
         <div class="info-wrap">
            <div class="info-text">Оплата работы мастеров</div>
            <div class="info-amount">{{statistics.masters_cost}} ₽</div>
         </div>
      </section>
   </div>
</template>

<script>
   // Локально подключаем компонент с графиками
   import Vue from "vue";
   import VueApexCharts from "vue-apexcharts";

   Vue.use(VueApexCharts); // графики
   Vue.component('apexchart', VueApexCharts);

   export default {
      name: "general-statics-of-objects",
      data: () => ({
         loading: true,

         statistics: {},
         // ----- график пончик
         donutSeries: [],
         donutLabels: [],
         donutChartOptions: {}
      }),
      created() {
         try {
            this.$store.dispatch('waitToken', this.getStatistics)
         } catch (e) {
            console.log(e);
         }
      },
      methods: {
         async getStatistics() {

            await this.$http.get('wp/v2/history/general-statistics', {
               params: {
                  object_id: this.$route.params.id
               }
            })
               .then(response => response.json())
               .then(response => {
                  console.log('in', response)


                  this.statistics = response


                  //---------- график пончик
                  this.donutSeries = [];
                  this.donutLabels = [];

                  if (response.donut_chart.length > 0) {
                     // получить уникальные технологии работ
                     let _uniqueLabels = [...new Set(response.donut_chart.map(item => item.title))]
                     // посчитать количество технологий
                     _uniqueLabels.forEach(item => {
                        let count = 0
                        response.donut_chart.forEach(responseItem => {
                           if (item === responseItem.title) {
                              count++
                           }
                        })
                        this.donutSeries.push(count)
                        this.donutLabels.push(item)
                     })

                  }

                  this.donutChartOptions = {
                     chart: {
                        type: 'donut',
                     },
                     legend: {
                        fontSize: '16px',
                        position: 'bottom',
                        itemMargin: {
                           horizontal: 0,
                           vertical: 5
                        },
                     },
                     labels: this.donutLabels,
                     //
                     responsive: [{
                        breakpoint: 600,
                        options: {
                           chart: {
                              width: 300,
                              height: 400
                           }
                        }
                     }]
                  };

                  this.loading = false

               })
               .catch(function (e) {
                  throw e;
               })
         }
      },
      mounted() {

         console.log('General-statistics-of-objects.vue');
         this.$store.commit('change_headerNav', {
            text: 'Общая статистика',
            colorNav: 'gray',
            colorHome: 'black',
            colorText: 'black'
         });
      }
   }
</script>

<style lang="scss" scoped>
   .s-statistics {
      font-size: 14px;
   }

   .info {
      &-wrap {
         display: block;
         width: 100%;
      }

      &-text {
         display: inline-block;
         width: 50%;
      }

      &-amount {
         display: inline-block;
         width: 50%;
         padding: 5px;
         text-align: center;
         background-color: #E4E8EB;
         margin-bottom: 10px;
      }
   }
</style>

<style lang="scss">
   .apexcharts-legend-series {
      width: 100%;
      margin-bottom: 15px;
   }
</style>