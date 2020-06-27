<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="个人信息"
    width="500px"
    @close="emitParent"
  >
    <div>
      <p>
        <label>姓名:</label>
        <span>{{ detailsPerson.username }}</span>
      </p>
      <p>
        <label>电话:</label>
        <span>{{ detailsPerson.phone }}</span>
      </p>
    </div>
    <div>
      <p>
        <label>专业:</label>
        <span>{{ detailsPerson.expertName }}</span>
      </p>
      <p>
        <label>简介:</label>
        <span>{{ detailsPerson.expertIntroduction }}</span>
      </p>
    </div>
    <div>
      <p>
        <label>城市:</label>
        <span>{{ detailsPerson.province }}{{ detailsPerson.city }}</span>
      </p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getRoleDetail } from "@/api/expertSystem";

export default {
  data() {
    return {
      dialogVisible: false,
      detailsPerson: {}
    };
  },
  methods: {
    open(id) {
      this.dialogVisible = true;
      // 获取用户信息
      getRoleDetail(id).then(res => {
        this.detailsPerson = res.result || {};
      });
    },
    emitParent() {
      this.$emit("startCirculation");
    }
  }
};
</script>

<style lang="scss" scoped></style>
