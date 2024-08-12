import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons'; 
import 'ant-design-vue/dist/reset.css';
import Antd from 'ant-design-vue';
import i18n from './i18n';
import store from './store';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

library.add(fas, far);
const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router); 
app.use(Antd);
app.use(i18n);
app.use(store);
app.use(VueSweetalert2);

app.mount('#app')
