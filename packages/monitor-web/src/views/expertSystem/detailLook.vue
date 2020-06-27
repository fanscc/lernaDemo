<template>
  <div class="questions">
    <div class="questions_conten">
      <div>
        <div class="questions_conten_nav">
          <div>鸡蛋怎么变大</div>
        </div>
      </div>
      <div class="questions_conten_details">
        <div class="questions_conten_details_left">
          <div
            v-viewer
            ref="scrollDom"
            class="questions_conten_details_left_scroll"
          >
            <div
              v-for="(item, index) in messageArray"
              :key="index"
              style="overflow: hidden;margin-bottom: 10px;"
            >
              <div v-if="item.type === 1" class="user">
                <p>{{ item.name }}</p>
                <p v-if="item.coontenType === 1">{{ item.text }}</p>
                <p v-if="item.coontenType === 2">
                  <img :src="item.text" alt=" " />
                </p>
              </div>
              <div v-if="item.type === 2" class="specialist">
                <p>{{ item.name }}</p>
                <p v-if="item.coontenType === 1">{{ item.text }}</p>
                <p
                  v-if="item.coontenType === 2"
                  style="max-width: 200px;position:relative;cursor:pointer"
                >
                  <el-progress
                    v-if="item.status === 1"
                    :percentage="percentage"
                    type="circle"
                    class="progressDilog"
                  />
                  <img
                    :src="item.text"
                    :style="{ opacity: item.status === 1 ? 0.5 : 1 }"
                    alt=" "
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="questions_conten_details_right">
          <div class="questions_intro">
            群简介: '怎么让鸡蛋变大'
          </div>
          <div class="questions_user">
            <p @click="personalDetail">用户A</p>
            <p @click="personalDetail">专家A</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 个人信息 -->
    <personalDetail ref="personalDetailDom" />
    <div class="questions_footer">
      <el-button
        class="pub_btn"
        type="primary"
        plain="plain"
        @click="$router.go(-1)"
        >返回</el-button
      >
    </div>
  </div>
</template>

<script>
import personalDetail from "../expertSystem/common/personalDetail.vue";
import Viewer from "v-viewer";
import Vue from "vue";
import "viewerjs/dist/viewer.css";
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 100000
  }
});
export default {
  name: "answerTheHistoryDetail",
  components: {
    personalDetail
  },
  data() {
    return {
      textarea: "",
      messageArray: [
        { type: 1, text: "鸡蛋很小", name: "用户A", coontenType: 1 },
        { type: 2, text: "多吃大米", name: "专家A", coontenType: 1 }
      ]
    };
  },
  methods: {
    personalDetail() {
      console.log(1);
      this.$refs.personalDetailDom.open();
    }
  }
};
</script>

<style lang="scss" scoped>
.questions {
  height: 100%;
  p {
    margin: 0;
  }
  max-width: 1200px;
  padding: 20px;
  .questions_nav {
    margin-bottom: 10px;
  }
  .questions_conten {
    border: 1px solid #ddd;
    height: calc(100% - 40px);
    .questions_conten_nav {
      position: relative;
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #ddd;
      div:nth-of-type(1) {
        margin: 0;
        font-size: 18px;
        text-align: center;
        font-weight: bold;
      }
    }
  }
  .questions_conten_details {
    height: calc(100% - 50px);
    display: flex;
    flex-wrap: wrap;
    .questions_conten_details_left {
      width: calc(100% - 181px);
      height: 100%;
      padding: 10px 10px 0 10px;
      .questions_conten_details_left_scroll {
        height: 100%;
        overflow: auto;
      }
      .import {
        & /deep/ .el-textarea__inner {
          border: none;
        }
      }
      .sendMsg {
        height: 80px;
        border-top: 1px solid #ddd;
        position: relative;
        .send_btn {
          display: flex;
          position: absolute;
          right: 4px;
          bottom: 4px;
        }
      }
      .user {
        text-align: left;
        margin-bottom: 20px;
        p:nth-of-type(1) {
          font-size: 12px;
          color: #666;
          margin-bottom: 6px;
          text-align: left;
        }
        p:nth-of-type(2) {
          padding: 4px;
          border-radius: 4px;
          background: #ccc;
          float: left;
          line-height: 20px;
        }
        p:nth-of-type(2) {
          img {
            width: 100%;
          }
          .progressDilog {
            position: absolute;
            width: 100px;
            height: 100px;
            left: 50%;
            top: 50%;
            margin-left: -50px;
            margin-top: -50px;
            z-index: 9;
            & /deep/ .el-progress-circle {
              width: 100px !important;
              height: 100px !important;
            }
          }
        }
      }
      .specialist {
        p:nth-of-type(1) {
          font-size: 12px;
          color: #666;
          margin-bottom: 6px;
          text-align: right;
        }
        p:nth-of-type(2) {
          float: right;
          padding: 4px;
          border-radius: 4px;
          background: #ccc;
          line-height: 20px;
        }
        p:nth-of-type(2) {
          img {
            width: 100%;
          }
          .progressDilog {
            position: absolute;
            width: 100px;
            height: 100px;
            left: 50%;
            top: 50%;
            margin-left: -50px;
            margin-top: -50px;
            z-index: 9;
            & /deep/ .el-progress-circle {
              width: 100px !important;
              height: 100px !important;
            }
          }
        }
        margin-bottom: 20px;
      }
    }
    .questions_conten_details_right {
      width: 180px;
      height: 100%;
      font-size: 12px;
      line-height: 20px;
      padding: 5px;
      border-left: 1px solid #ddd;
      .questions_intro {
        padding: 20px 0;
        max-height: 300px;
        overflow: auto;
        border-bottom: 1px solid #ddd;
        margin-bottom: 20px;
      }
    }
  }
  .questions_user {
    font-size: 14px;
    p {
      padding: 6px 0;
      cursor: pointer;
      color: #1890ff;
    }
  }
  .questions_footer {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .addSpecialist {
    position: absolute;
    top: 10px;
    right: 20px;
  }
  .pl_30 {
    padding-left: 30px;
  }
}
</style>
<style>
.questions_conten_details_left_scroll::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
  scrollbar-arrow-color: red;
}
.questions_conten_details_left_scroll::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
  scrollbar-arrow-color: red;
}
.questions_conten_details_left_scroll::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
</style>
