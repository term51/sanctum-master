<template>
   <div class="app-loader">
      <div class="preloader-wrapper active" :class="size">
         <div class="spinner-layer spinner-blue">
            <div class="circle-clipper left">
               <div class="circle"></div>
            </div>
            <div class="gap-patch">
               <div class="circle"></div>
            </div>
            <div class="circle-clipper right">
               <div class="circle"></div>
            </div>
         </div>

         <div class="spinner-layer spinner-red">
            <div class="circle-clipper left">
               <div class="circle"></div>
            </div>
            <div class="gap-patch">
               <div class="circle"></div>
            </div>
            <div class="circle-clipper right">
               <div class="circle"></div>
            </div>
         </div>

         <div class="spinner-layer spinner-yellow">
            <div class="circle-clipper left">
               <div class="circle"></div>
            </div>
            <div class="gap-patch">
               <div class="circle"></div>
            </div>
            <div class="circle-clipper right">
               <div class="circle"></div>
            </div>
         </div>

         <div class="spinner-layer spinner-green">
            <div class="circle-clipper left">
               <div class="circle"></div>
            </div>
            <div class="gap-patch">
               <div class="circle"></div>
            </div>
            <div class="circle-clipper right">
               <div class="circle"></div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
   export default {
      name: "loader",
      props: {
         size: String
      }
   }
</script>

<style scoped>
   .app-loader {
      text-align: center;
      margin: 30px 0;
   }
</style>