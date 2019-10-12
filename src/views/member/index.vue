<!-- member index -->
<template>
  <div class="wrapper">
    <el-tabs v-model="tabActive"
             tab-position="left"
             @tab-click="tabChange"
             style="height:100%">
      <!-- 会员申请流程 -->
      <el-tab-pane name="process"
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
      <el-tab-pane name="data"
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
                  {{ $t('member.supply') }} ผู้ให้บริการขนส่ง ที่รับสินค้าจากศูนย์แลกเปลี่ยนสินค้า
                  เพื่อนำส่งผู้รับปลายทาง โดยผ่านการบริการของแพลตฟอร์ม
                </el-checkbox>
                <el-checkbox label="HUB"
                             disabled>
                  {{ $t('member.hub') }} ศูนย์รวบรวมและแลกเปลี่ยนสินค้า ระหว่างผู้ส่งสินค้าและผู้ขนส่ง
                  โดยผ่านการบริการของแพลตฟอร์ม
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
                         class="submitBtn">{{ $t('member.save') }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <!-- 相关文件（发货人）150px -->
      <el-tab-pane name="DEMAND"
                   :label="$t('member.relevantDocument_demand')">
        <div class="container">
          <el-alert v-if="applyStatus.demand.status == 'REJECTED'"
                    class="rejectMsg"
                    show-icon
                    :closable="false"
                    :description='applyStatus.demand.rejectReason'
                    :title="$t('member.applyStatusRejected')"
                    type="error"></el-alert>
          <el-alert v-else-if="applyStatus.demand.status == 'DEFAULT'"
                    class="rejectMsg"
                    show-icon
                    :closable="false"
                    :title="$t('member.applyStatusDefault')"
                    type="info"></el-alert>
          <el-alert v-else-if="applyStatus.demand.status == 'ACCEPTED'"
                    class="rejectMsg"
                    show-icon
                    :closable="false"
                    @click="goToDownload"
                    :description="$t('member.goToDownload')"
                    :title="$t('member.applyStatusAccepted')"
                    type="success"></el-alert>
          <el-form label-width="200px"
                   :disabled="applyStatus.demand.status == 'ACCEPTED' || applyStatus.demand.status == 'ACTIVATED' || applyStatus.demand.status == 'DEFAULT'">
            <el-form-item :label="$t('member.affidavit')">
              <el-upload class="upload"
                         :action="baseUrl + '?credentials_type=affidavit&apply_type=DEMAND'"
                         :headers="headers"
                         :file-list="fileList.demand.affidavit"
                         :on-success="uploadSuccess"
                         accept="image/*"
                         :on-change="handleChange">
                <el-button size="small"
                           icon="el-icon-upload2"
                           type="primary">{{ $t('member.upload') }}
                </el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('member.transportationLicense')">
              <el-upload class="upload"
                         :action="baseUrl + '?credentials_type=transportation_license&apply_type=DEMAND'"
                         :headers="headers"
                         :file-list="fileList.demand.transportation_license"
                         :on-success="uploadSuccess"
                         accept="image/*"
                         :on-change="handleChange">
                <el-button size="small"
                           icon="el-icon-upload2"
                           type="primary">{{ $t('member.upload') }}
                </el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('member.IDcard')">
              <el-upload class="upload"
                         :action="baseUrl + '?credentials_type=idcard&apply_type=DEMAND'"
                         :headers="headers"
                         :file-list="fileList.demand.idcard"
                         :on-success="uploadSuccess"
                         accept="image/*"
                         :on-change="handleChange">
                <el-button size="small"
                           icon="el-icon-upload2"
                           type="primary">{{ $t('member.upload') }}
                </el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('member.houseParticulars')">
              <el-upload class="upload"
                         :action="baseUrl + '?credentials_type=house_particulars&apply_type=DEMAND'"
                         :headers="headers"
                         :file-list="fileList.demand.house_particulars"
                         :on-success="uploadSuccess"
                         accept="image/*"
                         :on-change="handleChange">
                <el-button size="small"
                           icon="el-icon-upload2"
                           type="primary">{{ $t('member.upload') }}
                </el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('member.bangAccount')">
              <el-upload class="upload"
                         :action="baseUrl + '?credentials_type=bank_account_copy&apply_type=DEMAND'"
                         :headers="headers"
                         :file-list="fileList.demand.bank_account_copy"
                         :on-success="uploadSuccess"
                         accept="image/*"
                         :on-change="handleChange">
                <el-button size="small"
                           icon="el-icon-upload2"
                           type="primary">{{ $t('member.upload') }}
                </el-button>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button class="submitBtn"
                         @click="submitDemand"
                         type="primary">
                {{ $t('member.submitDemand') }}
              </el-button>
            </el-form-item>
          </el-form>
          <el-button type="primary"
                     style="margin-left:200px;"
                     @click="goToDownload"
                     v-if="applyStatus.demand.status == 'ACCEPTED'">{{$t('member.goToDownload')}}</el-button>
        </div>
      </el-tab-pane>
      <!-- 相关文件(运输公司) -->
      <el-tab-pane name="SUPPLY"
                   :label="$t('member.relevantdocument_supply')">
        <div class="container">
          <el-alert v-if="applyStatus.supply.status == 'REJECTED'"
                    class="rejectMsg"
                    show-icon
                    :closable="false"
                    :description='applyStatus.supply.rejectReason'
                    :title="$t('member.applyStatusRejected')"
                    type="error"></el-alert>
          <el-alert v-else-if="applyStatus.supply.status == 'DEFAULT'"
                    class="rejectMsg"
                    show-icon
                    :closable="false"
                    :title="$t('member.applyStatusDefault')"
                    type="info"></el-alert>
          <el-alert v-else-if="applyStatus.supply.status == 'ACCEPTED'"
                    class="rejectMsg"
                    show-icon
                    :closable="false"
                    @click="goToDownload"
                    :description="$t('member.goToDownload')"
                    :title="$t('member.applyStatusAccepted')"
                    type="success"></el-alert>
          <el-form label-width="200px"
                   :disabled="applyStatus.supply.status == 'ACCEPTED' || applyStatus.supply.status == 'ACTIVATED' ">
            <el-form-item :label="$t('member.affidavit')">
              <el-upload class="upload"
                         :action="baseUrl + '?credentials_type=affidavit&apply_type=SUPPLY'"
                         :headers="headers"
                         :file-list="fileList.supply.affidavit"
                         :on-success="uploadSuccess"
                         accept="image/*"
                         :on-change="handleChange">
                <el-button size="small"
                           icon="el-icon-upload2"
                           type="primary">{{ $t('member.upload') }}
                </el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('member.transportationLicense')">
              <el-upload class="upload"
                         :action="baseUrl + '?credentials_type=transportation_license&apply_type=SUPPLY'"
                         :headers="headers"
                         :file-list="fileList.supply.transportation_license"
                         :on-success="uploadSuccess"
                         accept="image/*"
                         :on-change="handleChange">
                <el-button size="small"
                           icon="el-icon-upload2"
                           type="primary">{{ $t('member.upload') }}
                </el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('member.IDcard')">
              <el-upload class="upload"
                         :action="baseUrl + '?credentials_type=idcard&apply_type=SUPPLY'"
                         :headers="headers"
                         :file-list="fileList.supply.idcard"
                         :on-success="uploadSuccess"
                         accept="image/*"
                         :on-change="handleChange">
                <el-button size="small"
                           icon="el-icon-upload2"
                           type="primary">{{ $t('member.upload') }}
                </el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('member.houseParticulars')">
              <el-upload class="upload"
                         :action="baseUrl + '?credentials_type=house_particulars&apply_type=SUPPLY'"
                         :headers="headers"
                         :file-list="fileList.supply.house_particulars"
                         :on-success="uploadSuccess"
                         accept="image/*"
                         :on-change="handleChange">
                <el-button size="small"
                           icon="el-icon-upload2"
                           type="primary">{{ $t('member.upload') }}
                </el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('member.bangAccount')">
              <el-upload class="upload"
                         :action="baseUrl + '?credentials_type=bank_account_copy&apply_type=SUPPLY'"
                         :headers="headers"
                         :file-list="fileList.supply.bank_account_copy"
                         :on-success="uploadSuccess"
                         accept="image/*"
                         :on-change="handleChange">
                <el-button size="small"
                           icon="el-icon-upload2"
                           type="primary">{{ $t('member.upload') }}
                </el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('member.mapForDistributionCenters')">
              <el-upload class="upload"
                         :action="baseUrl + '?credentials_type=center_map&apply_type=SUPPLY'"
                         :headers="headers"
                         :file-list="fileList.supply.center_map"
                         :on-success="uploadSuccess"
                         accept="image/*"
                         :on-change="handleChange">
                <el-button size="small"
                           icon="el-icon-upload2"
                           type="primary">{{ $t('member.upload') }}
                </el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('member.carRegistration')">
              <el-upload class="upload"
                         :action="baseUrl + '?credentials_type=truck_register_copy&apply_type=SUPPLY'"
                         :headers="headers"
                         :file-list="fileList.supply.truck_register_copy"
                         :on-success="uploadSuccess"
                         accept="image/*"
                         :on-change="handleChange">
                <el-button size="small"
                           icon="el-icon-upload2"
                           type="primary">{{ $t('member.upload') }}
                </el-button>
              </el-upload>
            </el-form-item>
            <!-- <el-form-item :label="$t('member.cargoInsurance')">
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
            </el-form-item> -->
            <el-form-item :label="$t('member.dc')">
              <div class="z-cell">
                <el-switch v-model="dc_status"
                           @change="dcChange"
                           :active-value="1"
                           :inactive-value="0"
                           :active-text="$t('member.have')"
                           :inactive-text="$t('member.notHave')" />
              </div>
              <transition name="el-fade-in">
                <div v-if="dc_status"
                     class="z-cell dc-wrapper">
                  <div>
                    <el-table border
                              :data="dc"
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
                          <el-input v-model="scope.row.years"
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
                         v-if="applyStatus.supply.status == 'DEFAULT'"
                         disabled
                         class="submitBtn">
                {{ $t('member.applyStatusDefault') }}
              </el-button>
              <el-button type="primary"
                         v-else-if="applyStatus.supply.status == 'ACCEPTED'"
                         disabled
                         class="submitBtn">
                {{ $t('member.applyStatusAccepted') }}
              </el-button>
              <el-button v-else
                         class="submitBtn"
                         @click="submitSupply"
                         type="primary">
                {{ $t('member.submitSupply') }}
              </el-button>
            </el-form-item>
          </el-form>
          <el-button type="primary"
                     style="margin-left:200px;"
                     @click="goToDownload"
                     v-if="applyStatus.demand.status == 'ACCEPTED'">{{$t('member.goToDownload')}}</el-button>
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
                         multiple>
                <el-button size="small"
                           icon="el-icon-upload2"
                           type="primary">{{ $t('member.upload') }}
                </el-button>
                <div slot="tip"
                     class="el-upload__tip">只能上传jpg/png文件，且不超过500kb
                </div>
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
                         class="submitBtn">{{ $t('member.submitHUB') }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <!-- 我的会员合同 -->
      <el-tab-pane name="contract"
                   :label="$t('member.myContract')">
        <div class="container">
          <el-table border
                    :data="contractList">
            <el-table-column header-align="center"
                             align="center"
                             :label="$t('member.type')">
              <template slot-scope="scope">
                <div>
                  {{scope.row.type == "DEMAND" ? $t('member.demand') : scope.row.type == "SUPPLY" ? $t('member.supply') : ""}}
                </div>
              </template>
            </el-table-column>
            <el-table-column header-align="center"
                             align="center"
                             :label="$t('member.downloadContract')">
              <template slot-scope="scope">
                <el-button type="primary"
                           @click="downloadContract(scope.row.path)">{{$t('member.download')}}</el-button>
              </template>
            </el-table-column>
            <el-table-column header-align="center"
                             align="center"
                             :label="$t('member.uploadContract')">
              <template slot-scope="scope">
                <el-upload class="upload"
                           :action="baseUrl + '?credentials_type=affidavit&apply_type=DEMAND'"
                           :headers="headers"
                           :file-list="fileList.demand.affidavit"
                           :on-success="uploadSuccess"
                           accept="image/*"
                           :on-change="handleChange">
                  <el-button size="small"
                             icon="el-icon-upload2"
                             type="primary">{{ $t('member.upload') }}
                  </el-button>
                </el-upload>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { fillInfo, getInfo, getCredentials, submitApply, getApplying, getDc, getContract } from '@/api/member'
import { getToken } from '@/utils/auth'

let self;
export default {
  data () {
    return {
      tabActive: 'process',
      dc_status: false,
      dc: [{ address: '', years: '' }],
      perShipment: false,
      perShipmentSelected: null,
      perPrice: false,
      perPriceSelected: null,
      infoForm: {},
      typeList: [],
      baseUrl: process.env.VUE_APP_BASE_API + '/api/member/upload',
      headers: {
        "authorization": getToken(),
        "locale": this.$store.getters.language
      },
      fileList: {
        demand: {
          affidavit: [],
          transportation_license: [],
          idcard: [],
          house_particulars: [],
          bank_account_copy: [],
        },
        supply: {
          affidavit: [],
          transportation_license: [],
          idcard: [],
          house_particulars: [],
          bank_account_copy: [],
          center_map: [],
          truck_register_copy: [],
        }
      },
      applyList: {
        demand: null,
        supply: null
      },
      applyStatus: {
        demand: {
          status: null
        },
        supply: {
          status: null
        }
      },
      contractList: []
    }
  },
  watch: {
    typeList (n, o) {
      let type = ''
      for (let i of n) {
        type += `${i},`
      }
      type = type.substr(0, type.length - 1)
      self.infoForm.chosenTypes = type
    }
  },
  mounted () {
    self = this;
    self.loadData();
  },
  methods: {
    loadData () {
      self.loadData_info();
      self.loadData_list('DEMAND');
      self.loadData_list('SUPPLY');
      self.loadData_contract();
    },
    // 载入基础资料
    loadData_info () {
      getInfo().then(res => {
        self.infoForm = res.data;
        self.typeList = self.$store.getters.userInfo.roleListStr.split(',');
      })
      getApplying().then(res => {
        console.log(res)
        for (let i of res.data) {
          self.applyStatus[i.applyType.toLowerCase()] = {
            status: i.auditStatus,
            rejectReason: i.rejectReason
          };
        }
      })
    },
    // 载入相关文件
    loadData_list (apply_type) {
      // 获取文件列表
      getCredentials(apply_type).then(res => {
        for (let i of res.data) {
          self.fileList[i.applyType.toLowerCase()][i.credentialsType] = [{
            name: i.resource.name,
            url: i.resource.path
          }]
        }
      })
      if (apply_type == "SUPPLY") {
        getDc().then(res => {
          self.dc_status = res.data.length == 0 ? 0 : 1;
          self.dc = res.data;
        })
      }
    },
    // 获取合同
    loadData_contract () {
      getContract().then(res => {
        self.contractList = res.data;
      })
    },
    tabChange (tab, e) {
      // let name = tab.name;
      // if (name == 'data') {
      //   self.loadData_info();
      // } else if (name == 'DEMAND' || name == 'SUPPLY' || name == 'HUB') {
      //   self.loadData_list(name)
      // }
    },
    // 会员类型选择
    typeListChange (e) {

    },
    // 注册类型选择
    typeChange (e) {
      if (e == 'PERSONAL') {
        self.infoForm.companyName = ''
      } else {
        self.infoForm.humanName = ''
      }
    },
    // 保存基础资料
    saveInfo () {
      fillInfo(self.infoForm).then(res => {
        self.$message.success(self.$t('member.saveSuccess'))
        self.loadData_info()
      })
    },
    // dc表格操作
    addDc () {
      this.dc.push({ address: '', years: '' })
    },
    delDc (row, index) {
      this.dc.splice(index, 1)
    },
    // 文件选中时的处理
    handlePreview (file, fileList) {
      // console.log(file)
      // if (fileList.length > 1) {
      //   fileList.splice(0, 1);
      // }
    },
    // 文件覆盖上传
    handleChange (file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
      // self.fileList.demand.affidavit = []
    },
    // 文件上传成功的处理
    uploadSuccess (res, file) {
      console.log(file)
      if (res.status === 200) {
        let applyType = res.data.applyType; // 申请类型
        let credentialsType = res.data.credentialsType; // 文件类型
        self.fileList[self.tabActive.toLowerCase()][res.data.credentialsType][0] = {
          name: res.data.resource.name,
          url: res.data.resource.path
        }
        // self.loadData_list(self.tabActive);
      }
    },
    // 文件删除时的处理
    handleRemove (file, fileList) {
    },
    // 提交发货人申请
    submitDemand () {
      // 简单验证
      for (let x in self.fileList.demand) {
        console.log(x)
        if (self.fileList.demand[x].length == 0) {
          return self.$message.warning(self.$t('member.pleaseCompleteTheInformation'))
        }
      }
      submitApply('DEMAND').then(res => {
        self.loadData();
      })
    },
    dcChange (e) {
      self.dc = [{ address: '', years: '' }]
    },
    // 提交运输公司申请
    submitSupply () {
      // 简单验证
      for (let x in self.fileList.supply) {
        if (self.fileList.supply[x].length == 0) {
          return self.$message.warning(self.$t('member.pleaseCompleteTheInformation'))
        }
      }
      if (self.dc_status == 1) {
        for (let i of self.dc) {
          if (i.address == "" || i.years == "") {
            return self.$message.warning(self.$t('member.pleaseCompleteTheInformation'))
          }
        }
      }
      submitApply('SUPPLY', {
        dc_status: self.dc_status,
        dc: JSON.stringify(self.dc)
      }).then(res => {
        self.loadData();
      })
    },
    // 去下载会员合同
    goToDownload () {
      self.tabActive = 'contract';
    },
    downloadContract (path) {
      window.open(path)
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

.rejectMsg {
  margin-bottom: 20px;
}
</style>
