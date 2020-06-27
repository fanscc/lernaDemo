<template>
  <div class="articleList demo-image__placeholder">
    <el-image
      class="img"
      style="position: relative;top: 4px;"
      :src="detail.thumbnail"
    >
      <div slot="placeholder" class="image-slot">
        <div v-loading="true">
          <div class="img"></div>
        </div>
      </div>
      <div slot="error" class="image-slot">
        <div class="img">
          <i
            style="font-size: 50px;position: relative;top: 5px;color: #ccc"
            class="el-icon-picture-outline"
          ></i>
        </div>
      </div>
    </el-image>
    <div style="display: inline-block;margin-left: 10px">
      <h4>{{ detail.title }}</h4>
      <span>{{ detail.category }}</span>
      <span style="margin-left: 15px;">{{ detail.author }}</span>
      <span style="margin-left: 15px;color: #999">{{ detail.publishTs }}</span>
      <span style="margin-left: 15px;color: #999">{{ detail.priority }}级</span>
    </div>
    <div style="margin-top: 30px" v-html="detail.content"></div>
  </div>
</template>

<script>
import { articleSelectOne } from "../../../api/articleManagement";
import { initData } from "../../../api/data";

export default {
  data() {
    return {
      detail: {}
    };
  },
  async mounted() {
    const category = await initData("/cms/category");
    const detail = await articleSelectOne(this.$route.query.id);
    this.detail = { ...detail.result };
    category.result.forEach(item => {
      if (item.id === this.detail.category) this.detail.category = item.name;
    });
  }
};
</script>

<style lang="scss" scoped>
.articleList {
  padding: 20px;
  margin: 0 auto;
  box-sizing: content-box;
}
.img {
  margin-top: 5px;
  width: 85px;
  height: 60px;
  object-fit: cover;
  text-align: center;
}
</style>
