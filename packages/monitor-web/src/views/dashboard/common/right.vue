<template>
  <div class="right_center">
    <div class="conten_video">
      <h4 style="font-size: 20px;">
        视频监控
        <div>
          <img src="../../../assets/img/line1.gif" />
        </div>
      </h4>
      <div>
        <scroll-pane ref="scrollPane" style="height:110px" class="video_scroll">
          <iframe
            v-for="item in urlVideo"
            :key="item"
            :src="item"
            width="70%"
            height="100px"
            id="ysopen"
            style="margin-right: 10px;"
            allowfullscreen
          >
          </iframe>
          <div
            v-if="urlVideo.length === 0"
            style="text-indent: 20px;font-weight: bold;"
          >
            暂无在线摄像头
          </div>
        </scroll-pane>
      </div>
    </div>
    <div class="conten_renwu">
      <h4>
        任务
        <div>
          <img src="../../../assets/img/line1.gif" />
        </div>
      </h4>
      <div class="right-top">
        <div class="swiper-container swiper1">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <div v-for="item in 6" :key="item" class="item_tip">打卡</div>
            </div>
            <div class="swiper-slide">
              <div v-for="item in 6" :key="item" class="item_tip">扫描</div>
            </div>
          </div>
        </div>
        <span class="top-left"></span>
        <span class="top-right"></span>
      </div>
    </div>
    <div class="conten_tip">
      <h4>
        告警
        <div>
          <img src="../../../assets/img/line1.gif" />
        </div>
      </h4>
      <div>
        <div class="right-top">
          <div class="swiper-container swiper1">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
                <div v-for="item in 6" :key="item" class="item_tip">高温</div>
              </div>
              <div class="swiper-slide">
                <div v-for="item in 6" :key="item" class="item_tip">缺水</div>
              </div>
            </div>
          </div>
          <span class="top-left"></span>
          <span class="top-right"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swiper from "swiper";
import ScrollPane from "@/components/ScrollPane";
import { getVideoToken, cameraList } from "@/api/videoSurveillance/index";
import { getToken, setVideToken } from "@/utils/auth";
import deviceSerial from "@/utils/video";
export default {
  data() {
    return {
      accessToken: "",
      urlVideo: []
    };
  },
  components: { ScrollPane },
  created() {
    this.getToken();
  },
  mounted() {
    this.$nextTick(() => {
      new Swiper(".right-top .swiper1", {
        navigation: {
          nextEl: ".top-left",
          prevEl: ".top-right"
        },
        autoplay: true,
        loop: false,
        observer: true,
        disableOnInteraction: false,
        observeParents: true,
        onSlideChangeEnd: function(swiper) {
          swiper.update(); //swiper更新
        },
        autoplayDisableOnInteraction: false
      });
    });
  },
  methods: {
    getToken() {
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
              this.cameraList();
            }
          })
          .catch(() => {});
      } else {
        this.accessToken = getToken("video_token");
        this.cameraList();
      }
    },
    cameraList() {
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
        this.urlVideo = videoArr.map(i => {
          let checkCode = deviceSerial[i.deviceSerial]
            ? deviceSerial[i.deviceSerial] + "@"
            : "";
          return `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://${checkCode}open.ys7.com/${i.deviceSerial}/${i.channelNo}.live&autoplay=1&accessToken=${this.accessToken}`;
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.right_center {
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .conten_renwu,
  .conten_tip {
    flex: 1;
    font-size: 20px;
  }
  .right-top {
    position: relative;
    padding: 0 50px;
    .top-left,
    .top-right {
      position: absolute;
      top: 50%;
      display: inline-block;
      width: 18px;
      height: 45px;
      margin-top: -22.5px;
      outline: none;
      cursor: pointer;
    }
    .top-left {
      background: url(../../../assets/img/u122.png) no-repeat center;
      background-size: 100%;
      right: 4%;
    }
    .top-right {
      background: url(../../../assets/img/u123.png) no-repeat center;
      background-size: 100%;
      left: 4%;
    }
    .item_tip {
      display: flex;
      justify-content: space-between;
      height: 30px;
      line-height: 30px;
      box-sizing: border-box;
      margin-bottom: 5px;
      padding: 0 10px;
      font-size: 16px;
      cursor: pointer;
    }
    .item_tip:nth-of-type(odd) {
      background: rgba(24, 33, 106, 0.77);
    }
    .item_tip:nth-of-type(even) {
      background: rgba(59, 64, 136, 0.57);
    }
    .item_tip:hover {
      background: rgba(149, 146, 59, 0.5) !important;
    }
  }
  .conten_video,
  .conten_renwu,
  .conten_tip {
    text-align: center;
  }
}
.video_scroll {
  & /deep/ .el-scrollbar__wrap {
    height: 110px;
    overflow: hidden;
  }
}
</style>
