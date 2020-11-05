<template>
   <div class="btn-wrap col s12">
      <h2 class="title"></h2>
      <Loader size="big" v-if="loading"/>
<!--      <router-link-->
<!--         v-else-->
<!--         v-for="(object,index) in all_objects"-->
<!--         :key="index"-->
<!--         class="btn btn-medium"-->
<!--         :style="'background-color:' + $store.state.accentColors.gray"-->
<!--         tag="button"-->
<!--         :title="object.note"-->
<!--         :to="'/auction/object-information/' + object.id">{{object.object_name}}-->
<!--      </router-link>-->
      <div
         v-else
         v-for="(object,index) in all_objects"
         :key="index"
         class="btn btn-medium"
         :title="object.note"
         :style="'background-color:' + $store.state.accentColors.gray">{{object.object_name}}
      </div>
   </div>
</template>

<script>
   export default {
      name: "available-objects-list",
      data: () => ({
         loading: true,
         all_objects: []
      }),
      created() {
         try {
            // this.loading = false
            this.$store.dispatch('waitToken', this.getObjects)
         } catch (e) {
            console.log(e);
         }
      },
      methods: {
         async getObjects() {
            this.all_objects = []

            await this.$http.get('wp/v2/auction/available-objects', {
               params: {
                  user_id: this.$store.state.auth.userId
               }
            })
               .then(response => response.json())
               .then(response => {
                  console.log('in', response);
                  this.all_objects = response
                  this.loading = false
               })
               .catch(function (e) {
                  throw e;
               })
         }
      },
      mounted() {
         console.log('Available-objects-list.vue');
         this.$store.commit('change_headerNav', {
            showBack: true,
            showHome: true,
            text: 'Список объектов доступных для торгов',
            colorNav: 'lightBlue',
            colorHome: 'black',
            colorText: 'black'
         });
      },
   }
</script>

<style lang="scss" scoped>
   .btn {
      width: 31%;
      margin: 10px;
      color: #000000;
      overflow: hidden;
      white-space: normal;
      text-transform: none;
      cursor: auto;
   }

   @media screen and (max-width: 1300px) {
      .btn {
         width: 47%;
      }
   }

   @media screen and (max-width: 800px) {
      .btn {
         width: 100%;
      }
   }
</style>