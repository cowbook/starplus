import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Page2 from '../views/Page2.vue'
import Page3 from '../views/Page3.vue'
import Page4 from '../views/Page4.vue'
import Page5 from '../views/Page5.vue'
import Page6 from '../views/Page6.vue'
import Page26 from '../views/Page26.vue'

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
  },
  {
    path: '/page3',
    name: 'Page3',
    component: Page3
  },
  {
    path: '/page4',
    name: 'Page4',
    component: Page4
  },
  {
    path: '/page5',
    name: 'Page5',
    component: Page5
  },
  {
    path: '/page6',
    name: 'Page6',
    component: Page6
  },
  {
    path: '/page7',
    name: 'Page7',
    component: Page6
  },
  {
    path: '/page8',
    name: 'Page8',
    component: Page6
  },
  {
    path: '/page9',
    name: 'Page9',
    component: Page6
  },
  {
    path: '/page10',
    name: 'Page10',
    component: Page6
  },
  {
    path: '/page11',
    name: 'Page11',
    component: Page6
  },
  {
    path: '/page12',
    name: 'Page12',
    component: Page6
  },
  {
    path: '/page13',
    name: 'Page13',
    component: Page6
  },
  {
    path: '/page14',
    name: 'Page14',
    component: Page6
  },
  {
    path: '/page15',
    name: 'Page15',
    component: Page6
  },
  {
    path: '/page16',
    name: 'Page16',
    component: Page6
  },
  {
    path: '/page17',
    name: 'Page17',
    component: Page6
  },
  {
    path: '/page18',
    name: 'Page18',
    component: Page6
  },
  {
    path: '/page19',
    name: 'Page19',
    component: Page6
  },
  {
    path: '/page20',
    name: 'Page20',
    component: Page6
  },
  {
    path: '/page21',
    name: 'Page21',
    component: Page6
  },
  {
    path: '/page22',
    name: 'Page22',
    component: Page6
  },
  {
    path: '/page23',
    name: 'Page23',
    component: Page6
  },
  {
    path: '/page24',
    name: 'Page24',
    component: Page6
  },
  {
    path: '/page25',
    name: 'Page25',
    component: Page6
  },
  {
    path: '/page26',
    name: 'Page26',
    component: Page26
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router