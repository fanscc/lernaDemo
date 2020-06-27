<template>
  <div class="chart_conten">
    <div class="chart_conten_search">
      <el-form ref="form" :inline="true" label-width="110px" size="small">
        <el-form-item label="别名">
          <el-input
            v-model="expressAlias"
            clearable
            size="mini"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          class="ml_20"
          @click="search"
          >搜索</el-button
        >
      </el-form>
      <el-button
        v-permission="['ADMIN', 'REPORT_ALL', 'REPORT_ADD']"
        type="primary"
        icon="el-icon-plus"
        @click="addforecast"
        >新增</el-button
      >
    </div>
    <div ref="topictable" class="chart_conten_table">
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
        <el-table-column type="index" width="50" />
        <el-table-column prop="expressAlias" label="告警条件别名" />
        <el-table-column prop="express" label="告警组合" />
        <el-table-column prop="minTh" label="是否启用">
          <template slot-scope="scope">
            <span>{{ scope.row.deleted === 0 ? "启用" : "停用" }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180" center>
          <template slot-scope="scope">
            <el-button
              v-permission="['ADMIN', 'REPORT_ALL', 'REPORT_EDIT']"
              type="success"
              size="mini"
              @click="editOpen(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              v-permission="['ADMIN', 'REPORT_ALL', 'REPORT_DELETE']"
              type="danger"
              size="mini"
              @click="delet(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { condition } from "@/api/thePolice";
import { Loading } from "element-ui";
export default {
  name: "ForecastList",
  data: function() {
    return {
      expressAlias: "", // 查询的别名
      loading: false,
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
  mounted() {},
  methods: {
    init(objs) {
      const params = objs || {};
      condition.getalarmCondition(params).then(res => {
        this.tableData = res.result;
      });
    },
    search() {
      if (!this.expressAlias) {
        this.init();
        return;
      }
      this.init({ expressAlias: this.expressAlias });
    },
    addforecast() {
      this.$router.push({
        path: "/thePolice_hidden/condition"
      });
    },
    editOpen(id) {
      this.$router.push({
        path: "/thePolice_hidden/editcondition",
        query: {
          id: id
        }
      });
    },
    delet(id) {
      this.$confirm("确定删除该节点吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const loadingInstance = Loading.service({
            fullscreen: true,
            lock: true,
            text: "Loading",
            background: "rgba(0, 0, 0, 0.5)"
          });
          condition
            .deleteCondition(id)
            .then(() => {
              this.$notify({
                title: "删除成功",
                type: "success",
                duration: 2500
              });
              this.init();
            })
            .finally(() => {
              loadingInstance.close();
            });
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.chart_conten {
  height: 100%;
  padding: 0 20px;
  overflow-x: hidden;
  .chart_conten_search {
    padding: 20px 0;
  }
  .ml_20 {
    margin-left: 20px;
  }
  .mB_10 {
    margin-bottom: 10px;
  }
  .chart_conten_table {
    height: calc(100% - 124px);
  }
}
</style>
