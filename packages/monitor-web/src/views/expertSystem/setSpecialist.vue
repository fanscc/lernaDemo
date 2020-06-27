<template>
  <div class="chart_conten">
    <div class="chart_conten_search">
      <el-form ref="form" :inline="true" label-width="110px">
        <el-form-item label="专家">
          <el-input v-model="from.name" class="fe-input-content" />
        </el-form-item>
        <el-form-item label="专业">
          <el-select v-model="from.majorId" clearable placeholder="请选择">
            <el-option
              v-for="item in specialtyArr"
              :key="item.id"
              :label="item.major"
              :value="item.id"
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
      </el-form>
      <!-- <el-button
        v-if="!choiceExpert"
        type="primary"
        icon="el-icon-plus"
        @click="add"
        >新增</el-button
      > -->
      <el-button v-if="choiceExpert" type="primary" @click="choiceExpert_method"
        >确定选择</el-button
      >
    </div>

    <div ref="topictable" class="chart_conten_table">
      <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="tableData"
        :cell-style="bodyStyle"
        :header-cell-style="headerStyle"
        :class="[choiceExpert ? 'choiceExpert_class' : '']"
        height="100%"
        stripe
        show-overflow-tooltip
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="index" width="50" />
        <el-table-column v-if="choiceExpert" type="selection" width="55" />
        <el-table-column prop="username" label="专家" />
        <el-table-column prop="expertMajor" label="专业" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column prop="email" label="邮箱" />
      </el-table>
    </div>

    <!-- 新增专家 -->
    <!-- <addSpecia
      v-if="!choiceExpert"
      :specialtyArr="specialtyArr"
      @init="init"
      ref="addSpeciaDom"
    /> -->
  </div>
</template>

<script>
import { getExpertList, specialtyList } from "@/api/expertSystem";

export default {
  name: "expertList",
  props: {
    choiceExpert: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      loading: false,
      from: {
        name: "", // 专家
        majorId: "" // 专业
      },
      specialtyArr: [], // 专业下拉框
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
      multipleSelection: []
    };
  },
  created() {
    this.init();
    // 获取专业下拉框
    specialtyList().then(res => {
      this.specialtyArr = res.result;
    });
  },
  methods: {
    init() {
      this.loading = true;
      let params = this.from;
      getExpertList(params)
        .then(res => {
          this.tableData = res.result;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    add() {
      this.$refs.addSpeciaDom.open();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    choiceExpert_method() {
      // 调取接口
      const selectArr = this.multipleSelection.slice();
      this.$refs.multipleTable.clearSelection();
      this.$emit("choiceExpert", selectArr);
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
    width: 450px;
    max-height: 70%;
    overflow: auto;
  }
  .choiceExpert_class {
    height: 400px !important;
    overflow: auto;
  }
}
</style>
