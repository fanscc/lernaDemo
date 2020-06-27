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
