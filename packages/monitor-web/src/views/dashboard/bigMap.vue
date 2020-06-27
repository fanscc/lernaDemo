<template>
  <div class="map_big">
    <div class="nav_conten">
      <div v-cloak style="position: relative;">
        <el-button type="primary" class="return_btn" @click="$router.go(-1)"
          >返回</el-button
        >
        <span class="times"
          >{{ year }}年{{ month + 1 }}月{{ date }}日&nbsp;&nbsp;星期{{
            day
          }}&nbsp;&nbsp;{{ hours }}:{{ minutes }}:{{ seconds }}</span
        >
      </div>
      <div style="font-size: 30px;line-height:60px">农科智慧农业(华南地区)</div>
      <div>
        <img
          id="u23_img"
          class="img "
          src="../../assets/img/u23.png"
          style="height: 80px; margin-top: -10px;"
        />
      </div>
    </div>
    <div class="map_conten" style="display: flex">
      <map_left></map_left>
      <map_center></map_center>
      <map_right></map_right>
    </div>
  </div>
</template>

<script>
import map_center from "./common/center.vue";
import map_left from "./common/left.vue";
import map_right from "./common/right.vue";
export default {
  data() {
    return {
      year: null,
      month: null,
      day: null,
      date: null,
      hours: null,
      minutes: null,
      seconds: null,
      timer: null
    };
  },
  mounted() {
    this.timer = setInterval(() => {
      this.getTime(); // 修改数据date
    }, 1000);
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  methods: {
    getTime() {
      let dates = new Date();
      this.year = dates.getFullYear();
      this.month = dates.getMonth();
      this.date = dates.getDate();
      this.day = this.toChina(dates.getDay());
      this.hours = dates.getHours();
      this.minutes = dates.getMinutes();
      this.seconds = dates.getSeconds();
      if (this.seconds < 10) {
        this.seconds = "0" + this.seconds;
      }
      if (this.minutes < 10) {
        this.minutes = "0" + this.minutes;
      }
      if (this.hours < 10) {
        this.hours = "0" + this.hours;
      }
    },
    toChina(day) {
      let objs = {
        1: "一",
        2: "二",
        3: "三",
        4: "四",
        5: "五",
        6: "六",
        0: "日"
      };
      return objs[day];
    }
  },
  components: {
    map_left,
    map_center,
    map_right
  }
};
</script>

<style lang="scss" scoped>
[v-cloak] {
  display: none;
}
.map_big {
  height: 100%;
  background: url(../../assets/img/bg.png) no-repeat center;
  background-size: 100% 100%;
  color: #fff;
  .nav_conten {
    display: flex;
    height: 50px;
    line-height: 50px;
    font-weight: 900;
    .times {
      display: inline-block;
      font-family: "Arial Negreta", "Arial Normal", "Arial";
      font-weight: 700;
      font-style: normal;
      color: #ffffff;
      vertical-align: middle;
    }
    & > div {
      text-align: center;
      line-height: 50px;
    }
    div:nth-of-type(1) {
      width: 30%;
    }
    div:nth-of-type(2) {
      width: 40%;
    }
    div:nth-of-type(3) {
      width: 30%;
    }
  }
  .map_conten {
    height: calc(100% - 50px);
    overflow: hidden;
  }
  .mRl10 {
    margin: 0 10px;
  }
  .cursorPoint {
    cursor: pointer;
  }
  .return_btn {
    position: absolute;
    left: 10px;
    top: 12px;
  }
}
</style>
