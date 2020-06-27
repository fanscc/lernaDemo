<template>
  <div class="left_center">
    <h4 class="left_center_nav">
      数据采集
      <div>
        <img src="../../../assets/img/line1.gif" />
      </div>
    </h4>
    <div>
      <leftTop></leftTop>
    </div>
    <h4 class="left_center_nav">
      社会服务
      <div>
        <img src="../../../assets/img/line1.gif" />
      </div>
    </h4>
    <div class="left-top">
      <div class="swiper-container swiper2">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <div v-for="item in 6" :key="item" class="item_tip">
              茶叶产量低
            </div>
          </div>
          <div class="swiper-slide">
            <div v-for="item in 6" :key="item" class="item_tip">
              茶叶除虫
            </div>
          </div>
          <div class="swiper-slide">
            <div v-for="item in 6" :key="item" class="item_tip">
              茶叶浇水
            </div>
          </div>
        </div>
      </div>
      <!-- <span class="top-left-wiper2"></span>
        <span class="top-right-wiper2"></span> -->
    </div>
  </div>
</template>

<script>
import leftTop from "./leftTop.vue";
import Swiper from "swiper";
export default {
  data() {
    return {};
  },
  components: {
    leftTop
  },
  mounted() {
    this.$nextTick(() => {
      new Swiper(".left-top .swiper2", {
        navigation: {
          nextEl: ".top-left-wiper2",
          prevEl: ".top-right-wiper2"
        },
        speed: 1000,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        loop: true,
        observer: true,
        observeParents: true,
        direction: "vertical",
        onSlideChangeEnd: function(swiper) {
          swiper.update(); //swiper更新
        },
        autoplayDisableOnInteraction: false
      });
    });
  }
};
</script>

<style lang="scss" scoped>
.left_center {
  width: 25%;
  height: 100%;
  .left_center_nav {
    height: 40px;
    text-align: center;
    font-size: 20px;
  }
  .left-top {
    position: relative;
    padding: 0 50px;
    height: calc(100% - 40px);
    .swiper-container {
      height: 100%;
      .swiper-wrapper {
        height: 100%;
      }
      .swiper-slide {
        height: 100%;
      }
    }
    .top-left-wiper2,
    .top-right-wiper2 {
      position: absolute;
      top: 50%;
      display: inline-block;
      width: 18px;
      height: 45px;
      margin-top: -22.5px;
      outline: none;
      cursor: pointer;
    }
    .top-left-wiper2 {
      background: url(../../../assets/img/u122.png) no-repeat center;
      background-size: 100%;
      right: 4%;
    }
    .top-right-wiper2 {
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
      cursor: pointer;
    }
    .item_tip:hover {
      background: rgba(149, 146, 59, 0.5) !important;
    }
    .item_tip:nth-of-type(odd) {
      background: rgba(24, 33, 106, 0.77);
    }
    .item_tip:nth-of-type(even) {
      background: rgba(59, 64, 136, 0.57);
    }
  }
}
</style>
