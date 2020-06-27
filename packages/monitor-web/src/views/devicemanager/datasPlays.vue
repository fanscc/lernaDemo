<template>
  <div class="datasDisplay">
    <div class="buttonSwitch">
      <ul>
        <li
          v-for="(value, key, index) in nodeDataArr"
          :key="index"
          class="transducer"
        >
          <span
            :class="[activeSensor == key ? 'active' : '']"
            @click="activeSensor = key"
            >{{ key }}</span
          >
        </li>
      </ul>
    </div>

    <div class="buttonSwitch">
      <ul>
        <li
          v-for="(item, index) of nodeDataArr[activeSensor]"
          :key="index"
          class="param"
          @click="showHistoryVal(item)"
        >
          <span class="title" style="background: #78909c;color: #fff;">
            <i :class="item.iconName" class="iconfont" />
            {{ item.name }}
          </span>
          <span
            v-if="
              parseInt(item.sensor / 1000) != 8 &&
                parseInt(item.sensor / 1000) != 9 &&
                parseInt(item.sensor / 1000) != 16 &&
                parseInt(item.sensor / 1000) != 15
            "
            class="value"
            >{{ item.value || "暂无数据" }}</span
          >
          <span v-if="parseInt(item.sensor / 1000) == 15"
            >经纬度:{{ item.value }},{{ item.value2 }}</span
          >
          <span v-else style="margin-right:10px;" />
        </li>
        <li
          v-show="
            nodeDataArr[activeSensor] && nodeDataArr[activeSensor].length == 0
          "
          class="no-sensor"
        >
          暂无设备~
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    nodeDataArr: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      activeSensor: "空气"
    };
  },
  watch: {},
  methods: {
    showHistoryVal(item) {
      this.$emit("showHistoryVal", item);
    },
    resetNode() {
      this.activeSensor = "空气";
    }
  }
};
</script>
<style lang="scss" scope>
.datasDisplay {
  .buttonSwitch {
    ul {
      display: flex;
      li {
        span {
          padding: 10px;
          font-size: 16px;
          color: #42b983;
          cursor: pointer;
        }
        span.active {
          background: #42b983;
          color: #fff;
        }
      }
    }
  }
  .transducer {
    margin-left: 20px;
    margin-bottom: 20px;
  }
  .iconfont {
    margin-right: 0 !important;
  }
}
</style>
