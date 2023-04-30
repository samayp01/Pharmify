import { createRouter, createWebHistory } from 'vue-router';

// import auth from './middleware/auth';

const routeMap = [
  {
    path: '/',
    redirect: '/login'
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
  // TODO: uncomment auth code when server is ready

  // check if the route is protected and user is authenticated
  // if (!auth() && to.name !== 'login' && to.name !== 'register') {
  // if (to.name !== 'login' && to.name !== 'register') {
    // return { name: 'login' } // redirect to login
  // }
  console.log(to.name);
})

export default router;