<template>
   <div>
      <p v-for="(notification, key) in getNotification" :key="key" class="center">
         {{notification}}
      </p>
   </div>
</template>

<script>
   export default {
      name: "notification",
      data: () => ({
         // Список сообщений
         notifications: {
            'userApproved': 'Для работы с сервисом необходимо заполнить данные в профиле и посетить офис для заключения договора.'
         }
      }),
      props: {
         notificationsProps: String
      },
      computed: {
         // Получить строку и преобразовать ее в массив
         getNotification(notificationsProps) {

            let notifications = notificationsProps.$attrs.notification;
            // Проверка на существаование в списке notifications и их актуальность
            if (notifications) {
               notifications = notifications.replace(/\s/g, '').split(',');
               notifications.forEach((element, index) => {
                  // console.log(element);
                  if (element === 'userApproved')
                     if (this.$store.state.auth.userApproved)
                        notifications.splice(index, 1);
               });
               // формирование массива с актуальным notifications из data и удаление пустых элементов
               return notifications.map(element => (this.notifications[element])).filter(element => (typeof element !== 'undefined'));
            }

            return Array;
         }
      }
   }
</script>

<style scoped>

</style>