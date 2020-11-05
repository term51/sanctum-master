// Фильтры это обычные функции
export default function dateFilter(value, format = 'date') {
   // Опции даты https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   const options = {};
   // Если строка включает символы
   if (format.includes('date')) {
      options.day = '2-digit';
      options.month = '2-digit';
      options.year = 'numeric';
   }
   if (format.includes('time')) {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.second = '2-digit';
   }
   //возвращаем дату в нужном формате
   return new Intl.DateTimeFormat('ru-RU', options).format(new Date(value));
}