import mainState from './index';

// фоновый шаблон
export default {
   state: {
      headerNav: { //настройки шапки в EmptyLayout.vue
         BackUrl: '/',
         HomeImgUrl: '',
         Color: '',
         TextColor: '',
         Text: '',
         ShowHome: true,
         ShowBack: true
      },
      headerNavHomeImgUrls: {
         white: '/img/home_white.png',
         black: '/img/home_black.png'
      }
   },
   mutations: {
      change_headerNav(state, navHeader) {
         state.headerNav.Text = navHeader.text; // текст
         if (navHeader.colorNav) state.headerNav.Color = mainState.state.accentColors[navHeader.colorNav]; // Цвет панели
         if (navHeader.colorHome) state.headerNav.HomeImgUrl = state.headerNavHomeImgUrls[navHeader.colorHome]; // Цвет кнопки Home
         if (navHeader.colorText) state.headerNav.TextColor = navHeader.colorText; // Цвет текста
         if (typeof navHeader.showHome != 'undefined') {
            state.headerNav.ShowHome = navHeader.showHome;  // видимость кнопки Home
         } else {
            state.headerNav.ShowHome = true;
         }
         if (typeof navHeader.showBack != 'undefined') {
            state.headerNav.ShowBack = navHeader.showBack; // видимость кнопки назад
         } else {
            state.headerNav.ShowBack = true;
         }
      }
   }
}