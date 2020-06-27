<template>
  <div class="chart_conten">
    <div class="chart_conten_search">
      <el-form ref="form" :inline="true" label-width="110px">
        <el-form-item label="姓名">
          <el-input v-model="from.username" class="fe-input-content" />
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
    <div ref="topictable" class="chart_conten_table">
      <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="tableData"
        :cell-style="bodyStyle"
        :header-cell-style="headerStyle"
        height="100%"
        stripe
        show-overflow-tooltip
        style="width: 100%"
      >
        <el-table-column type="index" width="50" />
        <el-table-column prop="username" label="姓名" />
        <el-table-column prop="province" label="省" />
        <el-table-column prop="city" label="市" />
        <el-table-column prop="realName" label="姓名" />
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="mini"
              v-permission="['ADMIN', 'TOURIST_ALL', 'TOURIST_DELETE']"
              @click="delete_mthods(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getVisitUser, deletVisitUser } from "@/api/expertSystem";
import { Loading } from "element-ui";

export default {
  name: "tourist",
  data: function() {
    return {
      loading: false,
      from: {
        username: "" // 姓名
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
  mounted() {},
  methods: {
    init() {
      this.loading = true;
      getVisitUser(this.from)
        .then(res => {
          this.tableData = res.result;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    delete_mthods(row) {
      const userId = row.id;
      this.$confirm("确定删除该游客吗?", "提示", {
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
          deletVisitUser(userId)
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
    },
    search() {
      this.init();
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
  .flex_aligin {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    p {
      min-width: 100px;
      text-align: right;
      margin-right: 5px;
    }
    .fe-input-content {
      width: 200px;
    }
  }
  /deep/ .el-dialog {
    width: 450px;
    max-height: 70%;
    overflow: auto;
  }
}
</style>
