import Home from '@/views/home/index.vue'
const routes = [
  {
    path: '/',
    component: Home,
    name: 'home',
  },
  { path: '/login', component: import('@/views/login/index.vue'), name: 'login' },
  { path: '/404', component: import('@/views/404/index.vue'), name: '404' },
  // { path: '/:pathMatch(.*)*', redirect: '/404', name: 'Home' },
]
export default routes
