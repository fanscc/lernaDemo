<template>
  <div class="chart_conten">
    <div class="chart_conten_search">
      <el-form ref="form" :inline="true" label-width="110px">
        <el-form-item label="标题">
          <el-input v-model="searchFrom.title" style="width: 200px" />
        </el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          class="ml_20"
          @click="search"
          >搜索</el-button
        >
      </el-form>
    </div>

    <div class="chart_conten_table">
      <el-table
        v-loading="loading"
        :data="tableData"
        :cell-style="bodyStyle"
        :header-cell-style="headerStyle"
        stripe
        show-overflow-tooltip
        style="width: 100%"
        height="100%"
      >
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="state" label="状态">
          <template slot-scope="scope">
            {{ scope.row.state | stateName }}
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建人" />
        <el-table-column prop="createTs" label="开始时间" />
        <el-table-column prop="updateTs" label="更新时间" />
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="goLook(scope.row)"
              >查看</el-button
            >
            <el-button
              v-if="scope.row.state != '3'"
              type="warning"
              size="mini"
              @click="edit(scope.row)"
              >去修改</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { beInitiatedLIst } from "@/api/task";
export default {
  name: "ByTaskList",
  filters: {
    stateName(val) {
      const objs = {
        "0": "待分配",
        "1": "进行中",
        "2": "完成",
        "3": "终止"
      };
      return objs[val];
    }
  },
  data: function() {
    return {
      loading: false,
      dialogVisible: false,
      searchFrom: {
        taskType: "accept"
      },
      tableData: [],
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
  created() {
    this.init();
  },
  methods: {
    init() {
      this.loading = true;
      beInitiatedLIst(this.searchFrom)
        .then(res => {
          this.tableData = res.result;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    search() {
      this.init();
    },
    goLook(row) {
      this.$router.push({
        path: "/taskManagementIndex/taskComplete",
        query: { id: row.id }
      });
    },
    edit(row) {
      this.$router.push({
        path: "/taskManagementIndex/byEdit",
        query: { id: row.id }
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
  .flex_aligin {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    p,
    label {
      min-width: 100px;
      text-align: right;
      margin-right: 5px;
    }
    .fe-input-content {
      width: 200px;
    }
  }
  .chart_conten_table {
    height: calc(100% - 124px);
  }
}
</style>
