import request from "@/utils/request";
// 被指派的任务
export function taskList(params) {
  return request({
    url: `/task/task`,
    method: "get",
    params: params
  });
}
// 指定执行人
export function taskAppoint(data) {
  return request({
    url: `/task/taskDistribution`,
    method: "post",
    data: data
  });
}
// 更新执行人
export function updataTaskAppoint(data) {
  return request({
    url: `/task/taskDistribution`,
    method: "put",
    data: data
  });
}
// 新增任务
export function addtask(data) {
  return request({
    url: `/task/task`,
    method: "post",
    data: data
  });
}
// 编辑任务
export function edittask(taskId, data) {
  return request({
    url: `/task/task/${taskId}`,
    method: "put",
    data: data
  });
}
// 查看任务
export function looktask(taskid) {
  return request({
    url: `/task/taskDistribution/${taskid}`,
    method: "get"
  });
}
// 完成任务
export function completetask(taskId, data) {
  return request({
    url: `/task/task/${taskId}`,
    method: "put",
    data: data
  });
}
// 被发起的人
export function beInitiatedLIst(params) {
  return request({
    url: `/task/task`,
    method: "get",
    params: params
  });
}
// 去完成的按钮
export function goTaskResult(data) {
  return request({
    url: `/task/taskResult`,
    method: "post",
    data: data
  });
}

// 更新任务
export function UpDataTaskResult(id, data) {
  return request({
    url: `/task/taskResult/${id}`,
    method: "put",
    data: data
  });
}
