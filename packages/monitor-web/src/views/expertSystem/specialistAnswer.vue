<template>
  <div class="questions">
    <div class="questions_conten">
      <div>
        <div class="questions_conten_nav">
          <div>{{ titleObj.title }}</div>
          <el-button
            type="primary"
            v-if="role == 2 && statu != 100"
            class="addSpecialist"
            @click="chooseExpert"
            >添加别的专家</el-button
          >
        </div>
      </div>
      <div class="questions_conten_details">
        <div class="questions_conten_details_left">
          <div
            v-viewer
            ref="scrollDom"
            class="questions_conten_details_left_scroll"
          >
            <el-button v-if="oldLen>=30" type="primary" size="mini" @click="more" :loading="moreLoading" style="margin: 0 auto;display: block;">查看更多</el-button>
            <div
              v-for="(item, index) in messageArray"
              :key="index"
              style="overflow: hidden;margin-bottom: 10px;"
            >
              <div v-if="item.uidRole == 1" class="user">
                <p>{{ item.username || "游客" }}:</p>
                <p v-if="item.contentType === 1">{{ item.content }}</p>
                <p
                  v-if="item.contentType === 2"
                  style="max-width: 200px;position:relative;cursor:pointer"
                >
                  <el-progress
                    v-if="item.status === 1"
                    :percentage="percentage"
                    type="circle"
                    class="progressDilog"
                  />
                  <img
                    :src="item.content"
                    @load="loaded"
                    :style="{ opacity: item.status === 1 ? 0.5 : 1 }"
                    alt="图片加载失败"
                  />
                </p>
              </div>
              <div v-if="item.uidRole == 2" class="specialist">
                <p>{{ item.username || "专家" }}:</p>
                <p v-if="item.contentType === 1">{{ item.content }}</p>
                <p
                  v-if="item.contentType === 2"
                  style="max-width: 200px;position:relative;cursor:pointer"
                >
                  <el-progress
                    v-if="item.status === 1"
                    :percentage="percentage"
                    type="circle"
                    class="progressDilog"
                  />
                  <img
                    :src="item.content"
                    @load="loaded"
                    :style="{ opacity: item.status === 1 ? 0.5 : 1 }"
                    alt="图片加载失败"
                  />
                </p>
              </div>
            </div>
          </div>
          <div class="sendMsg" v-if="statu !== 100">
            <div>
              <el-input
                :rows="2"
                v-model="textarea"
                resize="none"
                class="import"
                type="textarea"
                placeholder="请输入内容"
                @keyup.native.enter="sendMsg"
              />
            </div>
            <div class="send_btn">
              <sendUpload
                v-model="percentage"
                :loading="loading"
                @change="change"
                @success="success"
                @error="error"
              />
              <el-button
                :loading="loading"
                type="primary"
                style="margin-left: 5px;"
                @click="sendMsg"
              >
                发送</el-button
              >
            </div>
          </div>
        </div>
        <div class="questions_conten_details_right">
          <div class="questions_intro">群简介: {{ titleObj.brief }}</div>
          <div class="questions_user" v-if="intentionExpert.length > 0">
            <p
              @click="personalDetail(ite.creator)"
              v-for="(ite, ind) in intentionExpert"
              :key="ind"
            >
              {{ ite.expertName || ite.realname || ite.username }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="questions_footer">
      <el-button type="primary" v-if="statu !== 100" @click="publick"
        >已解决问题</el-button
      >
      <el-button type="primary" plain="plain" @click="$router.go(-1)"
        >返回</el-button
      >
    </div>
    <!-- 个人信息 -->
    <personalDetail
      ref="personalDetailDom"
      @startCirculation="startCirculation"
    />
    <!-- 选择专家 -->
    <chooseExpert ref="chooseExpertDom" @initAtExpert="initAtExpert" />
  </div>
</template>

<script>
import {
  getTopic,
  getReply,
  getAtExpert,
  replyQuestion,
  setPublicTopicId
} from "@/api/expertSystem";
import sendUpload from "@/components/uploadpic/sendUpload";
import personalDetail from "./common/personalDetail.vue";
import chooseExpert from "./common/chooseExpert.vue";
import Viewer from "v-viewer";
import Vue from "vue";
import "viewerjs/dist/viewer.css";
import {getReplyMore} from "../../api/expertSystem";
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 100000
  }
});
export default {
  name: "SpecialistAnswer",
  components: {
    sendUpload,
    personalDetail,
    chooseExpert
  },
  data() {
    return {
      times: null,
      topicId: "", // 问题id
      statu: "", // 问题状态
      role: "", // 角色
      textarea: "",
      titleObj: {},
      messageArray: [],
      intentionExpert: [],
      percentage: 1, // 上传图片的进度条
      loading: false, // 代表图片上传的时候的进度和发送信息的进度
      oldLen: undefined,
      moreLoading: false,
      isMore: false
    };
  },
  created() {
    this.topicId = this.$route.query.id;
    this.statu = this.$route.query.statu;
    this.role = this.$route.query.role;
    getTopic(this.topicId).then(res => {
      this.titleObj = res.result;
    });
    this.getReply();
    this.initAtExpert();
    this.circulation();
  },
  destroyed() {
    this.destroyed();
  },
  methods: {
    loaded(){
      if(!this.isMore)
        this.$refs.scrollDom.scrollTop = this.$refs.scrollDom.scrollHeight;
    },
    more(){
      this.isMore = true;
      this.moreLoading = true;
      getReplyMore(this.topicId,this.messageArray[0].id).then(res => {
        this.oldLen = res.result.length;
        this.messageArray.unshift(...res.result.reverse());
        let oldHight = this.$refs.scrollDom.scrollHeight;
        this.$nextTick(() => {
          this.$refs.scrollDom.scrollTop = this.$refs.scrollDom.scrollHeight - oldHight;
        })
      }).finally(()=>{
        this.moreLoading = false;
      });
    },
    destroyed() {
      clearInterval(this.times);
      this.times = null;
    },
    circulation() {
      if (this.times === null && parseInt(this.statu) !== 100) {
        this.times = setInterval(this.getReply, 1000);
      }
    },
    initAtExpert(boolenStr) {
      getAtExpert(this.topicId).then(res => {
        this.intentionExpert = res.result || [];
      });
      if (boolenStr) {
        this.circulation();
      }
    },
    getReply: function () {
      getReply(this.topicId).then(res => {
        if (this.messageArray.length === 0) {
          this.messageArray.push(...res.result.reverse());
        }
        else if (this.messageArray[this.messageArray.length - 1].id !== res.result[0].id) {
          for (let [key,value] of res.result.entries()) {
            if(this.messageArray[this.messageArray.length - 1].id === value.id){
              this.messageArray.push(...res.result.splice(0,key));
              this.$nextTick(() => {
                this.$refs.scrollDom.scrollTop = this.$refs.scrollDom.scrollHeight;
              });
              break;
            }
          }
        }
        if (this.oldLen === undefined) {
          this.oldLen = this.messageArray.length;
          this.$nextTick(() => {
            try {
              this.$refs.scrollDom.scrollTop = this.$refs.scrollDom.scrollHeight;
            } catch (_) {
              console.log(_);
            }
          });
        }
        console.log(this.messageArray)
      });
    },
    personalDetail(id) {
      // 需要传过去id，跟当前角色
      this.destroyed();
      this.$refs.personalDetailDom.open(id);
    },
    chooseExpert() {
      this.destroyed();
      this.$refs.chooseExpertDom.open(this.topicId);
    },
    sendMsg() {
      if (!this.textarea) {
        this.$message.warning("请先输入内容");
        return;
      }
      this.loading = true;
      // 发送给后台
      let parmas = {
        topicId: parseFloat(this.topicId),
        contentType: 1,
        uidRole: parseFloat(this.role),
        content: this.textarea,
        uid: localStorage.getItem("userId")
          ? parseFloat(localStorage.getItem("userId"))
          : "" // titleObj.uidRole
      };
      replyQuestion(parmas)
        .then(() => {
          // this.messageArray.push({
          //   uidRole: this.role,
          //   username: localStorage.getItem("username"),
          //   content: this.textarea,
          //   contentType: 1
          // });
          this.textarea = "";
          // this.$nextTick(() => {
          //   this.$refs.scrollDom.scrollTop = this.$refs.scrollDom.scrollHeight;
          // });
          this.loading = false;
          this.isMore = false;
        })
        .catch(() => {
          this.$message.error("回复失败");
          this.loading = false;
        });
    },
    change() {
      // this.messageArray.push(imgItem);
      this.loading = true;
      // 让滚动条滚动到最下面
      // this.$nextTick(() => {
      //   this.$refs.scrollDom.scrollTop = this.$refs.scrollDom.scrollHeight;
      // });
    },
    success(picUrl, imgItem) {
      // 调本地接口存路径
      let params = {
        topicId: this.topicId,
        contentType: 2,
        content: picUrl,
        uidRole: this.role,
        uid: localStorage.getItem("userId")
          ? parseFloat(localStorage.getItem("userId"))
          : ""
      };
      // 发送给我们后台
      replyQuestion(params)
        .then(() => {
          // this.messageArray.push({
          //   uidRole: this.role,
          //   username: localStorage.getItem("username"),
          //   content: picUrl,
          //   contentType: 2
          // });
          this.loading = false;
          this.isMore = false;
          imgItem.status = 0;
          this.percentage = 1;
          // this.$nextTick(() => {
          //   this.$refs.scrollDom.scrollTop = this.$refs.scrollDom.scrollHeight;
          // });
        })
        .catch(() => {
          this.$message.error("图片发送失败");
          this.loading = false;
          imgItem.status = 0;
          this.percentage = 1;
          // this.messageArray.pop();
        });
    },
    error(imgItem) {
      // 去掉图片的数组
      this.loading = false;
      imgItem.status = 0;
      this.percentage = 1;
      this.messageArray.pop();
    },
    publick() {
      let params = {
        state: 100
      };
      setPublicTopicId(this.topicId, params).then(() => {
        this.$message.success("问题已解决");
        let url =
          parseFloat(this.role) === 2
            ? "/expertSystem/answerTheHistory"
            : "/expertSystem/addMyQuestions";
        this.$router.push({
          path: url
        });
      });
    },
    startCirculation() {
      this.circulation();
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
    height: calc(100% - 80px);
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
        height: calc(100% - 81px);
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
          font-size: 14px;
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
          font-size: 14px;
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
  .questions_footer {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
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
