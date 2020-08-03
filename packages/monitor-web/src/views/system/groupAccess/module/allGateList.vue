<template>
  <div v-if="dialogVisible" class="chart_conten allocationWate">
    <el-dialog
      :visible.sync="dialogVisible"
      :title="objData.name + '分配分组情况'"
      width="80%"
    >
      <div class="chart_conten_search">
        <el-form ref="form" :inline="true" label-width="110px" size="small">
<!--          <el-form-item label="分组">-->
<!--            <el-select-->
<!--              v-model="selectValue"-->
<!--              style="width: 200px"-->
<!--              placeholder="请选择"-->
<!--              class="fe-select-content"-->
<!--              clearable-->
<!--            >-->
<!--              <el-option-->
<!--                v-for="item in grouping"-->
<!--                :key="item.value"-->
<!--                v-bind="item"-->
<!--              />-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--          <el-button-->
<!--            type="primary"-->
<!--            icon="el-icon-search"-->
<!--            class="ml_20"-->
<!--            @click="search"-->
<!--            >搜索</el-button-->
<!--          >-->
            <el-button style="margin-left: 25px" type="primary" @click="saveAllocation">保存</el-button>
        </el-form>
      </div>

      <div class="chart_conten_table">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="tableData"
          :cell-style="bodyStyle"
          :header-cell-style="headerStyle"
          :row-key="getrowCode"
          stripe
          show-overflow-tooltip
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            :reserve-selection="true"
            type="selection"
            prop="groupId"
            width="55"
          />
          <el-table-column type="index" width="50" />
          <el-table-column prop="groupId" label="分组ID" />
          <el-table-column prop="groupName" label="分组名称" />
<!--          <el-table-column prop="gateAlias" label="网关别名" />-->
<!--          <el-table-column prop="macId" label="网关mac地址" />-->
<!--          <el-table-column label="分组对应的权限" width="350">-->
<!--            <template slot-scope="scope">-->
<!--              <el-radio-group v-model="scope.row.operation">-->
<!--                <el-radio :label="1">修改</el-radio>-->
<!--                <el-radio :label="2">删除</el-radio>-->
<!--                <el-radio :label="3">修改与删除</el-radio>-->
<!--              </el-radio-group>-->
<!--            </template>-->
<!--          </el-table-column>-->
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission";
import {
  getGate,
  getGroup,
  getsearchGroup,
  authorityGateWays,
  authorityGateWaysUpdate
} from "@/api/equipment";
import {getGroupByUid} from "../../../../api/equipment";

export default {
  name: "FenpeiGateway",
  props: {
    selectObj: {
      // 选中的对象
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data: function() {
    return {
      loading: false,
      grouping: [],
      selectValue: "",
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
      dialogVisible: false,
      objData: {},
      delLoading: false,
      multipleSelection: []
    };
  },
  methods: {
    checkPermission,
    openDialog(obj = {}) {
      this.tableData = [];
      this.objData = obj;
      this.dialogVisible = true;
      this.init();
    },
    saveAllocation() {
      this.dialogVisible = false;
      console.log(this.multipleSelection);
      // 根据this.selectObj有没有值来判断是新增还是修改
      const params = [];
      this.multipleSelection.map(item => {
        const objs = {
          uid: this.objData.id,
          resClass: "nry_group_table",
          resId: item.groupId,
          operation: item.operation
        };
        params.push(objs);
      });
      console.log(params);
      if (this.selectObj && this.selectObj.length === 0) {
        authorityGateWays(params)
          .then(() => {
            this.$notify({
              title: "分配成功",
              type: "success",
              duration: 2500
            });
          })
          .finally(() => {
            this.$emit("parent");
          });
      } else {
        authorityGateWaysUpdate(params, this.objData.id)
          .then(() => {
            this.$notify({
              title: "分配成功",
              type: "success",
              duration: 2500
            });
          })
          .finally(() => {
            this.$emit("parent");
          });
      }
    },
    init() {
      this.loading = true;
      getGroup().then(res => {
        this.$nextTick(() => {
          this.tableData = res.result;
          this.selectCheck();
          this.loading = false;
        });
      });
    },
    selectCheck() {
      this.$refs.multipleTable.clearSelection();
      this.selectObj.forEach(item => {
        for(let value of this.tableData){
          if (item.groupId === value.groupId){
            this.$refs.multipleTable.toggleRowSelection(value);
            break;
          }
        }
      });
    },
    resetValue() {
      this.selectValue = "";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getrowCode(row) {
      return row.gateId;
    },
    // search() {
    //   if (this.selectValue) {
    //     this.loading = true;
    //     this.tableData = [];
    //     getsearchGroup(this.selectValue)
    //       .then(res => {
    //         this.tableData = res.result;
    //         this.selectObj.map(item => {
    //           for (let x = 0; x < this.tableData.length; x++) {
    //             if (item.gateId === this.tableData[x].gateId) {
    //               this.tableData[x] = item;
    //             }
    //           }
    //         });
    //         this.$nextTick(() => {
    //           this.selectCheck();
    //         });
    //       })
    //       .finally(() => {
    //         this.loading = false;
    //       });
    //   } else {
    //     this.init();
    //   }
    // }
  }
};
</script>

<style lang="scss" scoped>
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
    padding-bottom: 10px;
  }
}
.allocationWate {
  /deep/ .el-dialog__body {
    padding: 0;
    .chart_conten_search {
      padding: 0;
    }
  }
  /deep/ .el-dialog {
    max-height: 75%;
    overflow: auto;
  }
}
.authority {
  margin-left: 4px;
}
</style>
