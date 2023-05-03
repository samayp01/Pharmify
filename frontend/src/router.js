import { createRouter, createWebHistory } from 'vue-router';
import auth from './middleware/auth';

const routeMap = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/LandingPage.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('./views/RegisterView.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('./views/PrescriptionsView.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('./views/forms/SettingsView.vue')
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('./views/HistoryView.vue')
  },
  {
    path: '/prescription/:prescription',
    name: 'view-prescription',
    component: () => import('./views/SinglePrescriptionView.vue'),
    props: true
  },
  {
    path: '/add/prescription',
    name: 'add-prescription',
    component: () => import('./views/forms/AddPrescriptionView.vue')
  },
  {
    path: '/manage/caretaker',
    name: 'manage-caretaker',
    component: () => import('./views/forms/ManageCaretakerView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes: routeMap
});

router.beforeEach(async (to) => {
  if (!auth() && to.name !== 'login' && to.name !== 'register') {
    return { name: 'login' } // redirect to login if not authorized
  } else if(auth() && (to.name === 'login' || to.name === 'register')) {
    return { name: 'dashboard' } // redirect to dashboard if authorized
  }
})

export default router;