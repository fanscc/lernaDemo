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
    <el-button
      class="filter-item"
      size="mini"
      type="success"
      icon="el-icon-search"
      @click="toQuery"
      >搜索</el-button
    >
  </div>
</template>

<script>

export default {
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
      this.$refs.form.dialog = true;
    },
    addTo(newData){
      console.log(newData);
      // console.log( Object.values(this.$refs.form._data.times))
      this.$message({
        message: '等接口，分id',
        type: 'success'
      });
      this.$refs.form.isSuccess(true);
    },
    toQuery() {
      this.$parent.page = 0;
      this.$parent.init();
    }
  }
};
</script>
