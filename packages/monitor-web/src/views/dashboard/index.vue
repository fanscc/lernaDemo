<template>
  <div class="dashboard-container">
    <div class="dashboard-container_nav">
      <selfCascader :path="PATH" @gateSwitch="gateSwitch" />
      <el-button type="primary" class="rg_position_big" @click="go_bigScreen"
        >大屏展示</el-button
      >
      <p class="dashboard-container_nav_title">
        <font style="color: #42b983;margin-right:4px">{{ gateName }}</font
        >网关下所有节点的信息
      </p>
    </div>
    <div class="sensors_conten">
      <div
        v-for="(ite, ind) in nodeArr"
        :key="ind"
        style="margin-bottom: 10px;"
      >
        <div>
          <!-- <vGraph v-for="(item,index) in ite.sensors" :node-id="ite.nodeId" :key="index" v-bind="item"/> -->
          <shownode v-bind="ite" />
        </div>
      </div>
      <div
        v-if="nodeArr.length === 0"
        style="text-align: center;font-size:20px;width:100%"
      >
        此网关下无节点
      </div>
    </div>
  </div>
</template>

<script>
const uid = JSON.parse(localStorage.getItem("userId"));
const PATH = [
  `/newman/user/${uid}/group`,
  `/newman/user/${uid}/gate?groupId`,
  `/newman/gate`
];
import { getGate, getNodeValue } from "@/api/equipment";
import selfCascader from "@/components/Cascader/index";
import shownode from "@/components/shownode/index";
import { Loading } from "element-ui";
export default {
  name: "Dashboard",
  components: { selfCascader, shownode },
  data() {
    return {
      PATH: PATH,
      gateName: "",
      nodeArr: [],
      accessToken: ""
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      // 初始化的时候就不去选择了请求网关接口默认选中第一个网关
      const gateId = (await this.getGaet()) || "";
      const loadingInstance = Loading.service({
        fullscreen: true,
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.5)"
      });
      if (gateId) {
        getNodeValue(gateId)
          .then(res => {
            this.nodeArr = res.result;
          })
          .finally(() => {
            loadingInstance.close();
          });
      } else {
        loadingInstance.close();
      }
    },
    getGaet() {
      return new Promise((resolve, reject) => {
        getGate()
          .then(res => {
            this.gateName = res.result[0] ? res.result[0].gateAlias : "";
            resolve(res.result[0] ? res.result[0].gateId : "");
          })
          .catch(() => {
            reject("");
          });
      });
    },
    gateSwitch(val) {
      this.gateName = val[1].name;
      const gateId = val[1].gateId;
      const loadingInstance = Loading.service({
        fullscreen: true,
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.5)"
      });
      getNodeValue(gateId)
        .then(res => {
          this.nodeArr = res.result;
        })
        .finally(() => {
          loadingInstance.close();
        });
    },
    go_bigScreen() {
      this.$router.push({
        path: "/bigScreen"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  height: 100%;
  padding: 20px;
  padding-right: 0;
}
.sensors_conten {
  margin-top: 20px;
  height: calc(100% - 60px);
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
}
.dashboard-container_nav {
  position: relative;
  height: 40px;
  .dashboard-container_nav_title {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 20px;
    font-weight: bold;
  }
}
.video_iframe {
  & /deep/ .el-dialog {
    width: 70%;
    max-width: 1200px;
    min-width: 600px;
  }
}
.rg_position {
  position: absolute;
  right: 120px;
  top: 0;
}
.rg_position_big {
  position: absolute;
  right: 20px;
  top: 0;
}
</style>
