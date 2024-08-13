import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Classes from '../views/Classes.vue';
import Students from '../views/Students.vue';

const routes = [
  { path: '/', component: Dashboard , meta: { title: 'Dashboard' }},
  { path: '/classes', component: Classes , meta: { title: 'Classes' }},
  { path: '/students/:classId', component: Students, name: 'Students' , meta: { title: 'Students' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
