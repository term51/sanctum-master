import M from 'materialize-css/dist/js/materialize.min';

export default {
   install(Vue) {
      // Создаем системную переменную $message для более удобного вывода всплывающих сообщений toasts из materialize
      Vue.prototype.$message = function (html) {
         // M.toast({html, options});
         M.toast({html: `${html}`});
      };
      Vue.prototype.$error = function (html) {
         M.toast({html: `${html}`, classes: 'error'});
      };
      // console.log('toast добавить options ' + options);
   }
}