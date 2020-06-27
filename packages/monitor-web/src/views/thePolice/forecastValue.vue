<template>
  <div class="forecastValue">
    <p class="forecastValue_nav">阀值设置</p>
    <div class="from_input">
      <el-form
        ref="numberValidateForm"
        :model="ValidateForm"
        :rules="rules"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="别名:" prop="alias">
          <el-input
            v-model="ValidateForm.alias"
            placeholder="请输入别名"
            style="width: 178px;"
          />
        </el-form-item>
        <el-form-item label="网关" prop="gateId">
          <el-select
            v-model="ValidateForm.gateId"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in gateArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="节点" prop="nodeId">
          <el-select
            v-model="ValidateForm.nodeId"
            :disabled="ValidateForm.gateId === ''"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in nodeArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="传感器" prop="sensorId">
          <el-select
            v-model="ValidateForm.sensorId"
            :disabled="ValidateForm.nodeId === ''"
            placeholder="请选择传感器"
          >
            <el-option
              v-for="item in sensorArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            ValidateForm.sensorId &&
              !equipmentArr.includes(parseInt(ValidateForm.sensorId / 1000))
          "
          :label="labelName + '最大值'"
          prop="maxTh"
        >
          <el-input
            v-model="ValidateForm.maxTh"
            placeholder="请输入最大值"
            style="width: 178px;"
          />
        </el-form-item>
        <el-form-item
          v-if="
            ValidateForm.sensorId &&
              !equipmentArr.includes(parseInt(ValidateForm.sensorId / 1000))
          "
          :label="labelName + '最小值'"
          prop="minTh"
        >
          <el-input
            v-model="ValidateForm.minTh"
            placeholder="请输入最小值"
            style="width: 178px;"
          />
        </el-form-item>
        <el-form-item
          v-if="
            ValidateForm.sensorId &&
              !equipmentArr.includes(parseInt(ValidateForm.sensorId / 1000))
          "
          label="超时时间"
          prop="timeout"
        >
          <el-input
            v-model="ValidateForm.timeout"
            placeholder="超时时间单位秒"
            style="width: 178px;"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { forecast } from "@/api/thePolice";
import { Loading } from "element-ui";
let checkJustEntered = false; // 判断是不是刚进
const equipmentArr = [9, 15, 16];
export default {
  name: "ForecastValue",
  data() {
    const validValue = (rule, value, callback) => {
      const doubleRule = /\d$/g;
      if (value && !doubleRule.test(value)) {
        callback(new Error("报警值只能数字"));
      } else {
        callback();
      }
    };
    const validValuetimeout = (rule, value, callback) => {
      const doubleRule = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (value && !doubleRule.test(value)) {
        callback(new Error("超时时间只能输入正数,且最多2位小数"));
      } else {
        callback();
      }
    };
    const validMax = (rule, value, callback) => {
      if (
        parseFloat(value) < this.ValidateForm.minTh &&
        this.ValidateForm.minTh
      ) {
        callback(new Error("最大值不能小于最小值"));
      } else {
        callback();
      }
    };
    const validMin = (rule, value, callback) => {
      if (
        parseFloat(value) > this.ValidateForm.maxTh &&
        this.ValidateForm.maxTh
      ) {
        callback(new Error("最小值不能大于最大值"));
      } else {
        callback();
      }
    };
    return {
      equipmentArr: equipmentArr, // 控制类
      ValidateForm: {
        alias: "",
        gateId: "", // 网关
        nodeId: "", // 节点
        sensorId: "", // 传感器
        maxTh: "",
        minTh: "",
        timeout: "" // 设置达到这个时间多久就报警
      },
      gateArr: [], // 网关数组
      nodeArr: [], // 节点数组
      sensorArr: [], // 传感器数组
      loadinggate: false,
      loadingnode: false,
      rules: {
        alias: [{ required: true, message: "请输入别名", trigger: "blur" }],
        gateId: [{ required: true, message: "请选择网关", trigger: "change" }],
        nodeId: [{ required: true, message: "请选择节点", trigger: "change" }],
        sensorId: [
          { required: true, message: "请选择传感器", trigger: "change" }
        ],
        maxTh: [
          { required: true, message: "请输入最大值", trigger: "blur" },
          { validator: validValue, trigger: "blur" },
          { validator: validMax, trigger: "blur" }
        ],
        minTh: [
          { required: true, message: "请输入最小值", trigger: "blur" },
          { validator: validValue, trigger: "blur" },
          { validator: validMin, trigger: "blur" }
        ],
        timeout: [{ validator: validValuetimeout, trigger: "blur" }]
      },
      editSensorId: ""
    };
  },
  computed: {
    labelName() {
      const name = this.$utils.fliterSensorName(this.ValidateForm.sensorId);
      return name;
    }
  },
  watch: {
    "ValidateForm.gateId": {
      handler(val) {
        if (val !== "") {
          if (!checkJustEntered) {
            this.ValidateForm.nodeId = "";
          }
          this.nodeArr = [];
          forecast.getSearchCycle(val, true).then(res => {
            this.nodeArr = res.result.map(item => {
              return {
                label: item.nodeName,
                value: item.nodeId,
                sensorArr: item.cycles ? item.cycles : []
              };
            });
          });
        }
      },
      deep: true,
      immediate: true
    },
    nodeArr() {
      if (checkJustEntered && this.nodeArr.length > 0) {
        this.sensorArr = [];
        let cyclesArr = [];
        this.nodeArr.map(item => {
          if (item.value === this.ValidateForm.nodeId) {
            cyclesArr = item.sensorArr;
          }
        });
        this.sensorArr = cyclesArr.map(o => {
          const name = this.$utils.fliterSensorName(o.sensor);
          return {
            label: name,
            value: o.sensor
          };
        });
        checkJustEntered = false;
      }
    },
    "ValidateForm.nodeId": {
      handler(val) {
        if (!checkJustEntered) {
          this.ValidateForm.sensorId = "";
          this.ValidateForm.maxTh = "";
          this.ValidateForm.minTh = "";
          this.ValidateForm.timeout = "";
        }
        if (val !== "") {
          this.sensorArr = [];
          let cyclesArr = [];
          this.nodeArr.map(item => {
            if (item.value === val) {
              cyclesArr = item.sensorArr;
            }
          });
          this.sensorArr = cyclesArr.map(o => {
            const name = this.$utils.fliterSensorName(o.sensor);
            return {
              label: name,
              value: o.sensor
            };
          });
        }
      },
      deep: true
    }
  },
  created() {
    checkJustEntered = true;
    this.editSensorId = this.$route.query.sensorId;
    // 获取网关
    forecast.getGate().then(res => {
      this.gateArr = res.result.map(item => {
        return {
          label: item.gateAlias,
          value: item.gateId
        };
      });
    });
    if (this.editSensorId) {
      // 编辑也先获取详情信息
      const loadingInstance = Loading.service({ fullscreen: true });
      forecast
        .getforecastlistDetail(this.editSensorId)
        .then(res => {
          for (const k in this.ValidateForm) {
            this.ValidateForm[k] = res.result[k] || "";
          }
        })
        .finally(() => {
          loadingInstance.close();
        });
    }
  },
  methods: {
    submitForm() {
      this.$refs.numberValidateForm.validate(valid => {
        if (valid) {
          const parmas = Object.assign({}, this.ValidateForm);
          const loadingInstance = Loading.service({ fullscreen: true });
          if (this.editSensorId) {
            forecast
              .editerforecast(this.editSensorId, parmas)
              .then(() => {
                this.$notify({
                  title: "编辑成功",
                  type: "success",
                  duration: 2500
                });
                this.$router.push({ path: "/thePolice/forecastList" });
              })
              .finally(() => {
                loadingInstance.close();
              });
          } else {
            forecast
              .addforecast(parmas)
              .then(() => {
                this.$notify({
                  title: "新增成功",
                  type: "success",
                  duration: 2500
                });
                this.$router.push({ path: "/thePolice/forecastList" });
              })
              .finally(() => {
                loadingInstance.close();
              });
          }
        }
      });
    },
    goBack() {
      const view = { path: this.$route.path };
      const toPath = { path: "/thePolice/forecastList" };
      this.$utils.closeTag(view, toPath);
    }
  }
};
</script>

<style lang="scss" scoped>
.forecastValue {
  height: 100%;
  .forecastValue_nav {
    font-size: 20px;
    margin: 0;
    margin-bottom: 10px;
    height: 40px;
    line-height: 40px;
    border-left: 5px solid blue;
    background: #eef;
    text-indent: 10px;
  }
}
</style>
