<!-- member index -->
<template>
  <div class="wrapper member">
    <el-tabs v-model="tabActive" tab-position="left" @tab-click="tabChange" style="height:100%">
      <!-- 会员申请流程 -->
      <el-tab-pane name="process" :label="$t('member.membershipApplicationProcess')">
        <div class="container">
          <el-steps simple>
            <el-step :title="$t('member.register')" icon="none" status="process">
              <svg-icon slot="icon" style="font-size:20px;" class-name="international-icon" icon-class="A1" />
            </el-step>
            <el-step :title="$t('member.enterData')" icon="none" status="process">
              <svg-icon slot="icon" style="font-size:20px;" class-name="international-icon" icon-class="A2" />
            </el-step>
            <el-step :title="$t('member.submitApplication')" icon="none" status="process">
              <svg-icon slot="icon" style="font-size:20px;" class-name="international-icon" icon-class="A3" />
            </el-step>
            <el-step :title="$t('member.downloadContract')" icon="none" status="process">
              <svg-icon slot="icon" style="font-size:20px;" class-name="international-icon" icon-class="A4" />
            </el-step>
          </el-steps>
          <el-steps class="secStep" simple>
            <el-step :title="$t('member.payGuaranteeMoney')" icon="none" status="process">
              <svg-icon slot="icon" style="font-size:20px;" class-name="international-icon" icon-class="A5" />
            </el-step>
            <el-step :title="$t('member.sendContractBackToPlatform')" icon="none" status="process">
              <svg-icon slot="icon" style="font-size:20px;" class-name="international-icon" icon-class="A6" />
            </el-step>
            <el-step :title="$t('member.onlieTraining')" icon="none" status="process">
              <svg-icon slot="icon" style="font-size:20px;" class-name="international-icon" icon-class="A7" />
            </el-step>
            <el-step :title="$t('member.activateAccount')" icon="none" status="process">
              <svg-icon slot="icon" style="font-size:20px;" class-name="international-icon" icon-class="A8" />
            </el-step>
          </el-steps>
        </div>
      </el-tab-pane>
      <!-- 基础资料 -->
      <el-tab-pane name="data" :label="$t('member.essentialData')">
        <div class="container fixform">
          <el-form ref="form" label-width="150px" label-position="left">
            <!-- 会员类型 -->
            <el-form-item class="choose-type" :label="$t('member.memberType')">
              <div style="line-height:25px;">
                <el-checkbox-group v-model="typeList" @change="typeListChange">
                  <el-checkbox
                    label="DEMAND"
                    :disabled="applyStatus.demand.status === 'ACCEPTED' || applyStatus.demand.status === 'ACTIVATED'"
                  >
                    {{ $t("member.demand") }} ผู้ใช้บริการว่าจ้างขนส่งสินค้า ผ่านการให้บริการของ แพลตฟอร์ม
                  </el-checkbox>
                  <el-checkbox
                    label="SUPPLY"
                    :disabled="applyStatus.supply.status === 'ACCEPTED' || applyStatus.supply.status === 'ACTIVATED'"
                  >
                    {{ $t("member.supply") }} ผู้ให้บริการขนส่ง ที่รับสินค้าจากศูนย์แลกเปลี่ยนสินค้า เพื่อนำส่งผู้รับปลายทาง
                    โดยผ่านการบริการของแพลตฟอร์ม
                  </el-checkbox>
                  <el-checkbox label="HUB" disabled>
                    {{ $t("member.hub") }} ศูนย์รวบรวมและแลกเปลี่ยนสินค้า ระหว่างผู้ส่งสินค้าและผู้ขนส่ง
                    โดยผ่านการบริการของแพลตฟอร์ม
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </el-form-item>
            <!-- 注册类型 -->
            <el-form-item :label="$t('member.typeOfRegistration')">
              <el-radio-group v-model="infoForm.type" :disabled="activated" @change="typeChange">
                <el-radio label="PERSONAL">{{ $t("member.personal") }}</el-radio>
                <el-radio label="COMPANY">{{ $t("member.juristicPerson") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('member.companyName')">
              <el-input
                class="inp"
                :disabled="!infoForm.type || infoForm.type === 'PERSONAL' || activated"
                v-model="infoForm.companyName"
              />
            </el-form-item>
            <el-form-item :label="$t('member.name')">
              <el-input
                class="inp"
                :disabled="!infoForm.type || infoForm.type === 'COMPANY' || activated"
                v-model="infoForm.humanName"
              />
            </el-form-item>
            <el-form-item :label="$t('member.contacktName')">
              <el-input class="inp" v-model="infoForm.contactName" />
            </el-form-item>
            <el-form-item :label="$t('member.phone_No')">
              <el-input class="inp" v-model="infoForm.contactMobile" />
            </el-form-item>
            <el-form-item :label="$t('member.email')">
              <el-input class="inp" v-model="infoForm.email" />
            </el-form-item>
            <el-form-item :label="$t('member.fullAddress')">
              <el-input class="inp" :placeholder="$t('member.address')" v-model="infoForm.address" />
              <el-input class="inp" :placeholder="$t('member.region')" v-model="infoForm.region" />
            </el-form-item>
            <el-form-item />
            <el-form-item :label="$t('member.bankname')">
              <el-input class="inp" v-model="infoForm.bank" />
            </el-form-item>
            <el-form-item :label="$t('member.accountName')">
              <el-input class="inp" v-model="infoForm.bankAccountName" />
            </el-form-item>
            <el-form-item :label="$t('member.bankAccount_No')">
              <el-input class="inp" v-model="infoForm.bankNumber" />
            </el-form-item>
            <el-form-item :label="$t('member.billingAddress')">
              <el-input class="inp" :placeholder="$t('member.address')" v-model="infoForm.bankBillAddress" />
              <el-input class="inp" :placeholder="$t('member.region')" v-model="infoForm.bankBillRegion" />
            </el-form-item>
            <el-form-item />
            <el-form-item :label="$t('member.profileDiscription')">
              <el-input class="inp" v-model="infoForm.description" type="textarea" resize="none" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveInfo" class="submitBtn">{{ $t("member.save") }} </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <!-- 相关文件（发货人）150px -->
      <el-tab-pane name="DEMAND" :label="$t('member.relevantDocument_demand')">
        <div class="container fixupload">
          <el-alert
            v-if="applyStatus.demand.status === 'REJECTED'"
            class="rejectMsg"
            show-icon
            :closable="false"
            :description="applyStatus.demand.rejectReason"
            :title="$t('member.applyStatusRejected')"
            type="error"
          />
          <el-alert
            v-else-if="applyStatus.demand.status === 'DEFAULT'"
            class="rejectMsg"
            show-icon
            :closable="false"
            :title="$t('member.applyStatusDefault')"
            type="info"
          />
          <el-alert
            v-else-if="applyStatus.demand.status === 'ACCEPTED'"
            class="rejectMsg"
            show-icon
            :closable="false"
            @click="goToDownload"
            :description="$t('member.goToDownload')"
            :title="$t('member.applyStatusAccepted')"
            type="success"
          />
          <el-alert
            v-else-if="applyStatus.demand.status === 'ACTIVATED'"
            class="rejectMsg"
            show-icon
            :closable="false"
            :title="$t('member.applyStatusAccepted')"
            type="success"
          />
          <el-form
            label-width="200px"
            :disabled="
              applyStatus.demand.status === 'ACCEPTED' ||
                applyStatus.demand.status === 'ACTIVATED' ||
                applyStatus.demand.status === 'DEFAULT'
            "
            label-position="left"
          >
            <el-form-item :label="$t('member.affidavit')">
              <el-upload
                class="upload"
                :action="baseUrl + '?credentials_type=affidavit&apply_type=DEMAND'"
                :headers="headers"
                :file-list="fileList.demand.affidavit"
                :on-success="uploadSuccess"
                accept="image/*"
                :on-change="handleChange"
              >
                <el-button size="small" icon="el-icon-upload2" type="primary">{{ $t("member.upload") }} </el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('member.transportationLicense')">
              <el-upload
                class="upload"
                :action="baseUrl + '?credentials_type=transportation_license&apply_type=DEMAND'"
                :headers="headers"
                :file-list="fileList.demand.transportation_license"
                :on-success="uploadSuccess"
                accept="image/*"
                :on-change="handleChange"
              >
                <el-button size="small" icon="el-icon-upload2" type="primary">{{ $t("member.upload") }} </el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('member.IDcard')">
              <el-upload
                class="upload"
                :action="baseUrl + '?credentials_type=idcard&apply_type=DEMAND'"
                :headers="headers"
                :file-list="fileList.demand.idcard"
                :on-success="uploadSuccess"
                accept="image/*"
                :on-change="handleChange"
              >
                <el-button size="small" icon="el-icon-upload2" type="primary">{{ $t("member.upload") }} </el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('member.houseParticulars')">
              <el-upload
                class="upload"
                :action="baseUrl + '?credentials_type=house_particulars&apply_type=DEMAND'"
                :headers="headers"
                :file-list="fileList.demand.house_particulars"
                :on-success="uploadSuccess"
                accept="image/*"
                :on-change="handleChange"
              >
                <el-button size="small" icon="el-icon-upload2" type="primary">{{ $t("member.upload") }} </el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('member.bangAccount')">
              <el-upload
                class="upload"
                :action="baseUrl + '?credentials_type=bank_account_copy&apply_type=DEMAND'"
                :headers="headers"
                :file-list="fileList.demand.bank_account_copy"
                :on-success="uploadSuccess"
                accept="image/*"
                :on-change="handleChange"
              >
                <el-button size="small" icon="el-icon-upload2" type="primary">{{ $t("member.upload") }} </el-button>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button class="submitBtn" @click="submitDemand" type="primary">
                {{ $t("member.submitDemand") }}
              </el-button>
            </el-form-item>
          </el-form>
          <el-button
            type="primary"
            style="margin-left:200px;"
            @click="goToDownload"
            class="gotodownload"
            v-if="applyStatus.demand.status === 'ACCEPTED'"
            >{{ $t("member.goToDownload") }}
          </el-button>
        </div>
      </el-tab-pane>
      <!-- 相关文件(运输公司) -->
      <el-tab-pane name="SUPPLY" :label="$t('member.relevantdocument_supply')">
        <div class="container fixupload">
          <el-alert
            v-if="applyStatus.supply.status === 'REJECTED'"
            class="rejectMsg"
            show-icon
            :closable="false"
            :description="applyStatus.supply.rejectReason"
            :title="$t('member.applyStatusRejected')"
            type="error"
          />
          <el-alert
            v-else-if="applyStatus.supply.status === 'DEFAULT'"
            class="rejectMsg"
            show-icon
            :closable="false"
            :title="$t('member.applyStatusDefault')"
            type="info"
          />
          <el-alert
            v-else-if="applyStatus.supply.status === 'ACCEPTED'"
            class="rejectMsg"
            show-icon
            :closable="false"
            @click="goToDownload"
            :description="$t('member.goToDownload')"
            :title="$t('member.applyStatusAccepted')"
            type="success"
          />
          <el-alert
            v-else-if="applyStatus.supply.status === 'ACTIVATED'"
            class="rejectMsg"
            show-icon
            :closable="false"
            :title="$t('member.applyStatusAccepted')"
            type="success"
          />
          <el-form
            label-width="200px"
            :disabled="
              applyStatus.supply.status === 'ACCEPTED' ||
                applyStatus.supply.status === 'ACTIVATED' ||
                applyStatus.supply.status === 'DEFAULT'
            "
            label-position="left"
          >
            <el-form-item :label="$t('member.logo')">
              <el-upload
                class="avatar-uploader"
                :action="baseUrl + '?credentials_type=logo&apply_type=SUPPLY'"
                :headers="headers"
                :show-file-list="false"
                :on-success="uploadSuccess"
                accept="image/*"
                :on-change="handleChange"
              >
                <img v-if="fileList.supply.logo[0]" :src="fileList.supply.logo[0].url" class="avatar" alt="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('member.affidavit')">
              <el-upload
                class="upload"
                :action="baseUrl + '?credentials_type=affidavit&apply_type=SUPPLY'"
                :headers="headers"
                :file-list="fileList.supply.affidavit"
                :on-success="uploadSuccess"
                accept="image/*"
                :on-change="handleChange"
              >
                <el-button size="small" icon="el-icon-upload2" type="primary">{{ $t("member.upload") }} </el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('member.transportationLicense')">
              <el-upload
                class="upload"
                :action="baseUrl + '?credentials_type=transportation_license&apply_type=SUPPLY'"
                :headers="headers"
                :file-list="fileList.supply.transportation_license"
                :on-success="uploadSuccess"
                accept="image/*"
                :on-change="handleChange"
              >
                <el-button size="small" icon="el-icon-upload2" type="primary">{{ $t("member.upload") }} </el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('member.IDcard')">
              <el-upload
                class="upload"
                :action="baseUrl + '?credentials_type=idcard&apply_type=SUPPLY'"
                :headers="headers"
                :file-list="fileList.supply.idcard"
                :on-success="uploadSuccess"
                accept="image/*"
                :on-change="handleChange"
              >
                <el-button size="small" icon="el-icon-upload2" type="primary">{{ $t("member.upload") }} </el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('member.houseParticulars')">
              <el-upload
                class="upload"
                :action="baseUrl + '?credentials_type=house_particulars&apply_type=SUPPLY'"
                :headers="headers"
                :file-list="fileList.supply.house_particulars"
                :on-success="uploadSuccess"
                accept="image/*"
                :on-change="handleChange"
              >
                <el-button size="small" icon="el-icon-upload2" type="primary">{{ $t("member.upload") }} </el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('member.bangAccount')">
              <el-upload
                class="upload"
                :action="baseUrl + '?credentials_type=bank_account_copy&apply_type=SUPPLY'"
                :headers="headers"
                :file-list="fileList.supply.bank_account_copy"
                :on-success="uploadSuccess"
                accept="image/*"
                :on-change="handleChange"
              >
                <el-button size="small" icon="el-icon-upload2" type="primary">{{ $t("member.upload") }} </el-button>
              </el-upload>
            </el-form-item>
            <!-- <el-form-item :label="$t('member.mapForDistributionCenters')">
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
            </el-form-item> -->
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
                <el-switch
                  v-model="dc_status"
                  @change="dcChange"
                  :active-value="1"
                  :inactive-value="0"
                  :active-text="$t('member.have')"
                  :inactive-text="$t('member.notHave')"
                />
              </div>
              <transition name="el-fade-in">
                <div v-if="dc_status" class="z-cell dc-wrapper">
                  <div>
                    <el-table border :data="dc" style="width:700px;">
                      <el-table-column align="center" :label="$t('member.dcAddress')">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.address" type="textarea" resize="none" />
                        </template>
                      </el-table-column>
                      <el-table-column align="center" :label="$t('member.transportationExperience')">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.years" type="textarea" resize="none" />
                        </template>
                      </el-table-column>
                      <el-table-column center width="100px">
                        <template slot-scope="scope">
                          <div style="text-align:center;">
                            <el-button
                              v-if="scope.$index !== 0"
                              type="danger"
                              icon="el-icon-delete"
                              circle
                              @click="delDc(scope.row, scope.$index)"
                            />
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <div class="dc-add-button">
                    <el-button type="primary" icon="el-icon-plus" circle @click="addDc" />
                  </div>
                </div>
              </transition>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" v-if="applyStatus.supply.status === 'DEFAULT'" disabled class="submitBtn">
                {{ $t("member.applyStatusDefault") }}
              </el-button>
              <el-button type="primary" v-else-if="applyStatus.supply.status === 'ACCEPTED'" disabled class="submitBtn">
                {{ $t("member.applyStatusAccepted") }}
              </el-button>
              <el-button v-else class="submitBtn" @click="submitSupply" type="primary">
                {{ $t("member.submitSupply") }}
              </el-button>
            </el-form-item>
          </el-form>
          <el-button
            type="primary"
            style="margin-left:200px;"
            @click="goToDownload"
            class="gotodownload"
            v-if="applyStatus.demand.status === 'ACCEPTED'"
            >{{ $t("member.goToDownload") }}
          </el-button>
        </div>
      </el-tab-pane>
      <!-- 相关文件(货运站) -->
      <el-tab-pane disabled name="5" :label="$t('member.relevantdocument_HUB')">
        <div class="container fixupload">
          <el-form label-width="200px">
            <el-form-item :label="$t('member.affidavit')">
              <el-upload class="upload" action="https://jsonplaceholder.typicode.com/posts/" multiple>
                <el-button size="small" icon="el-icon-upload2" type="primary">{{ $t("member.upload") }} </el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png文件，且不超过500kb
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
              <el-button type="primary" class="submitBtn">{{ $t("member.submitHUB") }} </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <!-- 基础设置 -->
      <!-- <el-tab-pane name="setting" :label="$t('member.setting')">
        <div class="container">
          <el-form hide-required-asterisk label-width="200px" ref="setForm" :model="setForm" :rules="setRules" label-position="left">
            <el-form-item prop="exchange" :label="$t('member.VolumeWeightDivisor')">
              <el-select v-model="setForm.exchange" :placeholder="$t('placeholder.pleaseChoose')" class="inp">
                <el-option :label="2500" :value="2500"> </el-option>
                <el-option :label="3000" :value="3000"> </el-option>
                <el-option :label="3500" :value="3500"> </el-option>
              </el-select>
              <div style="color:#ccc;">
                <div>{{ $t("member.volumeWeightConversion") }}</div>
                <div class="inp">
                  {{ $t("member.example") }},<br />
                  {{ $t("member.example1") }}
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveSet" class="submitBtn">{{ $t("member.save") }} </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane> -->
      <!-- 我的会员合同 -->
      <el-tab-pane name="contract" :label="$t('member.myContract')">
        <div class="container">
          <el-table border :data="contractList">
            <el-table-column header-align="center" align="center" :label="$t('member.type')">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.type === "DEMAND" ? $t("member.demand") : scope.row.type === "SUPPLY" ? $t("member.supply") : "" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" :label="$t('member.downloadContract')">
              <template slot-scope="scope">
                <el-button type="primary" @click="downloadContract(scope.row)">{{ $t("member.download") }} </el-button>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" :label="$t('member.uploadContract')">
              <template slot-scope="scope">
                <el-upload
                  :action="cBaseUrl + '?apply_type=' + scope.row.type"
                  :headers="headers"
                  :disabled="scope.row.status === 'ACTIVATED'"
                  :file-list="fileList.contract[scope.row.type]"
                  :on-success="uploadSuccess2"
                  :show-file-list="false"
                  accept=".pdf,image/*"
                  :on-change="handleChange"
                >
                  <el-button size="small" icon="el-icon-upload2" :disabled="scope.row.status === 'ACTIVATED'" type="primary"
                    >{{ $t("member.upload") }}
                  </el-button>
                </el-upload>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" prop="prop" :label="$t('member.status')">
              <template slot-scope="scope">
                <div>
                  <el-tag type="info" v-if="contractStatus[scope.row.type] === '' || contractStatus[scope.row.type] == null"
                    >{{ $t("member.waitUpload") }}
                  </el-tag>
                  <el-tag type="success" v-else-if="scope.row.status === 'ACTIVATED'">{{ $t("member.passed") }} </el-tag>
                  <el-tag type="primary" v-else>{{ $t("member.underReview") }} </el-tag>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { fillInfo, getInfo, getCredentials, submitApply, getApplying, getDc, getContract, setExchange } from "@/api/member";
import { getToken } from "@/utils/auth";

let self;
export default {
  data() {
    return {
      tabActive: "process",
      dc_status: false,
      dc: [{ address: "", years: "" }],
      perShipment: false,
      perShipmentSelected: null,
      perPrice: false,
      perPriceSelected: null,
      infoForm: {},
      typeList: [],
      baseUrl: `${process.env.VUE_APP_BASE_API}/api/member/upload`,
      cBaseUrl: `${process.env.VUE_APP_BASE_API}/api/member/contract/upload`,
      headers: {
        authorization: getToken(),
        locale: this.$store.getters.language,
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
          // center_map: [],
          // truck_register_copy: [],
          logo: [],
        },
        contract: {
          DEMAND: [],
          SUPPLY: [],
        },
      },
      applyList: {
        demand: null,
        supply: null,
      },
      applyStatus: {
        demand: {
          status: null,
        },
        supply: {
          status: null,
        },
      },
      contractList: [],
      contractStatus: {
        DEMAND: "",
        SUPPLY: "",
      },
      activated: false,
      setForm: {
        exchange: null,
      },
      setRules: {
        exchange: [{ required: true, message: " ", trigger: "change" }],
      },
    };
  },
  watch: {
    typeList(n) {
      let type = "";
      for (const i of n) {
        type += `${i},`;
      }
      type = type.substr(0, type.length - 1);
      self.infoForm.chosenTypes = type;
    },
  },
  mounted() {
    self = this;
    self.loadData();
  },
  methods: {
    loadData() {
      self.loadData_info();
      self.loadData_list("DEMAND");
      self.loadData_list("SUPPLY");
      self.loadData_contract();
    },
    // 载入基础资料`
    loadData_info() {
      getInfo().then(res => {
        self.infoForm = res.data.site;
        self.setForm.exchange = res.data.site.exchange;
        if (res.data.site.contactMobile == "" || res.data.site.contactMobile == null) {
          self.infoForm.contactMobile = res.data.user.phone;
        }
        self.typeList = self.$store.getters.userInfo.chosenRoles.split(",");
      });
      getApplying().then(res => {
        let activated = false;
        for (const i of res.data) {
          self.applyStatus[i.applyType.toLowerCase()] = {
            status: i.auditStatus,
            rejectReason: i.rejectReason,
          };
          self.contractStatus[i.applyType] = i.contract;
          if (i.auditStatus == "ACTIVATED") {
            activated = true;
          }
        }
        self.activated = activated;
      });
    },
    // 载入相关文件
    loadData_list(apply_type) {
      // 获取文件列表
      getCredentials(apply_type).then(res => {
        for (const i of res.data) {
          self.fileList[i.applyType.toLowerCase()][i.credentialsType] = [
            {
              name: i.resource.name,
              url: i.resource.path,
            },
          ];
        }
      });
      if (apply_type == "SUPPLY") {
        getDc().then(res => {
          self.dc_status = res.data.length == 0 ? 0 : 1;
          self.dc = res.data;
        });
      }
    },
    // 获取合同
    loadData_contract() {
      getContract().then(res => {
        self.contractList = res.data;
      });
    },
    tabChange() {
      // let name = tab.name;
      // if (name == 'data') {
      //   self.loadData_info();
      // } else if (name == 'DEMAND' || name == 'SUPPLY' || name == 'HUB') {
      //   self.loadData_list(name)
      // }
    },
    // 会员类型选择
    typeListChange() {},
    // 注册类型选择
    typeChange(e) {
      if (e == "PERSONAL") {
        self.infoForm.companyName = "";
      } else {
        self.infoForm.humanName = "";
      }
    },
    // 保存基础资料
    saveInfo() {
      if (!/^(0|66)\d{9}$/.test(self.infoForm.contactMobile)) {
        return self.$message.warning(self.$t("login.phoneWrong"));
      }
      fillInfo(self.infoForm).then(() => {
        self.$message.success(self.$t("member.saveSuccess"));
        self.loadData_info();
      });
    },
    // dc表格操作
    addDc() {
      this.dc.push({ address: "", years: "" });
    },
    delDc(row, index) {
      this.dc.splice(index, 1);
    },
    // 文件选中时的处理
    handlePreview() {
      // console.log(file)
      // if (fileList.length > 1) {
      //   fileList.splice(0, 1);
      // }
    },
    // 文件覆盖上传
    handleChange(file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
      // self.fileList.demand.affidavit = []
    },
    // 文件上传成功的处理
    uploadSuccess(res) {
      if (res.status === 200) {
        self.fileList[self.tabActive.toLowerCase()][res.data.credentialsType] = [
          {
            name: res.data.resource.name,
            url: res.data.resource.path,
          },
        ];
        // self.loadData_list(self.tabActive);
      }
    },
    // 合同上传成功的处理
    uploadSuccess2() {
      self.loadData();
      self.$message.success(self.$t("member.uploadSuccess"));
    },
    // 文件删除时的处理
    handleRemove() {},
    // 提交发货人申请
    submitDemand() {
      // 简单验证
      for (const x in self.fileList.demand) {
        if (self.fileList.demand[x].length == 0) {
          return self.$message.warning(self.$t("member.pleaseCompleteTheInformation"));
        }
      }
      submitApply("DEMAND").then(() => {
        self.loadData();
      });
    },
    dcChange() {
      self.dc = [{ address: "", years: "" }];
    },
    // 提交运输公司申请
    submitSupply() {
      // 简单验证
      for (const x in self.fileList.supply) {
        if (self.fileList.supply[x].length == 0) {
          return self.$message.warning(self.$t("member.pleaseCompleteTheInformation"));
        }
      }
      if (self.dc_status == 1) {
        for (const i of self.dc) {
          if (i.address == "" || i.years == "") {
            return self.$message.warning(self.$t("member.pleaseCompleteTheInformation"));
          }
        }
      }
      submitApply("SUPPLY", {
        dc_status: self.dc_status,
        dc: JSON.stringify(self.dc),
      }).then(() => {
        self.loadData();
      });
    },
    // 去下载会员合同
    goToDownload() {
      self.tabActive = "contract";
    },
    downloadContract(path) {
      window.open(`${process.env.VUE_APP_BASE_API}/api/token/pdf/download?applyType=${path.type}&token=${getToken()}`);
      // console.log(path.type)
      // window.open()
    },
    // 保存基础设置
    saveSet() {
      self.$refs.setForm.validate(valid => {
        if (valid) {
          setExchange(self.setForm).then(res => {
            self.$message.success(self.$t("member.saveSuccess"));
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  box-sizing: border-box;
  height: 100%;
}

.container {
  height: 100%;
  padding: 20px;
  padding-left: 40px;
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

.submitBtn,
.gotodownload {
  width: 300px;
}
</style>
<style lang="scss">
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

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.member .fixform .el-form-item {
  margin-bottom: 5px;
}

.member .el-form-item {
  margin-bottom: 15px;
}

.member .fixupload {
  .upload {
    display: flex;
    align-items: center;
  }
  .el-upload {
    margin-right: 25px;
  }
  .el-upload-list__item:first-child {
    margin-top: 0px;
    margin-left: 20px;
  }
}

.member .el-tabs--left .el-tabs__item.is-left {
  text-align: left;
  max-width: 100%;
  white-space: normal;
  word-break: break-all;
  line-height: 16px;
  height: 50px;
}

.member .el-tabs__content {
  background-color: #fff;
}

.member .el-tabs__active-bar {
  width: 0;
  height: 0;
  background-color: #fff;
}

.member .el-tabs--left .el-tabs__active-bar.is-left {
  width: 0;
  height: 0;
}

.member .el-tabs__nav-wrap::after {
  background-color: #fff;
}

.member .el-tabs--left .el-tabs__nav-wrap.is-left {
  width: 185px;
  padding-top: 20px;
}

.member .el-tabs--left .el-tabs__header.is-left {
  margin-left: 10px;
  background-color: #fff;
}
</style>
