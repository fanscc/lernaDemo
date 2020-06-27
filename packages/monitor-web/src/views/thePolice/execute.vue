<template>
  <div class="condition">
    <p class="condition_nav">
      执行设置
    </p>
    <div class="condition_conten">
      <el-form
        ref="numberValidateForm"
        :model="ValidateForm"
        :rules="rules"
        label-width="200px"
        class="demo-ruleForm"
      >
        <el-form-item label="别名:" prop="alias">
          <el-input
            v-model="ValidateForm.alias"
            placeholder="请输入别名"
            style="width: 178px;"
          />
        </el-form-item>
        <el-form-item label="告警条件:" prop="conditionId">
          <el-select
            v-model="ValidateForm.conditionId"
            placeholder="请选择告警条件"
          >
            <el-option
              v-for="item in emergencyArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="对策方案:" prop="bodyId">
          <el-select v-model="ValidateForm.bodyId" placeholder="请选择对策方案">
            <el-option
              v-for="item in countermeasureArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <p class="mackValue">设置对策方案的值:</p>
        <div>
          <el-form-item
            v-for="(it, index) in checkParams"
            :key="index"
            :label="it.commit + ':'"
            :class="[it.require === 'true' ? 'required' : '']"
          >
            <el-input
              v-model="ValidateForm.extraParam[it.name]"
              :placeholder="it.commit"
              style="width: 178px;"
            />
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { condition, execute } from "@/api/thePolice";
import { Loading } from "element-ui";
let checkJustint = false;
export default {
  name: "Condition",
  data() {
    return {
      ValidateForm: {
        alias: "", // 别名
        conditionId: "", // 选择的告警条件
        bodyId: "", // 选择的对策表
        extraParam: {} // 对策表的值
      },
      checkParams: [],
      rules: {
        alias: [{ required: true, message: "请输入别名", trigger: "blur" }],
        conditionId: [
          { required: true, message: "请选择的告警条件", trigger: "change" }
        ],
        bodyId: [
          { required: true, message: "请对策表的条件", trigger: "change" }
        ]
      },
      emergencyArr: [], // 告警条件
      countermeasureArr: [], // 对策方案数组
      editId: ""
    };
  },
  watch: {
    "ValidateForm.bodyId": function(val) {
      if (!checkJustint) {
        // 如果是编辑页面就不请空
        this.ValidateForm.extraParam = {};
      }
      this.countermeasureArr.forEach(o => {
        if (val === o.value) {
          this.checkParams = o.checkParams;
        }
      });
      checkJustint = false;
    }
  },
  created() {
    this.getEmergencyArr();
    this.getCountermeasureArr();
    this.editId = this.$route.query.id;
    if (this.editId) {
      checkJustint = true;
      // 获取
      const loadingInstance = Loading.service({
        fullscreen: true,
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.5)"
      });
      execute
        .getDetailExecute(this.editId)
        .then(res => {
          const datas = res.result;
          this.ValidateForm.alias = datas.alias;
          this.ValidateForm.conditionId = datas.conditionId;
          this.ValidateForm.bodyId = datas.bodyId;
          if (datas.alarmExecutionBody) {
            this.checkParams = JSON.parse(datas.alarmExecutionBody.checkParams);
          } else {
            this.checkParams = [];
          }
          const objs = datas.extraParam ? JSON.parse(datas.extraParam) : {};
          for (const k in objs) {
            this.$set(this.ValidateForm.extraParam, k, objs[k]);
          }
        })
        .finally(() => {
          loadingInstance.close();
        });
    }
  },
  methods: {
    // 获取告警条件数组
    getEmergencyArr() {
      condition.getalarmCondition().then(res => {
        this.emergencyArr = res.result.map(item => {
          return {
            value: item.id,
            label: item.expressAlias
          };
        });
      });
    },
    // 获取对策方案数组
    getCountermeasureArr() {
      execute.getCountermeasureList().then(res => {
        this.countermeasureArr = res.result.map(item => {
          return {
            value: item.id,
            label: item.bodyAlias,
            checkParams: JSON.parse(item.checkParams)
          };
        });
      });
    },
    save() {
      this.$refs.numberValidateForm.validate(valid => {
        if (valid) {
          // 判断必填项是否填了s
          for (let i = 0; i < this.checkParams.length; i++) {
            const item = this.checkParams[i];
            if (
              item.require === "true" &&
              !this.ValidateForm.extraParam[item.name]
            ) {
              this.$message.warning(item.commit + "为必填项");
              return;
            }
          }
          const params = {
            alias: this.ValidateForm.alias,
            conditionId: this.ValidateForm.conditionId,
            bodyId: this.ValidateForm.bodyId,
            extraParam: JSON.stringify(this.ValidateForm.extraParam)
          };
          const loadingInstance = Loading.service({
            fullscreen: true,
            lock: true,
            text: "Loading",
            background: "rgba(0, 0, 0, 0.5)"
          });
          if (this.editId) {
            execute
              .editExecute(this.editId, params)
              .then(() => {
                this.$notify({
                  title: "编辑成功",
                  type: "success",
                  duration: 2500
                });
                this.$router.push({ path: "/thePolice/executeList" });
              })
              .finally(() => {
                loadingInstance.close();
              });
          } else {
            execute
              .addExecute(params)
              .then(() => {
                this.$notify({
                  title: "新增成功",
                  type: "success",
                  duration: 2500
                });
                this.$router.push({ path: "/thePolice/executeList" });
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
      const toPath = { path: "/thePolice/executeList" };
      this.$utils.closeTag(view, toPath);
    }
  }
};
</script>

<style lang="scss" scoped>
.condition {
  height: 100%;
  .condition_nav {
    font-size: 20px;
    margin: 0;
    margin-bottom: 10px;
    height: 40px;
    line-height: 40px;
    border-left: 5px solid blue;
    background: #eef;
    text-indent: 10px;
  }
  .margin_10R {
    margin-left: 10px;
  }
  .biaosi {
    margin: 0 0 18px 220px;
    width: 2px;
    height: 50px;
    line-height: 50px;
    text-indent: 6px;
    background: #409eff;
  }
  .mackValue {
    text-indent: 30px;
    font-size: 18px;
    font-weight: bold;
  }
  .required {
    /deep/ .el-form-item__label:before {
      content: "*";
      color: red;
      position: relative;
      left: -4px;
      font-size: 14px;
    }
  }
}
</style>
