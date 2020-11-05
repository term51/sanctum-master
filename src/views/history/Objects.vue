<template>
   <div class="btn-wrap col s12">
      <h2 class="title"></h2>
      <Loader size="big" v-if="loading"/>
      <router-link
         v-else
         v-for="(object,index) in all_objects"
         :key="index"
         class="btn btn-medium"
         :style="'background-color:' + $store.state.accentColors.gray"
         tag="button"
         :title="object.auction_description"
         :to="'/history/object/' + object.id">{{object.object_name}}
      </router-link>
   </div>
</template>

<script>
   export default {
      name: "objects",
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
         // получить объекты
         async getObjects() {
            this.all_objects = []

            await this.$http.get('wp/v2/history/objects')
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
         console.log('Objects.vue');
         this.$store.commit('change_headerNav', {
            text: 'История объектов',
            colorNav: 'gray',
            colorHome: 'black',
            colorText: 'black'
         });
      }
   }
</script>

<style lang="scss" scoped>
   .btn {
      width: 31%;
      margin: 10px;
      color: #000000;
      text-transform: none;
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