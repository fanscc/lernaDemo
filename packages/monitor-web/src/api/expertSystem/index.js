import request from "@/utils/https";
// const uid = localStorage.getItem("userId");

// 公开问题列表接口
export function publicityList(params) {
  return request({
    url: `/expert/publicTopic`,
    method: "get",
    params: params
  });
}

// 注册接口
export function register(data) {
  return request({
    url: `/expert/register`,
    method: "post",
    data: data
  });
}

// 专家列表列表接口
export function getExpertList(params) {
  return request({
    url: `/expert/expert`,
    method: "get",
    params: params
  });
}

// 新增专家的时候选择用户
export function chooseUser(params) {
  return request({
    url: `/expert/user`,
    method: "get",
    params: params
  });
}

// 专业下拉框
export function specialtyList(params) {
  return request({
    url: `/expert/major`,
    method: "get",
    params: params
  });
}

// 新增专家
export function addSpecialty(data) {
  return request({
    url: `/expert/user`,
    method: "post",
    data: data
  });
}

// @我的问题

// @我的问题列表接口

export function topicLIst(params) {
  return request({
    url: `/expert/atMeTopic`,
    method: "get",
    params: params
  });
}

// 问题详情拆开成3个接口

/// 查询问题信息
export function getTopic(id) {
  return request({
    url: `/expert/topic/${id}`,
    method: "get"
  });
}

/// 回复问题的信息接口
export function getReply(id) {
  return request({
    url: `/expert/reply?topicId=${id}`,
    method: "get",
    noloding: true
  });
}

/// 回复问题的信息接口
export function getReplyMore(id,maxId) {
  return request({
    url: `/expert/reply?topicId=${id}&maxId=${maxId}`,
    method: "get",
    noloding: true
  });
}

/// 获取当前任务的关联任务,包括用户,专家
export function getAtExpert(id) {
  return request({
    url: `/expert/atExpert/topicId/${id}`,
    method: "get"
  });
}

/// 回复问题

export function replyQuestion(data) {
  return request({
    url: `/expert/reply`,
    method: "POST",
    data: data,
    noloding: true
  });
}

/// 添加别的专家

export function atAddSpecialty(data) {
  return request({
    url: `/expert/atExpert`,
    method: "POST",
    data: data
  });
}

// 点击用户或者专家名字显示详细信息

export function getRoleDetail(id) {
  return request({
    url: `/expert/user/${id}`,
    method: "get"
  });
}

// 游客新增问题
export function addMyTopic(params) {
  return request({
    url: `/expert/topic`,
    method: "post",
    data: params
  });
}

// 我的提问列表

export function getMyTopic(params) {
  return request({
    url: `/expert/createdTopic`,
    method: "get",
    params: params
  });
}

// // 提问历史
// export function getMyTopicHisTory(params) {
//   return request({
//     url: `/expert/topic/MyTopicHisTory`,
//     method: "get",
//     params: params
//   });
// }

// 游客更新问题， 公开，关闭，查看
export function setPublicTopicId(publicTopicId, data) {
  return request({
    url: `/expert/topic/${publicTopicId}`,
    method: "put",
    data: data
  });
}

// 专家更新问题 公开，关闭，查看
export function setAtMeTopic(publicTopicId, data) {
  return request({
    url: `/expert/atMeTopic/${publicTopicId}`,
    method: "put",
    data: data
  });
}

// 游客信息

// 游客列表
export function getVisitUser(params) {
  return request({
    url: `/expert/role/1`,
    method: "get",
    params: params
  });
}

// 删除游客
export function deletVisitUser(id) {
  return request({
    url: `/expert/user/${id}`,
    method: "delete"
  });
}
