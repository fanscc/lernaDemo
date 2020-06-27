<template>
  <div class="chart_conten">
    <div class="chart_conten_search">
      <el-form ref="form" :inline="true" label-width="110px">
        <el-form-item label="标题">
          <el-input v-model="searchFrom.title" style="width: 200px" />
        </el-form-item>
        <!-- <el-form-item label="处理人">
          <el-input v-model="searchFrom.user" style="width: 200px"/>
        </el-form-item> -->
        <el-form-item label="状态">
          <el-select
            v-model="searchFrom.status"
            clearable
            placeholder="请选择状态"
          >
            <el-option label="待分配" value="0" />
            <el-option label="进行中" value="1" />
            <el-option label="终止" value="3" />
          </el-select>
        </el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          class="ml_20"
          @click="search"
          >搜索</el-button
        >
      </el-form>
      <el-button
        v-permission="['ADMIN', 'TASK_ALL', 'TASK_ADD']"
        type="primary"
        icon="el-icon-plus"
        @click="goAddTask"
        >新增</el-button
      >
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
        <el-table-column prop="createTs" label="开始时间" />
        <el-table-column prop="updateTs" label="更新时间" />
        <el-table-column fixed="right" label="操作" width="320">
          <template slot-scope="scope">
            <el-button
              v-permission="['ADMIN', 'TASK_ALL', ' TASK_PEOPLE']"
              v-if="scope.row.state == '0'"
              type="success"
              size="mini"
              @click="goPoint(scope.row)"
              >指定人员</el-button
            >
            <el-button
              v-permission="['ADMIN', 'TASK_ALL', 'TASK_LOOK']"
              type="success"
              size="mini"
              @click="goLook(scope.row)"
              >查看</el-button
            >
            <el-button
              v-permission="['ADMIN', 'TASK_ALL', 'TASK_EDIT']"
              v-if="scope.row.state != '3'"
              type="warning"
              size="mini"
              @click="edit(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-permission="['ADMIN', 'TASK_ALL', 'TASK_REMOVE']"
              v-if="scope.row.state != '3'"
              type="danger"
              size="mini"
              @click="completet(scope.row)"
              >完成</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      class="choose_user_dialog"
      title="提示"
      width="80%"
    >
      <chooserUserTable
        :choose_user="true"
        :choose_user_arr="executor"
        @chooseUser="chooseUser"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  taskList,
  taskAppoint,
  updataTaskAppoint,
  completetask
} from "@/api/task";
import chooserUserTable from "../system/user/index";
export default {
  name: "TaskList",
  components: {
    chooserUserTable
  },
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
      taskId: "",
      type: "", // 判断分配执行人的时候是新增还是编辑
      executor: "", // 被指定人的id
      searchFrom: {
        taskType: "create"
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
      taskList(this.searchFrom)
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
    goAddTask() {
      this.$router.push({ path: "/taskManagementIndex/taskAllocation" });
    },
    goLook(row) {
      this.$router.push({
        path: "/taskManagementIndex/taskComplete",
        query: { id: row.id }
      });
    },
    edit(row) {
      this.$router.push({
        path: "/taskManagementIndex/taskAllocationEdit",
        query: { id: row.id }
      });
    },
    goPoint(row) {
      this.dialogVisible = true;
      this.taskId = row.id;
      this.executor = row.executor;
      if (row.executor) {
        this.type = "edit";
      } else {
        this.type = "add";
      }
    },
    chooseUser(val) {
      const userId = val.id;
      const params = {
        taskId: this.taskId,
        executor: userId
      };
      const objApi = {
        add: taskAppoint,
        edit: updataTaskAppoint
      };
      objApi[this.type](params).then(() => {
        this.dialogVisible = false;
        this.init();
      });
    },
    completet(row) {
      completetask(row.id, { state: 3 }).then(() => {
        this.$notify({
          title: "更新成功",
          type: "success",
          duration: 2500
        });
        this.init();
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
