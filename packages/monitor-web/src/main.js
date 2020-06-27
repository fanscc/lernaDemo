import Vue from "vue";
require("babel-polyfill");
import "normalize.css/normalize.css"; // A modern alternative to CSS resets
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "swiper/css/swiper.min.css";
import locale from "element-ui/lib/locale/lang/zh-CN"; // lang i18n
import VCharts from "v-charts";
import echarts from "echarts";
// 地图
import BaiduMap from "vue-baidu-map";

import "@/styles/index.scss"; // global css

import App from "./App";
import router from "./router/routers";
import permission from "./components/permission";
import store from "./store";

import "@/icons"; // icon
import "./router/index"; // permission control
import { utils } from "@/utils/tool";
// 兼容低版本浏览器的finnay方法
require("promise.prototype.finally").shim();
Vue.prototype.$utils = utils;
Vue.prototype.$echarts = echarts;
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: "aEqbp6FKpETwT7Y8vDYDks8I5SoWxihk"
});
Vue.use(VCharts);
Vue.use(permission);
Vue.use(ElementUI, { size: "mini", locale });
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
