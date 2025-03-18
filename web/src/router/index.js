import { createRouter, createWebHistory } from 'vue-router'
import BabyfootHome from '@/views/BabyfootHome.vue'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import axios from "axios"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: BabyfootHome,
      
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    
  ],
})

// meta: { requiresAuth: true }

router.beforeEach(async (to, from, next) => {

  async function isTokenValid(token) {
  
    try {
      let api_url=import.meta.env.VITE_API_URL
      const response = await axios.get(`${api_url}/auth/valid`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // If status is 200, return true
      if (response.status === 200) {
        return true;
      }
      
      return false;  // In case the status isn't 200 for some reason
    } catch (error) {
      // If an error occurs, return false (token invalid or other issue)
      return false;
    }
  }
  
  const isLoggedIn = !!localStorage.getItem('token'); // Replace with actual auth logic
  let token=localStorage.getItem('token')
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let isValid=await isTokenValid(token)
    if (!isLoggedIn || !isValid ) {
      next('/login'); // 🚫 Redirect to login if not authenticated
    } else {
      next(); // ✅ Allow access
    }
  } else {
    next(); // ✅ Allow access to public routes
  }
});

export default router
