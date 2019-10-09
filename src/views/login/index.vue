<template>
  <div class="manage">
    <!-- 登录 -->
    <transition name='el-fade-in'>
      <div v-if="formType == 'login'"
           class="loginBox">
        <el-form ref="loginForm"
                 :model="loginForm"
                 :rules="loginRules"
                 class="login-form"
                 autocomplete="on"
                 label-position="right"
                 label-width="120px"
                 hide-required-asterisk
                 size="small">
          <div class="login-header">
            <img src="../../assets/image/logo.png"
                 alt="logo">
            <LangSelect :toggle-lang="true"
                        class="langBtn" />
          </div>
          <div class="choseTab">
            <div :class="curTab==1?'isActive':''"
                 @click="choseTab(1)">{{ $t('login.demand') }}</div>
            <div :class="curTab==2?'isActive':''"
                 @click="choseTab(2)">{{ $t('login.supply') }}</div>
            <div :class="curTab==3?'isActive':''"
                 @click="choseTab(3)">{{ $t('login.hub') }}</div>
            <div :class="curTab==4?'isActive':''"
                 @click="choseTab(4)">{{ $t('login.platform') }}</div>
          </div>
          <el-form-item prop="username"
                        :label="$t('login.username')">
            <el-input ref="username"
                      v-model="loginForm.username"
                      placeholder="请输入您的登录账号"
                      name="username"
                      type="text"
                      tabindex="1"
                      autocomplete="on"
                      size="small"
                      class="inputWidth" />
          </el-form-item>
          <el-form-item prop="password"
                        :label="$t('login.password')">
            <el-input ref="password"
                      v-model="loginForm.password"
                      placeholder="密码"
                      name="password"
                      autocomplete="on"
                      size="small"
                      class="inputWidth"
                      @keyup.enter.native="handleLogin" />
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading"
                       class="inputWidth"
                       type="button"
                       size="small"
                       @click.native.prevent="handleLogin">{{ $t('login.login') }}</el-button>
          </el-form-item>
        </el-form>
        <div class="atPassword">
          <el-link :underline="false"
                   type="primary"
                   @click="formType = 'register'">{{ $t('login.register') }}</el-link>
          <el-link :underline="false"
                   type="primary"
                   @click="formType = 'forget'">{{ $t('login.forgotPassword') }}</el-link>
        </div>
      </div>
    </transition>
    <!-- 注册 -->
    <transition name="el-fade-in">
      <div v-if="formType == 'register'"
           class="register">
        <el-card>
          <!-- 步骤条 -->
          <el-steps class="steps"
                    :active="regStep"
                    simple>
            <el-step :title="$t('login.selPartnerType')"
                     icon="el-icon-user-solid"></el-step>
            <el-step :title="$t('login.enterAccountInfo')"
                     icon="el-icon-edit"></el-step>
          </el-steps>
          <!-- 选择类型 -->
          <div v-if="regStep === 0">
            <el-checkbox-group v-model="regList">
              <div class="regCheck">
                <el-checkbox label="DEMAND">
                  <div class="regItem">
                    <div class="reglabel">{{ $t('login.demand') }}</div>
                    <div class="regCon">ผู้ใช้บริการว่าจ้างขนส่งสินค้า ผ่านการให้บริการของ แพลตฟอร์ม</div>
                  </div>
                </el-checkbox>
              </div>
              <div class="regCheck">
                <el-checkbox label="SUPPLY">
                  <div class="regItem">
                    <div class="reglabel">{{ $t('login.supply') }}</div>
                    <div class="regCon">
                      ผู้ให้บริการขนส่ง ที่รับสินค้าจากศูนย์แลกเปลี่ยนสินค้า เพื่อนำส่ง
                      <br>ผู้รับปลายทาง โดยผ่านการบริการของแพลตฟอร์ม
                    </div>
                  </div>
                </el-checkbox>
              </div>
              <div class="regCheck">
                <el-checkbox label="HUB"
                             disabled>
                  <div class="regItem">
                    <div class="reglabel">{{ $t('login.hub') }}</div>
                    <div class="regCon">
                      ศูนย์รวบรวมและแลกเปลี่ยนสินค้า ระหว่างผู้ส่งสินค้าและผู้ขนส่ง
                      <br>โดยผ่านการบริการของแพลตฟอร์ม
                    </div>
                  </div>
                </el-checkbox>
              </div>
            </el-checkbox-group>
            <div class="btnBox">
              <el-button type="info"
                         @click="back"
                         class="backBtn">{{ $t('login.back') }}</el-button>
              <el-button type="primary"
                         :disabled="regList.length === 0"
                         @click="nextStep"
                         class="nextBtn">{{ $t('login.nextStep') }}</el-button>
            </div>
          </div>
          <!-- 输入信息 -->
          <div v-else-if="regStep === 1">
            <el-form ref="regForm"
                     :model="regForm"
                     :rules="regRules"
                     class="reg-form"
                     label-position="left"
                     label-width="160px"
                     hide-required-asterisk
                     size="small">
              <el-form-item prop="chosenTypes"
                            :label="$t('login.memberType')">
                <el-input v-model="regForm.choosedRoles"
                          disabled
                          class="inputWidth" />
              </el-form-item>
              <el-form-item prop="phone"
                            :label="$t('login.mobilePhoneNo')">
                <el-input v-model="regForm.phone"
                          class="inputWidth" />
              </el-form-item>
              <el-form-item prop="captcha"
                            :label="$t('login.graphCaptcha')">
                <div style="display:flex;align-items:center;">
                  <el-input v-model="captcha.inp"
                            maxlength="4" />
                  <img :src="captcha.url"
                       @click="refreshCaptcha"
                       alt="captcha">
                </div>
              </el-form-item>
              <el-form-item prop="smsCode"
                            :label="$t('login.messageCode')">
                <div class="inputWidth"
                     style="display:flex;align-items:center;">
                  <el-input v-model="regForm.smsCode">
                    <el-button @click="sendMessageCode"
                               slot="append">{{ codeFreezeTime == 0 ? $t('login.sendMessage') : codeFreezeTime + 's' }}</el-button>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item prop="email"
                            :label="$t('login.email')">
                <el-input v-model="regForm.email"
                          class="inputWidth" />
              </el-form-item>
              <el-form-item prop="name"
                            :label="$t('login.regName')">
                <el-input v-model="regForm.name"
                          class="inputWidth" />
              </el-form-item>
              <el-form-item prop="password"
                            :label="$t('login.regPassword')">
                <el-input v-model="regForm.password"
                          show-password
                          class="inputWidth" />
              </el-form-item>
              <el-form-item prop="confirmPassword"
                            :label="$t('login.confirmPassword')">
                <el-input v-model="regForm.confirmPassword"
                          show-password
                          class="inputWidth" />
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="regArgee">I accept</el-checkbox>
                <el-link :underline="false"
                         type="primary"
                         class="argee">{{ $t('login.termAndConditions') }}</el-link>
              </el-form-item>
              <el-form-item>
                <el-button :loading="loading"
                           class="inputWidth"
                           type="primary"
                           @click="register"
                           size="small">{{ $t('login.confirm') }}</el-button>
              </el-form-item>
              <el-form-item>
                <el-button :loading="loading"
                           class="inputWidth"
                           type="info"
                           @click="prevStep"
                           size="small">{{ $t('login.back') }}</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
    </transition>
  </div>
</template>

<script>
import LangSelect from '../../components/LangSelect/index'
import { getCaptcha, register, login, getMessageCode } from '@/api/user'

export default {
  components: { LangSelect },
  data () {
    const self = this;
    const validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error(self.$t('login.rule_name')))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error(self.$t('login.rule_password')))
      } else if (value.length < 8 || value.length > 20) {
        callback(new Error(self.$t('login.rule_password_length')))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error(self.$t('login.rule_phone')))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error(self.$t('login.rule_email')))
      } else if (!/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value)) {
        callback(new Error(self.$t('login.rule_email_format')))
      } else {
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error(self.$t('login.rule_confirmPassword')))
      } else if (self.regForm.password !== self.regForm.confirmPassword) {
        callback(new Error(self.$t('login.rule_confirmPassword_same')))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loginRules: {
        name: [
          { required: true, trigger: 'blur', validator: validateName }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      regForm: {},
      regRules: {
        name: { required: true, trigger: 'blur', validator: validateName },
        password: { required: true, trigger: 'blur', validator: validatePassword },
        email: { required: true, trigger: 'blur', validator: validateEmail },
        phone: { required: true, trigger: 'blur', validator: validatePhone },
        confirmPassword: { required: true, trigger: 'blur', validator: validateConfirmPassword }
      },
      loading: false,
      curTab: 1,
      formType: 'login',
      regList: [],
      regArgee: false,
      regStep: 0,
      captcha: {
        url: '',
        key: '',
        inp: ''
      },
      codeFreezeTime: 0,
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  created () { },
  mounted () {

  },
  methods: {
    choseTab (n) {
      const self = this
      self.curTab = n
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || '/',
                query: this.otherQuery
              })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    back () {
      const self = this;
      self.formType = 'login';
    },
    // 下一步
    nextStep () {
      const self = this;
      self.regStep = 1;
      let type = '';
      for (let i of self.regList) {
        type += `${i},`;
      }
      type = type.substr(0, type.length - 1);
      self.regForm.choosedRoles = type;
      getCaptcha().then(res => {
        self.captcha = {
          ...self.captcha,
          url: res.data.image,
          key: res.data.key
        }
      })
    },
    // 返回上一步
    prevStep () {
      const self = this;
      self.regStep = 0;
      self.regForm = {};
    },
    // 刷新验证码
    refreshCaptcha () {
      const self = this;
      getCaptcha().then(res => {
        self.captcha = {
          ...self.captcha,
          url: res.data.image,
          key: res.data.key
        }
      })
    },
    // 发送短信
    sendMessageCode () {
      const self = this;
      if (self.codeFreezeTime != 0) {
        return
      } if (self.regForm.phone == "" || !self.regForm.phone) {
        return self.$message.warning(self.$t('login.rule_phone'))
      } else if (self.captcha.inp == "") {
        return self.$message.warning(self.$t('login.captcha_required'))
      } else {
        getMessageCode({
          key: self.captcha.key,
          verifyCode: self.captcha.inp,
          phone: self.regForm.phone
        }).then(res => {
          self.$message.success(self.$t('login.smsSend'));
          self.codeFreezeTime = 60;
          let codeTimeInterval = setInterval(() => {
            self.codeFreezeTime--;
            if (self.codeFreezeTime <= 0) {
              clearInterval(codeTimeInterval)
            }
          }, 1000);
        })
      }
    },
    // 确认注册
    register () {
      const self = this;
      if (!self.regArgee) {
        return self.$message.warning(self.$t('login.mustAccept'))
      }
      register(self.regForm).then(res => {
        self.$message.success(self.$t('login.registerSuccess'));
        self.formType = 'login';
        self.regForm = {};
      })
    }
  }
}
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
}
</style>
