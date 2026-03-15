import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Page2 from '../views/Page2.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/page2',
    name: 'Page2',
    component: Page2
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router