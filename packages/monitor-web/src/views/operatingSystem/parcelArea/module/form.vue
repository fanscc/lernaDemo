<template>
  <el-dialog
    class="dialog"
    :append-to-body="true"
    :visible.sync="dialog"
    :title="isAdd ? '新增地块' : '编辑地块'"
    width="500px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-form-item label="名称" prop="name">
      <el-input style="width:335px;" v-model="form.name" />
      </el-form-item>
      <el-form-item label="纬度" prop="lat">
        <el-input-number
          style="width:335px;"
          :min="0" :max="90"
          controls-position="right"
          v-model.number="form.lat" />
      </el-form-item>
      <el-form-item label="经度" prop="lon">
        <el-input-number
          style="width:335px;"
          :min="0" :max="180"
          controls-position="right"
          v-model.number="form.lon" />
      </el-form-item>
<!--      <el-form-item label="面积" prop="acreage" >-->
<!--        <el-input-number-->
<!--          style="width:335px;"-->
<!--          :min="0"-->
<!--          controls-position="right"-->
<!--          v-model.number="form.acreage" />-->
<!--      </el-form-item>-->
      <el-form-item label="类型" prop="type">
        <el-tooltip class="item" effect="dark" :disabled="!disabled" content="已有子地块,不可修改为最小地块" placement="bottom">
          <el-select style="width:335px;"  v-model="form.type" :disabled="disabled">
            <el-option
              v-for="item in types"
              :key="item.index"
              :label="item.lable"
              :value="item.value"
            />
          </el-select>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit"
        >确认</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const types = [
      {
        value: 1,
        lable: "分组"
      },
      {
        value: 2,
        lable: "最小地块,不可再分"
      }
    ];
    return {
      dialog: false,
      loading: false,
      form: {},
      types,
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        lat: [{ required: true,  message: "请输入数字", trigger: "focus", type: "number"}],
        lon: [{ required: true,  message: "请输入数字", trigger: "focus", type: "number"}],
        // acreage: [{ message: "请输入数字", trigger: "focus", type: "number"}],
        type: [{ required: true, message: "请选择地块类型", trigger: "blur",}],
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm();
    },
    isSuccess(){
      this.loading = false
      this.resetForm();
    },
    doSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.name !== undefined && this.form.name !== "") {
            this.loading = true;
            this.$emit('update:isLoading', this.loading)
            if (this.isAdd) {
              this.$parent.append(JSON.parse(JSON.stringify(this.form)))
            }else this.$parent.editSuccess(JSON.parse(JSON.stringify(this.form)));
          } else {
            this.$message({
              message: "名称不能为空",
              type: "error"
            });
          }
        }
      });
    },

    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();

    },
  }
};
</script>

<style lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
