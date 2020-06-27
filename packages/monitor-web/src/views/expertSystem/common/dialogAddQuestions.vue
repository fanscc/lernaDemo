<template>
  <el-dialog :visible.sync="dialogVisible" title="新增问题" width="500px">
    <span>
      <el-form
        ref="addruleForm"
        :model="addruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="主题" prop="title">
          <el-input v-model="addruleForm.title" />
        </el-form-item>
        <el-form-item label="简介" prop="brief">
          <el-input
            :rows="2"
            v-model="addruleForm.brief"
            resize="none"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="选择专业" prop="majorId">
          <el-select
            v-model="addruleForm.majorId"
            placeholder="请选择"
            @change="getMajor"
          >
            <el-option
              v-for="item in expertArry"
              :key="item.id"
              :label="item.major"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择专家" prop="expertId">
          <el-select
            v-model="addruleForm.expertId"
            :disabled="!addruleForm.majorId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in majorArr"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveGroup">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addMyTopic, specialtyList, getExpertList } from "@/api/expertSystem";
export default {
  data() {
    return {
      dialogVisible: false,
      expertArry: [], // 专业
      majorArr: [], // 专家
      addruleForm: {
        title: "",
        brief: "",
        majorId: "",
        expertId: ""
      },
      rules: {
        title: [{ required: true, message: "请输入主题", trigger: "blur" }],
        majorId: [{ required: true, message: "请选择专业", trigger: "change" }],
        expertId: [{ required: true, message: "请选择专家", trigger: "change" }]
      }
    };
  },
  methods: {
    open() {
      // 获取专业下拉框
      specialtyList().then(res => {
        this.expertArry = res.result;
      });
      this.dialogVisible = true;
    },
    getMajor(val) {
      getExpertList({ majorId: val }).then(res => {
        this.majorArr = res.result;
      });
    },
    saveGroup() {
      this.$refs["addruleForm"].validate(valid => {
        if (valid) {
          console.log(this.addruleForm);
          addMyTopic(this.addruleForm).then(() => {
            this.$message.success("新增问题成功");
            this.dialogVisible = false;
            this.$emit("init");
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
