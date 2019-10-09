<!-- member index -->
<template>
  <div class="wrapper">
    <el-tabs v-model="tabActive"
             tab-position="left"
             style="height:100%">
      <!-- 会员申请流程 -->
      <el-tab-pane name="1"
                   :label="$t('member.membershipApplicationProcess')">
        <div class="container">
          <el-steps simple>
            <el-step :title="$t('member.register')"
                     icon="none"
                     status="process">
              <svg-icon slot="icon"
                        style="font-size:20px;"
                        class-name="international-icon"
                        icon-class="A1" />
            </el-step>
            <el-step :title="$t('member.enterData')"
                     icon="none"
                     status="process">
              <svg-icon slot="icon"
                        style="font-size:20px;"
                        class-name="international-icon"
                        icon-class="A2" />
            </el-step>
            <el-step :title="$t('member.submitApplication')"
                     icon="none"
                     status="process">
              <svg-icon slot="icon"
                        style="font-size:20px;"
                        class-name="international-icon"
                        icon-class="A3" />
            </el-step>
            <el-step :title="$t('member.downloadContract')"
                     icon="none"
                     status="process">
              <svg-icon slot="icon"
                        style="font-size:20px;"
                        class-name="international-icon"
                        icon-class="A4" />
            </el-step>
          </el-steps>
          <el-steps class="secStep"
                    simple>
            <el-step :title="$t('member.payGuaranteeMoney')"
                     icon="none"
                     status="process">
              <svg-icon slot="icon"
                        style="font-size:20px;"
                        class-name="international-icon"
                        icon-class="A5" />
            </el-step>
            <el-step :title="$t('member.sendContractBackToPlatform')"
                     icon="none"
                     status="process">
              <svg-icon slot="icon"
                        style="font-size:20px;"
                        class-name="international-icon"
                        icon-class="A6" />
            </el-step>
            <el-step :title="$t('member.onlieTraining')"
                     icon="none"
                     status="process">
              <svg-icon slot="icon"
                        style="font-size:20px;"
                        class-name="international-icon"
                        icon-class="A7" />
            </el-step>
            <el-step :title="$t('member.activateAccount')"
                     icon="none"
                     status="process">
              <svg-icon slot="icon"
                        style="font-size:20px;"
                        class-name="international-icon"
                        icon-class="A8" />
            </el-step>
          </el-steps>
        </div>
      </el-tab-pane>
      <!-- 基础资料 -->
      <el-tab-pane name="2"
                   :label="$t('member.essentialData')">
        <div class="container">
          <el-form ref="form"
                   label-width="150px">
            <!-- 会员类型 -->
            <el-form-item class="choose-type"
                          :label="$t('member.memberType')">
              <el-checkbox-group v-model="typeList"
                                 @change="typeListChange">
                <el-checkbox label="DEMAND">
                  {{ $t('member.demand') }} ผู้ใช้บริการว่าจ้างขนส่งสินค้า ผ่านการให้บริการของ แพลตฟอร์ม
                </el-checkbox>
                <el-checkbox label="SUPPLY">
                  {{ $t('member.supply') }} ผู้ให้บริการขนส่ง ที่รับสินค้าจากศูนย์แลกเปลี่ยนสินค้า เพื่อนำส่งผู้รับปลายทาง โดยผ่านการบริการของแพลตฟอร์ม
                </el-checkbox>
                <el-checkbox label="HUB"
                             disabled>
                  {{ $t('member.hub') }} ศูนย์รวบรวมและแลกเปลี่ยนสินค้า ระหว่างผู้ส่งสินค้าและผู้ขนส่ง โดยผ่านการบริการของแพลตฟอร์ม
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <!-- 注册类型 -->
            <el-form-item :label="$t('member.typeOfRegistration')">
              <el-radio-group v-model="infoForm.type"
                              @change="typeChange">
                <el-radio label="PERSONAL">{{ $t('member.personal') }}</el-radio>
                <el-radio label="COMPANY">{{ $t('member.juristicPerson') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('member.companyName')">
              <el-input class="inp"
                        :disabled="!infoForm.type || infoForm.type == 'PERSONAL'"
                        v-model="infoForm.companyName" />
            </el-form-item>
            <el-form-item :label="$t('member.name')">
              <el-input class="inp"
                        :disabled="!infoForm.type || infoForm.type == 'COMPANY'"
                        v-model="infoForm.humanName" />
            </el-form-item>
            <el-form-item :label="$t('member.contacktName')">
              <el-input class="inp"
                        v-model="infoForm.contactName" />
            </el-form-item>
            <el-form-item :label="$t('member.phone_No')">
              <el-input class="inp"
                        v-model="infoForm.contactMobile" />
            </el-form-item>
            <el-form-item :label="$t('member.email')">
              <el-input class="inp"
                        v-model="infoForm.email" />
            </el-form-item>
            <el-form-item :label="$t('member.fullAddress')">
              <el-input class="inp"
                        v-model="infoForm.address" />
              <el-input class="inp"
                        placeholder="Region"
                        v-model="infoForm.region" />
            </el-form-item>
            <el-form-item />
            <el-form-item :label="$t('member.bankname')">
              <el-input class="inp"
                        v-model="infoForm.bank" />
            </el-form-item>
            <el-form-item :label="$t('member.accountName')">
              <el-input class="inp"
                        v-model="infoForm.bankAccountName" />
            </el-form-item>
            <el-form-item :label="$t('member.bankAccount_No')">
              <el-input class="inp"
                        v-model="infoForm.bankNumber" />
            </el-form-item>
            <el-form-item :label="$t('member.billingAddress')">
              <el-input class="inp"
                        v-model="infoForm.bankBillAddress" />
              <el-input class="inp"
                        placeholder="Region"
                        v-model="infoForm.bankBillRegion" />
            </el-form-item>
            <el-form-item />
            <el-form-item :label="$t('member.profileDiscription')">
              <el-input class="inp"
                        v-model="infoForm.description"
                        type="textarea"
                        resize="none" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         @click="saveInfo"
                         class="submitBtn">{{ $t('member.save') }}</el-button>
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
                         :http-request="(file)=>{uploadFile(file,'1')}"
                         action="no"
                         :limit="1">
                <el-button size="small"
                           icon="el-icon-upload2"
                           type="primary">{{ $t('member.upload') }}</el-button>
                <div slot="tip"
                     class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('member.transportationLicense')" />
            <el-form-item :label="$t('member.IDcard')" />
            <el-form-item :label="$t('member.houseParticulars')" />
            <el-form-item :label="$t('member.bangAccount')" />
            <el-form-item>
              <el-button type="primary"
                         class="submitBtn">{{ $t('member.submitDemand') }}</el-button>
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
                           type="primary">{{ $t('member.upload') }}</el-button>
                <div slot="tip"
                     class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('member.transportationLicense')" />
            <el-form-item :label="$t('member.IDcard')" />
            <el-form-item :label="$t('member.houseParticulars')" />
            <el-form-item :label="$t('member.bangAccount')" />
            <el-form-item :label="$t('member.mapForDistributionCenters')" />
            <el-form-item :label="$t('member.carRegistration')" />
            <el-form-item :label="$t('member.cargoInsurance')">
              <div>
                <div class="z-cell">
                  <el-checkbox v-model="perPrice">
                    <el-input size="small"
                              class="checkbox-inp" />
                    THB
                    <el-select v-model="perPriceSelected"
                               size="small"
                               class="checkbox-select"
                               placeholder="Per price" />
                  </el-checkbox>
                </div>
                <div class="z-cell">
                  <el-checkbox v-model="perShipment">
                    <el-input size="small"
                              class="checkbox-inp" />
                    THB
                    <el-select v-model="perShipmentSelected"
                               size="small"
                               class="checkbox-select"
                               placeholder="Per shipment" />
                  </el-checkbox>
                </div>
              </div>
            </el-form-item>
            <el-form-item :label="$t('member.dc')">
              <div class="z-cell">
                <el-switch v-model="dc"
                           :active-text="$t('member.have')"
                           :inactive-text="$t('member.notHave')" />
              </div>
              <transition name="el-fade-in">
                <div v-if="dc"
                     class="z-cell dc-wrapper">
                  <div>
                    <el-table border
                              :data="dcList"
                              style="width:700px;">
                      <el-table-column align="center"
                                       :label="$t('member.dcAddress')">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.address"
                                    type="textarea"
                                    resize="none" />
                        </template>
                      </el-table-column>
                      <el-table-column align="center"
                                       :label="$t('member.transportationExperience')">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.experience"
                                    type="textarea"
                                    resize="none" />
                        </template>
                      </el-table-column>
                      <el-table-column center
                                       width="100px">
                        <template slot-scope="scope">
                          <div style="text-align:center;">
                            <el-button v-if="scope.$index != 0"
                                       type="danger"
                                       icon="el-icon-delete"
                                       circle
                                       @click="delDc(scope.row,scope.$index)" />
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <div class="dc-add-button">
                    <el-button type="primary"
                               icon="el-icon-plus"
                               circle
                               @click="addDc" />
                  </div>
                </div>
              </transition>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         class="submitBtn">{{ $t('member.submitSupply') }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <!-- 相关文件(货运站) -->
      <el-tab-pane disabled
                   name="5"
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
                           type="primary">{{ $t('member.upload') }}</el-button>
                <div slot="tip"
                     class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('member.transportationLicense')" />
            <el-form-item :label="$t('member.IDcard')" />
            <el-form-item :label="$t('member.houseParticulars')" />
            <el-form-item :label="$t('member.bangAccount')" />
            <el-form-item :label="$t('member.cargoInsurance')" />
            <el-form-item :label="$t('member.mapForDistributionCenters')" />
            <el-form-item :label="$t('member.functionalArea')">
              <el-input style="width:200px;">
                <div slot="append">㎡</div>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         class="submitBtn">{{ $t('member.submitHUB') }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <!-- 我的会员合同 -->
      <el-tab-pane name="6"
                   :label="$t('member.myContract')">
        <div class="container" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { fillInfo, getInfo, upload } from '@/api/member'
export default {
  data () {
    return {
      tabActive: '1',
      dc: false,
      dcList: [{ address: '', experience: '' }],
      perShipment: false,
      perShipmentSelected: null,
      perPrice: false,
      perPriceSelected: null,
      infoForm: {},
      typeList: []
    }
  },
  watch: {
    typeList (n, o) {
      const self = this;
      let type = "";
      for (let i of n) {
        type += `${i},`;
      }
      type = type.substr(0, type.length - 1);
      self.infoForm.chosenTypes = type;
    }
  },
  mounted () {
    this.loadData_info();
  },
  methods: {
    // 载入初始数据
    loadData_info () {
      const self = this;
      getInfo().then(res => {
        self.infoForm = res.data;
        self.typeList = self.$store.getters.userInfo.roleListStr.split(',');
      })
    },
    // 会员类型选择
    typeListChange (e) {
      const self = this;
    },
    // 注册类型选择
    typeChange (e) {
      const self = this;
      if (e == 'PERSONAL') {
        self.infoForm.companyName = "";
      } else {
        self.infoForm.humanName = "";
      }
    },
    // 保存基础资料
    saveInfo () {
      const self = this;
      fillInfo(self.infoForm).then(res => {
        self.$message.success(self.$t('member.saveSuccess'));
        self.loadData_info();
      })
    },
    // dc表格操作
    addDc () {
      this.dcList.push({ address: '', experience: '' })
    },
    delDc (row, index) {
      this.dcList.splice(index, 1)
    },
    uploadFile (file, e) {
      const self = this;
      console.log(file)
      console.log(e)
      return
      upload({
        apply_type,
        credentials_type,
        file
      }).then(res => {

      })
    }

  },
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
  overflow: scroll;
}

.secStep {
  margin-top: 50px;
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
<style>
.el-step {
  width: 100% !important;
}

.el-step__title {
  width: 100% !important;
}

.el-tab-pane,
.el-tabs__content {
  height: 100%;
}
</style>
