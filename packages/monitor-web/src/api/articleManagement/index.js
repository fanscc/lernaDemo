import request from "@/utils/request";

  export function articleSelectOne(id) {
  return request({
    url: `/cms/article/${id}`,
    method: "get",
  });
}

export function articleInsert(data) {
  return request({
    url: `/cms/article`,
    method: "post",
    data: data
  });
}

export function articleUpdate(data) {
  return request({
    url: `/cms/article/${data.id}`,
    method: "put",
    data: data
  });
}

export function articleSelectAbstract(params) {
  return request({
    url: `/cms/articleAbstract`,
    method: "get",
    params: params
  });
}

export function articleCount(params) {
  return request({
    url: `/cms/articleCount`,
    method: "get",
    params: params
  });
}

export function categorySelectOne(id) {
  return request({
    url: `/cms/selectOne/${id}`,
    method: "get",
  });
}

export function categoryInsert(data) {
  return request({
    url: `/cms/category`,
    method: "post",
    data: data
  });
}

export function categoryUpdate(data) {
  return request({
    url: `/cms/category/${data.id}`,
    method: "put",
    data: data
  });
}

export function categorySelect(params) {
  return request({
    url: `/cms/category`,
    method: "get",
    params: params
  });
}

export function categoryCount(params) {
  return request({
    url: `/cms/categoryCount`,
    method: "get",
    params: params
  });
}
