import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/layout',
      component: () => import('../views/Layout.vue'),
      redirect:"/forum/article",
      children:[
        {
          path:"/forum",
          name:"内容管理",
          children:[
            {
              name:"帖子管理",
              path:"article",
              component:()=>import('@/views/forum/ArticleList.vue'),
            },
            {
              name:"评论管理",
              path:"comment",
              component:()=>import('@/views/forum/CommentList.vue'),
            },
            {
              name:"板块管理",
              path:"board",
              component:()=>import('@/views/forum/BoardList.vue'),
            },
          ]
        },
        {
          path:"/user",
          name:"用户管理",
          children:[
            {
              name:"用户列表",
              path:"list",
              component:()=>import('@/views/user/UserList.vue'),
            },
          ]
        },
        {
          path:"/settings",
          name:"设置",
          children:[
            {
              name:"系统设置",
              path:"sys",
              component:()=>import('@/views/settings/SysSettings.vue'),
            },
          ]
        },
      ]
    },
  ]
})

export default router
