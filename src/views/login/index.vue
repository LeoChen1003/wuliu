<template>
  <div class="manage">
    <!-- 登录 -->
    <transition name="el-fade-in">
      <div v-if="formType == 'login'" class="loginBox">
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
            <img src="../../assets/image/logo.png" alt="logo" class="logo" />
          </div>
          <!-- <div class="choseTab">
            <div :class="curTab=='DEMAND'?'isActive':''"
                 @click="choseTab('DEMAND')">{{ $t('login.demand') }}</div>
            <div :class="curTab=='SUPPLY'?'isActive':''"
                 @click="choseTab('SUPPLY')">{{ $t('login.supply') }}</div>
            <div :class="curTab=='HUB'?'isActive':''"
                 @click="choseTab('HUB')">{{ $t('login.hub') }}</div>
            <div :class="curTab=='PLATFORM'?'isActive':''"
                 @click="choseTab('PLATFORM')">{{ $t('login.platform') }}</div>
          </div> -->
          <el-form-item prop="username" :label="$t('login.username')">
            <span slot="label"><i class="el-icon-user loginIcon"></i></span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              :placeholder="$t('placeholder.pleaseEnterYourLoginAccount')"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="on"
              class="inputWidth"
            />
          </el-form-item>
          <el-form-item prop="password" :label="$t('login.password')">
            <span slot="label"><i class="el-icon-lock loginIcon"></i></span>
            <el-input
              ref="password"
              v-model="loginForm.password"
              :placeholder="$t('placeholder.pleaseInputPassword')"
              name="password"
              type="password"
              autocomplete="on"
              class="inputWidth"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" class="inputWidth" type="primary" @click.native.prevent="handleLogin">{{
              $t("login.login")
            }}</el-button>
          </el-form-item>
        </el-form>
        <div class="atPassword">
          <el-link :underline="false" type="primary" @click="formType = 'register'">{{ $t("login.register") }}</el-link>
          <el-link :underline="false" type="primary" @click="toForgot">{{ $t("login.forgotPassword") }}</el-link>
        </div>
        <div class="languageBox">
          <div class="languageBox-item" @click="changeLang('th_TH')" :class="language == 'th_TH' ? 'actived' : ''">
            <img src="../../assets/image/th.png" class="banner" />
            <div class="county">ไทย</div>
          </div>
          <div class="languageBox-item" @click="changeLang('zh_CN')" :class="language == 'zh_CN' ? 'actived' : ''">
            <img src="../../assets/image/cn.png" class="banner" />
            <div class="county">中文</div>
          </div>
          <div class="languageBox-item" @click="changeLang('en_US')" :class="language == 'en_US' ? 'actived' : ''">
            <img src="../../assets/image/en.png" class="banner" />
            <div class="county">English</div>
          </div>
        </div>
        <div class="app-box">
          <el-popover placement="bottom" trigger="hover">
            <img src="../../assets/image/iphoneQRC.png" class="qrCode" />
            <div style="text-align:center;">司机端的APP</div>
            <el-button type="primary" slot="reference" plain round @click="iphoneDownload" size="mini">
              <div class="app-btn">
                <img src="../../assets/image/iphone.png" />
                <div>iphone</div>
              </div>
            </el-button>
          </el-popover>
          <el-popover placement="bottom" trigger="hover">
            <img src="../../assets/image/androidQRC.png" class="qrCode" />
            <div style="text-align:center;">司机端的APP</div>
            <el-button type="primary" slot="reference" plain round @click="androidDownload" size="mini">
              <div class="app-btn">
                <img src="../../assets/image/android.png" />
                <div>Android</div>
              </div>
            </el-button>
          </el-popover>
        </div>
      </div>
    </transition>
    <!-- 注册 -->
    <transition name="el-fade-in">
      <div v-if="formType == 'register'" class="register">
        <el-card>
          <!-- 步骤条 -->
          <el-steps class="steps" :active="regStep" simple>
            <el-step :title="$t('login.selPartnerType')" icon="el-icon-user-solid"></el-step>
            <el-step :title="$t('login.enterAccountInfo')" icon="el-icon-edit"></el-step>
          </el-steps>
          <!-- 选择类型 -->
          <div v-if="regStep === 0">
            <el-checkbox-group v-model="regList">
              <div class="regCheck">
                <el-checkbox label="DEMAND">
                  <div class="regItem">
                    <div class="reglabel">{{ $t("login.demand") }}</div>
                    <div class="regCon">
                      ผู้ใช้บริการว่าจ้างขนส่งสินค้า ผ่านการให้บริการของ แพลตฟอร์ม
                    </div>
                  </div>
                </el-checkbox>
              </div>
              <div class="regCheck">
                <el-checkbox label="SUPPLY">
                  <div class="regItem">
                    <div class="reglabel">{{ $t("login.supply") }}</div>
                    <div class="regCon">
                      ผู้ให้บริการขนส่ง ที่รับสินค้าจากศูนย์แลกเปลี่ยนสินค้า เพื่อนำส่ง
                      <br />ผู้รับปลายทาง โดยผ่านการบริการของแพลตฟอร์ม
                    </div>
                  </div>
                </el-checkbox>
              </div>
              <div class="regCheck">
                <el-checkbox label="HUB" disabled>
                  <div class="regItem">
                    <div class="reglabel">{{ $t("login.hub") }}</div>
                    <div class="regCon">
                      ศูนย์รวบรวมและแลกเปลี่ยนสินค้า ระหว่างผู้ส่งสินค้าและผู้ขนส่ง
                      <br />โดยผ่านการบริการของแพลตฟอร์ม
                    </div>
                  </div>
                </el-checkbox>
              </div>
            </el-checkbox-group>
            <div class="btnBox">
              <el-button type="info" @click="back" class="backBtn">{{ $t("login.back") }}</el-button>
              <el-button type="primary" :disabled="regList.length === 0" @click="nextStep" class="nextBtn">{{
                $t("login.nextStep")
              }}</el-button>
            </div>
          </div>
          <!-- 输入信息 -->
          <div v-else-if="regStep === 1">
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
              <el-form-item prop="chosenTypes" :label="$t('login.memberType')">
                <el-input v-model="regForm.chosenTypes" disabled class="inputWidth" />
              </el-form-item>
              <el-form-item prop="email" :label="$t('login.email')">
                <el-input v-model="regForm.email" class="inputWidth" />
              </el-form-item>
              <el-form-item prop="name" :label="$t('login.regName')">
                <el-input v-model="regForm.name" class="inputWidth" />
              </el-form-item>
              <el-form-item prop="password" :label="$t('login.regPassword')">
                <el-input v-model="regForm.password" show-password class="inputWidth" />
              </el-form-item>
              <el-form-item prop="confirmPassword" :label="$t('login.confirmPassword')">
                <el-input v-model="regForm.confirmPassword" show-password class="inputWidth" />
              </el-form-item>
              <el-form-item prop="captcha" :label="$t('login.graphCaptcha')">
                <div style="display:flex;align-items:center;">
                  <el-input v-model="captcha.inp" maxlength="4" />
                  <img :src="captcha.url" @click="refreshCaptcha" alt="captcha" />
                </div>
              </el-form-item>
              <el-form-item prop="phone" :label="$t('login.mobilePhoneNo')">
                <el-input v-model="regForm.phone" class="inputWidth" />
              </el-form-item>
              <el-form-item prop="smsCode" :label="$t('login.messageCode')">
                <div class="inputWidth" style="display:flex;align-items:center;">
                  <el-input v-model="regForm.smsCode">
                    <el-button @click="sendMessageCode" slot="append">{{
                      codeFreezeTime == 0 ? $t("login.sendMessage") : codeFreezeTime + "s"
                    }}</el-button>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="regArgee">{{ $t("login.iAgree") }}</el-checkbox>
                <el-link :underline="false" type="primary" @click="conditionsDialog = true" class="argee">{{
                  $t("login.termAndConditions")
                }}</el-link>
                {{ $t("login.and") }}
                <el-link :underline="false" type="primary" @click="privacyPolicyDialog = true" class="argee">{{
                  $t("login.privacyPolicy")
                }}</el-link>
              </el-form-item>
              <el-form-item>
                <el-button :loading="loading" class="inputWidth" type="primary" @click="register" size="small">{{
                  $t("login.confirm")
                }}</el-button>
              </el-form-item>
              <el-form-item>
                <el-button :loading="loading" class="inputWidth" type="info" @click="prevStep" size="small">{{
                  $t("login.back")
                }}</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
    </transition>
    <!-- 忘记密码 -->
    <transition name="el-fade-in">
      <div v-if="formType == 'forget'" class="forgot">
        <el-card>
          <!-- 步骤条 -->
          <el-steps class="steps" :active="0" simple>
            <el-step :title="$t('login.resetPassword')" icon="el-icon-lock"></el-step>
          </el-steps>
          <!-- 输入信息 -->
          <div>
            <el-form
              ref="forgotForm"
              :model="forgotForm"
              :rules="forgotRules"
              class="reg-form"
              label-position="left"
              label-width="160px"
              hide-required-asterisk
              size="small"
            >
              <el-form-item prop="name" :label="$t('login.username')">
                <el-input v-model="forgotForm.name" class="inputWidth" />
              </el-form-item>
              <el-form-item prop="phone" :label="$t('login.mobilePhoneNo')">
                <el-input v-model="forgotForm.phone" class="inputWidth" />
              </el-form-item>
              <el-form-item prop="captcha" :label="$t('login.graphCaptcha')">
                <div style="display:flex;align-items:center;">
                  <el-input v-model="captcha.inp" maxlength="4" />
                  <img :src="captcha.url" @click="refreshCaptcha" alt="captcha" />
                </div>
              </el-form-item>
              <el-form-item prop="code" :label="$t('login.messageCode')">
                <div class="inputWidth" style="display:flex;align-items:center;">
                  <el-input v-model="forgotForm.code">
                    <el-button @click="sendMessageCode" slot="append">{{
                      codeFreezeTime == 0 ? $t("login.sendMessage") : codeFreezeTime + "s"
                    }}</el-button>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item prop="password" :label="$t('login.resetPassword')">
                <el-input v-model="forgotForm.password" show-password class="inputWidth" />
              </el-form-item>
              <el-form-item prop="confirmPassword" :label="$t('login.confirmPassword')">
                <el-input v-model="forgotForm.confirmPassword" show-password class="inputWidth" />
              </el-form-item>
              <el-form-item>
                <el-button :loading="loading" class="inputWidth" type="primary" @click="forgotPassword" size="small">{{
                  $t("login.confirm")
                }}</el-button>
              </el-form-item>
              <el-form-item>
                <el-button :loading="loading" class="inputWidth" type="info" @click="forgotBack" size="small">{{
                  $t("login.back")
                }}</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
    </transition>
    <el-dialog :title="$t('login.termAndConditions')" :visible.sync="conditionsDialog" width="700px">
      <iframe :src="conditionsUrl" width="100%" height="700px" frameborder="0"> </iframe>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="conditionsDialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="$t('login.privacyPolicy')" :visible.sync="privacyPolicyDialog" width="700px">
      <iframe :src="privacyPolicyUrl" width="100%" height="700px" frameborder="0"> </iframe>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="privacyPolicyDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCaptcha, register, login, getMessageCode, forgot } from "@/api/user";

export default {
  components: {},
  data() {
    const self = this;
    const validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error(self.$t("login.rule_name")));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error(self.$t("login.rule_password")));
      } else if (value.length < 6 || value.length > 20) {
        callback(new Error(self.$t("login.rule_password_length")));
      } else {
        callback();
      }
    };
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error(self.$t("login.rule_phone")));
      } else {
        callback();
      }
    };
    const validateEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error(self.$t("login.rule_email")));
      } else if (
        // eslint-disable-next-line no-useless-escape
        !/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
          value,
        )
      ) {
        callback(new Error(self.$t("login.rule_email_format")));
      } else {
        callback();
      }
    };
    const validateConfirmPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error(self.$t("login.rule_confirmPassword")));
      } else if (self.regForm.password !== self.regForm.confirmPassword) {
        callback(new Error(self.$t("login.rule_confirmPassword_same")));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        name: [{ required: true, trigger: "blur", validator: validateName }],
        password: [{ required: true, trigger: "blur", validator: validatePassword }],
      },
      regForm: {},
      regRules: {
        name: { required: true, trigger: "blur", validator: validateName },
        password: {
          required: true,
          trigger: "blur",
          validator: validatePassword,
        },
        email: { required: true, trigger: "blur", validator: validateEmail },
        phone: { required: true, trigger: "blur", validator: validatePhone },
        confirmPassword: {
          required: true,
          trigger: "blur",
          validator: validateConfirmPassword,
        },
      },
      forgotForm: {
        code: "",
        confirmPassword: "",
        name: "",
        password: "",
        phone: "",
      },
      forgotRules: {
        name: { required: true, trigger: "blur", validator: validateName },
        password: {
          required: true,
          trigger: "blur",
          validator: validatePassword,
        },
        phone: { required: true, trigger: "blur", validator: validatePhone },
        confirmPassword: {
          required: true,
          trigger: "blur",
          validator: validateConfirmPassword,
        },
      },
      loading: false,
      curTab: "DEMAND",
      formType: "login",
      regList: [],
      regArgee: false,
      regStep: 0,
      captcha: {
        url: "",
        key: "",
        inp: "",
      },
      codeFreezeTime: 0,
      conditionsDialog: false,
      privacyPolicyDialog: false,
    };
  },
  // 监听属性 类似于data概念
  computed: {
    language: {
      get() {
        return this.$store.getters.language;
      },
      set() {},
    },
    conditionsUrl: {
      get() {
        let type = this.language == "en_US" ? "en" : this.language == "th_TH" ? "th" : "en";
        return `https://t-rex.flashlogistics.co.th/html/term-${type}.html`;
      },
    },
    privacyPolicyUrl: {
      get() {
        let type = this.language == "en_US" ? "en" : this.language == "th_TH" ? "th" : "en";
        return `https://t-rex.flashlogistics.co.th/html/privacy-${type}.html`;
      },
    },
  },
  // 监控data中的数据变化
  watch: {},
  created() {},
  mounted() {
    this.$store.dispatch("user/chooseRole", this.curTab);
  },
  methods: {
    choseTab(n) {
      const self = this;
      self.curTab = n;
      this.$store.dispatch("user/chooseRole", n);
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$store.dispatch("user/getInfo");
              this.$router.replace({
                path: this.redirect || "/",
                query: this.otherQuery,
              });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    back() {
      const self = this;
      self.formType = "login";
    },
    // 下一步
    nextStep() {
      const self = this;
      self.regStep = 1;
      let type = "";
      for (let i of self.regList) {
        type += `${i},`;
      }
      type = type.substr(0, type.length - 1);
      self.regForm.chosenTypes = type;
      getCaptcha().then(res => {
        self.captcha = {
          ...self.captcha,
          url: res.data.image,
          key: res.data.key,
        };
      });
    },
    // 返回上一步
    prevStep() {
      const self = this;
      self.regStep = 0;
      self.regForm = {};
    },
    // 刷新验证码
    refreshCaptcha() {
      const self = this;
      getCaptcha().then(res => {
        self.captcha = {
          ...self.captcha,
          url: res.data.image,
          key: res.data.key,
        };
      });
    },
    // 发送短信
    sendMessageCode() {
      const self = this;
      if (self.codeFreezeTime != 0) {
        return;
      } else if (
        !/^(0|66)\d{9}$/.test(
          self.formType == "register" ? self.regForm.phone : self.formType == "forget" ? self.forgotForm.phone : "",
        )
      ) {
        return self.$message.warning(self.$t("login.phoneWrong"));
      }
      if ((self.regForm.phone == "" || !self.regForm.phone) && self.formType == "register") {
        return self.$message.warning(self.$t("login.rule_phone"));
      } else if ((self.forgotForm.phone == "" || !self.forgotForm.phone) && self.formType == "forget") {
        return self.$message.warning(self.$t("login.rule_phone"));
      } else if (self.captcha.inp == "") {
        return self.$message.warning(self.$t("login.captcha_required"));
      } else {
        let phone = self.formType == "register" ? self.regForm.phone : self.formType == "forget" ? self.forgotForm.phone : "";
        getMessageCode({
          key: self.captcha.key,
          verifyCode: self.captcha.inp,
          phone: phone,
          type: self.formType,
        }).then(res => {
          self.$message.success(self.$t("login.smsSend"));
          self.codeFreezeTime = 60;
          let codeTimeInterval = setInterval(() => {
            self.codeFreezeTime--;
            if (self.codeFreezeTime <= 0) {
              clearInterval(codeTimeInterval);
              self.codeFreezeTime = 0;
            }
          }, 1000);
        });
      }
    },
    // 确认注册
    register() {
      const self = this;
      if (!self.regArgee) {
        return self.$message.warning(self.$t("login.mustAccept"));
      }
      register(self.regForm).then(res => {
        self.$message.success(self.$t("login.registerSuccess"));
        self.formType = "login";
        self.regForm = {};
        self.captcha = {
          url: "",
          key: "",
          inp: "",
        };
      });
    },
    // 忘记密码框
    toForgot() {
      let self = this;
      self.formType = "forget";
      self.forgotForm = {
        code: "",
        confirmPassword: "",
        name: "",
        password: "",
        phone: "",
      };
      getCaptcha().then(res => {
        self.captcha = {
          ...self.captcha,
          url: res.data.image,
          key: res.data.key,
        };
      });
    },
    // 忘记密码返回
    forgotBack() {
      let self = this;
      self.formType = "login";
    },
    // 忘记密码
    forgotPassword() {
      let self = this;
      this.$refs.forgotForm.validate(valid => {
        if (valid) {
          forgot(self.forgotForm).then(res => {
            self.$message.success(self.$t("login.resetSuccess"));
            self.formType = "login";
            self.forgotForm = {};
          });
        }
      });
    },
    changeLang(lang) {
      this.$i18n.locale = lang;
      this.$store.dispatch("app/setLanguage", lang);
    },
    androidDownload() {
      window.open("https://play.google.com/store/apps/details?id=com.flashexpress.express.logistics");
    },
    iphoneDownload() {
      window.open("https://itunes.apple.com/app/id1484309319");
    },
  },
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
.manage {
  .loginBox {
    position: absolute;
    top: 55%;
    right: 50%;
    transform: translate(40%, -60%);

    .login-form {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .login-header {
      width: 100%;
      // height: 100px;
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
      padding-left: 120px;
      padding-right: 10px;
      box-sizing: border-box;
      color: #169bd5;
      font-size: 14px;
    }

    .inputWidth {
      width: 300px;
    }
  }
  .register,
  .forgot {
    position: absolute;
    top: 10%;
    margin-bottom: 5%;
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
    }

    .btnBox {
      width: 100%;
      margin-top: 30px;
      text-align: center;
    }

    .reg-form {
      margin-top: 20px;
      box-sizing: border-box;
    }

    .inputWidth {
      width: 300px;
    }
  }

  .forgot {
    .el-steps {
      justify-content: center;
    }
  }
}

.logo {
  width: 110px;
}

.loginIcon {
  font-size: 20px;
}

.languageBox {
  justify-content: space-between;
  box-sizing: border-box;
  padding-left: 120px;
  display: flex;
  margin-top: 20px;
  align-items: center;
  line-height: 16px;
  margin-bottom: 120px;

  .languageBox-item {
    width: 100px;
    display: flex;
    cursor: pointer;
    box-sizing: border-box;
    padding: 10px;
    justify-content: center;

    .banner {
      width: 24px;
      height: 16px;
      margin-right: 3px;
    }
  }

  .actived {
    border: 1px solid red;
  }
}

.app-box {
  box-sizing: border-box;
  padding-left: 120px;
  text-align: center;
  display: flex;
  justify-content: space-between;

  .app-btn {
    display: flex;
    align-items: center;
    font-size: 18px;

    img {
      width: 30px;
    }
  }
}

.qrCode {
  width: 220px;
  height: 220px;
}
</style>
