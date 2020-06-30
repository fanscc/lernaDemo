<template>
  <div class="chart_conten">
    <div class="chart_conten_search">
      <el-form ref="form" :inline="true" label-width="110px" size="small">
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
      </el-form>
      <el-button
        v-permission="['ADMIN', 'GATEWAY_ALL', 'GATEWAY_ADD']"
        type="primary"
        icon="el-icon-plus"
        @click="centerDialogVisible = true"
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
        <el-table-column prop="groupId" label="所属分组">
          <template slot-scope="scope">
            {{ groupIdSwicthName(scope.row.groupId) }}
          </template>
        </el-table-column>
        <el-table-column prop="gateAlias" label="网关别名" />
        <el-table-column prop="macId" label="网关mac地址" />
        <el-table-column prop="lat" label="纬度" />
        <el-table-column prop="lon" label="经度" />
        <el-table-column prop="address" label="地址" />
        <el-table-column prop="channel" label="通道" />
        <el-table-column label="通讯方式">
          <template slot-scope="scope">
            {{
              scope.row.netType == 1
                ? "zigbee"
                : scope.row.netType == 2
                ? "lora"
                : ""
            }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.operation == 1 || scope.row.operation == 3"
              type="success"
              size="mini"
              @click="editAlias(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-if="scope.row.operation == 2 || scope.row.operation == 3"
              type="danger"
              size="mini"
              @click="deleteGroup(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增网关 -->
    <el-dialog
      :visible.sync="centerDialogVisible"
      class="add_gateway"
      title="新增网关"
      width="50%"
      center
    >
      <span>
        <el-form
          ref="addruleForm"
          :model="addruleForm"
          :rules="rules"
          label-width="110px"
          class="demo-ruleForm"
        >
          <el-form-item label="分组" prop="addselectValue">
            <el-select
              v-model="addruleForm.addselectValue"
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
          <el-form-item label="网关别名" prop="addAlias">
            <el-input v-model="addruleForm.addAlias" class="fe-input-content" />
          </el-form-item>
          <el-form-item label="网关mac地址" prop="addMacId">
            <el-input v-model="addruleForm.addMacId" class="fe-input-content" />
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
          <el-form-item label="纬度" prop="addLat">
            <el-input
              v-model="addruleForm.addLat"
              readonly="readonly"
              placeholder="请选择地址"
              class="fe-input-content"
            />
          </el-form-item>
          <el-form-item label="经度" prop="addLon">
            <el-input
              v-model="addruleForm.addLon"
              placeholder="请选择地址"
              readonly="readonly"
              class="fe-input-content"
            />
          </el-form-item>
          <el-form-item label="网关地址" prop="addAddress">
            <el-input
              v-model="addruleForm.addAddress"
              class="fe-input-content"
              placeholder="只能输入正整数范围在0-65535之间"
            />
          </el-form-item>
          <el-form-item label="网关通道" prop="addChannel">
            <el-input
              v-model="addruleForm.addChannel"
              class="fe-input-content"
              placeholder="只能输入正整数范围在0-83之间"
            />
          </el-form-item>
          <el-form-item label="网关通讯方式" prop="netType">
            <el-select
              v-model="addruleForm.netType"
              style="width: 200px"
              placeholder="请选择"
              class="fe-select-content"
              clearable
            >
              <el-option key="1" label="zigbee" value="1" />
              <el-option key="2" label="lora" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="室内或室外" prop="addressStyle">
            <el-select
              v-model="addruleForm.addressStyle"
              style="width: 200px"
              placeholder="请选择"
              class="fe-select-content"
              clearable
            >
              <el-option key="1" label="室内" value="1" />
              <el-option key="2" label="室外" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="上传图片">
            <uploadPic
              v-if="centerDialogVisible"
              v-model="picName"
              :add-mac-id="addruleForm.addMacId"
          /></el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveGroup">保存</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户 -->
    <el-dialog
      :visible.sync="editVisible"
      title="修改网关"
      class="editgatedialog"
      center
    >
      <span>
        <el-form
          ref="editruleForm"
          :model="editruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="网关别名" prop="editOtherName">
            <el-input v-model="editruleForm.editOtherName" />
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editsaveGroup">确 定</el-button>
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
  getGate,
  getGroup,
  getsearchGroup,
  editeGate,
  addGate,
  deleteGate
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
    const valiNumaddress = (rule, value, callback) => {
      const reg = /[1-9][0-9]*$/g;
      if (value === "") {
        callback(new Error("请输入内容"));
      } else if (!reg.test(value)) {
        callback(new Error("网关地址只能输入正整数"));
      } else if (parseFloat(value) > 65535) {
        callback(new Error("网关的地址范围在0-65535之间!"));
      } else {
        callback();
      }
    };
    const valiNumaddChannel = (rule, value, callback) => {
      const reg = /[1-9][0-9]*$/g;
      if (value === "") {
        callback(new Error("请输入内容"));
      } else if (!reg.test(value)) {
        callback(new Error("网关通道只能输入正整数"));
      } else if (parseFloat(value) > 83) {
        callback(new Error("网关通道范围在0-83之间!"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      grouping: [],
      selectValue: "",
      inputValue: "",
      tableData: [],
      centerDialogVisible: false,
      editId: "",
      editVisible: false,
      adressVisible: false,
      addruleForm: {
        addselectValue: "", // 新增的时候选择的分组
        addLon: "", // 维度
        addLat: "", // 纬度
        addMacId: "", // 网关mac地址
        addAlias: "", // 网关别名
        addAddress: "", // 网关地址
        addChannel: "", // 网关通道
        netType: "", // 网关通讯方式
        addressStyle: "1"
      },
      picName: "", // 上传图片的地址
      editruleForm: {
        editOtherName: "" // 编辑的别名
      },
      rules: {
        addselectValue: [
          { required: true, message: "请选择的分组", trigger: "change" }
        ],
        addLon: [{ required: true, message: "请选择维度", trigger: "blur" }],
        addLat: [{ required: true, message: "请选择纬度", trigger: "blur" }],
        addMacId: [
          { required: true, message: "请输入网关mac地址", trigger: "blur" }
        ],
        addAlias: [
          { required: true, message: "请输入网关别名", trigger: "blur" }
        ],
        addAddress: [
          { trigger: "blur", validator: valiNumaddress, required: true }
        ],
        addChannel: [
          { trigger: "blur", validator: valiNumaddChannel, required: true }
        ],
        netType: [
          { required: true, message: "请选择网关的通讯方式", trigger: "change" }
        ],
        addressStyle: [
          {
            required: true,
            message: "请选择是室内网关还是室外",
            trigger: "change"
          }
        ],
        editOtherName: [
          { required: true, message: "请输入网关别名", trigger: "blur" }
        ]
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
  },
  methods: {
    init() {
      this.loading = true;
      getGate()
        .then(res => {
          this.tableData = res.result;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    resetValue() {
      this.selectValue = "";
    },
    search() {
      if (this.selectValue) {
        this.loading = true;
        getsearchGroup(this.selectValue)
          .then(res => {
            this.tableData = res.result;
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.init();
      }
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
    editAlias(item) {
      this.editId = item.gateId;
      this.editVisible = true;
    },
    editsaveGroup() {
      this.$refs["editruleForm"].validate(valid => {
        if (valid) {
          const params = {
            gateAlias: this.editruleForm.editOtherName
          };
          const loadingInstance = Loading.service({
            fullscreen: true,
            lock: true,
            text: "Loading",
            background: "rgba(0, 0, 0, 0.5)"
          });
          editeGate(params, this.editId)
            .then(() => {
              this.$notify({
                title: "编辑成功",
                type: "success",
                duration: 2500
              });
              this.editVisible = false;
              this.init();
            })
            .finally(() => {
              loadingInstance.close();
            });
        }
      });
    },
    saveGroup() {
      this.$refs["addruleForm"].validate(valid => {
        if (valid) {
          const params = {
            macId: this.addruleForm.addMacId,
            gateAlias: this.addruleForm.addAlias,
            lat: this.addruleForm.addLat,
            lon: this.addruleForm.addLon,
            groupId: this.addruleForm.addselectValue,
            map: this.picName,
            address: this.addruleForm.addAddress,
            channel: this.addruleForm.addChannel,
            netType: parseFloat(this.addruleForm.netType),
            isGps: parseFloat(this.addruleForm.addressStyle)
          };
          const loadingInstance = Loading.service({
            fullscreen: true,
            lock: true,
            text: "Loading",
            background: "rgba(0, 0, 0, 0.5)"
          });
          addGate(params)
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
      });
    },
    deleteGroup(row) {
      const gateId = row.gateId;
      this.$confirm(
        "删除该网关该下面的节点也会删除,确定删除该网关吗?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          const loadingInstance = Loading.service({
            fullscreen: true,
            lock: true,
            text: "Loading",
            background: "rgba(0, 0, 0, 0.5)"
          });
          deleteGate(gateId)
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
      this.addruleForm.addLon = addressObj.lng;
      this.addruleForm.addLat = addressObj.lat;
    },
    emitAdress(addressObj) {
      this.addruleForm.addLon = addressObj.lng;
      this.addruleForm.addLat = addressObj.lat;
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
