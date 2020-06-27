<template>
  <div class="chart_conten">
    <div class="chart_conten_search">
      <el-form ref="form" :inline="true" label-width="110px">
        <el-form-item label="标题">
          <el-input v-model="searchFrom.title" style="width: 200px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchFrom.state"
            clearable
            placeholder="请选择状态"
          >
            <el-option label="有最新提问" value="1" />
            <el-option label="已阅读过的回复" value="2" />
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
        <div class="flex_conten">
          <p>
            {{ item.brief }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { topicLIst, setPublicTopicId } from "@/api/expertSystem";

export default {
  name: "NeedMyAnswer",
  filters: {
    stateName(val) {
      const objs = {
        "1": "有最新回复",
        "2": "已阅读过回复"
      };
      return objs[val];
    }
  },
  data: function() {
    return {
      loading: false,
      searchFrom: {
        title: "",
        state: ""
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
      topicLIst(params).then(res => {
        this.tableData = res.result;
      });
    },
    goAnswer(id) {
      setPublicTopicId(id, { state: 2 }).then(() => {});
      this.$router.push({
        path: "/expertSystem_hidden/answerDetails",
        query: { id: id, role: 2, statu: 1 }
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
  .newQustion {
    div {
      font-weight: bold;
    }
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
}
</style>
