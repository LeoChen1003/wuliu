<template>
  <div class="manage">
    <div class="loginBox">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="right"
        label-width="120px"
        hide-required-asterisk
        size="small"
      >
        <div class="login-header">
          <span class="line"></span>
          <img src="../../assets/image/logo.png" alt="logo" />
          <span class="line"></span>
        </div>

        <el-form-item prop="username" :label="$t('login.username')">
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入您的登录账号"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
            size="small"
            class="inputWidth"
          />
        </el-form-item>

        <el-form-item prop="password" :label="$t('login.password')">
          <el-input
            ref="password"
            v-model="loginForm.password"
            placeholder="密码"
            name="password"
            autocomplete="on"
            size="small"
            @keyup.enter.native="handleLogin"
            class="inputWidth"
          />
        </el-form-item>
        <!-- <div class="atPassword">
          <div @click="formType = 1" href="#" class="canTouch">忘记密码？</div>
          <div>
            <el-checkbox v-model="rememberPassword">记住密码</el-checkbox>
          </div>
        </div>-->
        <el-form-item>
          <el-button
            :loading="loading"
            class="inputWidth"
            @click.native.prevent="handleLogin"
            type="button"
            size="small"
          >{{$t('login.login')}}</el-button>
        </el-form-item>
        <el-form-item>
          <LangSelect :toggleLang="false" class="inputWidth"></LangSelect>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import LangSelect from "components/LangSelect/index";

export default {
  components: { LangSelect },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入账号"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      loading: false
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  methods: {},
  created() {},
  mounted() {}
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.manage {
  .loginBox {
    .login-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .line {
      }
    }
    .inputWidth {
      width: 300px;
    }
  }
}
</style>