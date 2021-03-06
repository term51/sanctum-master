// Настройки модуля дата пикер
export default {
   state: {
      datePickerOptions: {
         firstDay: 1,
         format: 'dd.mm.yyyy',
         i18n: {
            cancel: 'Отмена',
            clear: 'Очистить',
            done: 'Выбрать',
            months:
               [
                  'Январь',
                  'Февраль',
                  'Март',
                  'Апрель',
                  'Май',
                  'Июнь',
                  'Июль',
                  'Август',
                  'Сентябрь',
                  'Октябрь',
                  'Ноябрь',
                  'Декабрь'
               ],
            monthsShort:
               [
                  'Янв',
                  'Фев',
                  'Мар',
                  'Апр',
                  'Май',
                  'Июн',
                  'Июл',
                  'Авг',
                  'Сен',
                  'Окт',
                  'Ноя',
                  'Дек'
               ],
            weekdays:
               [
                  'Воскресенье',
                  'Понедельник',
                  'Вторник',
                  'Среда',
                  'Четверг',
                  'Пятница',
                  'Суббота'
               ],
            weekdaysShort:
               [
                  'Вс',
                  'Пн',
                  'Вт',
                  'Ср',
                  'Чт',
                  'Пт',
                  'Сб'
               ],
            weekdaysAbbrev: ['В', 'П', 'В', 'С', 'Ч', 'П', 'С']
         }
      },
      timePickerOptions: {
         twelveHour: false,
         i18n: {
            cancel: 'Отмена',
            clear: 'Очистить',
            done: 'Выбрать',
         }
      }
   },
   mutations: {},
   actions: {}
}