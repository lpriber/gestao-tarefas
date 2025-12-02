import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TasksView from '../views/TasksView.vue'
import ProfileView from '../views/ProfileView.vue'
import { useSessionStore } from '../stores/session'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { public: true } },
    { path: '/tasks', name: 'tasks', component: TasksView, meta: { requiresAuth: true } },
    { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
  ],
})

router.beforeEach(async (to) => {
  const session = useSessionStore()

  if (session.loading) {
    await new Promise((res) => {
      const int = setInterval(() => {
        if (!session.loading) { clearInterval(int); res(null) }
      }, 50)
    })
  }

  if (to.meta.requiresAuth && !session.user) {
    return { name: 'home' }
  }
})

export default router