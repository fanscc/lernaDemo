<template>
  <div class="chart_conten allocationWate">
    <el-dialog
      :visible.sync="dialogVisible"
      :title="objData.name + '已分配网关'"
      width="80%"
    >
      <div class="chart_conten_search">
        <el-button
          style="margin-left: 20px"
          type="primary"
          @click="addAllocation"
          >修改分配网关</el-button
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
        >
          <el-table-column type="index" width="50" />
          <el-table-column prop="groupId" label="所属分组" />
          <el-table-column prop="gateAlias" label="网关别名" />
          <el-table-column prop="macId" label="网关mac地址" />
          <el-table-column prop="lat" label="纬度" />
          <el-table-column prop="lon" label="经度" />
          <el-table-column label="网关对应的权限" width="250">
            <template slot-scope="scope">
              <span>{{ scope.row.operation | fliterName }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <allGateList
      ref="allGateDom"
      :select-obj="tableData"
      @parent="dialogVisible = false"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission";
import allGateList from "./allGateList";
import { getGate, getGroup, getSelectgateWays } from "@/api/equipment";
export default {
  name: "FenpeiGateway",
  components: { allGateList },
  filters: {
    fliterName(val) {
      const obj = {
        "1": "修改",
        "2": "删除",
        "3": "修改与删除"
      };
      return obj[val];
    }
  },
  data: function() {
    return {
      loading: false,
      grouping: [],
      selectRowId: ["021", "1", "55", "5"],
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
      objData: {}
    };
  },
  created() {
    getGroup().then(res => {
      res.result.map(item => {
        item.value = item.groupId;
        item.label = item.groupName;
      });
      this.grouping = res.result;
    });
  },
  methods: {
    checkPermission,
    async openDialog(obj = {}) {
      this.tableData = [];
      this.objData = obj;
      this.dialogVisible = true;
      // this.selectRowId = await this.getselectRowId()
      this.init();
    },
    addAllocation() {
      this.$refs.allGateDom.openDialog(this.objData);
    },
    getSelfGate() {},
    getselectRowId() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        const parmas = {
          uid: this.objData.id,
          resClass: "nry_gateway_table"
        };
        getSelectgateWays(parmas)
          .then(res => {
            const selectRowId = [];
            res.result.map(item => {
              selectRowId.push({
                resId: item.resId,
                operation: JSON.stringify(item.operation)
              });
            });
            resolve(selectRowId);
          })
          .catch(() => {
            reject();
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    init() {
      this.loading = true;
      // 根据用户id查询当前网关权限分配情况

      getGate(this.objData.id)
        .then(res => {
          this.tableData = res.result;
        })
        .finally(() => {
          this.loading = false;
        });
    }
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
</style>
