const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue')
  },
  {
    path: '/principal',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/eventos', component: () => import('pages/Eventos.vue') },
      { path: '/empresas', component: () => import('pages/Empresas.vue') },
      { path: '/usuarios', component: () => import('pages/Usuarios.vue') },
      { path: '/cola', component: () => import('pages/Cola.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
