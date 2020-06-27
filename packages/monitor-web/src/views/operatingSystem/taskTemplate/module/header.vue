<template>
  <div class="head-container">
    <!-- 搜索 -->
    <el-input
      v-model="query.alias"
      clearable
      placeholder="输入任务别名搜索"
      style="width: 200px;"
      class="filter-item"
      @keyup.enter.native="toQuery"
    />
    <el-input
      v-model="query.crop"
      clearable
      placeholder="输入作物搜索"
      style="width: 200px;"
      class="filter-item"
      @keyup.enter.native="toQuery"
    />
<!--    <el-select-->
<!--      v-model="query.repeat"-->
<!--      clearable-->
<!--      style="width: 200px;"-->
<!--      placeholder="循环情况"-->
<!--      class="filter-item"-->
<!--      @change="toQuery"-->
<!--    >-->
<!--      <el-option-->
<!--        v-for="item in this.$refs.form._data.repeats"-->
<!--        :key="item.value"-->
<!--        :label="item.lable"-->
<!--        :value="item.value"-->
<!--      />-->
<!--    </el-select>-->
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
import {addTemplate} from "../../../../api/operatingSystem";
export default {
  components: { eForm },
  props: {
    query: {
      type: Object,
      required: true
    },
  },
  data() {
    return {

    };
  },
  methods: {
    add() {
      // this.$refs.form.init();
      this.$refs.form.dialog = true;
    },
    addTo(newData){
      console.log(newData);
      addTemplate(newData)
      .then(res=>{
        console.log(res)
        this.$parent.init();
        this.$notify({
          title: "添加成功",
          type: "success",
          duration: 2500
        });
      })

      this.$refs.form.isSuccess(true);
    },
    toQuery() {
      this.$parent.init();
    }
  }
};
</script>
