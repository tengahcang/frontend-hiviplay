import { createRouter, createWebHistory } from 'vue-router'

// 👇 Import dari project 1
import HomeView from '../views/HomeView.vue'
import Purchase from '../views/Purchase.vue'

// 👇 Import dari project 2 (Admin + User)
import OrderList from '../pages/OrderList.vue'
import AddOrder from '../pages/AddOrder.vue'
import EditOrder from '../pages/EditOrder.vue'
import LoginPage from "../pages/LoginPage.vue"
import AdminLayout from "../layouts/AdminLayout.vue"

// User Login System
import UserLogin from '../pages/UserLogin.vue'
import OTPVerification from '../pages/OTPUser.vue'
import UserPage from '../pages/User.vue'

// ======================================================
// GABUNGAN ROUTES
// ======================================================

const routes = [

  // --------------------------------------------------
  // PUBLIC WEBSITE (Home + Purchase)
  // --------------------------------------------------
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: "HiviPlay" },
  },
  {
    path: '/purchase',
    name: 'purchase',
    component: Purchase,
    meta: { title: "HiviPlay" }
  },

  // --------------------------------------------------
  // USER APP
  // --------------------------------------------------
  {
    path: '/login',
    name: 'user-login',
    component: UserLogin,
    meta: { title: "HiviPlay" },
  },
  {
    path: '/video',
    name: 'user-video',
    component: UserPage,
    meta: { title: "HiviPlay" },
  },
  {
    path: '/login/code',
    name: 'otp-verification',
    component: OTPVerification,
    meta: { title: "HiviPlay" },
  },

  // --------------------------------------------------
  // ADMIN APP
  // --------------------------------------------------
  {
    path: '/admin/login',
    name: 'login',
    component: LoginPage,
    meta: { title: "HiviPlay - Admin" },
  },

  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, title: "HiviPlay - Admin" },
    children: [
      {
        path: 'orders',
        name: 'orders',
        component: OrderList,
        meta: { title: "HiviPlay - Admin" },
      },
      {
        path: 'orders/add',
        name: 'add-order',
        component: AddOrder,
        meta: { title: "HiviPlay - Admin" },
      },
      {
        path: 'orders/edit',
        name: 'edit-order',
        component: EditOrder,
        meta: { title: "HiviPlay - Admin" },
      },
    ],
  }

];


// ======================================================
// ROUTER SETUP
// ======================================================

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// ======================================================
// MIDDLEWARE (Auth Admin)
// ======================================================

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = localStorage.getItem('userToken');

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  }
  else if (isAuthenticated && to.name === 'login') {
    next({ name: 'orders' });
  }
  else {
    next();
  }
});

// ======================================================
// AUTO SET DOCUMENT TITLE
// ======================================================

router.afterEach((to) => {
  const pageTitle = to.meta.title || "HiviPlay";
  document.title = pageTitle;
});

export default router;
