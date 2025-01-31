import { createRouter, createWebHistory } from 'vue-router';
import LoginMenu from '@/components/LoginMenu.vue';
import RegisterMenu from '@/components/RegisterMenu.vue';
import DashboardMenu from '@/components/DashboardMenu.vue';
import HomePage from '@/components/HomePage.vue'; // Добавляем новый маршрут

const routes = [
  { path: '/', name: 'HomePage', component: HomePage }, // Главная страница с уникальным названием
  { path: '/login', name: 'LoginMenu', component: LoginMenu },
  { path: '/register', name: 'RegisterMenu', component: RegisterMenu },
  { path: '/dashboard', name: 'DashboardMenu', component: DashboardMenu }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;