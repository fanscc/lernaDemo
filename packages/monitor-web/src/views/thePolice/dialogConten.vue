<template>
  <el-dialog title="监控信息" :visible.sync="dialogTableVisible" width="800px">
    <el-table :data="gridData">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column property="name" label="监理项目名称"></el-table-column>
      <el-table-column property="wendu" label="当前温度/分析"></el-table-column>
      <el-table-column property="shidu" label="当前湿度/分析"></el-table-column>
      <el-table-column
        property="zhaoying"
        label="当前噪声/分析"
      ></el-table-column>
      <el-table-column property="address" label="历史数据">
        <template>
          <el-button type="primary" disabled>历史数据</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  name: "dialogConten",
  data() {
    return {
      dialogTableVisible: false,
      gridData: [
        {
          name: "珠江公寓酒店",
          wendu: "45℃/不正常",
          shidu: "80%/不正常",
          zhaoying: "125DB/不正常"
        },
        {
          name: "广州报业文化中心",
          wendu: "30℃/不正常",
          shidu: "45%/正常",
          zhaoying: "40DB/正常"
        },
        {
          name: "五山街道",
          wendu: "35℃/不正常",
          shidu: "65%/正常",
          zhaoying: "40DB/正常"
        },
        {
          name: "荔园社区",
          wendu: "22℃/不正常",
          shidu: "43%/正常",
          zhaoying: "40DB/正常"
        },
        {
          name: "下沙社区",
          wendu: "57℃/不正常",
          shidu: "40%/正常",
          zhaoying: "41DB/正常"
        },
        {
          name: "集美嘉悦花园",
          wendu: "28℃/不正常",
          shidu: "70%/不正常",
          zhaoying: "165DB/不正常"
        },
        {
          name: "马庄中心",
          wendu: "30℃/不正常",
          shidu: "45%/正常",
          zhaoying: "40DB/正常"
        },
        {
          name: "藕塘庄五巷",
          wendu: "35℃/不正常",
          shidu: "65%/正常",
          zhaoying: "77DB/正常"
        },
        {
          name: "山门平康",
          wendu: "41℃/不正常",
          shidu: "56%/正常",
          zhaoying: "77DB/正常"
        },
        {
          name: "中约坊",
          wendu: "29℃/不正常",
          shidu: "79%/正常",
          zhaoying: "41DB/正常"
        }
      ]
    };
  },
  methods: {
    open() {
      this.dialogTableVisible = true;
    }
  }
};
</script>
