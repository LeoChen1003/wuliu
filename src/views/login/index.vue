<template>
  <div class="manage">
    <div class="loginBox" v-if="formType == 'login'">
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
          <img src="../../assets/image/logo.png" alt="logo" />
          <LangSelect :toggleLang="true" class="langBtn"></LangSelect>
        </div>
        <div class="choseTab">
          <div @click="choseTab(1)" :class="curTab==1?'isActive':''">{{$t('login.demand')}}</div>
          <div @click="choseTab(2)" :class="curTab==2?'isActive':''">{{$t('login.supply')}}</div>
          <div @click="choseTab(3)" :class="curTab==3?'isActive':''">{{$t('login.hub')}}</div>
          <div @click="choseTab(4)" :class="curTab==4?'isActive':''">{{$t('login.platform')}}</div>
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
        <el-form-item>
          <el-button
            :loading="loading"
            class="inputWidth"
            @click.native.prevent="handleLogin"
            type="button"
            size="small"
          >{{$t('login.login')}}</el-button>
        </el-form-item>
      </el-form>
      <div class="atPassword">
        <div @click="formType = 'register'">{{$t('login.register')}}</div>
        <div @click="formType = 'forget'">{{$t('login.forgotPassword')}}</div>
      </div>
    </div>
    <div class="register" v-if="formType == 'register'">
      <el-tabs type="border-card" style="width:600px;">
        <el-tab-pane>
          <span slot="label">① {{$t('login.selPartnerType')}}</span>
          <el-checkbox-group v-model="regList">
            <div class="regCheck">
              <el-checkbox :label="0">
                <div class="regItem">
                  <div class="reglabel">{{$t('login.demand')}}</div>
                  <div class="regCon">ผู้ใช้บริการว่าจ้างขนส่งสินค้า ผ่านการให้บริการของ แพลตฟอร์ม</div>
                </div>
              </el-checkbox>
            </div>
            <div class="regCheck">
              <el-checkbox :label="1">
                <div class="regItem">
                  <div class="reglabel">{{$t('login.supply')}}</div>
                  <div class="regCon">
                    ผู้ให้บริการขนส่ง ที่รับสินค้าจากศูนย์แลกเปลี่ยนสินค้า เพื่อนำส่ง
                    <br />ผู้รับปลายทาง โดยผ่านการบริการของแพลตฟอร์ม
                  </div>
                </div>
              </el-checkbox>
            </div>
            <div class="regCheck">
              <el-checkbox :label="2">
                <div class="regItem">
                  <div class="reglabel">{{$t('login.hub')}}</div>
                  <div class="regCon">
                    ศูนย์รวบรวมและแลกเปลี่ยนสินค้า ระหว่างผู้ส่งสินค้าและผู้ขนส่ง
                    <br />โดยผ่านการบริการของแพลตฟอร์ม
                  </div>
                </div>
              </el-checkbox>
            </div>
          </el-checkbox-group>
          <div class="nextStep">
            <el-button type="primary" class="nextBtn">{{$t('login.nextStep')}}</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label">② {{$t('login.enterAccountInfo')}}</span>
          <el-form
            ref="regForm"
            :model="regForm"
            :rules="regRules"
            class="reg-form"
            label-position="left"
            label-width="160px"
            hide-required-asterisk
            size="small"
          >
            <el-form-item prop="mT" :label="$t('login.memberType')">
              <el-input v-model="regForm.mT" placeholder class="inputWidth" />
            </el-form-item>
            <el-form-item prop="mT" :label="$t('login.mobilePhoneNo')">
              <el-input v-model="regForm.mT" placeholder class="inputWidth" />
            </el-form-item>
            <el-form-item prop="mT" :label="$t('login.messageCode')">
              <div class="inputWidth" style="display:flex;align-items:center;">
                <el-input v-model="regForm.mT" placeholder style="width:58%;margin-right:5px;" />
                <el-button style="width:40%;">{{$t('login.sendMessage')}}</el-button>
              </div>
            </el-form-item>
            <el-form-item prop="mT" :label="$t('login.graphCaptcha')">
              <div class="inputWidth" style="display:flex;align-items:center;">
                <el-input v-model="regForm.mT" placeholder style="width:58%;margin-right:5px;" />
                <el-button style="width:40%;">{{$t('login.sendMessage')}}</el-button>
              </div>
            </el-form-item>
            <el-form-item prop="mT" :label="$t('login.email')">
              <el-input v-model="regForm.mT" placeholder class="inputWidth" />
            </el-form-item>
            <el-form-item prop="mT" :label="$t('login.regName')">
              <el-input v-model="regForm.mT" placeholder class="inputWidth" />
            </el-form-item>
            <el-form-item prop="mT" :label="$t('login.regPassword')">
              <el-input v-model="regForm.mT" placeholder class="inputWidth" />
            </el-form-item>
            <el-form-item prop="mT" :label="$t('login.confirmPassword')">
              <el-input v-model="regForm.mT" placeholder class="inputWidth" />
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="regArgee">I accept</el-checkbox>
              <span class="argee">{{$t('login.termAndConditions')}}</span>
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="loading"
                class="inputWidth"
                type="primary"
                size="small"
              >{{$t('login.confirm')}}</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
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
      regForm: {},
      regRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      loading: false,
      curTab: 1,
      formType: "login",
      regList: [],
      regArgee: false
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  methods: {
    choseTab(n) {
      let self = this;
      self.curTab = n;
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.manage {
  .loginBox {
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translate(40%, -55%);
    .login-form {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .login-header {
      width: 100%;
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      position: relative;
      img {
        position: absolute;
        left: 50%;
      }
      .langBtn {
        position: absolute;
        right: 15px;
      }
    }
    .choseTab {
      width: 100%;
      padding-left: 130px;
      margin: 20px 0;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      color: #333333;
      font-size: 14px;
      div {
        width: 75px;
        text-align: center;
        cursor: pointer;
      }
      .isActive {
        font-weight: bold;
        color: rgb(22, 155, 213);
      }
    }
    .atPassword {
      display: flex;
      justify-content: space-between;
      padding-left: 130px;
      padding-right: 10px;
      box-sizing: border-box;
      color: #169bd5;
      font-size: 14px;
    }
    .inputWidth {
      width: 300px;
    }
  }
  .register {
    position: absolute;
    top: 15%;
    right: 50%;
    transform: translate(50%, 0);
    .regCheck {
      margin-top: 20px;
    }
    .regItem {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      .reglabel {
        width: 150px;
      }
      .regCon {
      }
    }
    .nextStep {
      width: 100%;
      margin-top: 30px;
      margin-bottom: 20px;
      .nextBtn {
        position: relative;
        left: 50%;
        transform: translate(-50%, 0);
      }
    }
    .reg-form {
      padding-left: 30px;
      box-sizing: border-box;
      .argee {
        color: #169bd5;
      }
    }
    .inputWidth {
      width: 300px;
    }
  }
}
</style>