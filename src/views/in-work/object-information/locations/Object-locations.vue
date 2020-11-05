<template>
   <div class="col s12 offset-m2 m8 offset-xl3 xl6">

      <h2 class="title"></h2>
      <Loader size="big" v-show="loading"/>

      <section class="s-locations" v-show="!loading">

         <table class="highlight">
            <thead>
            <tr>
               <th>Название</th>
               <th>Ценовая категория</th>
               <th>Материалы</th>
               <th></th>
            </tr>
            </thead>

            <tbody>
            <tr @click="selectLocation(location)"
                v-for="(location,index) in locations" :key="index">
               <td class="modal-trigger" data-target="modal1">{{location.title}}</td>
               <td class="modal-trigger" data-target="modal1">{{location.technology_pricing_policy}}</td>
               <td class="modal-trigger" data-target="modal1">{{location.materials_pricing_policy}}</td>
               <td>
                  <button
                     @click="deleteLocation(location.id)"
                     class="number btn-delete"
                     :style="'background-color:'+ $store.state.accentColors.red">X
                  </button>
               </td>
            </tr>

            </tbody>
         </table>

         <!-- Modal Structure -->
         <div ref="modal" id="modal1" class="modal">
            <div class="modal-content">
               <h2 class="title">Выберите действие</h2>
               <router-link
                  class="btn btn-standard btn-large btn-dark"
                  tag="button"
                  :to="`/in-work/object-information/${$route.params.id}/locations/${selectLocationsId}/location-type-of-work`">Выбрать вид
                  работ
               </router-link>

               <router-link
                  class="btn btn-standard btn-large btn-dark"
                  tag="button"
                  :to="`/in-work/object-information/${$route.params.id}/locations/${selectLocationsId}/location-price-policy`">Выбор
                  ценовой политики
               </router-link>

               <router-link
                  class="btn btn-standard btn-large btn-dark"
                  tag="button"
                  :to="`/in-work/object-information/${$route.params.id}/locations/${selectLocationsId}/location-measurement-input`">Ввод
                  замеров
               </router-link>
               <button class="btn btn-standard btn-large red accent-1"
                       @click="modal.close()">
                  Отмена
               </button>
            </div>
         </div>

         <!--/////////-->


         <h2 class="title">Новая локация</h2>

         <div class="input-field">
            <input
               id="location_title"
               type="text"
               v-model.trim="location_title"
               :class="{invalid: ($v.location_title.$dirty && !$v.location_title.required)}"
            >
            <label for="location_title">Назовите локацию</label>
            <small
               class="helper-text invalid"
               v-if="$v.location_title.$dirty && !$v.location_title.required"
            >Обязательное поле</small>
         </div>

         <div class="input-field">
            <select ref="s_priceCategory" class="">
               <option
                  v-for="(price_policy, index) in price_policy"
                  :key="index"
                  :value="price_policy.policy_id">{{price_policy.policy_title}}
               </option>
            </select>
         </div>

         <div class="input-field">
            <select ref="s_materials" class="">
               <option
                  v-for="(material,index) in materials_price_policy"
                  :key="index"
                  :value="material.policy_id">{{material.policy_title}}
               </option>
            </select>
         </div>

         <div class="input-field">
            <button @click.prevent="addLocation" class="btn btn-dark lighten-1 waves-effect waves-light">
               Добавить локацию
            </button>
         </div>

         <!--         <div class="input-field">-->
         <!--            <button-->
         <!--               @click.prevent="saveLocations"-->
         <!--               class="btn btn-large btn-save btn-standard light-green lighten-1 waves-effect waves-light"-->
         <!--               type="submit">-->
         <!--               Сохранить-->
         <!--            </button>-->
         <!--         </div>-->

      </section>
   </div>
</template>

<script>
   import {required} from 'vuelidate/lib/validators';
   import M from "materialize-css/dist/js/materialize.min";

   export default {
      name: "object-locations",
      data: () => ({
         loading: true,
         locations: [], // локации объекта
         materials_price_policy: [], // id, названия политик материалов мастера
         price_policy: [], // id, названия политик цен мастера
         location_title: '', // поле с названием новой локации
         priceCategory: null,
         materials: null,
         modal: null,
         selectLocationsId: '' // переменная для передачи id локации кнопке
      }),
      validations: {
         location_title: {required}
      },
      created() {
         try {
            // подождать получение токена
            this.$store.dispatch('waitToken', this.getLocations)  // получить название объекта и локации
            this.$store.dispatch('waitToken', this.getPolicy) // получить политики материалов и работ мастера
         } catch (e) {
            console.log(e)
         }
      },
      methods: {
         // получение всех локаций, политик работ и материалов мастера
         async getLocations() {
            this.locations = []

            await this.$http.get('wp/v2/object-information/locations', {
               params: {
                  // user_id: this.$store.state.auth.userId,
                  object_id: this.$route.params.id
               }
            })
               .then(response => response.json())
               .then(response => {
                  console.log('in', response)

                  this.locations = response.locations_of_the_objects
                  this.loading = false
               })
               .catch(function (e) {
                  throw e;
               })

            setTimeout(() => {
               this.modal = M.Modal.init(this.$refs.modal, {})
            }, 100)

         },
         async getPolicy() {
            this.materials_price_policy = []
            this.price_policy = []
            await this.$http.get('wp/v2/object-information/locations-policy', {
               params: {
                  user_id: this.$store.state.auth.userId,
                  // object_id: this.$route.params.id
               }
            })
               .then(response => response.json())
               .then(response => {
                  console.log('in policy', response)
                  this.materials_price_policy = response.materials_price_policy
                  this.price_policy = response.price_policy
               })
               .catch(function (e) {
                  throw e;
               })
            setTimeout(() => {
               this.priceCategory = M.FormSelect.init(this.$refs.s_priceCategory)
               this.materials = M.FormSelect.init(this.$refs.s_materials)

            }, 100)

         },
         // добавление новой локации в объект
         async addLocation() {
            if (this.$v.$invalid) {   // Если форма не валидна
               this.$v.$touch();   //	Sets the $dirty flag of the model and all its children to true recursively.
               return  // отмена
            }

            const formData = {
               object_id: this.$route.params.id,
               title: this.location_title,
               technology_pricing_policy_id: this.priceCategory.el.value,
               materials_pricing_policy_id: this.materials.el.value
            };

            try {
               console.log(formData);
               await this.$http.post('wp/v2/object-information/locations', formData)
                  .then(response => response.json())
                  .then(response => {

                     this.location_title = '' // очистка поля Назовите локацию
                     this.loading = true
                     this.getLocations()
                     this.$store.commit('setMessage', response.message);
                  })
                  .catch(function (e) {
                     console.log(e);
                     this.$store.commit('setError', e.data.code)
                     // this.$store.commit('setError', error.data.code);
                     throw e
                  })

            } catch (e) {
               console.log('catch Create-an-object.vue')
               // this.$error('Ошибка');
               console.log(e);
            }
            this.$store.commit('clearMessage')
            this.$store.commit('clearError')


         },
         // удаление локации
         async deleteLocation(id) {
            if (confirm('Точно удалить?')) {
               await this.$http.delete('wp/v2/object-information/locations', {
                  params: {
                     // user_id: this.$store.state.auth.userId,
                     location_id: id
                  }
               })
                  .then(response => response.json())
                  .then(response => {
                     this.loading = true
                     this.getLocations()
                     this.$store.commit('setMessage', response.message)
                  })
                  .catch(function (e) {
                     this.$store.commit('setError', e.data.code)
                     throw e
                  })
               this.$store.commit('clearMessage')
               this.$store.commit('clearError')
            }
            // this.modal.;
         },
         selectLocation(location) {
            this.selectLocationsId = location.id;
            this.$store.commit('setLocationName', location.title)
            this.$store.commit('setLocationPricePolicy', location.technology_pricing_policy_id)
            this.$store.commit('setLocationMaterialsCategory', location.materials_pricing_policy_id)
         },
         // saveLocations() {
         //    this.$message('Сохранено')
         // }
      },
      mounted() {
         console.log('Object-location.vue');
         this.$store.commit('change_headerNav', {
            text: 'Локации обекта ' + this.$store.state.objectInfo.object_name,
            colorNav: 'red',
            colorHome: 'black',
            colorText: 'black'
         });

      },
      // очищаем память
      beforeDestroy() {
         // закрытие модального окна (влияет на стили)
         if (this.modal) {
            this.modal.close()
         }
         // Проверка на существование переменной
         if (this.modal && this.modal.destroy) {
            this.modal.destroy();
         }
         if (this.priceCategory && this.priceCategory.destroy) {
            this.priceCategory.destroy();
         }
         if (this.materials && this.materials.destroy) {
            this.materials.destroy();
         }
      }
   }
</script>

<style lang="scss" scoped>
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

   .btn-dark {
      color: #ffffff !important;
   }


   .btn-save {
      margin-top: 50px;
   }

   @media only screen and (max-width: 992px) {
      .modal {
         width: 90%;
      }
   }
</style>