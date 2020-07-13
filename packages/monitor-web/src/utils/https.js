import axios from "axios";
import { Notification, MessageBox, Loading } from "element-ui";
import router from "@/router/routers";
import { getToken } from "@/utils/auth";
import store from "../store";

let loadinginstance = null;

// 创建axios实例
// let baseUrl = process.env.ONLINE
//   ? "https://www.nongruiyun.com"
//   : "https://test.nongruiyun.com";

const service = axios.create({
  // baseURL: process.env.NODE_ENV === "production" ? baseUrl : "/", // api 的 base_url
  timeout: 6000, // 请求超时时间
  headers: {
    "Content-Type": "application/json"
  }
});

// request拦截器
service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers["Authorization"] = "Bearer " + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    if (config.method === "get") {
      let params = Object.assign({}, config.params);
      for (let i in params) {
        if (params[i] === "" || params[i] === undefined) {
          delete params[i];
        }
      }
      config.params = params;
    }
    // 由noloding参数来判断是否需要显示loading
    if (!config.noloding) {
      loadinginstance = null;
      loadinginstance = Loading.service({
        fullscreen: true,
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.5)"
      });
    }
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  response => {
    loadinginstance && loadinginstance.close();
    loadinginstance = null;
    const code = parseFloat(response.status) || parseFloat(response.code);
    if (code < 200 || code > 300) {
      Notification.error({
        title: response.message
      });
      return Promise.reject("error");
    } else if (
      response.data.code &&
      response.data.code !== 0 &&
      parseFloat(response.data.code) !== 200
    ) {
      Notification.error({
        title: response.data.msg
      });
      return Promise.reject("error");
    } else {
      return response.data;
    }
  },
  error => {
    loadinginstance && loadinginstance.close();
    loadinginstance = null;
    let code = 0;
    try {
      code = error.response.data.code;
    } catch (e) {
      if (error.toString().indexOf("Error: timeout") !== -1) {
        Notification.error({
          title: "网络请求超时",
          duration: 2500
        });
        return Promise.reject(error);
      }
      if (error.toString().indexOf("Error: Network Error") !== -1) {
        Notification.error({
          title: "网络请求错误",
          duration: 2500
        });
        return Promise.reject(error);
      }
    }
    if (code === 401) {
      MessageBox.confirm(
        "登录状态已过期，您可以继续留在该页面，或者重新登录",
        "系统提示",
        {
          confirmButtonText: "重新登录",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        store.dispatch("LogOut").then(() => {
          location.reload(); // 为了重新实例化vue-router对象 避免bug
        });
      });
    } else if (code === 403) {
      router.push({ path: "/401" });
    } else {
      const errorMsg = error.response.data.message;
      if (errorMsg !== undefined) {
        Notification.error({
          title: errorMsg,
          duration: 2500
        });
      }
    }
    return Promise.reject(error);
  }
);

export default service;
