<template>
  <div class="monitoring">
    <div class="monitoring_left">
      <template v-if="showOrhidden">
        <div
          class="bor333"
          v-for="(item, index) in urlVideo"
          :key="index"
          :style="{
            width: activeShow === 1 ? '100%' : '50%',
            height: activeShow === 4 ? '50%' : '100%'
          }"
        >
          <iframe
            :src="item"
            width="100%"
            height="100%"
            :id="`ysOpenDevice_${index}`"
            allowfullscreen
          >
          </iframe>
        </div>
        <div
          v-if="urlVideo.length === 0"
          style="text-indent: 20px;font-weight: bold;"
        >
          暂无在线摄像头
        </div>
      </template>
    </div>
    <div class="monitoring_right">
      <p class="col_white">显示:</p>
      <div class="inline_block" style="margin-bottom: 20px;">
        <span
          class="inline_block"
          style="background:#4b637d; border: 1px solid #fff; width: 25px;height: 25px;margin-right: 20px; cursor: pointer;"
          :style="{ background: activeShow === 1 ? '#007aff' : '#4b637d' }"
          @click="witchShow(1)"
        >
        </span>
        <span
          class="inline_block"
          style="background:#4b637d; border: 1px solid #fff; width: 25px;height: 25px;position: relative; margin-right: 20px; cursor: pointer;"
          :style="{ background: activeShow === 2 ? '#007aff' : '#4b637d' }"
          @click="witchShow(2)"
        >
          <i
            style="border: 1px solid #fff;position: absolute;left: 11px; height: 24px;"
          ></i>
        </span>
        <span
          class="inline_block"
          :style="{ background: activeShow === 4 ? '#007aff' : '#4b637d' }"
          @click="witchShow(4)"
          style="background:#4b637d; border: 1px solid #fff; width: 25px;height: 25px;position: relative; margin-right: 20px; cursor: pointer;"
        >
          <i
            style="border: 1px solid #fff;position: absolute;left: 11px; height: 24px;"
          ></i>
          <i
            style="border: 1px solid #fff;position: absolute;top: 11px; width: 24px;"
          ></i>
        </span>
      </div>
      <p class="col_white">分页:</p>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="activeShow"
        :total="total"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getVideoToken, cameraList } from "@/api/videoSurveillance/index";
import { getToken, setVideToken } from "@/utils/auth";
import deviceSerial from "@/utils/video";
export default {
  name: "videoLive",
  data() {
    return {
      accessToken: "",
      urlVideo: [],
      page: 0,
      activeShow: 1,
      showOrhidden: true,
      total: 0
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
  },
  methods: {
    init() {
      // 获取摄像头列表
      const formData = new FormData();
      formData.append("accessToken", this.accessToken);
      /**
       * 这里因为是直接调取的海康的接口，没办法控制只显示在线的设备所以先写死传50然后自己过滤
       */
      formData.append("pageStart", 0);
      formData.append("pageSize", 50);
      cameraList(formData).then(res => {
        let videoArr = res.data.filter(i => i.status === 1);
        this.urlVideo = videoArr
          .slice(
            this.page * this.activeShow,
            this.activeShow + this.page * this.activeShow
          )
          .map(i => {
            let checkCode = deviceSerial[i.deviceSerial]
              ? deviceSerial[i.deviceSerial] + "@"
              : "";
            return `https://open.ys7.com/ezopen/h5/iframe_se?url=ezopen://${checkCode}open.ys7.com/${i.deviceSerial}/${i.channelNo}.live&autoplay=1&accessToken=${this.accessToken}`;
          });
        this.total = videoArr.length;
        // 重新刷新
        this.showOrhidden = false;
        this.$nextTick(() => {
          this.showOrhidden = true;
        });
      });
    },
    witchShow(index) {
      this.page = 0;
      this.activeShow = index;
      this.init();
    },
    handleCurrentChange(val) {
      this.page = val - 1;
      this.init();
    }
  }
};
</script>

<style lang="scss" scoped>
.monitoring {
  height: calc(100% - 60px);
  display: flex;
  flex-wrap: wrap;
  .monitoring_left {
    height: 100%;
    width: calc(100% - 300px);
    display: flex;
    flex-wrap: wrap;
    & > div {
      width: 50%;
      height: 50%;
    }
  }
  .monitoring_right {
    width: 300px;
    padding: 10px;
    background: #333;
    height: calc(100% - 2px);
    color: #fff;
  }
  .bor333 {
    border: 1px solid #333;
  }
  .inline_block {
    display: inline-block;
  }
}
</style>
