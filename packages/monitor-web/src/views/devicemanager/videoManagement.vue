<template>
  <div class="chart_conten">
    <div class="chart_conten_search">
      <!-- <el-form ref="form" :inline="true" label-width="110px" size="small">
        <el-form-item label="分组">
          <el-select
            v-model="selectValue"
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
          @click="search"
          >搜索</el-button
        >
      </el-form> -->
      <el-button type="primary" icon="el-icon-plus" @click="addVideo"
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
        <el-table-column type="index" width="50" />
        <el-table-column prop="groupId" label="分组">
          <template slot-scope="scope">
            {{ swicthGroupName(scope.row.groupId) }}
          </template>
        </el-table-column>
        <el-table-column prop="channelName" label="摄像头名称">
        </el-table-column>
        <el-table-column prop="cameraAlias" label="摄像头描述">
        </el-table-column>
        <el-table-column prop="deviceSerial" label="设备编码" />
        <el-table-column prop="channelNo" label="通道" width="100" />
        <!-- <el-table-column label="是否在线" width="100">
          <template slot-scope="scope">
            {{ scope.row.status === 1 ? "在线" : "断线" }}
          </template>
        </el-table-column> -->
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="editAlias(scope.row)"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" @click="deleteGroup(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增摄像头 -->
    <el-dialog
      :visible.sync="centerDialogVisible"
      class="add_gateway"
      :title="editId ? '编辑摄像头' : '新增摄像头'"
      width="50%"
      center
      @close="reset"
    >
      <span>
        <el-form
          ref="addruleForm"
          :model="addruleForm"
          :rules="rules"
          label-width="140px"
          class="demo-ruleForm"
        >
          <el-form-item label="分组" prop="groupId">
            <el-select
              v-model="addruleForm.groupId"
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
          <el-form-item label="摄像头描述" prop="cameraAlias">
            <el-input
              v-model="addruleForm.cameraAlias"
              class="fe-input-content"
            />
          </el-form-item>
          <div class="address_xz">
            <el-button type="primary" size="mini" @click="getCurrentAddress"
              >获取当前地址</el-button
            >
            <el-button
              type="primary"
              size="mini"
              @click="
                adressVisible = true;
                centerDialogVisible = false;
              "
              >去选择地址</el-button
            >
          </div>
          <el-form-item label="纬度" prop="lat">
            <el-input
              v-model="addruleForm.lat"
              readonly="readonly"
              placeholder="请选择地址"
              class="fe-input-content"
            />
          </el-form-item>
          <el-form-item label="经度" prop="lon">
            <el-input
              v-model="addruleForm.lon"
              placeholder="请选择地址"
              readonly="readonly"
              class="fe-input-content"
            />
          </el-form-item>
          <el-form-item label="是否支持云台控制" prop="deviceType">
            <el-select
              v-model="addruleForm.deviceType"
              style="width: 200px"
              placeholder="请选择"
              class="fe-select-content"
              clearable
            >
              <el-option label="支持" :value="1" />
              <el-option label="不支持" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="选择摄像头" prop="deviceSerialType">
            <el-select
              v-model="addruleForm.deviceSerialType"
              style="width: 200px"
              placeholder="请选择"
              class="fe-select-content"
              clearable
            >
              <el-option
                v-for="item in deviceSerialList"
                :key="item.value"
                v-bind="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="摄像头封面">
            <img
              v-if="editId"
              :src="`${baseUrl}${addruleForm.url}`"
              alt=""
              srcset=""
              style="width: 200px;height: 150px;"/>
            <uploadPic
              v-if="centerDialogVisible"
              v-model="addruleForm.url"
              :add-mac-id="addruleForm.addMacId"
          /></el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveGroup">保存</el-button>
      </span>
    </el-dialog>

    <select-the-seats
      v-show="adressVisible"
      ref="getAddress"
      @emitAdress="emitAdress"
    />
  </div>
</template>

<script>
import {
  getGroup,
  getbyGroupId,
  getYscamera,
  postYscamera,
  editYscamera,
  deleteYscamera
} from "@/api/equipment";
import selectTheSeats from "@/components/map/selectTheSeats";
import uploadPic from "@/components/uploadpic/upload";
import { Loading } from "element-ui";
export default {
  name: "Gateway",
  components: {
    selectTheSeats,
    uploadPic
  },
  data: function() {
    return {
      baseUrl: process.env.ONLINE
        ? "https://www.gdaas-tea.com/base/org/1/file?file="
        : "https://zckj.gudonger.com/base/org/1/file?file=",
      loading: false,
      grouping: [],
      selectValue: "",
      inputValue: "",
      tableData: [],
      deviceSerialList: [], // 摄像头列表
      centerDialogVisible: false,
      editId: "",
      adressVisible: false,
      addruleForm: {
        groupId: "", // 新增的时候选择的分组
        cameraAlias: "",
        deviceType: "", // 是否支持云台控制
        url: "", // 摄像头封面
        lon: "", // 维度
        lat: "", // 纬度
        deviceSerialType: "" // 选择的摄像头
      },
      rules: {
        groupId: [
          { required: true, message: "请选择的分组", trigger: "change" }
        ],
        cameraAlias: [
          { required: true, message: "请输入摄像头描述", trigger: "blur" }
        ],
        deviceType: [
          {
            required: true,
            message: "请选择是否支持云台控制",
            trigger: "change"
          }
        ],
        deviceSerialType: [
          { required: true, message: "请选择的摄像头", trigger: "change" }
        ],
        lon: [{ required: true, message: "请选择维度", trigger: "blur" }],
        lat: [{ required: true, message: "请选择纬度", trigger: "blur" }]
      },
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
    getGroup().then(res => {
      res.result.map(item => {
        item.value = item.groupId;
        item.label = item.groupName;
      });
      this.grouping = res.result;
    });
    getYscamera().then(res => {
      res.result.map(item => {
        item.value = item.deviceSerial + "_" + item.channelNo;
        item.label = item.channelName;
      });
      this.deviceSerialList = res.result;
    });
  },
  methods: {
    init() {
      this.loading = true;
      getbyGroupId()
        .then(res => {
          this.tableData = res.result;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    swicthGroupName(val) {
      return this.grouping.filter(i => i.value === val)[0].label;
    },
    resetValue() {
      this.selectValue = "";
    },
    //吧分组的id转换成别名显示
    groupIdSwicthName(id) {
      for (var i = 0; i < this.grouping.length; i++) {
        let item = this.grouping[i];
        if (item.groupId === id) {
          return item.groupName;
        }
      }
    },
    handleClick(row) {
      console.log(row);
    },
    addVideo() {
      this.centerDialogVisible = true;
      this.$nextTick(() => {
        this.$refs["addruleForm"].clearValidate();
      });
    },
    editAlias(item) {
      this.editId = item.id;
      for (let i in this.addruleForm) {
        if (i === "url") {
          this.addruleForm.url = item.url.split("=")[1];
        } else {
          this.addruleForm[i] = item[i];
        }
      }
      this.addruleForm.deviceSerialType =
        item.deviceSerial + "_" + item.channelNo;
      this.centerDialogVisible = true;
      this.$nextTick(() => {
        this.$refs["addruleForm"].clearValidate();
      });
    },
    reset() {
      this.editId = "";
      for (let i in this.addruleForm) {
        this.addruleForm[i] = "";
      }
    },
    saveGroup() {
      this.$refs["addruleForm"].validate(valid => {
        if (valid) {
          // 摄像头信息
          let itme = this.deviceSerialList.filter(
            i =>
              i.deviceSerial + "_" + i.channelNo ===
              this.addruleForm.deviceSerialType
          )[0];
          const params = {
            cameraAlias: this.addruleForm.cameraAlias,
            channelName: itme.channelName,
            url: `${this.baseUrl}${this.addruleForm.url}`,
            groupId: this.addruleForm.groupId,
            lat: this.addruleForm.lat,
            lon: this.addruleForm.lon,
            channelNo: itme.channelNo,
            deviceSerial: itme.deviceSerial,
            deviceType: this.addruleForm.deviceType,
            xRcs: 0.0,
            yRcs: 0.0,
            isgps: 0
          };
          const loadingInstance = Loading.service({
            fullscreen: true,
            lock: true,
            text: "Loading",
            background: "rgba(0, 0, 0, 0.5)"
          });
          if (this.editId) {
            editYscamera(params, this.editId)
              .then(() => {
                this.$notify({
                  title: "编辑成功",
                  type: "success",
                  duration: 2500
                });
                this.centerDialogVisible = false;
                this.init();
              })
              .finally(() => {
                loadingInstance.close();
              });
          } else {
            postYscamera(params)
              .then(() => {
                this.$notify({
                  title: "新增成功",
                  type: "success",
                  duration: 2500
                });
                this.centerDialogVisible = false;
                this.init();
              })
              .finally(() => {
                loadingInstance.close();
              });
          }
        }
      });
    },
    deleteGroup(row) {
      const gateId = row.id;
      this.$confirm("确认删除该摄像头吗", "提示", {
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
          deleteYscamera(gateId)
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
    async getCurrentAddress() {
      // 获取当前位子的坐标
      const addressObj = await this.$refs.getAddress.getAdress();
      this.addruleForm.lon = addressObj.lng;
      this.addruleForm.lat = addressObj.lat;
    },
    emitAdress(addressObj) {
      this.addruleForm.lon = addressObj.lng;
      this.addruleForm.lat = addressObj.lat;
      this.adressVisible = false;
      this.centerDialogVisible = true;
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
  .add_gateway {
    /deep/ .el-dialog {
      width: 800px !important;
      margin-top: 0 !important;
      top: 50%;
      height: 80%;
      overflow: auto;
      transform: translateY(-50%);
    }
  }
  .editgatedialog {
    /deep/ .el-dialog {
      width: 450px;
    }
  }
  .address_xz {
    padding-left: 110px;
    margin-bottom: 10px;
  }
}
</style>
