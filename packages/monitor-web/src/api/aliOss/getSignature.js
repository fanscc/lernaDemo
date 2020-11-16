import request from "@/utils/request";

export function getsearchGroup(dirText) {
  return request({
    url: `/base/org/1/policy?dir=${dirText}`,
    method: "post"
  });
}

export function uploadWangEditor(url, objs, onUploadProgress) {
  return request({
    url: url,
    method: "post",
    data: objs,
    onUploadProgress
  });
}
