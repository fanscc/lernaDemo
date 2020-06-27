<template>
  <div>
    <div v-for="(ite, $index) in warningSaveArr" :key="$index">
      <p
        v-if="$index !== 0"
        :style="{ marginLeft: `${ite.leve * 40 + 160}px` }"
        class="biaosi"
      >
        {{ ite.type === "add" ? "并" : "或" }}
      </p>
      <div
        :style="{ paddingLeft: `${ite.leve * 40}px` }"
        style="margin-top: 10px;"
      >
        <label>预警方案: </label>
        <el-select v-model="ite.warningType" placeholder="请选择预警方案">
          <el-option
            v-for="item in thresholdArr"
            :key="item.id"
            :label="item.alias"
            :value="item.id"
          />
        </el-select>

        <span class="margin_10L">
          <el-button
            v-if="$index === warningSaveArr.length - 1"
            type="primary"
            @click="addcombine(ite)"
            >并且</el-button
          >
          <el-button
            v-if="$index === warningSaveArr.length - 1"
            type="success"
            @click="addor(ite)"
            >或者</el-button
          >
          <el-button
            v-if="!ite.children || ite.children.length === 0"
            type="primary"
            @click="childrenAddcombine(ite)"
            >组且</el-button
          >
          <el-button
            v-if="!ite.children || ite.children.length === 0"
            type="primary"
            @click="childrenAddor(ite)"
            >组或</el-button
          >
          <el-button
            v-if="$index !== warningSaveArr.length - 1 || ite.leve !== 0"
            type="danger"
            @click="remove($index)"
            >删除</el-button
          >
        </span>
      </div>
      <p
        v-if="ite.children && ite.children.length > 0"
        :style="{ marginLeft: `${ite.leve * 40 + 160}px` }"
        class="biaosi"
      >
        {{ ite.children[0].type === "add" ? "并" : "或" }}
      </p>
      <p
        v-if="ite.children && ite.children.length > 0"
        :style="{ paddingLeft: `${ite.leve * 40}px` }"
      >
        [
      </p>
      <CkytextCom
        v-if="ite.children && ite.children.length > 0"
        :warning-save-arr="ite.children"
        :threshold-arr="thresholdArr"
      />
      <p
        v-if="ite.children && ite.children.length > 0"
        :style="{ paddingLeft: `${ite.leve * 40}px` }"
      >
        ]
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "CkytextCom",
  props: {
    warningSaveArr: {
      type: Array,
      default: () => {
        return [];
      }
    },
    thresholdArr: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    addcombine(item) {
      console.log(item);
      this.warningSaveArr.push({
        warningType: "",
        type: "add",
        leve: item.leve
      });
    },
    childrenAddcombine(item) {
      if (!item.children) {
        this.$set(item, "children", []);
        item.children.push({
          warningType: "",
          type: "add",
          leve: item.leve + 1
        });
      } else {
        item.children.push({
          warningType: "",
          type: "add",
          leve: item.leve + 1
        });
      }
    },
    addor(item) {
      this.warningSaveArr.push({
        warningType: "",
        type: "or",
        leve: item.leve
      });
    },
    childrenAddor(item) {
      if (!item.children) {
        this.$set(item, "children", []);
        item.children.push({
          warningType: "",
          type: "or",
          leve: item.leve + 1
        });
      } else {
        item.children.push({
          warningType: "",
          type: "or",
          leve: item.leve + 1
        });
      }
    },
    remove(index) {
      this.warningSaveArr.splice(index, 1);
    },
    removeObj(item) {
      console.log(1, item);
      item.children = [];
      delete item.children;
      console.log(2, item);
    }
  }
};
</script>
<style lang="scss" scoped>
.biaosi {
  margin-top: 14px;
  margin-bottom: 14px;
  width: 2px;
  height: 50px;
  line-height: 50px;
  text-indent: 6px;
  background: #409eff;
}
</style>
