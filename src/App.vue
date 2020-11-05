<template>
    <div id="app">
        <!-- component проверяет функцию переданную в :is= из computed и тогда этот тег заменится на переданную строку -->
        <component :is="layout">
            <router-view/>
        </component>
    </div>
</template>

<script>
    import EmptyLayout from "./layouts/EmptyLayout";
    // import MainLayout from "./layouts/MainLayout";
    //определить какой лейаут рендерить
    export default {
        computed: {
            // будем возвращать строку с название лейаута (получим из index.js meta )
            layout() {
                //Если значение layout не определено выдаем empty
                return (this.$route.meta.layout || 'empty') + '-layout';
            }
        },
        components: {
            EmptyLayout,
            // MainLayout
        }
    }
</script>

<style lang="scss">
    * {
        box-shadow: none !important;
    }
    .helper-text.invalid {
        color: #f44336
    }

    @import "~materialize-css/dist/css/materialize.min.css";

    /*@import "assets/css/index.css";*/
</style>
