<template>
  <div class="control">
    <div>
      <iframe
        :src="videoUrl"
        width="100%"
        height="100%"
        id="ysOpenDevice"
        allowfullscreen
      >
      </iframe>
    </div>
    <div style="padding: 10px; background: #333;height: calc(100% - 2px);">
      <el-row>
        <span style="margin-right: 4px;" class="col_white">选择摄像头:</span>
        <el-select
          v-model="camera"
          filterable
          placeholder="请选择"
          @change="switchVideo"
        >
          <el-option
            v-for="item in cameraArr"
            :key="item.value"
            :label="item.channelName"
            :value="item.deviceSerial + ':' + item.channelNo"
          >
          </el-option>
        </el-select>
      </el-row>
      <el-row style="width: 280px;">
        <p class="col_white">云台速度:</p>
        <span
          class="action_span"
          :style="{
            background: activeSpeed === item.value ? '#007aff' : '#4b637d'
          }"
          v-for="(item, $index) in speedArr"
          :key="$index"
          @click="activeSpeed = item.value"
          >{{ item.label }}</span
        >
      </el-row>
      <el-row style="width: 280px;">
        <p class="col_white">操作命令:</p>
        <span
          class="action_span"
          :style="{
            background: activeDirection === $index ? '#007aff' : '#4b637d'
          }"
          v-for="(item, $index) in direction"
          :key="$index"
          @click="ptzStart($index)"
          >{{ item }}</span
        >
      </el-row>
      <el-row style="width: 280px;">
        <p class="col_white">停止:</p>
        <span class="action_span" @click="ptzStop">停止</span>
      </el-row>
    </div>
  </div>
</template>

<script>
import { ptzStart, ptzStop } from "@/api/videoSurveillance/index";
import { getVideoToken, cameraList } from "@/api/videoSurveillance/index";
import { getToken, setVideToken } from "@/utils/auth";
import deviceSerial from "@/utils/video";
export default {
  name: "consoleControl",
  data() {
    return {
      player: null,
      camera: "",
      cameraArr: [],
      videoUrl: "",
      directionNum: 0, // 操作指定
      direction: [
        "上",
        "下",
        "左",
        "右",
        "左上",
        "左下",
        "右上",
        "右下",
        "放大",
        "缩小",
        "近焦距",
        "远焦距"
      ],
      speedArr: [{ label: "适中", value: 1 }, { label: "快", value: 2 }],
      activeDirection: "",
      activeSpeed: 1
    };
  },
  created() {
    if (!getToken("video_token")) {
      // 获取token
      const formData = new FormData();
      formData.append("appKey", "fec5127cdbea4e45926a1fb6c826e4d8");
      formData.append("appSecret", "8bb710bd65ab43b5e489cee5be0fe17e");
      getVideoToken(formData)
        .then(res => {
          if (res.code === "200") {
            setVideToken("video_token", res.data.accessToken, 6.5);
            this.accessToken = res.data.accessToken;
            this.init();
          }
        })
        .catch(() => {});
    } else {
      this.accessToken = getToken("video_token");
      this.init();
    }
    this.$nextTick(() => {
      this.player = document.getElementById("ysOpenDevice").contentWindow;
    });
  },
  methods: {
    init() {
      // 获取摄像头列表
      const formData = new FormData();
      formData.append("accessToken", this.accessToken);
      formData.append("pageStart", 0);
      formData.append("pageSize", 50);
      cameraList(formData).then(res => {
        let videoArr = res.data.filter(i => i.status === 1);
        this.cameraArr = videoArr;
        if (this.cameraArr.length > 0) {
          this.camera =
            this.cameraArr[0].deviceSerial + ":" + this.cameraArr[0].channelNo;
          let checkCode = deviceSerial[this.cameraArr[0].deviceSerial]
            ? deviceSerial[this.cameraArr[0].deviceSerial] + "@"
            : "";
          this.videoUrl = `https://open.ys7.com/ezopen/h5/iframe_se?url=ezopen://${checkCode}open.ys7.com/${this.cameraArr[0].deviceSerial}/${this.cameraArr[0].channelNo}.live&autoplay=1&accessToken=${this.accessToken}&templete=3`;
        }
      });
    },
    ptzStart(index) {
      if (!this.camera) {
        return this.$message.error("没有选择摄像头");
      }
      this.directionNum = index;
      const formData = new FormData();
      formData.append("accessToken", this.accessToken);
      formData.append("deviceSerial", this.camera.split(":")[0]);
      formData.append("channelNo", this.camera.split(":")[1]);
      formData.append("direction", this.directionNum);
      formData.append("speed", this.activeSpeed);
      this.activeDirection = index;
      ptzStart(formData).then(res => {
        this.$message.success(res.msg);
      });
    },
    ptzStop() {
      const formData = new FormData();
      formData.append("accessToken", this.accessToken);
      formData.append("deviceSerial", this.camera.split(":")[0]);
      formData.append("channelNo", this.camera.split(":")[1]);
      formData.append("direction", this.activeDirection);
      ptzStop(formData).then(res => {
        this.$message.success(res.msg);
      });
    },
    switchVideo(val) {
      let checkCode = "";
      if (val.split(":")[0] === "D99567630") {
        checkCode = "YYVZQO@";
      }
      this.videoUrl = `https://open.ys7.com/ezopen/h5/iframe_se?url=ezopen://${checkCode}open.ys7.com/${
        val.split(":")[0]
      }/${val.split(":")[1]}.live&autoplay=1&accessToken=${this.accessToken}`;
    }
  }
};
</script>
<style lang="scss" scoped>
.control {
  height: calc(100% - 60px);
  display: flex;
  flex-wrap: wrap;
  & > div:nth-of-type(1) {
    width: calc(100% - 300px);
    height: 100%;
  }
  .action_span {
    padding: 5px 8px;
    color: #fff;
    background: #4b637d;
    border-radius: 2px;
    cursor: pointer;
    display: inline-block;
    margin-right: 8px;
    margin-bottom: 10px;
  }
  .col_white {
    color: #fff;
  }
}
</style>
