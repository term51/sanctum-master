<template>
   <div class="col s12">
      <Loader size="big" v-if="loading"/>
      <section class="s-posts" v-else>
         <div v-for="(post, index) of posts" :key="index" class="post-wrap">
            <p class="center">{{post.date | date}}</p>
            <div class="post-content-wrap blue-grey lighten-4">
               <div class="black-text">
                  <p class="post-title">{{post.title.rendered}}</p>
                  <p class="post-excerpt">{{post.excerpt.rendered | cleanHTML}}</p>
               </div>
               <div class="post-action center">
                  <router-link
                     tag="button"
                     class="btn grey darken-3 waves-effect waves-light"
                     :to="'/news/post/'+post.id">
                     Подробнее
                  </router-link>
               </div>
            </div>
         </div>
      </section>
   </div>
</template>

<script>
   export default {
      name: "news",
      data: () => ({
         posts: null,
         loading: true
      }),
      created() {
         // Получаем все статьи
         this.$http.get('wp/v2/posts')
            .then(response => {
               return response.json()
            })
            .then(posts => {
               // console.log(posts);
               this.posts = posts;
               this.loading = false;
            })
            .catch(function (error) {
               // console.log(error.data);
               this.$store.commit('setError', error.data.code);
            });
         this.$store.commit('clearMessage')
         this.$store.commit('clearError')
         // this.$http.get('posts').then(response => response.json().then(console.log(response.data)));

      },
      methods: {},
      mounted() {
         console.log('News.vue');
         this.$store.commit('change_headerNav', {
            text: 'Новости и предложения',
            colorNav: 'aquamarine',
            colorHome: 'black',
            colorText: 'black'
         });
      },
      // Позволяет выполнить действие перед уходом со страницы
      beforeRouteLeave(to, fromR, next) {
         // this.$store.commit('change_headerNavBackUrl', fromR.fullPath);
         console.log(fromR);
         next(true);
      }
   }
</script>

<style lang="scss" scoped>
   .s-posts {
      margin-top: 40px;

      .post-wrap {
         display: inline-block;
         width: 33.3%;
         vertical-align: top;
         overflow: hidden;

      }

      .post-content-wrap {
         margin: 0 10px 20px 10px;
         padding: 10px;
         height: 210px;

         p {
            margin: 0;
         }
      }

      .post-title {
         height: 50px;
         font-size: 16px;
         line-height: 19px;
         font-weight: 500;
      }

      .post-excerpt {
         font-size: 14px;
         line-height: 16px;
         height: 80px;
         overflow: hidden;
         white-space: pre-wrap;
      }

      .post-action {
         margin-top: 18px;
      }
   }

   button {
      background-color: #424852;
      color: #fff;
   }

   @media screen and (max-width: 1500px) {
      .s-posts {
         .post-wrap {
            width: 50%;
         }
      }
   }

   @media screen and (max-width: 1100px) {
      .s-posts {
         text-align: center;

         .post-wrap {
            width: 350px;
         }
      }
   }


   @media screen and (max-width: 760px) {
      .s-posts {
         .post-wrap {
            width: 100%;
            margin-bottom: 20px;
         }

         .post-content-wrap {
            margin: 0;
         }
      }
   }

</style>