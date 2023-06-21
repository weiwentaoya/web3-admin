import Home from '@/views/home/index.vue'
import Login from '@/views/login/index.vue'
const routes = [
  {
    path: '/',
    component: Home,
    name: 'home',
  },
  {
    path: '/login',
    component: Login,
    name: 'login',
  },
  { path: '/404', component: import('@/views/404/index.vue'), name: '404' },
  // { path: '/:pathMatch(.*)*', redirect: '/404', name: 'Home' },
]
export default routes
