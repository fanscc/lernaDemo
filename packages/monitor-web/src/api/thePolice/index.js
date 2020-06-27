import request from "@/utils/request";
const uid = JSON.parse(localStorage.getItem("userId"));
export const forecast = {
  // 获取告警列表
  getforecastList(params = {}) {
    return request({
      url: `/alarm/threshold`,
      method: "get",
      params: params
    });
  },

  // 新增预值的信息
  addforecast(data) {
    return request({
      url: `/alarm/threshold`,
      method: "post",
      data: data
    });
  },
  // 阈值的详情信息
  getforecastlistDetail(id) {
    return request({
      url: `/alarm/threshold/${id}`,
      method: "get"
    });
  },
  // 编辑阈值信息
  editerforecast(id, data) {
    return request({
      url: `/alarm/threshold/${id}`,
      method: "put",
      data: data
    });
  },
  // 删除阈值
  deletforecast(id) {
    return request({
      url: `/alarm/threshold/${id}`,
      method: "delete"
    });
  },
  // 获取所有网关列表
  getGate() {
    return request({
      url: `/newman/user/${uid}/gate`,
      method: "get"
    });
  },
  // 根据网关查找他下面的节点
  getSearchCycle(gateId, noloading) {
    return request({
      url: `/newman/gate/${gateId}/node`,
      method: "get",
      noloading
    });
  }
};

// 告警条件

export const condition = {
  // 获取告警条件列表
  getalarmCondition(params = {}) {
    return request({
      url: `/alarm/condition`,
      method: "get",
      params: params
    });
  },
  // 获取告警条件详情
  getDetailCondition(id) {
    return request({
      url: `/alarm/condition/${id}`,
      method: "get"
    });
  },
  // 编辑告警
  editCondition(id, data) {
    return request({
      url: `/alarm/condition/${id}`,
      method: "put",
      data: data
    });
  },
  // 新增告警
  addCondition(data) {
    return request({
      url: `/alarm/condition`,
      method: "post",
      data: data
    });
  },
  // 删除
  deleteCondition(thresholdId) {
    return request({
      url: `/alarm/condition/${thresholdId}`,
      method: "delete"
    });
  }
};

export const execute = {
  // 获取执行条件列表
  getalarmExecute(params = {}) {
    return request({
      url: `/alarm/executionPlan`,
      method: "get",
      params: params
    });
  },
  // 获取执行对策表
  getCountermeasureList() {
    return request({
      url: `/alarm/executionBody`,
      method: "get"
    });
  },
  // 获取执行条件详情
  getDetailExecute(id) {
    return request({
      url: `/alarm/executionPlan/${id}`,
      method: "get"
    });
  },
  // 编辑执行
  editExecute(id, data) {
    return request({
      url: `/alarm/executionPlan/${id}`,
      method: "put",
      data: data
    });
  },
  // 新增执行
  addExecute(data) {
    return request({
      url: `/alarm/executionPlan`,
      method: "post",
      data: data
    });
  },
  // 删除
  deleteExecute(id) {
    return request({
      url: `/alarm/executionPlan/${id}`,
      method: "delete"
    });
  }
};
