<template>
  <div class="chart_conten">
    <div class="chart_conten_search">
      <el-form :inline="true" label-width="110px" size="small">
        <el-form-item label="类别">
          <el-select
            v-model="group"
            style="width: 200px"
            placeholder="请选择"
            class="fe-select-content"
            clearable
          >
            <el-option
              v-for="item in grouping"
              :key="item.value"
              v-bind="item"
            />
          </el-select>
        </el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          class="ml_20"
          @click="init"
          >搜索</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="centerDialogVisible = true"
          >新增</el-button
        >
      </el-form>
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
        <el-table-column prop="id" align="center" label="Id" />
        <el-table-column prop="name" label="名称" />
        <el-table-column fixed="right" label="操作" width="100" center>
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="editgroup(scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增用户 -->
    <el-dialog
      wdith="600px"
      :visible.sync="centerDialogVisible"
      title="新增标记"
      center
    >
      <span>
        <el-form
          ref="addruleForm"
          :model="addruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="名称" prop="addOtherName">
            <el-input v-model="addruleForm.addOtherName" />
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveGroup">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户 -->
    <el-dialog :visible.sync="editVisible" title="编辑标记" center>
      <span>
        <el-form
          ref="editruleForm"
          :model="editruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="名称" prop="editOtherName">
            <el-input v-model="editruleForm.editOtherName" />
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editsaveGroup">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { baseTag, addbaseTag, editbaseTag } from "@/api/label/index";
import { Loading } from "element-ui";
export default {
  name: "labelCompton",
  data: function() {
    return {
      loading: false,
      grouping: [{ label: "things", value: "things" }],
      group: "",
      centerDialogVisible: false, // 显示新增组名的弹窗
      editVisible: false, // 编辑
      editId: "",
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
      },
      addruleForm: {
        addOtherName: "" // 别名
      },
      editruleForm: {
        editOtherName: "" // 编辑别名
      },
      rules: {
        addOtherName: [
          { required: true, message: "请输入标注名称", trigger: "blur" }
        ],
        editOtherName: [
          { required: true, message: "请输入标注名称", trigger: "blur" }
        ]
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
      baseTag({ group: this.group })
        .then(res => {
          this.tableData = res.result;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    resetValue() {
      this.group = "";
    },
    editgroup(item) {
      this.editId = item.id;
      this.editVisible = true;
      this.editruleForm.editOtherName = item.groupName;
    },
    saveGroup() {
      // 新增组名
      this.$refs["addruleForm"].validate(valid => {
        if (valid) {
          const params = {
            name: this.addruleForm.addOtherName,
            group: `things`
          };
          const loadingInstance = Loading.service({
            fullscreen: true,
            lock: true,
            text: "Loading",
            background: "rgba(0, 0, 0, 0.5)"
          });
          addbaseTag(params)
            .then(() => {
              this.$notify({
                title: "新建成功",
                type: "success",
                duration: 2500
              });
              this.centerDialogVisible = false;
              this.init();
              this.addOtherName = "";
            })
            .finally(() => {
              loadingInstance.close();
            });
        }
      });
    },
    editsaveGroup() {
      // 编辑保存别名
      this.$refs["editruleForm"].validate(valid => {
        if (valid) {
          const params = {
            name: this.editruleForm.editOtherName,
            group: `things`
          };
          const loadingInstance = Loading.service({
            fullscreen: true,
            lock: true,
            text: "Loading",
            background: "rgba(0, 0, 0, 0.5)"
          });
          editbaseTag(params, this.editId)
            .then(() => {
              this.$notify({
                title: "编辑成功",
                type: "success",
                duration: 2500
              });
              this.editVisible = false;
              this.init();
              this.editruleForm.editOtherName = "";
            })
            .finally(() => {
              loadingInstance.close();
            });
        }
      });
    },
    deleteGroup(row) {
      const groupId = row.groupId;
      this.$confirm("确定删除该分组吗?", "提示", {
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
          deleteGroup(groupId)
            .then(() => {
              this.$notify({
                title: "删除成功",
                type: "success",
                duration: 2500
              });
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
    width: 610px;
    max-height: 70%;
    overflow: auto;
  }
}
</style>
