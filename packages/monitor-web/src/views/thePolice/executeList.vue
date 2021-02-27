<template>
  <div class="chart_conten">
    <div class="chart_conten_search">
      <el-form ref="form" :inline="true" label-width="110px" size="small">
        <el-form-item label="别名">
          <el-input
            v-model="alias"
            size="mini"
            clearable
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
        v-permission="['ADMIN', 'EXECUTE_ALL', 'EXECUTE_ADD']"
        type="primary"
        icon="el-icon-plus"
        @click="addforecast"
        >新增</el-button
      >
      <!-- <el-button
        v-permission="['ADMIN', 'EXECUTE_ALL', 'EXECUTE_ADD']"
        type="primary"
        @click="addLanmu"
        >在建项目信息</el-button
      > -->
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
        <el-table-column prop="alias" label="别名" />
        <el-table-column label="告警条件">
          <template slot-scope="scope">
            {{
              scope.row.alarmCondition && scope.row.alarmCondition.expressAlias
            }}
          </template>
        </el-table-column>
        <el-table-column label="执行方案">
          <template slot-scope="scope">
            <span>{{ scope.row.alarmExecutionBody.bodyAlias }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Java执行主体">
          <template slot-scope="scope">
            <span>{{ scope.row.alarmExecutionBody.bodyJava }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Python执行主体">
          <template slot-scope="scope">
            <span>{{ scope.row.alarmExecutionBody.bodyPython }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行主体">
          <template slot-scope="scope">
            <span>{{ scope.row.alarmExecutionBody.bodyUrl }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="extraParam" label="执行对策附件参数">
          <template slot-scope="scope">
            <div
              v-for="(item, index) in scope.row.alarmExecutionBody.checkParams"
              :key="index"
            >
              <p>
                <span>{{ item.commit }}:</span>
                <span>{{ scope.row.extraParam[item.name] }}</span>
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180" center>
          <template slot-scope="scope">
            <el-button
              v-permission="['ADMIN', 'EXECUTE_ALL', ' EXECUTE_EDIT']"
              type="success"
              size="mini"
              @click="editOpen(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              v-permission="['ADMIN', 'EXECUTE_ALL', 'EXECUTE_DELETE']"
              type="danger"
              size="mini"
              @click="delet(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <dialogConten ref="dialogContenDom"></dialogConten>
  </div>
</template>

<script>
import { execute } from "@/api/thePolice";
import { Loading } from "element-ui";
import dialogConten from "./dialogConten.vue";
export default {
  name: "ForecastList",
  components: {
    dialogConten
  },
  data: function() {
    return {
      alias: "", // 查询条件别名
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
      const parmas = objs || {};
      this.loading = true;
      execute
        .getalarmExecute(parmas)
        .then(res => {
          res.result.map(item => {
            if (item.alarmExecutionBody) {
              item.alarmExecutionBody.checkParams = JSON.parse(
                item.alarmExecutionBody.checkParams
              );
            } else {
              item.alarmExecutionBody = {};
              item.alarmExecutionBody.checkParams = [];
            }
            item.extraParam = item.extraParam
              ? JSON.parse(item.extraParam)
              : {};
          });
          this.tableData = res.result;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    search() {
      if (this.alias) {
        this.init({ alias: this.alias });
      } else {
        this.init();
      }
    },
    addforecast() {
      this.$router.push({
        path: "/thePolice_hidden/execute"
      });
    },
    editOpen(id) {
      this.$router.push({
        path: "/thePolice_hidden/editexecute",
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
          const loadingInstance = Loading.service({ fullscreen: true });
          execute
            .deleteExecute(id)
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
    addLanmu() {
      this.$refs.dialogContenDom.open();
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
