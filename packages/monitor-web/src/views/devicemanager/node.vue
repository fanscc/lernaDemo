<template>
  <div class="chart_conten_node">
    <div class="chart_conten_search">
      <el-form ref="form" :inline="true" label-width="110px" size="small">
        <el-form-item label="分组">
          <el-select
            v-model="groupValue"
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
        <el-form-item label="网关">
          <el-select
            :disabled="!groupValue"
            v-model="gatewayValue"
            style="width: 200px"
            placeholder="请选择"
            filterable
            class="fe-select-content"
            clearable
          >
            <el-option
              v-for="item in gatewaying"
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
        <!-- <el-button
          type="primary"
          icon="el-icon-refresh"
          size="small"
          @click="resetValue"
        >重置</el-button
        > -->
      </el-form>
      <el-button
        v-permission="['ADMIN', 'NODE_ALL', 'NODE_ADD']"
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
        style="width: 100%;flex:1"
        height="100%"
      >
        <el-table-column type="index" width="50" />
        <el-table-column prop="gateId" label="所属网关">
          <template slot-scope="scope">
            {{ gateWaySwitchName(scope.row.gateId) }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址" />
        <el-table-column prop="nodeName" label="节点别名" />
        <el-table-column prop="channel" label="节点通道" />
        <el-table-column prop="lat" label="经度" />
        <el-table-column prop="lon" label="纬度" />
        <el-table-column prop="nodeId" label="节点编号" />
        <el-table-column prop="sensors" label="传感器类型">
          <template slot-scope="scope">
            <span
              v-for="(ite, ind) in scope.row.sensors.split(',')"
              :key="ind"
              style="margin-left:5px;"
            >
              {{ fiterName(ite) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              v-permission="['ADMIN', 'NODE_ALL', 'NODE_EDIT']"
              type="success"
              size="mini"
              @click="editNode(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-permission="['ADMIN', 'NODE_ALL', 'NODE_DEL']"
              type="danger"
              size="mini"
              @click="deleteNode_method(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增节点 -->
    <el-dialog
      :visible.sync="centerDialogVisible"
      title="新增节点"
      class="addnodedialog"
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
          <el-form-item label="选择网关" prop="addway">
            <el-select
              v-model="addway_index"
              style="width: 200px"
              placeholder="请选择"
              class="fe-select-content"
              filterable
              clearable
              @change="change_method"
            >
              <el-option
                v-for="(item, index) in gateing"
                :key="item.gateId"
                :label="item.gateAlias"
                :value="index"
              />
            </el-select>
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
            <el-input v-model="addruleForm.addLat" class="fe-input-content" />
          </el-form-item>
          <el-form-item label="经度" prop="addLon">
            <el-input v-model="addruleForm.addLon" class="fe-input-content" />
          </el-form-item>
          <el-form-item label="节点地址" prop="addAddress">
            <el-input
              v-model="addruleForm.addAddress"
              class="fe-input-content"
              placeholder="只能输入正整数范围在0-65535之间"
            />
          </el-form-item>
          <el-form-item label="节点通道" prop="addChannel">
            <el-input
              v-model="addruleForm.addChannel"
              class="fe-input-content"
              placeholder="只能输入正整数范围在0-83之间"
            />
          </el-form-item>
          <p class="mg_l_100">
            <el-button
              :disabled="!gateImg"
              size="mini"
              type="primary"
              @click="sceneVisible = true"
              >场景地址选择</el-button
            >
          </p>
          <p class="mg_l_100">
            <span>x:</span><span>{{ styleObject.x }}</span> <span>y:</span
            ><span>{{ styleObject.y }}</span>
          </p>
          <el-form-item label="节点别名" prop="addAlias">
            <el-input v-model="addruleForm.addAlias" class="fe-input-content" />
          </el-form-item>
          <el-form-item label="传感器类型">
            <div class="SensorTypeDom">
              <div
                v-for="(item, index) in SensorType"
                :key="index"
                class="margin_bt"
              >
                <el-select
                  v-model="item.sensor"
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in SensorTypes"
                    filterable
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <label v-if="item.sensor != 9000 && item.sensor != 16000"
                  >采集周期</label
                >
                <span v-if="item.sensor != 9000 && item.sensor != 16000">
                  <el-input
                    v-model="item.interval"
                    style="width: 200px;"
                    class="fe-input-content"
                    placeholder="只能输入正整数单位(s)"
                    @keyup.native="checkInterVal(item)"
                  />
                </span>
                <el-button
                  v-if="index > 0"
                  type="danger"
                  size="mini"
                  @click="removeSensorType(index)"
                  >删除传感器</el-button
                >
              </div>
              <el-button size="mini" type="primary" @click="addSensorType"
                >增加传感器</el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveGroup">保存</el-button>
      </span>
    </el-dialog>
    <!-- eslint-disable -->
     <!-- 编辑别名 -->
    <el-dialog title="编辑节点" :visible.sync="editVisible"  class="edtirdialog">
      <span>
         <el-form
          :model="editruleForm"
          :rules="rules"
          ref="editruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="别名" prop="editOtherName">
            <el-input v-model="editruleForm.editOtherName"></el-input>
          </el-form-item>
          <div class="address_xz">
            <el-button type="primary" size="mini" @click="getCurrentAddress">获取当前地址</el-button>
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
            <el-input v-model="editruleForm.addLat" class="fe-input-content" />
          </el-form-item>
          <el-form-item label="经度" prop="addLon">
            <el-input v-model="editruleForm.addLon" class="fe-input-content" />
          </el-form-item>
          <el-form-item label="传感器类型">
            <div class="SensorTypeDom">
              <div
                v-for="(item, index) in SensorEditType"
                :key="index"
                class="margin_bt"
              >
                <el-select
                  v-model="item.sensor"
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in SensorTypes"
                    filterable
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <label v-if="item.sensor != 9000 && item.sensor != 16000"
                  >采集周期</label
                >
                <span v-if="item.sensor != 9000 && item.sensor != 16000">
                  <el-input
                    v-model="item.interval"
                    style="width: 200px;"
                    class="fe-input-content"
                    placeholder="只能输入正整数单位(s)"
                    @keyup.native="checkInterVal(item)"
                  />
                </span>
                <el-button
                  v-if="index > 0"
                  type="danger"
                  size="mini"
                  @click="removeSensorType(index)"
                  >删除传感器</el-button
                >
              </div>
              <el-button size="mini" type="primary" @click="addSensorType"
                >增加传感器</el-button
              >
            </div>
          </el-form-item>          
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = editing = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <select-the-seats
      ref="getAddress"
      v-show="adressVisible"
      @emitAdress="emitAdress"
    ></select-the-seats>
    <el-dialog title="场景选择" :visible.sync="sceneVisible"  center class="scene_dialog">
      <sceneIndex @styleObject_method="styleObject_method" :gatePic="gatePic"></sceneIndex>
    </el-dialog>
  </div>
</template>

<script>
// getOriginImg
import {
  getCycle,
  getGroup,
  getsearchGroup,
  getSearchCycle,
  getGate,
  addNode,
  editNode,
  deleteNode
} from "@/api/equipment";
import selectTheSeats from "@/components/map/selectTheSeats";
import sceneIndex from "@/components/scene";
import { Loading } from "element-ui";
export default {
  name: "Gateway",
  components: {
    selectTheSeats,
    sceneIndex
  },
  data: function() {
    const valiNumaddress = (rule, value, callback) => {
      const reg = /[1-9][0-9]*$/g;
      if (value === "") {
        callback(new Error("请输入内容"));
      } else if (!reg.test(value)) {
        callback(new Error("节点地址只能输入正整数"));
      } else if (parseFloat(value) > 65535) {
        callback(new Error("节点的地址范围在0-65535之间!"));
      } else {
        callback();
      }
    };
    const valiNumaddChannel = (rule, value, callback) => {
      const reg = /[1-9][0-9]*$/g;
      if (value === "") {
        callback(new Error("请输入内容"));
      } else if (!reg.test(value)) {
        callback(new Error("节点通道只能输入正整数"));
      } else if (parseFloat(value) > 83) {
        callback(new Error("节点通道范围在0-83之间!"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      groupValue: "", // 分组
      gatewayValue: "", // 网关
      inputValue: "",
      tableData: [],
      grouping: [], // 分组
      gatewaying: [], // 选择分组后带出来的网关
      gateing: [], // 网关
      centerDialogVisible: false,
      adressVisible: false, // 选择地址
      editing: false,
      editVisible: false,
      sceneVisible: false,
      styleObject: {
        x: 0,
        y: 0
      },
      addruleForm: {
        addGroup: "", // 分组
        addway: "", // 网关
        addInterval: "", // 采集时间间隔
        addLat: "",
        addLon: "",
        addAddress: "",
        addChannel: "",
        addAlias: ""
      },
      addway_index: "",
      gateImg: "", // 网关设置的图片
      editruleForm: {
        editOtherName: "", // 编辑别名
        addLat: "",
        addLon: "",
      },
      rules: {
        addGroup: [
          { required: true, message: "请选择的分组", trigger: "blur" }
        ],
        addway: [{ required: true, message: "请输入网关", trigger: "blur" }],
        addNodeId: [
          { required: true, message: "请选择传感器类型", trigger: "blur" }
        ],
        addInterval: [
          {
            required: true,
            message: "请输入传感器采集时间间隔",
            trigger: "blur"
          }
        ],
        addLat: [{ required: true, message: "请输入经度", trigger: "blur" }],
        addLon: [{ required: true, message: "请输入维度", trigger: "blur" }],
        addAddress: [
          { trigger: "blur", validator: valiNumaddress, required: true }
        ],
        addChannel: [
          { trigger: "blur", validator: valiNumaddChannel, required: true }
        ],
        addAlias: [
          { required: true, message: "请输入节点别名", trigger: "blur" }
        ],
        editOtherName: [
          { required: true, message: "请输入节点别名", trigger: "blur" }
        ]
      },
      SensorType: [{ sensor: "", interval: "" }], // 选中的传感器
      SensorEditType: [{ sensor: "", interval: "" }], // 选中的传感器
      SensorTypes: this.$utils.SensorTypes,
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
      id: "", // 编辑的id
      gatePic: "" // 网关图片
    };
  },
  watch: {
    groupValue(val) {
      this.gatewaying = [];
      this.gatewayValue = "";
      getsearchGroup(val).then(res => {
        res.result.map(item => {
          item.value = item.gateId;
          item.label = item.gateAlias;
        });
        this.gatewaying = res.result;
      });
    },
    sceneVisible(val) {
      if (val) {
        // 获取场景的图片
        this.gatePic = `/base/org/1/file?file=${this.gateImg}`;
      }
    }
  },
  created() {
    this.init();
    this.dictionary();
  },
  methods: {
    init() {
      this.loading = true;
      getCycle()
        .then(res => {
          this.tableData = res.result;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    fiterName(val) {
      return this.$utils.fliterSensorName(val);
    },
    change_method() {
      if (!this.addway_index && this.addway_index !== 0) {
        this.addruleForm.addway = "";
        this.gateImg = "";
      } else {
        this.addruleForm.addway = this.gateing[this.addway_index].gateId;
        this.gateImg = this.gateing[this.addway_index].map;
      }
    },
    resetValue() {
      this.gatewayValue = "";
    },
    dictionary() {
      getGroup().then(res => {
        res.result.map(item => {
          item.value = item.groupId;
          item.label = item.groupName;
        });
        this.grouping = res.result;
      });
      getGate().then(res => {
        res.result.map(item => {
          item.value = item.gateId;
          item.label = item.gateAlias;
        });
        this.gateing = res.result;
      });
    },
    //吧网关转换成名字
    gateWaySwitchName(id) {
      for (var i = 0; i < this.gateing.length; i++) {
        let item = this.gateing[i];
        if (item.gateId === id) {
          return item.gateAlias;
        }
      }
    },
    search() {
      if (!this.gatewayValue) {
        this.$notify({
          title: "请先选择网关",
          type: "warning",
          duration: 2500
        });
        return;
      }
      const groupId = this.gatewayValue;
      this.loading = true;
      getSearchCycle(groupId)
        .then(res => {
          this.tableData = res.result;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    editNode(item) {
      this.editing = true
      this.editVisible = true;
      this.id = item.nodeId;
    },
    async getCurrentAddress() {
      // 获取当前位子的坐标
      const addressObj = await this.$refs.getAddress.getAdress();
      if(!this.editing){
        this.addruleForm.addLon = addressObj.lng;
        this.addruleForm.addLat = addressObj.lat;
      }else{
        this.editruleForm.addLon = addressObj.lng;
        this.editruleForm.addLat = addressObj.lat;
      }
    },
    emitAdress(addressObj) {
      if(!this.editing){
        this.addruleForm.addLon = addressObj.lng;
        this.addruleForm.addLat = addressObj.lat;
        this.centerDialogVisible = true;
      }else{
        this.editruleForm.addLon = addressObj.lng;
        this.editruleForm.addLat = addressObj.lat;
        this.editVisible = true;
      }
      this.adressVisible = false;
    },
    checkInterVal(item) {
      const rel = /[1-9][0-9]*$/g;
      if (!rel.test(item.interval)) {
        this.$notify({
          title: "采取周期只能输入正整数",
          type: "warning",
          duration: 2500
        });
        this.$set(item, "interval", "");
      }
    },
    saveGroup() {
      this.$refs["addruleForm"].validate(valid => {
        if (valid) {
          const SensorCycle = [];
          const NodeBean = {
            sensors: []
          };
          /**
           * 传感器类型处理相同的传感器加个序号
           */
          this.SensorType.map((o, index) => {
            if (!o.sensor) return;
            let num = 1;
            for (var i = index - 1; i >= 0; i--) {
              if (o.sensor === this.SensorType[i].sensor) {
                num++;
              }
            }
            SensorCycle.push({});
            SensorCycle[index].sensor = o.sensor - 0 + num;
            SensorCycle[index].interval = o.interval;
            NodeBean.sensors.push(o.sensor - 0 + num);
          });
          NodeBean.sensors = NodeBean.sensors.join(",");
          NodeBean.nodeId = this.addruleForm.nodeId;
          NodeBean.lat = this.addruleForm.addLat;
          NodeBean.lon = this.addruleForm.addLon;
          NodeBean.address = this.addruleForm.addAddress;
          NodeBean.channel = this.addruleForm.addChannel;
          NodeBean.nodeName = this.addruleForm.addAlias;
          NodeBean.xRcs = this.styleObject.x;
          NodeBean.yRcs = this.styleObject.y;
          NodeBean.gateId = this.addruleForm.addway;
          NodeBean.cycles = SensorCycle;
          const loadingInstance = Loading.service({
            fullscreen: true,
            lock: true,
            text: "Loading",
            background: "rgba(0, 0, 0, 0.5)"
          });
          addNode(NodeBean)
            .then(() => {
              this.$notify({
                title: "新建成功",
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
    deleteNode_method(row) {
      const nodeId = row.nodeId;
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
          deleteNode(nodeId)
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
    saveEdit() {
      this.$refs["editruleForm"].validate(valid => {
        if (valid) {
          const SensorCycle = [];
          const NodeBean = {
            sensors: []
          }
           /**
           * 传感器类型处理相同的传感器加个序号
           */
          this.SensorEditType.map((o, index) => {
            if (!o.sensor) return;
            let num = 1;
            for (var i = index - 1; i >= 0; i--) {
              if (o.sensor === this.SensorEditType[i].sensor) {
                num++;
              }
            }
            SensorCycle.push({});
            SensorCycle[index].sensor = o.sensor - 0 + num;
            SensorCycle[index].interval = o.interval;
            NodeBean.sensors.push(o.sensor - 0 + num);
          });
          NodeBean.sensors = NodeBean.sensors.join(",");
          NodeBean.cycles = SensorCycle;
          const params = {
            nodeName: this.editruleForm.editOtherName,
            addLat: this.editruleForm.addLat,
            addLon: this.editruleForm.addLon,
            sensors: NodeBean.sensors,
            cycles: SensorCycle
          };
          this.loading = true;
          editNode(params, this.id)
            .then(() => {
              this.$notify({
                title: "编辑成功",
                type: "success",
                duration: 2500
              });
              this.editing = false;
              this.editVisible = false;
              this.init();
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    addSensorType() {
      if(!this.editing){
        this.SensorType.push({ sensor: "", interval: "" });
      }else{
        this.SensorEditType.push({ sensor: "", interval: "" });
      }  
    },
    removeSensorType(index) {
      if(!this.editing){
        this.SensorType.splice(index, 1);
      }else{
        this.SensorEditType.splice(index, 1);
      }  
    },
    styleObject_method(obj) {
      this.sceneVisible = false;
      this.styleObject.x = obj.left;
      this.styleObject.y = obj.top;
    }
  }
};
</script>

<style lang="scss" scoped>
.chart_conten_node {
  height: 100%;
  padding: 0 20px;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
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
  .margin_bt {
    margin-bottom: 10px;
  }
  .chart_conten_table {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
/deep/ .el-dialog {
  width: 700px;
  max-height: 70%;
}
.scene_dialog /deep/ .el-dialog {
  width: 1000px;
  max-height: 80%;
}
.mg_l_100 {
  margin-left: 100px;
}
.addnodedialog {
  /deep/ .el-dialog {
    width: 800px !important;
    margin-top: 0 !important;
    top: 50%;
    height: 80%;
    overflow: auto;
    transform: translateY(-50%);
  }
}
.edtirdialog {
  /deep/ .el-dialog {
    width: 800px;
  }
}
.address_xz {
  padding-left: 110px;
  margin-bottom: 10px;
}
</style>
