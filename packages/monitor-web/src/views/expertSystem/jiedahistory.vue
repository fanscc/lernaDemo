<template>
  <div class="chart_conten">
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
      >
        <div>{{ item.title }}</div>
        <div class="flex_conten">
          <p>
            {{ item.brief }}
          </p>
        </div>
        <el-button
          class="publick_btn"
          type="primary"
          @click.stop="publick_answer(item.id)"
          >公开</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { topicLIst, setPublicTopicId } from "@/api/expertSystem";

export default {
  name: "NeedMyAnswer",
  data: function() {
    return {
      loading: false,
      searchFrom: {
        title: "",
        state: 100
      },
      tableData: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let params = Object.assign({}, this.searchFrom);
      topicLIst(params).then(res => {
        this.tableData = res.result;
      });
    },
    publick_answer(id) {
      let params = {
        state: 200
      };
      setPublicTopicId(id, params).then(() => {
        this.$message.success("公开成功");
        this.init();
      });
    },
    goAnswer(id) {
      this.$router.push({
        path: "/expertSystem_hidden/answerDetails",
        query: { id: id, role: 2, statu: 100 }
      });
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
  .chart_conten_table {
    height: calc(100% - 124px);
    border: 1px solid #ebeef5;
  }
  .quertion_item {
    position: relative;
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
    .publick_btn {
      position: absolute;
      right: 10px;
      top: 15px;
    }
  }
  .flex_conten {
    display: flex;
    justify-content: space-between;
    padding: 0 10px !important;
    .pub_btn {
      transform: translateY(-10px);
    }
  }
}
</style>
