<template>
  <el-dialog
    :append-to-body="true"
    :visible.sync="dialog"
    :title="isAdd ? '新增作物标签' : '编辑作物标签'"
    width="500px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-form-item label="标注名称" prop="name">
        <el-input v-model="form.name" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="描述" prop="tag">
        <el-input v-model="form.tag" style="width: 370px;" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit"
        >确认</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {},
      rules: {
        name: [{ required: true, message: "请输入作物名称", trigger: "blur" }],
        tag: [{ required: true, message: "请输入作物标签", trigger: "blur" }]
      }
    };
  },
  methods: {
    cancel() {
      this.resetForm();
    },
    isSuccess() {
      this.loading = false;
      this.resetForm();
    },
    doSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.name.length === 0) {
            this.$message({
              message: "名称不能为空",
              type: "error"
            });
          } else {
            this.loading = true;
            if (this.isAdd === false) {
              this.$parent.editTo(JSON.parse(JSON.stringify(this.form)));
            } else {
              this.$parent.addTo(JSON.parse(JSON.stringify(this.form)));
            }
          }
        }
      });
    },
    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();
      this.form = {
        id: "",
        name: "",
        tag: ""
      };
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-input-number .el-input__inner {
  text-align: left;
}
</style>
