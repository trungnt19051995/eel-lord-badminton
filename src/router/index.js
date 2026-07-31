import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CoupleView from '../views/CoupleView.vue'
import RulesView from '../views/RulesView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/cap-dau', name: 'couples', component: CoupleView },
    { path: '/the-le', name: 'rules', component: RulesView },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 140
      return { el: to.hash, top: headerHeight + 16, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

export default router
