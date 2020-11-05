<template>
   <div>
      <Loader size="big" v-if="loading"/>
      <div class="col s12 post-wrap" v-else>
         <p class="title" v-if="post">{{post.title.rendered}}</p>
         <!--      <div class="content" v-if="post">{{post.content.rendered}}</div>-->
         <div v-html="contentHtml" class="content"></div>
         <p class="date" v-if="post">{{post.date | date}}</p>
      </div>
   </div>

</template>

<script>
   export default {
      name: "post",
      data: () => ({
         post: null,
         loading: true
      }),
      methods: {
         renderContent(html) {

            if (typeof this.$refs.content !== "undefined")
               this.$refs.content.innerHTML = 'hy';
            console.log(html);
            console.log(this.$refs.content);
         },
         // contentHtml: function (e) {
         //
         // }
      },
      created() {
         // Получаем статью по id из параметра
         this.$http.get('wp/v2/posts/' + this.$route.params['id'])
            .then(response => {
               return response.json()
            })
            .then(post => {
               this.post = post;
               console.log(this.post);
               // показываем контент
               this.contentHtml = this.post.content.rendered;
               this.loading = false;
            })
            .catch(function (error) {
               console.log(error);
               // this.$store.commit('setError', error.data.code);
            });

      },
      mounted() {

         console.log('Post.vue');
         this.$store.commit('change_headerNav', {
            // text: '',
            colorNav: 'aquamarine',
            colorHome: 'black',
            colorText: 'black'
         });
      }

   }

</script>

<style lang="scss" scoped>
   .post-wrap {
      padding-top: 20px;
   }

   .title {
      font-weight: bold;
      font-size: 20px;
      line-height: 23px;
   }

   .content {
      font-size: 16px;
      line-height: 19px;
   }

   .date {
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
   }

</style>