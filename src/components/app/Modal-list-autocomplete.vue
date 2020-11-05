<template>
   <div>
      <div class="input-field fixed">
         <input id="searchInput" type="text" v-model="searchInput" v-on:input="searchMaterial">
         <label for="searchInput">Введите название материала</label>
      </div>
      <Loader size="big" v-if="loading"/>
      <div v-show="!loading" class="collection-wrap">
         <ul class="collection">
            <li :data-json="JSON.stringify(item)"
                v-for="(item,index) in sortedData" :key="index"
                @click="selectItem"
                class="modal-close collection-item">{{item.title}} -
               {{item.price}}р. за {{item.unitOfMeasurement}}
            </li>
         </ul>
      </div>

   </div>
</template>

<script>
   //компонент с модальным окном для выбора и сортировкой по title в получаемом массиве объектов
   export default {
      name: "modal-list-autocomplete",
      data: () => ({
         loading: false,
         searchInput: '',
         sortedData: [],
         data: [],
         textInputTimeout: null
      }),
      props: {
         // data: Array,
         //Ожидаем updateMaterials от родителя как функцию
         // updateMaterials: Function
      },
      created() {

      },
      methods: {
         // поиск по полученным названиям итемов
         searchMaterial() {
            this.loading = true
            clearTimeout(this.textInputTimeout)
            this.textInputTimeout = setTimeout(() => {
               if (this.searchInput !== '') {
                  try {
                     this.getMaterials()
                  } catch (e) {
                     console.log(e)
                  }
               } else {
                  this.loading = false
               }
            }, 1200)

            // this.sortedData = this.data.filter(currentValue => this.searchSymbol(currentValue.title));
         },
         // Получить материалы
         async getMaterials() {
            try {
               this.allMaterials = []
               await this.$http.get('wp/v2/users/used-materials/get-materials', {
                  params: {
                     search_input: this.searchInput
                  }
               })
                  .then(response => response.json())
                  .then(response => {
                     // console.log('allMaterials in', response);
                     this.data = response
                     console.log('child component', this.data)
                     // При создании компонента получить данные из props
                     this.sortedData = this.data
                     this.loading = false

                  }).catch(function (e) {
                     throw  e;
                  })


            } catch (e) {
               console.log(e);
               throw  e;
            }
            this.$store.commit('clearMessage');
            this.$store.commit('clearError');
         },
         // Функция поиска по символам
         searchSymbol(title) {
            let input = this.searchInput.toLowerCase().split('');
            let incoming = title.toLowerCase();

            if (incoming.indexOf(input) !== -1) {
               return true;
            } else {
               // Функция подсчета количества символов в строке
               String.prototype.count = function (c) {
                  let result = 0, i = 0;
                  for (i; i < this.length; i++) if (this[i] === c) result++;
                  return result;
               };

               let foundPosition = 0;
               for (let i = 0; i < input.length; i++) {
                  //Если найдено совпадение по введенному символу и таких символов в общем вводе не больше чем в проверяемой строке
                  if (incoming.indexOf(input[i], foundPosition) !== -1 && this.searchInput.toLowerCase().count(input[i]) <= incoming.count(input[i])) {
                     foundPosition = incoming.indexOf(input[i], foundPosition + 1);
                  } else {
                     return false;
                  }
               }
            }
            return true;
         },
         // отправляем ответ от модального окна с id выбранного элемента
         selectItem: function (e) {
            if (typeof e.target.dataset.json !== 'undefined') this.$emit('select-item', e.target.dataset.json);
         }
      }
      // mounted() {
      //
      // }
   }
</script>

<style lang="scss" scoped>
   .collection-wrap {
      overflow-y: auto;
      max-height: 52vh;
   }

   .collection {
      border: none;
   }

   .collection-item:hover {
      cursor: pointer;
      background-color: rgba(0, 0, 0, .1);
   }
</style>