<!-- member index -->
<template>
  <div class="wrapper">
    <el-tabs tab-position="left"
             v-model="tabActive"
             style="height:100%">
      <!-- 会员申请流程 -->
      <el-tab-pane name='1'
                   :label="$t('member.membershipApplicationProcess')">
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
      <!-- 基础资料 -->
      <el-tab-pane name='2'
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
            <el-form-item>
              <el-button type="primary"
                         class="submitBtn">{{$t('member.save')}}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <!-- 相关文件（发货人）150px -->
      <el-tab-pane name="3"
                   :label="$t('member.relevantDocument_demand')">
        <div class="container">
          <el-form label-width="200px">
            <el-form-item :label="$t('member.affidavit')">
              <el-upload class="upload"
                         action="https://jsonplaceholder.typicode.com/posts/"
                         multiple
                         :limit="1">
                <el-button size="small"
                           icon="el-icon-upload2"
                           type="primary">{{$t('member.upload')}}</el-button>
                <div slot="tip"
                     class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('member.transportationLicense')">

            </el-form-item>
            <el-form-item :label="$t('member.IDcard')">

            </el-form-item>
            <el-form-item :label="$t('member.houseParticulars')">

            </el-form-item>
            <el-form-item :label="$t('member.bangAccount')">

            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         class="submitBtn">{{$t('member.submitDemand')}}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <!-- 相关文件(运输公司) -->
      <el-tab-pane name="4"
                   :label="$t('member.relevantdocument_supply')">
        <div class="container">
          <el-form label-width="200px">
            <el-form-item :label="$t('member.affidavit')">
              <el-upload class="upload"
                         action="https://jsonplaceholder.typicode.com/posts/"
                         multiple
                         :limit="1">
                <el-button size="small"
                           icon="el-icon-upload2"
                           type="primary">{{$t('member.upload')}}</el-button>
                <div slot="tip"
                     class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('member.transportationLicense')">

            </el-form-item>
            <el-form-item :label="$t('member.IDcard')">

            </el-form-item>
            <el-form-item :label="$t('member.houseParticulars')">

            </el-form-item>
            <el-form-item :label="$t('member.bangAccount')">

            </el-form-item>
            <el-form-item :label="$t('member.mapForDistributionCenters')">

            </el-form-item>
            <el-form-item :label="$t('member.carRegistration')">

            </el-form-item>
            <el-form-item :label="$t('member.cargoInsurance')">
              <div>
                <div class="z-cell">
                  <el-checkbox v-model="perPrice">
                    <el-input size="small"
                              class="checkbox-inp"></el-input>
                    THB
                    <el-select size="small"
                               v-model="perPriceSelected"
                               class="checkbox-select"
                               placeholder="Per price"></el-select>
                  </el-checkbox>
                </div>
                <div class="z-cell">
                  <el-checkbox v-model="perShipment">
                    <el-input size="small"
                              class="checkbox-inp"></el-input>
                    THB
                    <el-select size="small"
                               v-model="perShipmentSelected"
                               class="checkbox-select"
                               placeholder="Per shipment"></el-select>
                  </el-checkbox>
                </div>
              </div>
            </el-form-item>
            <el-form-item :label="$t('member.dc')">
              <div class="z-cell">
                <el-switch v-model="dc"
                           :active-text="$t('member.have')"
                           :inactive-text="$t('member.notHave')"></el-switch>
              </div>
              <transition name="el-fade-in">
                <div class="z-cell dc-wrapper"
                     v-if="dc">
                  <div>
                    <el-table border
                              :data="dcList"
                              style="width:700px;">
                      <el-table-column align="center"
                                       :label="$t('member.dcAddress')">
                        <template slot-scope="scope">
                          <el-input type="textarea"
                                    resize="none"
                                    v-model="scope.row.address">
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column align="center"
                                       :label="$t('member.transportationExperience')">
                        <template slot-scope="scope">
                          <el-input type="textarea"
                                    resize="none"
                                    v-model="scope.row.experience">
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column center
                                       width="100px">
                        <template slot-scope="scope">
                          <div style="text-align:center;">
                            <el-button v-if="scope.$index != 0"
                                       type="danger"
                                       @click="delDc(scope.row,scope.$index)"
                                       icon="el-icon-delete"
                                       circle></el-button>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <div class="dc-add-button">
                    <el-button type="primary"
                               @click="addDc"
                               icon="el-icon-plus"
                               circle></el-button>
                  </div>
                </div>
              </transition>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         class="submitBtn">{{$t('member.submitSupply')}}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <!-- 相关文件(货运站) -->
      <el-tab-pane name="5"
                   :label="$t('member.relevantdocument_HUB')">
        <div class="container">
          <el-form label-width="200px">
            <el-form-item :label="$t('member.affidavit')">
              <el-upload class="upload"
                         action="https://jsonplaceholder.typicode.com/posts/"
                         multiple
                         :limit="1">
                <el-button size="small"
                           icon="el-icon-upload2"
                           type="primary">{{$t('member.upload')}}</el-button>
                <div slot="tip"
                     class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('member.transportationLicense')">

            </el-form-item>
            <el-form-item :label="$t('member.IDcard')">

            </el-form-item>
            <el-form-item :label="$t('member.houseParticulars')">

            </el-form-item>
            <el-form-item :label="$t('member.bangAccount')">

            </el-form-item>
            <el-form-item :label="$t('member.cargoInsurance')">

            </el-form-item>
            <el-form-item :label="$t('member.mapForDistributionCenters')">

            </el-form-item>
            <el-form-item :label="$t('member.functionalArea')">
              <el-input style="width:200px;">
                <div slot="append">㎡</div>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         class="submitBtn">{{$t('member.submitHUB')}}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <!-- 我的会员合同 -->
      <el-tab-pane name="6"
                   :label="$t('member.myContract')">
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
      tabActive: '5',
      dc: false,
      dcList: [{ address: '', experience: '' }],
      perShipment: false,
      perShipmentSelected: null,
      perPrice: false,
      perPriceSelected: null
    };
  },
  mounted () { },
  methods: {
    addDc () {
      this.dcList.push({ address: '', experience: '' })
    },
    delDc (row, index) {
      this.dcList.splice(index, 1)
    }
  }
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

.upload {
  width: 400px;
}

.z-cell {
  margin-bottom: 20px;
}

.checkbox-inp {
  width: 200px;
}

.checkbox-select {
  width: 200px;
}

.dc-wrapper {
  display: flex;
  align-items: flex-end;
}

.dc-add-button {
  height: 56px;
  margin-left: 20px;
}

.submitBtn {
  width: 300px;
}
</style>