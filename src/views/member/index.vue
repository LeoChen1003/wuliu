<!-- member index -->
<template>
  <div class="wrapper">
    <el-tabs tab-position="left"
             v-model="tabActive"
             style="height:100%"
             type="card">
      <el-tab-pane :label="$t('member.membershipApplicationProcess')">
        <div class="container">
          <el-steps simple>
            <el-step :title="$t('member.register')"
                     icon="none"
                     status='process'>
              <svg-icon style="font-size:20px;"
                        class-name="international-icon"
                        slot="icon"
                        icon-class="A1" />
            </el-step>
            <el-step :title="$t('member.enterData')"
                     icon="none"
                     status='process'>
              <svg-icon style="font-size:20px;"
                        class-name="international-icon"
                        slot="icon"
                        icon-class="A2" />
            </el-step>
            <el-step :title="$t('member.submitApplication')"
                     icon="none"
                     status='process'>
              <svg-icon style="font-size:20px;"
                        class-name="international-icon"
                        slot="icon"
                        icon-class="A3" />
            </el-step>
            <el-step :title="$t('member.downloadContract')"
                     icon="none"
                     status='process'>
              <svg-icon style="font-size:20px;"
                        class-name="international-icon"
                        slot="icon"
                        icon-class="A4" />
            </el-step>
          </el-steps>
          <el-steps class="secStep"
                    simple>
            <el-step :title="$t('member.payGuaranteeMoney')"
                     icon="none"
                     status='process'>
              <svg-icon style="font-size:20px;"
                        class-name="international-icon"
                        slot="icon"
                        icon-class="A5" />
            </el-step>
            <el-step :title="$t('member.sendContractBackToPlatform')"
                     icon="none"
                     status='process'>
              <svg-icon style="font-size:20px;"
                        class-name="international-icon"
                        slot="icon"
                        icon-class="A6" />
            </el-step>
            <el-step :title="$t('member.onlieTraining')"
                     icon="none"
                     status='process'>
              <svg-icon style="font-size:20px;"
                        class-name="international-icon"
                        slot="icon"
                        icon-class="A7" />
            </el-step>
            <el-step :title="$t('member.activateAccount')"
                     icon="none"
                     status='process'>
              <svg-icon style="font-size:20px;"
                        class-name="international-icon"
                        slot="icon"
                        icon-class="A8" />
            </el-step>
          </el-steps>
        </div>
      </el-tab-pane>
      <el-tab-pane :name="1"
                   :label="$t('member.essentialData')">
        <div class="container">
          <el-form ref="form"
                   label-width="150px">
            <!-- 会员类型 -->
            <el-form-item class="choose-type"
                          :label="$t('member.memberType')">
              <el-checkbox label="1">
                {{$t('member.demand')}} ผู้ใช้บริการว่าจ้างขนส่งสินค้า ผ่านการให้บริการของ แพลตฟอร์ม
              </el-checkbox>
              <el-checkbox label="2">
                {{$t('member.supply')}} ผู้ให้บริการขนส่ง ที่รับสินค้าจากศูนย์แลกเปลี่ยนสินค้า เพื่อนำส่งผู้รับปลายทาง โดยผ่านการบริการของแพลตฟอร์ม
              </el-checkbox>
              <el-checkbox label="3">
                {{$t('member.hub')}} ศูนย์รวบรวมและแลกเปลี่ยนสินค้า ระหว่างผู้ส่งสินค้าและผู้ขนส่ง โดยผ่านการบริการของแพลตฟอร์ม
              </el-checkbox>
            </el-form-item>
            <!-- 注册类型 -->
            <el-form-item :label="$t('member.typeOfRegistration')">
              <el-radio>{{$t('member.personal')}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('member.companyName')">
              <el-input class="inp"></el-input>
            </el-form-item>
            <el-form-item :label="$t('member.name')">
              <el-input class="inp"></el-input>
            </el-form-item>
            <el-form-item :label="$t('member.contacktName')">
              <el-input class="inp"></el-input>
            </el-form-item>
            <el-form-item :label="$t('member.phone_No')">
              <el-input class="inp"></el-input>
            </el-form-item>
            <el-form-item :label="$t('member.email')">
              <el-input class="inp"></el-input>
            </el-form-item>
            <el-form-item :label="$t('member.fullAddress')">
              <el-input class="inp"></el-input>
              <el-input class="inp"></el-input>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item :label="$t('member.bankname')">
              <el-input class="inp"></el-input>
            </el-form-item>
            <el-form-item :label="$t('member.accountName')">
              <el-input class="inp"></el-input>
            </el-form-item>
            <el-form-item :label="$t('member.bankAccount_No')">
              <el-input class="inp"></el-input>
            </el-form-item>
            <el-form-item :label="$t('member.billingAddress')">
              <el-input class="inp"></el-input>
              <el-input class="inp"></el-input>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item :label="$t('member.profileDiscription')">
              <el-input class="inp"
                        type="textarea"
                        resize="none"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('member.relevantDocument_demand')">
        <div class="container">

        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('member.relevantdocument_supply')">
        <div class="container">

        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('member.relevantdocument_HUB')">
        <div class="container">

        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('member.myContract')">
        <div class="container">

        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tabActive: 1
    };
  },
  mounted () { },
  methods: {}
}

</script>
<style lang='scss' scoped>
.wrapper {
  box-sizing: border-box;
  height: 100%;
}

.container {
  height: 100%;
  padding: 40px;
}

.secStep {
  margin-top: 50px;
}
</style>
<style>
.el-step {
  width: 100% !important;
}

.el-step__title {
  width: 100% !important;
}

.choose-type {
  width: 300px;
}

.inp {
  width: 400px;
}
</style>