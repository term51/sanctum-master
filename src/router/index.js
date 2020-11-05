import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
// import store from '../store'

Vue.use(VueRouter);

const routes = [
   {
      path: '/',
      name: 'home',
      // meta: {layout: 'main'}, // Задать свойства роута
      component: Home
   },

   //РЕДИРЕКТ НА 404
   {
      //Для всех остальных страниц, что не зареганы тут перекидываем на компонент ErrorCmp
      path: '*',
      name: 'error404',
      component: () => import('../views/Error404.vue')
   },
   // ### Страницы: ###
   // #Профиль и настройки
   {
      path: '/profile-and-settings',
      name: 'profile-and-settings',
      component: () => import('../views/profile-and-settings/Profile-and-settings.vue')
   },
   // --личные данные
   {
      path: '/profile-and-settings/personal-data',
      name: 'personal-data',
      component: () => import('../views/profile-and-settings/personal-data/Personal-data.vue')
   },
   // --виды работ
   {
      path: '/profile-and-settings/type-of-work',
      name: 'type-of-work',
      component: () => import('../views/profile-and-settings/type-of-work/Type-of-work.vue')
   },
   // ----Добавление новой технологии
   {
      path: '/profile-and-settings/type-of-work/add-new-technology',
      name: 'add-new-technology',
      component: () => import('../views/profile-and-settings/type-of-work/Add-new-technology.vue')
   },
   // --ценовая политика
   {
      path: '/profile-and-settings/price-policy',
      name: 'price-policy',
      component: () => import('../views/profile-and-settings/price-policy/Price-policy.vue')
   },
   // ----Редактировать ценовую политику
   {
      path: '/profile-and-settings/price-policy/edit-policy/:id',
      name: 'edit-policy',
      component: () => import('../views/profile-and-settings/price-policy/Edit-policy.vue')
   },
   // ----Добавить ценовую политику
   {
      path: '/profile-and-settings/price-policy/add-policy',
      name: 'add-policy',
      component: () => import('../views/profile-and-settings/price-policy/Add-policy.vue')
   },
   // --Используемые материалы
   {
      path: '/profile-and-settings/used-materials',
      name: 'used-materials',
      component: () => import('../views/profile-and-settings/used-materials/Used-materials.vue')
   },
   // ----Добавить политику используемых материалов
   {
      path: '/profile-and-settings/used-materials/add-used-materials',
      name: 'add-used-materials',
      component: () => import('../views/profile-and-settings/used-materials/Add-used-materials.vue')
   },
   // ----Редактировать политику используемых материалов
   {
      path: '/profile-and-settings/used-materials/edit-used-materials/:id',
      name: 'edit-used-materials',
      component: () => import('../views/profile-and-settings/used-materials/Edit-used-materials.vue')
   },
   // --конструктор калькуляторов - список
   {
      path: '/profile-and-settings/calculators-constructor-list',
      name: 'calculators-constructor-list',
      component: () => import('../views/profile-and-settings/calculators-constructor/Calculators-constructor-list.vue')
   },
   // ----создать калькулятор
   {
      path: '/profile-and-settings/calculators-constructor-list/create-calculator/:master_stage_id&:material_id',
      name: 'create-calculator',
      component: () => import('../views/profile-and-settings/calculators-constructor/Create-calculator.vue')
   },
   // ----открыть калькулятор
   {
      path: '/profile-and-settings/calculators-constructor-list/edit-calculator/:calculator_id',
      name: 'edit-calculator',
      component: () => import('../views/profile-and-settings/calculators-constructor/Edit-calculator.vue')
   },
   // ----проверить калькулятор
   {
      path: '/profile-and-settings/calculators-constructor-list/calculator/:calculator_id',
      name: 'calculator',
      component: () => import('../views/profile-and-settings/calculators-constructor/Calculator.vue')
   },
   // -- Поставщики
   {
      path: '/profile-and-settings/suppliers-list',
      name: 'suppliers-list',
      component: () => import('../views/profile-and-settings/suppliers/Suppliers-list.vue')
   },
   // ---- Создать поставщика
   {
      path: '/profile-and-settings/create-supplier/',
      name: 'create-supplier',
      component: () => import('../views/profile-and-settings/suppliers/Create-supplier.vue')
   },
   // ---- Редактировать поставщика
   {
      path: '/profile-and-settings/edit-supplier/:supplier_id',
      name: 'edit-supplier',
      component: () => import('../views/profile-and-settings/suppliers/Edit-supplier.vue')
   },

   // #Создать объект
   {
      path: '/create-an-object',
      name: 'create-an-object',
      component: () => import('../views/create-an-object/Create-an-object.vue')
   },

   // #В работе
   {
      path: '/in-work',
      name: 'in-work',
      component: () => import('../views/in-work/In-work.vue')
   },
   // --Информация по объекту
   {
      path: '/in-work/object-information/:id',
      name: 'object-information',
      component: () => import('../views/in-work/object-information/Object-information.vue')
   },
   // ----Локации объекта
   {
      path: '/in-work/object-information/:id/locations',
      name: 'object-locations',
      component: () => import('../views/in-work/object-information/locations/Object-locations.vue')
   },
   // ----Локация: вид работ
   {
      path: '/in-work/object-information/:id/locations/:location_id/location-type-of-work',
      name: 'location-type-of-work',
      component: () => import('../views/in-work/object-information/locations/Location-type-of-work.vue')
   },
   // ----Локация: ценовая политика
   {
      path: '/in-work/object-information/:id/locations/:location_id/location-price-policy',
      name: 'location-price-policy',
      component: () => import('../views/in-work/object-information/locations/Location-price-policy.vue')
   },
   // ----Локация: ввод замеров
   {
      path: '/in-work/object-information/:id/locations/:location_id/location-measurement-input',
      name: 'location-measurement-input',
      component: () => import('../views/in-work/object-information/locations/Location-measurement-input.vue'),
      // children: [
      //    {
      //       path: '/in-work/object-information/locations/location-measurement-input/:category_id',
      //       name: 'location-category-posts',
      //       component: () => import('../views/in-work/object-information/locations/Location-category-posts.vue')
      //    }
      // ]
   },


   // ----Сопроводительная документация
   {
      path: '/in-work/object-information/:id/accompanying-documentation',
      name: 'accompanying-documentation',
      component: () => import('../views/in-work/object-information/accompanying-documentation/Accompanying-documentation.vue')
   },
   // ----Сопроводительная документация, объект в работе
   {
      path: '/in-work/object-information/:id/accompanying-documentation-in-work',
      name: 'accompanying-documentation-in-work',
      component: () => import('../views/in-work/object-information/accompanying-documentation/Accompanying-documentation-in-work.vue')
   },
   //---- -- Дополнительная документация
   {
      path: '/in-work/object-information/:id/accompanying-documentation-in-work/additional-documentation',
      name: 'additional-documentation',
      component: () => import('../views/in-work/object-information/accompanying-documentation/additional-documentation/Additional-documentation.vue')
   },
   //---- -- -- Акт выполненных работ
   {
      path: '/in-work/object-information/:id/accompanying-documentation-in-work/additional-documentation/act-of-completed-work',
      name: 'act-of-completed-work',
      component: () => import('../views/in-work/object-information/accompanying-documentation/additional-documentation/Act-of-completed-work.vue')
   },
   //---- -- -- --АВР локация, ввод выполненной работы
   {
      path: '/in-work/object-information/:id/accompanying-documentation-in-work/additional-documentation/act-of-completed-work/:location_id',
      name: 'act-of-completed-work-location',
      component: () => import('../views/in-work/object-information/accompanying-documentation/additional-documentation/Act-of-completed-work-location.vue')
   },
   //---- -- -- Акт освидетельствования скрытых работ
   {
      path: '/in-work/object-information/:id/accompanying-documentation-in-work/additional-documentation/act-of-inspection-of-hidden-works',
      name: 'act-of-inspection-of-hidden-works',
      component: () => import('../views/in-work/object-information/accompanying-documentation/additional-documentation/Act-of-inspection-of-hidden-works.vue')
   },
   //---- -- -- --АОСР локация, ввод выполненной работы
   {
      path: '/in-work/object-information/:id/accompanying-documentation-in-work/additional-documentation/act-of-inspection-of-hidden-works/:location_id',
      name: 'act-of-inspection-of-hidden-works-location',
      component: () => import('../views/in-work/object-information/accompanying-documentation/additional-documentation/Act-of-inspection-of-hidden-works-location.vue')
   },
   //---- -- -- Дополнительное соглашение
   {
      path: '/in-work/object-information/:id/accompanying-documentation-in-work/additional-documentation/additional-agreement',
      name: 'additional-agreement',
      component: () => import('../views/in-work/object-information/accompanying-documentation/additional-documentation/Additional-agreement.vue')
   },


   // ------Список доставок по объекту
   {
      path: '/in-work/object-information/:id/accompanying-documentation-in-work/delivery-of-building-materials',
      name: 'delivery-of-building-materials',
      component: () => import('../views/in-work/object-information/accompanying-documentation/delivery/Delivery-of-building-materials.vue')
   },
   // --------Новая доставка строй материалов
   {
      path: '/in-work/object-information/:id/accompanying-documentation-in-work/delivery-request',
      name: 'delivery-request',
      component: () => import('../views/in-work/object-information/accompanying-documentation/delivery/Delivery-request.vue')
   },
   // --------Список матриалов по выбранной доставке
   {
      path: '/in-work/object-information/:id/accompanying-documentation-in-work/delivery-materials-list/:delivery_id',
      name: 'delivery-materials-list',
      component: () => import('../views/in-work/object-information/accompanying-documentation/delivery/Delivery-materials-list.vue')
   },


   // ------ознакомительная смета
   {
      path: '/in-work/object-information/:id/familiarized-estimate',
      name: 'familiarized-estimate',
      component: () => import('../views/in-work/object-information/locations/Location-measurement-input.vue')
   },


   // #История объектов
   {
      path: '/history',
      name: 'history',
      component: () => import('../views/history/History.vue')
   },
   //--общая статистика
   {
      path: '/history/general-statistics-of-objects',
      name: 'general-statistics-of-objects',
      component: () => import('../views/history/General-statistics-of-objects.vue')
   },
   //--все объекты
   {
      path: '/history/objects',
      name: 'objects',
      component: () => import('../views/history/Objects.vue')
   },
   //----открытый объект
   {
      path: '/history/object/:id',
      name: 'object',
      component: () => import('../views/history/Object.vue')
   },


   // #Новости и предложения
   {
      path: '/news',
      name: 'news',
      component: () => import('../views/news/News.vue')
   },
   // --открытая статья
   {
      path: '/news/post/:id',
      name: 'post',
      component: () => import('../views/news/Post.vue')
   },


   // #Статистика
   {
      path: '/statistics',
      name: 'statistics',
      component: () => import('../views/statistics/Statistics.vue')
   },


   // #Аукцион
   {
      path: '/auction',
      name: 'auction',
      component: () => import('../views/auction/Auction.vue')
   },
   // --Список выигрышных ставок
   {
      path: '/auction/winning-bid-list',
      name: 'winning-bid-list',
      component: () => import('../views/auction/winning-bids/Winning-bid-list.vue')
   },
   // ---- Страница победившего мастера
   {
      path: '/auction/winner-profile/:master_id&:object_id',
      name: 'winner-profile',
      component: () => import('../views/auction/winning-bids/Winner-profile.vue')
   },
   // --Список объектов доступных для торгов
   {
      path: '/auction/available-objects-list',
      name: 'available-objects-list',
      component: () => import('../views/auction/available-objects/Available-objects-list.vue')
   },
   // -- Список заключенных договоров
   {
      path: '/auction/contracts-concluded-list',
      name: 'contracts-concluded-list',
      component: () => import('../views/auction/contracts/Contracts-concluded-list.vue')
   },
   // ---- Договор с мастером
   {
      path: '/auction/contract-concluded/:contract_id',
      name: 'contract-concluded',
      component: () => import('../views/auction/contracts/Contract-concluded.vue')
   },
   // // ---- -- Дополнительная документация
   // {
   //    path: '/auction/contract-concluded/:contract_id/additional-documentation',
   //    name: 'auction-additional-documentation',
   //    component: () => import('../views/auction/contracts/additional-documentation/Additional-documentation.vue')
   // },
   // ---- ---- Акты выполненных работ
   {
      path: '/auction/contract-concluded/:contract_id/additional-documentation/acts-of-completed-work',
      name: 'auction-act-of-completed-work',
      component: () => import('../views/auction/contracts/additional-documentation/Act-of-completed-work.vue')
   },
   // ---- ---- -- Создать акт выполненных работ
   {
      path: '/auction/contract-concluded/:contract_id/additional-documentation/acts-of-completed-work/create',
      name: 'auction-create-act-of-completed-work',
      component: () => import('../views/auction/contracts/additional-documentation/Create-act-of-completed-work.vue')
   },
   // //---- -- -- -- АВР локация, ввод выполненной работы
   // {
   //    path: '/auction/contract-concluded/:id/additional-documentation/act-of-completed-work/:location_id',
   //    name: 'auction-act-of-completed-work-location',
   //    component: () => import('../views/auction/contracts/additional-documentation/Act-of-completed-work-location.vue')
   // },
   // //---- -- -- Акт освидетельствования скрытых работ мастером
   // {
   //    path: '/auction/contract-concluded/:id/additional-documentation/act-of-inspection-of-hidden-works',
   //    name: 'auction-act-of-inspection-of-hidden-works',
   //    component: () => import('../views/auction/contracts/additional-documentation/Act-of-inspection-of-hidden-works.vue')
   // },
   // //---- -- -- -- АОСР локация, ввод выполненной работы мастером
   // {
   //    path: '/auction/contract-concluded/:id/additional-documentation/act-of-inspection-of-hidden-works/:location_id',
   //    name: 'auction-act-of-inspection-of-hidden-works-location',
   //    component: () => import('../views/auction/contracts/additional-documentation/Act-of-inspection-of-hidden-works-location.vue')
   // },
   //---- -- -- Дополнительное соглашение c мастером
   {
      path: '/auction/contract-concluded/:contract_id/additional-documentation/additional-agreement',
      name: 'auction-additional-agreement',
      component: () => import('../views/auction/contracts/additional-documentation/Additional-agreement.vue')
   },



   // ----Общая информация об объекте
   // {
   //    path: '/auction/object-information/:id',
   //    name: 'object-information',
   //    component: () => import('../views/auction/available-objects/Object-information.vue')
   // }
];

const router = new VueRouter({
   mode: 'history',
   base: process.env.BASE_URL,
   routes
});

export default router
