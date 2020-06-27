<template>
  <div class="chart_conten">
    <div class="chart_conten_nav">
      <div>
        华山众创
      </div>
      <div>
        <span @click="goLogin">登录</span>
        <span @click="register">注册</span>
      </div>
    </div>
    <div class="chart_conten_search">
      <el-form ref="form" :inline="true" label-width="110px">
        <el-form-item label="标题">
          <el-input v-model="searchFrom.title" style="width: 200px" />
        </el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          class="ml_20"
          @click="init"
          >搜索</el-button
        >
      </el-form>
    </div>

    <div class="chart_conten_table">
      <div
        class="quertion_item"
        @click="goAnswer(item.id)"
        v-for="item in tableData"
        :key="item.id"
        :class="[item.state === 1 ? 'newQustion' : '']"
      >
        <div>{{ item.title }}</div>
        <p>
          {{ item.brief }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { publicityList } from "@/api/expertSystem";
export default {
  name: "classicQ",
  data() {
    return {
      loading: false,
      searchFrom: {
        title: ""
      },
      tableData: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let params = this.searchFrom;
      publicityList(params).then(res => {
        this.tableData = res.result;
      });
    },
    goAnswer(id) {
      this.$router.push({
        path: "/socialWorkDetail",
        query: { id: id }
      });
    },
    goLogin() {
      this.$router.push({
        path: "/login"
      });
    },
    register() {
      this.$router.push({
        path: "/register"
      });
    }
  }
};
</script>

<style lang="scss" scope>
.chart_conten {
  height: 100%;
  padding: 50px 20px 0 20px;
  overflow-x: hidden;
  position: relative;
  .chart_conten_search {
    padding: 20px 0;
  }
  .ml_20 {
    margin-left: 20px;
  }
  .chart_conten_table {
    height: calc(100% - 124px);
    border: 1px solid #ebeef5;
    overflow: auto;
  }
  .quertion_item {
    div,
    p {
      margin: 0;
      padding: 0;
      line-height: 30px;
      text-indent: 30px;
    }
    p {
      font-size: 12px;
      color: #666;
    }
    cursor: pointer;
    border-bottom: 1px solid #ebeef5;
  }
  .flex_conten {
    display: flex;
    justify-content: space-between;
    padding: 0 10px !important;
    .pub_btn {
      transform: translateY(-10px);
    }
  }
  .chart_conten_nav {
    position: fixed;
    height: 50px;
    top: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    background-color: #fff;
    -webkit-box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    div:nth-of-type(1) {
      font-size: 18px;
      font-weight: bold;
    }
    div:nth-of-type(2) {
      span {
        cursor: pointer;
      }
      span:nth-of-type(1) {
        font-size: 14px;
        color: #0681d0;
        margin-right: 20px;
      }
      span:nth-of-type(2) {
        font-size: 14px;
        color: #0681d0;
        border-radius: 30%;
        padding: 5px;
        border: 1px solid #0681d0;
      }
    }
  }
}
</style>
