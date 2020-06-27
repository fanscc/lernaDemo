import request from "@/utils/request";

export function getVideoToken(datas) {
  return request({
    url: `https://open.ys7.com/api/lapp/token/get`,
    method: "post",
    data: datas,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

export function cameraList(datas) {
  return request({
    url: `https://open.ys7.com/api/lapp/camera/list`,
    method: "post",
    data: datas,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

export function ptzStart(datas) {
  return request({
    url: `https://open.ys7.com/api/lapp/device/ptz/start`,
    method: "post",
    data: datas,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

export function ptzStop(datas) {
  return request({
    url: `https://open.ys7.com/api/lapp/device/ptz/stop`,
    method: "post",
    data: datas,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}
