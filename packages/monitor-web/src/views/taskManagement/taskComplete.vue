<template>
  <div class="taskComplete">
    <div class="taskComplete_nav">
      <p>
        <span>任务标题:</span><span>{{ details.title }}</span> <span>ID:</span
        ><span>{{ details.taskId }}</span>
      </p>
      <p>
        <span>状态:</span><span>{{ details.state | stateName }}</span>
        <span>处理人:</span><span>{{ details.executorName }}</span>
      </p>
      <p>
        <span>创建人:</span><span>{{ details.creatorName }}</span>
        <span>创建时间:</span><span>{{ details.createTs }}</span>
      </p>
      <p>
        <span>操作类型:</span>
        <span>
          {{ details.type | typeName }}
        </span>
      </p>
    </div>
    <h4>操作要求:</h4>
    <div v-html="details.content" />
    <div class="taskComplete_complete">
      <h4>完成情况:</h4>
      <div class="complete_div" v-html="details.detail" />
      <div>
        <img
          v-for="(item, index) in details.photo"
          :key="index"
          :src="item"
          style="width:400px;height:300px;"
        />
      </div>
      <div v-if="details.lon || details.lat">
        <p>
          地址信息:
        </p>
        <p>
          <span>经度:</span>
          <span>{{ details.lon }}</span>
          <span>维度:</span>
          <span>{{ details.lat }}</span>
        </p>
      </div>
      <p>
        <span>状态更新时间:</span><span>{{ details.updateTs }}</span>
      </p>
    </div>
    <p class="flex_center">
      <el-button type="primary" size="mini" @click="goBack">返回</el-button>
    </p>
  </div>
</template>

<script>
import { looktask } from "@/api/task";
export default {
  name: "TaskComplete",
  filters: {
    stateName(val) {
      const objs = {
        "0": "待分配",
        "1": "进行中",
        "2": "完成",
        "3": "终止"
      };
      return objs[val];
    },
    typeName(val) {
      const objs = {
        "1": "扫码",
        "2": "拍照",
        "3": "打卡",
        "4": "其他"
      };
      if (val) {
        const valArr = val.split(",");
        let str = "";
        valArr.map(o => {
          str += objs[o] + ",";
        });
        return str.substring(0, str.length - 1);
      }
      return "";
    }
  },
  data() {
    return {
      details: {
        title: "a",
        taskId: 1,
        executorName: 1,
        type: "",
        conductor: "",
        creator: "",
        creatorTime: "",
        conten: "",
        photo: []
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const taskId = this.$route.query.id;
      looktask(taskId).then(res => {
        if (res.result.photo) {
          res.result.photo = res.result.photo.split(",");
        }
        this.details = res.result;
      });
    },
    goBack() {
      const view = { path: "/taskManagementIndex/taskComplete" };
      this.$utils.closeTag(view);
    }
  }
};
</script>
<style lang="scss" scoped>
.taskComplete {
  padding: 20px;
  width: 1000px;
  .taskComplete_nav {
    p {
      height: 30px;
      display: flex;
      align-items: center;
      span {
        display: inline-block;
      }
      span:nth-of-type(odd) {
        width: 100px;
        text-align: right;
      }
      span:nth-of-type(even) {
        margin-left: 5px;
        width: 500px;
        text-align: left;
        font-weight: bold;
      }
    }
  }
  .flex_center {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  .complete_div {
    padding: 10px;
  }
}
</style>
