<template>
  <div class="register">
    <div class="register_conten">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="80px"
        class="demo-ruleForm"
      >
        <h3>社会服务注册</h3>
        <el-form-item label="手机号" prop="username">
          <el-input v-model="ruleForm.username" class="w200" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" class="w200" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="ruleForm.checkPass" class="w200" type="password" />
        </el-form-item>
        <el-form-item label="省" prop="provinceId">
          <el-select
            v-model="ruleForm.provinceId"
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
        <el-form-item label="市" prop="cityId">
          <el-select v-model="ruleForm.cityId" placeholder="请选择">
            <el-option
              v-for="item in cityArr"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="ruleForm.realName" class="w200" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">提交</el-button>
          <el-button type="primary" @click="goLogin()">返回登录页</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import provinceArr from "static/province";
import cityArr from "static/city";
import { register } from "@/api/expertSystem/index";

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
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
      ruleForm: {
        username: "",
        password: "",
        checkPass: "",
        provinceId: "",
        cityId: "",
        realName: ""
      },
      provinceArr: provinceArr,
      cityArr: [],
      expertArr: [
        {
          label: "茶叶",
          value: "1"
        },
        {
          label: "水稻",
          value: "2"
        }
      ],
      rules: {
        username: [{ required: true, validator: validPhone, trigger: "blur" }],
        password: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ],
        realName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        cityId: [{ required: true, message: "请选择市", trigger: "change" }],
        provinceId: [{ required: true, message: "请选择省", trigger: "change" }]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.ruleForm);
          delete params.checkPass;
          // 增加省跟城市的名称
          this.provinceArr.forEach(i => {
            if (i.id === params.provinceId) {
              params.province = i.name;
            }
          });
          this.cityArr.forEach(i => {
            if (i.id === params.cityId) {
              params.city = i.name;
            }
          });
          params.provinceId = parseFloat(params.provinceId);
          params.cityId = parseFloat(params.cityId);
          register(params).then(() => {
            this.$message.success("注册成功");
            this.$router.push({ path: "/login" });
          });
        }
      });
    },
    assignmentCity(val) {
      this.cityArr = [];
      this.ruleForm.cityId = "";
      if (val !== "") {
        this.cityArr = cityArr[val] || [];
      }
    },
    isvalidPhone(str) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
      return reg.test(str);
    },
    goLogin() {
      this.$router.push({ path: "/login" });
    }
  }
};
</script>

<style lang="scss" scoped>
.register {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .demo-ruleForm {
    border-radius: 6px;
    background: #ffffff;
    width: 365px;
    padding: 25px 25px 5px 25px;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.08);
    h3 {
      margin: 0px auto 30px auto;
      text-align: center;
      color: #707070;
    }
  }
  .w200 {
    width: 200px;
  }
}
</style>
