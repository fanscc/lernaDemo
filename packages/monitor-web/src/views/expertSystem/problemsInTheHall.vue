<template>
  <div class="chart_conten">
    <div class="chart_conten_search">
      <el-form ref="form" :inline="true" label-width="110px">
        <el-form-item label="问题">
          <el-input v-model="searchFrom.question" style="width: 200px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchFrom.status"
            clearable
            placeholder="请选择状态"
          >
            <el-option label="待回答" value="1" />
            <el-option label="已解答" value="2" />
          </el-select>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" class="ml_20"
          >搜索</el-button
        >
      </el-form>
    </div>

    <div class="chart_conten_table"></div>
  </div>
</template>

<script>
export default {
  name: "problemsInTheHall",
  filters: {
    stateName(val) {
      const objs = {
        "1": "未解答",
        "2": "已解答"
      };
      return objs[val];
    }
  },
  data: function() {
    return {
      loading: false,
      searchFrom: {},
      tableData: [
        {
          id: 11,
          question: "茶叶驱虫",
          state: "1",
          swithTypeName: "茶叶",
          specialistName: "王博士",
          createTs: "2019-07-08"
        }
      ],
      bodyStyle: {
        "font-size": "12px",
        padding: "0",
        height: "40px"
      },
      headerStyle: {
        "font-size": "12px",
        "font-weight": "blod",
        color: "rgba(49, 65, 86, 0.82)",
        padding: "0",
        height: "40px"
      }
    };
  },
  created() {},
  methods: {
    goEdit(id) {
      this.$router.push({
        path: "/expertSystem/addMyQuestions",
        query: { id: id }
      });
    }
  }
};
</script>

<style lang="scss" scope>
.chart_conten {
  height: 100%;
  padding: 0 20px;
  overflow-x: hidden;
  position: relative;
  .chart_conten_search {
    padding: 20px 0;
  }
  .ml_20 {
    margin-left: 20px;
  }
  .chart_conten_table {
    height: calc(100% - 124px);
  }
}
</style>
