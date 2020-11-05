<template>
   <div class="btn-wrap col s12">
      <h2 class="title"></h2>
      <Loader size="big" v-if="loading"/>
      <button
         v-else
         v-for="(object,index) in all_objects"
         :key="index"
         class="btn btn-medium"
         :style="'background-color:' + $store.state.accentColors.gray"
         :title="object.note"
         @click="linkObject(object.id, object.object_name)">{{object.object_name}}
      </button>
   </div>
</template>

<script>
   export default {
      name: "in-work",
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
         linkObject(object_id, object_name) {
            // запомнить имя объекта в шине
            this.$store.commit('setObjectName', object_name)
            // перейти к объекту
            this.$router.push('/in-work/object-information/' + object_id)
         },
         // получить объекты
         async getObjects() {
            this.all_objects = []

            await this.$http.get('wp/v2/in-work', {
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
         console.log('In-work.vue');
         this.$store.commit('change_headerNav', {
            text: 'В работе',
            colorNav: 'red',
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
      overflow: hidden;
      white-space: normal;
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