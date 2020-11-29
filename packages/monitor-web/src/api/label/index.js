import request from "@/utils/https";
// const uid = localStorage.getItem("userId");

// 标注列表
export function baseTag(params) {
  return request({
    url: `/base/tag`,
    method: "get",
    params: params,
    noloding: true
  });
}

// 标注新增
export function addbaseTag(data) {
  return request({
    url: `/base/tag`,
    method: "post",
    data: data
  });
}

// 标注编辑
export function editbaseTag(data, id) {
  return request({
    url: `/base/tag/${id}`,
    method: "put",
    data: data
  });
}

// 获取标点
export function getBaseThing(params, tags) {
  return request({
    url: `/base/thing?tags=${tags}`,
    method: "get",
    params
  });
}

// 创建标点
export function addBaseThing(data, type) {
  return request({
    url: `/base/thing?tags=${type}`,
    method: "post",
    data: data
  });
}

// 修改标点
export function editBaseThing(data, id, type) {
  return request({
    url: `/base/thing/${id}?tags=${type}`,
    method: "put",
    data: data
  });
}

// 删除标点
export function deleteBaseThing(id) {
  return request({
    url: `/base/thing/${id}`,
    method: "delete"
  });
}

// 记录
export function getBaseThingRecord(params) {
  return request({
    url: `/base/thingRecord`,
    method: "get",
    params
  });
}

// 给标点添加记录:
export function addBaseThingRecord(data) {
  return request({
    url: `/base/thingRecord`,
    method: "post",
    data: data
  });
}

export function editBaseThingRecord(data) {
  return request({
    url: `/base/thingRecord`,
    method: "put",
    data: data
  });
}
