import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "../views/layout/Layout";

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/

export const constantRouterMap = [
  {
    path: "/login",
    meta: { title: "登录", noCache: true },
    component: () => import("@/views/login/index"),
    hidden: true
  },
  {
    path: "/register",
    meta: { title: "注册", noCache: true },
    component: () => import("@/views/login/register"),
    hidden: true
  },
  {
    path: "/",
    redirect: "/socialWork",
    hidden: true
  },
  // 社会服务经典问题
  {
    path: "/socialWork",
    meta: { title: "经典问题", noCache: true },
    component: () => import("@/views/dashboard/problemIndex"),
    hidden: true
  },
  // 大屏展示
  {
    path: "/bigScreen",
    meta: { title: "经典问题", noCache: true },
    component: () => import("@/views/dashboard/bigMap"),
    hidden: true
  },
  // 社会服务经典问题详情
  {
    path: "/socialWorkDetail",
    meta: { title: "经典问题详情", noCache: true },
    component: () => import("@/views/dashboard/problemIndexDetail"),
    hidden: true
  },
  {
    path: "/404",
    component: () => import("@/views/errorPage/404"),
    hidden: true
  },
  {
    path: "/401",
    component: () => import("@/views/errorPage/401"),
    hidden: true
  },
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path*",
        component: () => import("@/views/redirect/index")
      }
    ]
  },
  // {
  //   path: "/dashboard",
  //   component: Layout,
  //   redirect: "/dashboard/dashboard",
  //   children: [
  //     {
  //       path: "dashboard",
  //       component: () => import("@/views/dashboard/index"),
  //       name: "首页",
  //       meta: { title: "首页", icon: "index", noCache: true, affix: true }
  //     }
  //   ]
  // },

  {
    path: "/taskManagementIndex",
    component: Layout,
    redirect: "/taskManagementIndex/taskAllocation",
    name: "任务管理",
    hidden: true,
    meta: {
      title: "任务管理",
      icon: "taskManag"
    },
    children: [
      {
        path: "taskAllocation",
        component: () => import("@/views/taskManagement/taskAllocation"),
        hidden: true,
        name: "taskAllocation",
        meta: { title: "新增任务", icon: "taskAllocation", noCache: true }
      },
      {
        path: "taskAllocationEdit",
        component: () => import("@/views/taskManagement/taskAllocation"),
        hidden: true,
        name: "taskAllocationEdit",
        meta: { title: "编辑任务", icon: "taskAllocation", noCache: true }
      },
      {
        path: "taskComplete",
        hidden: true,
        component: () => import("@/views/taskManagement/taskComplete"),
        name: "TaskComplete",
        meta: { title: "任务详情", icon: "taskComplete", noCache: true }
      },
      {
        path: "byEdit",
        hidden: true,
        component: () => import("@/views/taskManagement/byEdit"),
        name: "byEdit",
        meta: { title: "任务完成", icon: "taskAllocation", noCache: true }
      }
    ]
  },
  // 报警管理
  {
    path: "/thePolice_hidden",
    component: Layout,
    hidden: true,
    redirect: "noredirect",
    meta: { title: "报警管理", icon: "gaojing" },
    children: [
      {
        path: "forecastValue",
        hidden: true,
        component: () => import("@/views/thePolice/forecastValue"),
        name: "forecastValue",
        meta: { title: "新增阈值", icon: "iconalert" }
      },
      {
        path: "editforecastValue",
        hidden: true,
        component: () => import("@/views/thePolice/forecastValue"),
        name: "forecastValue",
        meta: { title: "编辑阈值", icon: "iconalert" }
      },
      {
        path: "condition",
        hidden: true,
        component: () => import("@/views/thePolice/condition"),
        name: "condition",
        meta: { title: "新增告警条件", icon: "iconalert" }
      },
      {
        path: "editcondition",
        hidden: true,
        component: () => import("@/views/thePolice/condition"),
        name: "condition",
        meta: { title: "编辑告警条件", icon: "iconalert" }
      },
      {
        path: "execute",
        hidden: true,
        component: () => import("@/views/thePolice/execute"),
        name: "execute",
        meta: { title: "新增执行", icon: "iconalert" }
      },
      {
        path: "editexecute",
        hidden: true,
        component: () => import("@/views/thePolice/execute"),
        name: "execute",
        meta: { title: "编辑执行", icon: "iconalert" }
      }
    ]
  },
  // 社会服务
  {
    path: "/expertSystem_hidden",
    component: Layout,
    hidden: true,
    redirect: "/expertSystem/expertList",
    meta: { title: "社会服务", icon: "shehuifuwu" },
    children: [
      {
        path: "answerDetails",
        hidden: true,
        component: () => import("@/views/expertSystem/specialistAnswer"),
        name: "answerDetails",
        meta: { title: "解答", icon: "iconalert" }
      },
      {
        path: "answerTheHistoryDetail",
        component: () => import("@/views/expertSystem/detailLook"),
        name: "answerTheHistoryDetail",
        hidden: true,
        meta: { title: "解答历史详情", icon: "jiedalishi" }
      }
    ]
  },
  {
    path: "/user",
    component: Layout,
    hidden: true,
    redirect: "noredirect",
    children: [
      {
        path: "center",
        component: () => import("@/views/system/user/center"),
        name: "个人中心",
        meta: { title: "个人中心", icon: "user" }
      }
    ]
  },
  {
    path: "/articleManagement_hidden",
    component: Layout,
    hidden: true,
    redirect: "/articleManagement_hidden/addOredit",
    children: [
      {
        path: "addOredit",
        component: () =>
          import("@/views/articleManagement/articleList/addOredit"),
        name: "addOreditName",
        meta: { title: "新增编辑文章", icon: "" }
      }
    ]
  },
  // 文章详情
  {
    path: "/articleDetai",
    component: () => import("@/views/articleManagement/articleList/detail"),
    hidden: true
  }
  // { path: '*', redirect: '/404', hidden: true }
];

export default new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
