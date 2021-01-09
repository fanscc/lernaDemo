import request from "@/utils/request";
import Cookies from "js-cookie";
// 获取所有分组列表
const uid =
  JSON.parse(localStorage.getItem("userId")) ||
  JSON.parse(Cookies.get("userId"));
export function getGroup() {
  return request({
    url: `/newman/group`,
    method: "get"
  });
}

// 新增分组
export function addGroup(params) {
  return request({
    url: `/newman/group`,
    method: "post",
    data: params
  });
}

// 分组编辑
export function editGroup(params, groupId) {
  return request({
    url: `/newman/group/${groupId}`,
    method: "put",
    data: params
  });
}

// 分组删除
export function deleteGroup(groupId) {
  return request({
    url: `/newman/group/${groupId}`,
    method: "delete"
  });
}

// 根据个人获取分组
export function getGroupByUid(uid) {
  return request({
    url: `/newman/user/${uid}/group`,
    method: "get"
  });
}

// 获取所有网关列表
export function getGate(id) {
  const userId = id || uid;
  return request({
    url: `/newman/user/${userId}/gate`,
    method: "get"
  });
}

// 网关页面的根据分组查询网关
export function getsearchGroup(groupId, noloading) {
  return request({
    url: `/newman/user/${uid}/gate?groupId=${groupId}`,
    method: "get",
    noloading
  });
}

// 网关编辑列表
export function editeGate(params, gateId) {
  return request({
    url: `/newman/gate/${gateId}`,
    method: "put",
    data: params
  });
}
// 删除网关
export function deleteGate(gateId) {
  return request({
    url: `/newman/gate/${gateId}`,
    method: "delete"
  });
}

// 网关新增
export function addGate(params) {
  return request({
    url: `/newman/gate`,
    method: "post",
    data: params
  });
}

// 获取所有节点列表
export function getCycle() {
  return request({
    url: `/newman/user/${uid}/node`,
    method: "get"
  });
}

// 根据网关查找他下面的节点

export function getSearchCycle(gateId, noloading) {
  return request({
    url: `/newman/gate/${gateId}/node`,
    method: "get",
    noloading
  });
}

// 节点新增
export function addNode(params) {
  return request({
    url: `/newman/node`,
    method: "post",
    data: params
  });
}

// 编辑节点
export function editNode(params, id) {
  return request({
    url: `/newman/node/${id}`,
    method: "put",
    data: params
  });
}

// 删除节点
export function deleteNode(nodeId) {
  return request({
    url: `/newman/node/${nodeId}`,
    method: "delete"
  });
}

// 查询节点的历史数据
export function getHistorymess(params) {
  return request({
    url: `/newman/value`,
    method: "get",
    params: params
  });
}

// 查询传感器的历史数据
export function getSensorHistoryVal(params) {
  return request({
    url: `/newman/values`,
    method: "get",
    params: params
  });
}

// 控制电磁阀
export function solenoidValve(params, data) {
  return request({
    url: `/newman/cmd`,
    method: "put",
    params: params,
    data: data
  });
}

// 网关权限控制新增
export function authorityGateWays(data) {
  return request({
    url: `/authority/authorities`,
    method: "post",
    data: data
  });
}

// 网关权限控制修改
export function authorityGateWaysUpdate(data, id) {
  return request({
    url: `/authority/authority/${id}`,
    method: "put",
    data: data
  });
}

// 查询已关联的网关

export function getSelectgateWays(parmas) {
  return request({
    url: `/authority/authority`,
    method: "get",
    params: parmas
  });
}

// 查询网关上传图片
export function getOriginImg(parmas) {
  return request({
    url: `/base/org/1/file?file=${parmas}`,
    method: "get"
  });
}

// 根据网关获取下面的节点信息喊当前值
export function getNodeValue(gateId) {
  return request({
    url: `/newman/gate/${gateId}/value`,
    method: "get"
  });
}

// 根据传感器查询历史数据
export function getSersorhistory(gateId, nodeId, parmas) {
  return request({
    url: `/newman/gate/${gateId}/node/${nodeId}/history`,
    method: "get",
    params: parmas
  });
}

/**
 * 摄像头管理
 */
// 获取所有摄像头
export function getYscamera() {
  return request({
    url: `/newman/yscamera?page=0&pageSize=50`,
    method: "get"
  });
}

// 根据分组获取摄像头
export function getbyGroupId(groupId) {
  let url =
    groupId || groupId === 0
      ? `/newman/camera?groupId=${groupId}`
      : `/newman/camera`;
  return request({
    url: url,
    method: "get"
  });
}

// 新增摄像头
export function postYscamera(data) {
  return request({
    url: `/newman/camera`,
    method: "post",
    data: data
  });
}

// 编辑机摄像头
export function editYscamera(data, id) {
  return request({
    url: `/newman/camera/${id}`,
    method: "put",
    data: data
  });
}

// 删除摄像头
export function deleteYscamera(id) {
  return request({
    url: `/newman/camera/${id}`,
    method: "delete"
  });
}
