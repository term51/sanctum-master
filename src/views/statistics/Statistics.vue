<template>
   <div class="col s12">
      <section>
         <h2 class="title">Выберите период для расчета статистики</h2>
         <div class="row">
            <div class="col s6">
               <label>с</label>
               <input v-on:change="changeDate" ref="date_from" type="text" class="datepicker">
            </div>
            <div class="col s6">
               <label>по</label>
               <input v-on:change="changeDate" ref="date_to" type="text" class="datepicker">
            </div>
         </div>

         <p v-if="isVisible" class="info">Число выполненных объектов - {{ objectSum }}</p>
         <p v-else class="info">{{ statusInfo }}</p>

         <apexchart v-if="isVisible" height="350" :options="lineChartOptions" :series="lineSeries"></apexchart>

         <apexchart v-if="isVisible" class="apex-css" width="500" :options="pieChartOptions"
                    :series="pieSeries"></apexchart>

      </section>
   </div>
</template>

<script>
   import M from 'materialize-css/dist/js/materialize.min';
   // Локально подключаем компонент с графиками
   import Vue from "vue";
   import VueApexCharts from "vue-apexcharts";

   Vue.use(VueApexCharts); // графики
   Vue.component('apexchart', VueApexCharts);

   export default {
      name: "statistics",
      data: () => ({
         dateFromInput: null,
         dateToInput: null,
         statusInfo: '',
         objectSum: 0,
         chosenDateFrom: null,
         chosenDateTo: null,

         // опции для Date
         dateOptions: {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            timezone: 'UTC'
         },

         //--------------------- Графики
         isVisible: false,
         //--------------------- линейный график
         lineSeries: [],
         lineChartOptions: {},
         lineSeriesData: [],
         lineSeriesDatePeriod: [],

         // -------------------- график пирог
         pieSeries: [],
         pieLabels: [],
         pieChartOptions: {}

      }),
      methods: {
         async getData() {
            // Очищаем данные
            this.statusInfo = '';
            this.lineSeriesDatePeriod = [];
            this.lineSeriesData = [];

            await this.$http.get('wp/v2/statistics', {
               params: {
                  date_from: this.chosenDateFrom.toLocaleString('ru', this.dateOptions),
                  date_to: this.chosenDateTo.toLocaleString('ru', this.dateOptions)
               }
            })
               .then(response => response.json())
               .then(response => {
                  console.log('in', response)
                  // Подсчет суммы всех заявок в полученном массиве
                  this.objectSum = response.line_chart.reduce((acc, el) => {
                     acc += +el.applications_count
                     return acc
                  }, 0)

                  // ================== график линейный ==================
                  if (response.line_chart.length > 0) {
                     // добавить даты из БД, где были заявки
                     for (let i = 0; i < response.line_chart.length; i++) {
                        // добавить дату от, если она не совпадает с массивом дат
                        if (i === 0 && response.line_chart[i].finish_date !== this.chosenDateFrom.toLocaleString('ru', this.dateOptions)) {
                           // подсчет количества заявок на каждую дату
                           this.lineSeriesData.push(0)
                           // добавить начальную дату в ру формате
                           this.lineSeriesDatePeriod.push(this.chosenDateFrom.toLocaleString('ru', this.dateOptions))
                        }

                        this.lineSeriesData.push(response.line_chart[i].applications_count)
                        this.lineSeriesDatePeriod.push(response.line_chart[i].finish_date)
                        // если достигнут конечный элемент и дата отличается от конечной добавить конечную дату
                        if (i === (response.line_chart.length - 1) && response.line_chart[i].finish_date !== this.chosenDateTo.toLocaleString('ru', this.dateOptions)) {
                           // подсчет количества заявок на каждую дату
                           this.lineSeriesData.push(0)
                           // добавить конечную дату в ру формате
                           this.lineSeriesDatePeriod.push(this.chosenDateTo.toLocaleString('ru', this.dateOptions))
                        }
                     }
                  }


                  // Создаем массив дат для линейного графика
                  // for (let q = this.chosenDateFrom; q <= this.chosenDateTo; q.setDate(q.getDate() + 1)) {
                  //
                  //    // подсчет количества заявок на каждую дату
                  //    this.lineSeriesData.push(response.filter(item => item.finish_date === q.toLocaleString('ru', this.dateOptions)).length);
                  //    // массив дат в ру формате
                  //    this.lineSeriesDatePeriod.push(q.toLocaleString('ru', this.dateOptions));
                  // }

                  this.lineSeries = [{
                     name: "Заявки",
                     data: this.lineSeriesData
                  }];
                  // опции графиков
                  this.lineChartOptions = {
                     chart: {
                        height: 350,
                        type: 'line',
                        zoom: {
                           enabled: false
                        },
                        toolbar: {
                           show: false,
                        }
                     },
                     dataLabels: {
                        enabled: false
                     },
                     stroke: {
                        width: 7,
                        curve: 'straight'
                     },
                     grid: {
                        row: {
                           colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                           opacity: 0.5
                        },
                     },
                     markers: {
                        size: 5,
                        colors: ["#FDCD56"],
                        strokeColors: "#fff",
                        strokeWidth: 2,
                        hover: {
                           size: 7,
                        }
                     },
                     // подписи по X
                     xaxis: {
                        categories: this.lineSeriesDatePeriod,
                     }
                  };

                  // ================== график пирог ==================
                  this.pieSeries = []
                  this.pieLabels = []
                  if (response.pie_chart.length > 0) {
                     // получить уникальные технологии работ
                     let _uniqueLabels = [...new Set(response.pie_chart.map(item => item.title))]
                     // посчитать количество технологий
                     _uniqueLabels.forEach(item => {
                        let count = 0
                        response.pie_chart.forEach(responseItem => {
                           if (item === responseItem.title) {
                              count++
                           }
                        })
                        this.pieSeries.push(count)
                        this.pieLabels.push(item)
                     })

                  }
                  this.pieChartOptions = {
                     chart: {
                        type: 'pie',
                     },
                     legend: {
                        position: 'bottom'
                     },
                     labels: this.pieLabels,
                     responsive: [{
                        breakpoint: 600,
                        options: {
                           chart: {
                              width: 300
                           }
                        }
                     }]
                  };

                  this.isVisible = true;

               })
               .catch(function (e) {
                  throw e;
               })
         },
         changeDate() {
            // Если имеется дата в обоих пикерах
            if (typeof this.dateFromInput.date != 'undefined' && typeof this.dateToInput.date != 'undefined') {
               // задаем выбранные даты
               this.chosenDateFrom = new Date(this.dateFromInput.date.toDateString());
               this.chosenDateTo = new Date(this.dateToInput.date.toDateString());
               //если первая дата меньше или равна второй
               if (this.chosenDateFrom.getTime() <= this.chosenDateTo.getTime()) {
                  // получить данные для графиков

                  this.getData()
               } else {
                  this.isVisible = false;
                  this.statusInfo = 'Дата окончания должна быть больше или равна дате начала';
               }
            }
         }
      }
      ,
      mounted() {
         console.log('Statistics.vue');
         this.$store.commit('change_headerNav', {
            text: 'Статистика',
            colorNav: 'orange',
            colorHome: 'black',
            colorText: 'black'
         });

         this.dateFromInput = M.Datepicker.init(this.$refs.date_from, this.$store.state.datePicker.datePickerOptions);
         this.dateToInput = M.Datepicker.init(this.$refs.date_to, this.$store.state.datePicker.datePickerOptions);

      }
      ,
      //очищаем память
      beforeDestroy() {
         // Проверка на существование переменной
         if (this.dateFromInput && this.dateFromInput.destroy) {
            this.dateFromInput.destroy();
         }
         if (this.dateToInput && this.dateToInput.destroy) {
            this.dateToInput.destroy();
         }
         if (this.chosenDateFrom) {
            this.chosenDateFrom = null;
         }
         if (this.chosenDateTo) {
            this.chosenDateTo = null;
         }
      }
   }
</script>

<style lang="scss" scoped>

   section {
      margin-top: 50px;

      .title {
         font-weight: bold;
         margin-bottom: 30px;
      }

      label {
         margin-right: 12px;
      }

      .datepicker {
         width: 80%;
      }
   }


   @media screen and (max-width: 1100px) {

   }

</style>
<style>
   .apexcharts-canvas {
      margin: auto;
   }

   .apexcharts-canvas .apexcharts-legend-series {

   }
</style>