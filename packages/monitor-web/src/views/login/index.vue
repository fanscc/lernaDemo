<template>
  <div class="login">
    <div>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        label-position="left"
        label-width="0px"
        class="login-form"
      >
        <h3 class="title">智慧茶园 后台管理系统</h3>
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            type="text"
            auto-complete="off"
            placeholder="账号"
          >
            <svg-icon
              slot="prefix"
              icon-class="user"
              class="el-input__icon"
              style="height: 39px;width: 13px;margin-left: 2px;"
            />
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            auto-complete="off"
            placeholder="密码"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon
              slot="prefix"
              icon-class="password"
              class="el-input__icon"
              style="height: 39px;width: 13px;margin-left: 2px;"
            />
          </el-input>
        </el-form-item>
        <el-checkbox
          v-model="loginForm.rememberMe"
          style="margin:0px 0px 25px 0px;"
          >记住密码</el-checkbox
        >
        <span class="goRegis" @click="goRegis">注册</span>
        <span
          class="goRegis"
          style="margin-left: 10px"
          @click="goQusetion_lobby"
          >问题大厅</span
        >
        <el-form-item style="width:100%;">
          <el-button
            :loading="loading"
            size="medium"
            type="primary"
            style="width:100%;"
            @click.native.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
        <!-- <p class="login-tip">系统默认用户名：admin，密码：123456</p> -->
      </el-form>
      <div class="flex_mobil">
        <div class="android">
          <p class="qrcode">
            <img src="../../assets/logo/android.png" alt="" srcset="" />
          </p>
          <p class="icon_tip"><svg-icon icon-class="anzou" fill="#fff" /></p>
        </div>
        <div class="ios">
          <p class="qrcode">
            <img src="../../assets/logo/iosqr.png" alt="" srcset="" />
          </p>
          <p class="icon_tip"><svg-icon icon-class="ios" fill="#fff" /></p>
        </div>
      </div>
    </div>
    <div class="footer">
      <font>ICP备案主体信息备案/许可证号：粤ICP备19091043号</font>
      <font>审核通过时间：2020-08-11 09:53:28</font>
      <font>主办单位名称：广东省农业科学院茶叶研究所</font>
    </div>
  </div>
</template>

<script>
import Config from "@/config";
import Cookies from "js-cookie";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        rememberMe: false
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [{ required: true, trigger: "blur", message: "密码不能为空" }]
      },
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCookie();
  },
  methods: {
    getCookie() {
      const username = Cookies.get("username");
      let password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      password = password === undefined ? this.loginForm.password : password;
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password,
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        const user = this.loginForm;
        if (valid) {
          this.loading = true;
          if (user.rememberMe) {
            Cookies.set("username", user.username, {
              expires: Config.passCookieExpires
            });
            Cookies.set("password", user.password, {
              expires: Config.passCookieExpires
            });
            Cookies.set("rememberMe", user.rememberMe, {
              expires: Config.passCookieExpires
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$store
            .dispatch("Login", user)
            .then(() => {
              this.loading = false;
              this.$router.push({ path: "/init" });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    goRegis() {
      this.$router.push({ path: "/register" });
    },
    goQusetion_lobby() {
      this.$router.push({ path: "/socialWork" });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 365px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.flex_mobil {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  .qrcode {
    width: 80px;
    height: 80px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .icon_tip {
    display: flex;
    justify-content: center;
    svg {
      width: 30px;
      height: 30px;
    }
  }
}
.goRegis {
  font-size: 14px;
  color: blue;
  margin-left: 130px;
  cursor: pointer;
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
</style>
