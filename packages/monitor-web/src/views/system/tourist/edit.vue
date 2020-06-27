<template>
  <el-dialog
    :visible.sync="dialog"
    title="编辑游客"
    append-to-body
    width="570px"
  >
    <el-form
      ref="form"
      :inline="true"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-form-item label="姓名" prop="introduce">
        <el-input v-model="form.username" :disabled="true" />
      </el-form-item>
      <el-form-item label="省" prop="province">
        <el-select
          v-model="form.province"
          placeholder="请选择"
          @change="assignmentCity"
        >
          <el-option
            v-for="item in provinceArr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="市" prop="city">
        <el-select v-model="form.city" placeholder="请选择">
          <el-option
            v-for="item in cityArr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" plain="plain" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit"
        >确认</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { edit } from "@/api/user";
import provinceArr from "static/province";
import cityArr from "static/city";
export default {
  data() {
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (!this.isvalidPhone(value)) {
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
      }
    };
    return {
      dialog: false,
      loading: false,
      form: {
        username: "",
        province: "",
        city: "",
        phone: ""
      },
      provinceArr: provinceArr,
      cityArr: [],
      style: "width: 184px",
      rules: {
        province: [{ required: true, message: "请选择省", trigger: "change" }],
        city: [{ required: true, message: "请选择市", trigger: "change" }],
        phone: [{ required: true, trigger: "blur", validator: validPhone }]
      }
    };
  },
  created() {
    const explorer = navigator.userAgent;
    if (explorer.indexOf("Chrome") >= 0) {
      this.style = "width: 184px";
    } else {
      this.style = "width: 172px";
    }
  },
  methods: {
    cancel() {
      this.resetForm();
    },
    open() {
      this.dialog = true;
    },
    doSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.doEdit();
        } else {
          return false;
        }
      });
    },
    assignmentCity() {
      this.cityArr = [];
      this.ruleForm.city = "";
      if (val !== "") {
        this.cityArr = cityArr[val] || [];
      }
    },
    doEdit() {
      edit(this.form)
        .then(() => {
          this.resetForm();
          this.$notify({
            title: "修改成功",
            type: "success",
            duration: 2500
          });
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();
      this.form = {
        username: "",
        introduce: "", // 专家介绍
        email: "",
        province: "",
        city: "",
        jobId: "", // 专业
        phone: ""
      };
    },
    isvalidPhone(str) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
      return reg.test(str);
    }
  }
};
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: center;
}
</style>
