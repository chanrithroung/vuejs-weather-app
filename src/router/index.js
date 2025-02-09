import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CityView from '@/views/CityView.vue'
import Test from '@/components/Test.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { 
        title: "Home"
      }
    },
    {
      path: '/weather/:state/:city',
      name: 'cityView',
      component: CityView,
      meta: {
        title: "Weather"
      }
    },
    {
      path: '/test',
      name: 'test',
      component: Test,
      meta: { 
        title: "Test"
      }
    },
  ],
})


router.beforeEach( (to, from, next) => {
  document.title = `${ to.params.state ? `${to.params.city}, ${to.params.state}` : to.meta.title} | The Local Weather`
  next()
})
export default router
