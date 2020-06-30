<template>
  <div>
    <el-button type="primary" @click="configStudy(1)"
      >菜单权限配置教程</el-button
    >
    <el-button type="success" @click="configStudy(2)"
      >按钮权限配置教程</el-button
    >
    <video
      :src="videoUrl"
      controls="controls"
      width="100%"
      height="500"
    ></video>
  </div>
</template>

<script>
export default {
  data() {
    return {
      videoUrl: "/base/org/1/file?file=1/gate/jc.mp4_1592577403149"
    };
  },
  methods: {
    configStudy(type) {
      if (type === 1) {
        this.videoUrl = "/base/org/1/file?file=1/gate/jc.mp4_1592577403149";
      } else {
        this.videoUrl = "/base/org/1/file?file=1/gate/btn.mp4_1593526039431";
      }
    }
  }
};
</script>
