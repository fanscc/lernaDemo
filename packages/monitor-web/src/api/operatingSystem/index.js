import request from "@/utils/https";

/**************************地块********************************/

// 添加地块信息
export function addFarm(data) {
  return request({
    url: `/system/farm`,
    method: "post",
    data: data
  });
}

// 获取所有地块信息
export function getFarm() {
  return request({
    url: `/system/farm`,
    method: "get"
  });
}

// 删除相应地块
export function delFarm(id) {
  return request({
    url: `/system/farm/${id}`,
    method: "delete"
  });
}

// 编辑地块信息
export function editFarm(data) {
  return request({
    url: `/system/farm`,
    method: "put",
    data: data
  });
}

/**************************作物********************************/

// 添加作物信息
export function addCrop(data) {
  return request({
    url: `/system/crop`,
    method: "post",
    data: data
  });
}

// 获取所有地块信息
export function getCrop(params) {
  return request({
    url: `/system/crop`,
    method: "get",
    params: params
  });
}

// 根据作物名称进行查询
export function searchCrop(params) {
  return request({
    url: `/system/crop/search`,
    method: "get",
    params: params
  });
}

// 删除相应地块
export function delCrop(id) {
  return request({
    url: `/system/crop/${id}`,
    method: "delete"
  });
}

// 编辑地块信息
export function editCrop(data) {
  return request({
    url: `/system/crop`,
    method: "put",
    data: data
  });
}

/****************************工作******************************/

// 添加工作
export function addWork(data) {
  return request({
    url: `/system/work`,
    method: "post",
    data: data
  });
}

// 获取所有工作信息
export function getWork(params) {
  return request({
    url: `/system/work`,
    method: "get",
    params: params
  });
}

// 根据作物名称进行查询
export function searchWork(params) {
  return request({
    url: `/system/work/search`,
    method: "get",
    params: params
  });
}

// 编辑作物信息
export function editWork(data) {
  return request({
    url: `/system/work`,
    method: "put",
    data: data
  });
}

// 删除相应作物
export function delWork(id) {
  return request({
    url: `/system/work/${id}`,
    method: "delete"
  });
}

/****************************任务模板******************************/

// 添加任务模板
export function addTemplate(data) {
  return request({
    url: `/system/templet`,
    method: "post",
    data: data
  });
}

// 获取所有任务模板
// export function getWork() {
//   return request({
//     url: `/system/work/get`,
//     method: "get",
//   });
// }

// 根据任务别名、作物查询任务模板
export function searchTemplate(params = {}) {
  return request({
    url: `/system/templet/search`,
    method: "get",
    params: params
  });
}

// 将任务模板发布分派出去
export function publicTemplate(data) {
  return request({
    url: `/system/templet/publish`,
    method: "post",
    data
  });
}

// 获取任务模板的用户
export function getUsers(data) {
  return request({
    url: `/system/templet/user`,
    method: "post",
    data
  });
}

// 任务模板信息更新
export function editTemplate(data) {
  return request({
    url: `/system/templet`,
    method: "put",
    data: data
  });
}

// 删除任务模板信息
export function delTempate(id) {
  return request({
    url: `/system/templet/${id}`,
    method: "delete"
  });
}

/****************************作业模块******************************/

// 根据任务别名、作物、任务分类查询
export function searchTask(data) {
  return request({
    url: `/system/task/search`,
    method: "post",
    data
  });
}

// // 编辑作业
// export function editWork(data) {
//   return request({
//     url: `work`,
//     method: "put",
//     data: data
//   });
// }

// 关闭作业
export function closeTask(id) {
  return request({
    url: `/system/task?id=${id}`,
    method: "delete"
  });
}

// 完成作业
export function startWord(id) {
  return request({
    url: `/system/task/action?id=${id}`,
    method: "get"
  });
}

// 完成作业
export function complishWord(params) {
  return request({
    url: `/system/task/complish`,
    method: "get",
    params
  });
}

/****************************作业记录模块******************************/

// 根据任务别名、作物、任务分类、创建人、执行人进行作业记录的查询
export function searchRecord(data) {
  return request({
    url: `/system/record/search`,
    method: "pose",
    data
  });
}
