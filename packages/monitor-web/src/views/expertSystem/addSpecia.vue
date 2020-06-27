<template>
  <el-dialog
    :visible.sync="dialog"
    title="新增专家"
    @closed="resetForm"
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
      <el-form-item label="选择用户" prop="uid">
        <el-select
          v-model="form.uid"
          :loading="loading"
          filterable
          remote
          placeholder="请输入关键词"
        >
          <el-option
            v-for="item in userArr"
            :key="item.id"
            :label="item.id"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <div>
        <el-form-item label="专家介绍" prop="expertIntroduction">
          <el-input
            v-model="form.expertIntroduction"
            :rows="2"
            style="width: 380px;"
            type="textarea"
          />
        </el-form-item>
      </div>
      <el-form-item label="省" prop="provinceId">
        <el-select
          v-model="form.provinceId"
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
        <el-select v-model="form.cityId" placeholder="请选择">
          <el-option
            v-for="item in cityArr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="form.realName" />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="专业" prop="majorId">
        <el-select
          v-model="form.majorId"
          :style="style"
          placeholder="请选择专业"
        >
          <el-option
            v-for="item in specialtyArr"
            :key="item.id"
            :label="item.major"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" plain="plain" @click="dialog = false"
        >取消</el-button
      >
      <el-button :loading="loading" type="primary" @click="doSubmit"
        >确认</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { chooseUser, addSpecialty } from "@/api/expertSystem";
import provinceArr from "static/province";
import cityArr from "static/city";
export default {
  props: {
    specialtyArr: {
      type: Array,
      default: () => []
    }
  },
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
        uid: "2",
        expertIntroduction: "", // 专家介绍
        email: "",
        provinceId: "",
        cityId: "",
        realName: "", // 真实姓名
        majorId: "1", // 专业
        phone: ""
      },
      userArr: [],
      provinceArr: provinceArr,
      cityArr: [],
      style: "width: 184px",
      rules: {
        uid: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        expertIntroduction: [
          { required: true, message: "请输入专家介绍", trigger: "blur" }
        ],
        provinceId: [
          { required: true, message: "请选择省", trigger: "change" }
        ],
        cityId: [{ required: true, message: "请选择市", trigger: "change" }],
        email: [
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }
        ],
        majorId: [{ required: true, message: "专业必填", trigger: "change" }],
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
    // 获取用户
    chooseUser({ username: "" }).then(res => {
      this.userArr = res.result.map(item => {
        return {
          id: item.id,
          expertName: item.expertName
        };
      });
    });
  },
  methods: {
    open() {
      this.dialog = true;
    },
    doSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.form);
          // 应后台要求需要多传expertName,province,city
          this.userArr.forEach(i => {
            if (i.id === params.uid) {
              params.expertName = i.expertName;
            }
          });
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
          addSpecialty(params).then(() => {
            this.$message.success("新增成功");
            this.$emit("init");
          });
        } else {
          return false;
        }
      });
    },
    assignmentCity(val) {
      this.cityArr = [];
      this.form.cityId = "";
      if (val !== "") {
        this.cityArr = cityArr[val] || [];
      }
    },
    resetForm() {
      this.$refs["form"].resetFields();
      this.form = {
        uid: "",
        expertIntroduction: "", // 专家介绍
        email: "",
        provinceId: "",
        cityId: "",
        majorId: "", // 专业
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

<style scoped></style>
