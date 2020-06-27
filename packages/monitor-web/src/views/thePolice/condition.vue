<template>
  <div class="condition">
    <p class="condition_nav">
      报警条件
    </p>
    <div class="condition_conten">
      <el-form
        ref="numberValidateForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <ckytest
          :warning-save-arr="warningSaveArr"
          :threshold-arr="thresholdArr"
        />
        <el-form-item style="margin-top:40px">
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import ckytest from "./children.vue";
import { forecast, condition } from "@/api/thePolice";
import { Loading } from "element-ui";
export default {
  name: "Condition",
  components: {
    ckytest
  },
  data() {
    return {
      warningSaveArr: [{ warningType: "", leve: 0 }],
      thresholdArr: [],
      paramsStr: "",
      paramsName: "",
      editId: ""
    };
  },
  created() {
    this.editId = this.$route.query.id;
    this.getThresholdArr();
    if (this.editId) {
      // 编辑页
      const loadingInstance = Loading.service({
        fullscreen: true,
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.5)"
      });
      condition
        .getDetailCondition(this.editId)
        .then(res => {
          this.warningSaveArr = JSON.parse(res.result.warningSaveArr);
        })
        .finally(() => {
          loadingInstance.close();
        });
    }
  },
  methods: {
    getThresholdArr() {
      // 获取阀值表
      forecast.getforecastList().then(res => {
        this.thresholdArr = res.result.map(item => {
          return {
            id: item.id,
            alias: item.alias
          };
        });
      });
    },
    save() {
      this.paramsStr = "";
      this.paramsName = "";
      this.warningSaveArr.forEach((o, index) => {
        const selectArr = this.thresholdArr.filter(i => i.id === o.warningType);
        if (index === 0) {
          this.paramsStr += o.warningType;
          if (selectArr.length !== 0) {
            this.paramsName = selectArr[0].alias;
          }
        } else {
          this.paramsStr += (o.type === "add" ? "&" : "|") + o.warningType;
          if (selectArr.length !== 0) {
            this.paramsName +=
              (o.type === "add" ? "且" : "或") + selectArr[0].alias;
          }
        }
        // 判断有无组
        if (o.children && o.children.length > 0) {
          this.childrenAnalysis(o.children);
        }
      });
      const parmas = {
        express: this.paramsStr,
        expressAlias: this.paramsName,
        warningSaveArr: JSON.stringify(this.warningSaveArr)
      };
      const loadingInstance = Loading.service({
        fullscreen: true,
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.5)"
      });
      if (this.editId) {
        condition
          .editCondition(this.editId, parmas)
          .then(() => {
            this.$notify({
              title: "编辑成功",
              type: "success",
              duration: 2500
            });
            this.$router.push({ path: "/thePolice/conditionList" });
          })
          .finally(() => {
            loadingInstance.close();
          });
      } else {
        condition
          .addCondition(parmas)
          .then(() => {
            this.$notify({
              title: "新增成功",
              type: "success",
              duration: 2500
            });
            this.$router.push({ path: "/thePolice/conditionList" });
          })
          .finally(() => {
            loadingInstance.close();
          });
      }
    },
    childrenAnalysis(items) {
      items.forEach((j, index) => {
        const selectArr = this.thresholdArr.filter(i => i.id === j.warningType);
        if (index === 0) {
          this.paramsStr +=
            (j.type === "add" ? "&" : "|") + "(" + j.warningType;
          this.paramsName +=
            (j.type === "add" ? "且" : "或") + "(" + selectArr[0].alias;
        } else {
          this.paramsStr += (j.type === "add" ? "&" : "|") + j.warningType;
          this.paramsName +=
            (j.type === "add" ? "且" : "或") + selectArr[0].alias;
        }
        if (j.children && j.children.length > 0) {
          this.childrenAnalysis(j.children);
        }
      });
      this.paramsStr += ")";
      this.paramsName += ")";
    },
    goBack() {
      const view = { path: this.$route.path };
      const toPath = { path: "/thePolice/conditionList" };
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
  .condition_conten {
    padding-left: 40px;
  }
}
</style>
