// const baseUrl = process.env.BASE_API;
const api = {
  state: {
    // 实时控制台
    socketApi: "/websocket?token=kl",
    // 图片上传
    imagesUploadApi: "/api/pictures",
    // 修改头像
    updateAvatarApi: "/api/users/updateAvatar",
    // 上传文件到七牛云
    qiNiuUploadApi: "/api/qiNiuContent",
    // Sql 监控
    sqlApi: "/druid",
    // swagger
    swaggerApi: "/swagger-ui.html"
  }
};

export default api;
