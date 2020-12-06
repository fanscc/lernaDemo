<template>
  <div class="chart_conten_solve_build_problem">
    <div class="chart_conten_nav">
      <div>
        智慧茶园
      </div>
      <div>
        <span @click="goLogin">登录</span>
        <span @click="register">注册</span>
      </div>
    </div>
    <div class="chart_conten_table" v-loading="loading">
      <template v-for="(table, index) in tables">
        <div class="item-header" :key="index">
          <div class="item-title">
            <svg-icon :icon-class="table.icon"></svg-icon>
            <span>{{ table.title }}</span>
          </div>
          <div class="item-more" @click="$router.push(table.link)">
            查看更多
          </div>
        </div>

        <div
          class="quertion_item"
          @click="goArtic(item.id)"
          v-for="(item, $index) in table.data"
          :key="`${index}_${$index}`"
          :class="[item.state === 1 ? 'newQustion' : '']"
        >
          <div class="artic_item_item">
            <div class="artic_img demo-image__placeholder">
              <el-image :src="item.thumbnail">
                <div slot="placeholder" class="image-slot">
                  <div v-loading="true">
                    <div class="artic_img_loading"></div>
                  </div>
                </div>
                <div slot="error" class="image-slot">
                  <div class="artic_img_loading">
                    <i
                      style="font-size: 50px;position: relative;top: 5px;color: #ccc"
                      class="el-icon-picture-outline"
                    ></i>
                  </div>
                </div>
              </el-image>
            </div>
          </div>
          <div class="artic_item_item">
            <div>{{ item.title }}</div>
            <p>
              <span>发表日期:</span>
              <span>{{ item.publishTs }}</span>
            </p>
          </div>
        </div>
      </template>
    </div>
    <div class="footer">
      <font>ICP备案主体信息备案/许可证号：粤ICP备19091043号</font>
      <font>审核通过时间：2020-08-11 09:53:28</font>
      <font>主办单位名称：广东省农业科学院茶叶研究所</font>
    </div>
  </div>
</template>

<script>
import { articleSelectAbstract } from "../../api/articleManagement";
import { initData } from "../../api/data";
export default {
  name: "classicQ",
  data() {
    return {
      loading: true,
      searchFrom: {
        title: ""
      },
      tables: [
        {
          icon: "team",
          title: "特色团队",
          link: "/login",
          data: []
        },
        {
          icon: "plan",
          title: "解决方案",
          link: "/login",
          data: []
        },
        {
          icon: "info",
          title: "科普信息",
          category: 9,
          link: "/login",
          data: []
        }
      ],
      categorys: []
    };
  },
  mounted() {
    initData("/cms/category")
      .then(res => {
        this.categorys = [...res.result];
        console.log(this.categorys);
        this.tables.forEach(item => {
          for (let i = 0; i < this.categorys.length; i++) {
            if (item.title === this.categorys[i].name) {
              item["category"] = this.categorys[i].id;
            }
          }
        });
        this.init();
      })
      .catch(() => {
        this.loading = false;
      });
  },
  methods: {
    init() {
      let promises = [];
      this.tables.forEach((item, index) => {
        if (!item.category) return;
        promises[index] = new Promise(resolve => {
          articleSelectAbstract({
            category: item.category,
            offset: 0,
            limit: 3
          }).then(res => {
            item.data = [...res.result];
            resolve();
          });
        });
      });
      Promise.all(promises).finally(() => {
        this.loading = false;
      });
    },
    goArtic(id) {
      let routeUrl = this.$router.resolve({
        path: "/articleDetai"
      });
      window.open(`${routeUrl.href}?id=${id}`, "_blank");
    },
    goAnswer(id) {
      this.$router.push({
        path: "/socialWorkDetail",
        query: { id: id }
      });
    },
    goLogin() {
      this.$router.push({
        path: "/login"
      });
    },
    register() {
      this.$router.push({
        path: "/register"
      });
    }
  }
};
</script>

<style lang="scss">
.chart_conten_solve_build_problem {
  height: calc(100% - 72px);
  padding: 50px 0 0 0;
  overflow-x: hidden;
  position: relative;
  .chart_conten_search {
    padding: 20px 0;
  }
  .ml_20 {
    margin-left: 20px;
  }
  .chart_conten_table {
    height: calc(100vh - 130px);
    border: 1px solid #ebeef5;
    overflow: auto;
    .item-header {
      padding: 10px 20px;
      border-bottom: 1px solid #ebeef5;
      .item-title {
        display: inline-block;
        span {
          margin-left: 7px;
        }
      }
      .item-more {
        float: right;
        cursor: pointer;
        color: #36a3f7;
        line-height: 16px;
        font-size: 12px;
      }
    }
  }
  .quertion_item {
    position: relative;
    height: 60px;
    line-height: 60px;
    div,
    p {
      margin: 0;
      padding: 0;
      line-height: 30px;
    }
    p {
      font-size: 12px;
      color: #666;
    }
    .artic_img {
      margin: 0 10px 0 30px;
      width: 60px;
      height: 60px;
      line-height: 60px;
      .el-image__inner {
        margin-top: 5px;
        width: 50px;
        height: 50px;
        object-fit: cover;
      }
      .artic_img_loading {
        width: 50px;
      }
    }
    display: flex;
    cursor: pointer;
    border-bottom: 1px solid #ebeef5;
  }
  .flex_conten {
    display: flex;
    justify-content: space-between;
    padding: 0 10px !important;
    .pub_btn {
      transform: translateY(-10px);
    }
  }
  .chart_conten_nav {
    position: fixed;
    height: 50px;
    top: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    background-color: #fff;
    -webkit-box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    div:nth-of-type(1) {
      font-size: 18px;
      font-weight: bold;
    }
    div:nth-of-type(2) {
      span {
        cursor: pointer;
      }
      span:nth-of-type(1) {
        font-size: 14px;
        color: #0681d0;
        margin-right: 20px;
      }
      span:nth-of-type(2) {
        font-size: 14px;
        color: #0681d0;
        border-radius: 30%;
        padding: 5px;
        border: 1px solid #0681d0;
      }
    }
  }
  .footer {
    height: 70px;
    background: #000;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    font-size: 12px;
  }
}
</style>
