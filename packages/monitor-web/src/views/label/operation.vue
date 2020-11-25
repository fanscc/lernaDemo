<template>
  <el-drawer title="操作管理" :visible.sync="drawer" :direction="direction">
    <span>我来啦!</span>
  </el-drawer>
</template>

<script>
export default {
  name: "operation",
  data() {
    return {
      drawer: false,
      direction: "rtl"
    };
  },
  methods: {
    open() {
      this.drawer = true;
    }
  }
};
</script>
