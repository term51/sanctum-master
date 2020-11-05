export default function cleanHTMLFilter(value) {
   //возвращаем строку без HTML тегов
   return value.replace(/<[^>]+>|&nbsp;/g, function () {
      // if (val == '&nbsp;'){
      //    return "    ";
      // }else{
      //    return "";
      // }
      return "";
   });
}