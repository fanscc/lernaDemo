<template>
  <div class="head-container">
    <!-- 搜索 -->
    <el-input
      v-model="query.value"
      clearable
      placeholder="输入作物名称搜索"
      style="width: 200px;"
      class="filter-item"
      @keyup.enter.native="toQuery"
    />

    <el-button
      class="filter-item"
      size="mini"
      type="success"
      icon="el-icon-search"
      @click="toQuery"
      >搜索</el-button
    >
    <!-- 新增 -->
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="add"
        >新增</el-button
      >
      <eForm ref="form" :is-add="true" />
    </div>
  </div>
</template>

<script>
import eForm from "./form";
import { addCrop } from "../../../../api/operatingSystem";
export default {
  components: { eForm },
  props: {
    query: {
      type: Object,
      required: true
    }
  },
  data() {
    return {};
  },
  methods: {
    add() {
      this.$refs.form.dialog = true;
    },
    addTo(newData) {
      console.log(newData);
      addCrop(newData).then(res => {
        console.log(res);
        this.$parent.init();
        this.$notify({
          title: "添加成功",
          type: "success",
          duration: 2500
        });
      });
      this.$refs.form.isSuccess(true);
    },
    toQuery() {
      this.$parent.init();
    }
  }
};
</script>
