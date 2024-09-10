// todo 对外暴露配置路由(常量路由)

export const constantRoute = [
  {
    //登录成功以后展示数据的路由
    path: '/',
    component: () => import('@/views/home/homePage.vue'),
    name: 'homePage',
    meta: {
      title: '主页',
      hidden: true,
      icon: '',
      clicked: 'false',
    }
  },
  {
    //登录
    path: '/login',
    component: () => import('@/views/login/loginPage.vue'),
    name: 'login',  //命名路由
    meta: {
      title: '登录',  //菜单标题
      hidden: true,  //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
      icon: 'Promotion',  //菜单文字左侧的图标,支持element-plus全部图标
      clicked: 'false',
    },
  },
  {
    //注册
    path: '/register',
    component: () => import('@/views/register/registerPage.vue'),
    name: 'register',  //命名路由
    meta: {
      title: '注册',
      hidden: true,
      icon: 'Promotion',  //菜单文字左侧的图标,支持element-plus全部图标
      clicked: 'false',
    },
  },
  {
    //layout
    path: '/layout',
    component: () => import('@/layout/index.vue'),
    name: 'layout',
    meta: {
      title: '',
      hidden: true,
      icon: '',
      clicked: 'false',
    },
    redirect: "/home",
    children: [
      {
        path: "/home",
        component: () => import("@/layout/home/index.vue"),
        meta: {
          title: "首页",
          hidden: false,
          icon: "House",
          clicked: "true",
        },
      },
    ]
  },
  {
    // 404
    path: '/404',
    component: () => import('@/views/404/404Page.vue'),
    name: '404',
    meta: {
      title: '404',
      hidden: true,
      icon: '',
      clicked: 'false',
    },
  },
  {
    //任意路由
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any',
    meta: {
      title: '任意路由',
      hidden: true,
      icon: 'DataLine',
      clicked: 'false',
    },
  },
  {
    //在线流量
    path: "/online",
    component: () => import("@/layout/index.vue"),
    name: "online",
    meta: {
      icon: "MessageBox",
      hidden: true,
      clicked: "false",
    },
    children: [
      {
        path: '/trafficAnalysis/online',
        component: () => import('@/views/onlineTraffic/onlineTraffic.vue'),
        name: 'onlineTraffic',
        meta: {
          title: '在线流量监测',
          icon: 'DataAnalysis',
          hidden: false,
          clicked: 'false',
        },
      },
    ]
  },
  {
    //离线流量
    path: "/package",
    component: () => import("@/layout/index.vue"),
    name: "package",
    meta: {
      icon: "MessageBox",
      hidden: true,
      clicked: "false",
    },
    children: [

      {
        path: '/trafficAnalysis/package',
        component: () => import('@/views/offlineTraffic/offlineTraffic.vue'),
        name: 'packageTraffic',
        meta: {
          title: '离线流量分析',
          icon: 'Files',
          hidden: false,
          clicked: 'false',
        },
      },

    ],
  },
  {
    //流量还原
    path: "/restore",
    component: () => import("@/layout/index.vue"),
    name: "restore",
    meta: {
      icon: "MessageBox",
      hidden: true,
      clicked: "false",
    },
    children: [

      {
        path: '/trafficAnalysis/restore',
        component: () => import('@/views/restore/restore.vue'),
        name: 'packageRestore',
        meta: {
          title: '流量还原',
          icon: 'FolderOpened',
          hidden: false,
          clicked: 'false',
        },
      },

    ],
  },

  // {
  //   //历史记录路由
  //   path: "/his",
  //   component: () => import("@/layout/index.vue"),
  //   name: "his",
  //   meta: {
  //     icon: "MessageBox",
  //     hidden: true,
  //     clicked: "false",
  //   },
  //   children: [
  //     {
  //       //历史记录路由
  //       path: "/history",
  //       component: () => import("@/views/history/historyData.vue"),
  //       name: "history",
  //       meta: {
  //         title: "历史",
  //         icon: "MessageBox",
  //         hidden: false,
  //         clicked: "false",
  //       },
  //     },
  //   ],
  // },
  {
    //alphaIDS路由
    path: "/alphaIDS",
    component: () => import("@/layout/index.vue"),
    name: "alphaIDS",
    meta: {
      icon: "MessageBox",
      hidden: true,
      clicked: "false",
    },
    children: [
      {
        path: "/alpha",
        component: () => import("@/views/alpha/alpha.vue"),
        name: "alpha",
        meta: {
          title: "AlphaIDS",
          icon: "ChatLineRound",
          hidden: false,
          clicked: "false",
        },
      },
    ],
  },
];
