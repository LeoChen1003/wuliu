<template>
  <div class='manage'>
    <el-table :data="dataList"
              border
              :cell-style="cell">
      <el-table-column prop="createdAt"
                       :label="$t('member.dateOfSubmission')">
        <!-- <template slot-scope="scope"
                  v-if="scope.row.auditAt">
          {{scope.row.auditAt.slice(0,10) + ' ' +scope.row.auditAt.slice(11,19)}}
        </template> -->
      </el-table-column>
      <el-table-column prop="phone"
                       :label="$t('member.platform_name')">
        <template slot-scope="scope">
          {{scope.row.financeGranteeAccount?scope.row.financeGranteeAccount.name:''}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.userName')">
        <template slot-scope="scope">
          {{scope.row.site?(scope.row.site.type == 'PERSONAL'?scope.row.site.humanName:scope.row.site.companyName):''}}
        </template>
      </el-table-column>
      <el-table-column prop="applyType"
                       :label="$t('member.partnerType')"></el-table-column>
      <el-table-column :label="$t('member.guarantee')">
        <template slot-scope="scope">
          {{scope.row.financeGranteeAccount?scope.row.financeGranteeAccount.currentBalance:null}}
        </template>
      </el-table-column>
      <el-table-column prop="contractNo"
                       :label="$t('member.contract')">
        <template slot-scope="scope">
          <div style="cursor: pointer;">
            <el-link :href="scope.row.contract"
                     target="_blank"
                     type='primary'>
              {{scope.row.contractNo}}
            </el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="auditStatus"
                       :label="$t('member.status')"></el-table-column>
      <el-table-column width='80px;'>
        <template slot-scope="scope">
          <div style="cursor: pointer;"
               @click="toShow(scope.row)">
            <svg-icon icon-class="look" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top:10px;text-align: center;margin-bottom:50px;"
                   background
                   :page-sizes="[1,5,10,20,50]"
                   :page-size="pagesize"
                   @size-change="pageSizeChange"
                   :current-page.sync="page.currentPage"
                   @current-change="pageChange"
                   layout="prev, pager, next, jumper"
                   :total="page.total"></el-pagination>
    <el-dialog :title="$t('member.essentialData')"
               center
               top='0vh'
               :visible.sync="dialogVisible"
               width="70%">
      <div class="container">
        <el-form ref="form"
                 label-width="150px">
          <!-- 会员类型 -->
          <el-form-item class="choose-type"
                        :label="$t('member.memberType')">
            <el-checkbox-group v-model="typeList"
                               disabled>
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
                            disabled>
              <el-radio label="PERSONAL">{{ $t('member.personal') }}</el-radio>
              <el-radio label="COMPANY">{{ $t('member.juristicPerson') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('member.companyName')">
            <el-input class="inp"
                      disabled
                      v-model="infoForm.companyName" />
          </el-form-item>
          <el-form-item :label="$t('member.name')">
            <el-input class="inp"
                      disabled
                      v-model="infoForm.humanName" />
          </el-form-item>
          <el-form-item :label="$t('member.contacktName')">
            <el-input class="inp"
                      disabled
                      v-model="infoForm.contactName" />
          </el-form-item>
          <el-form-item :label="$t('member.phone_No')">
            <el-input class="inp"
                      disabled
                      v-model="infoForm.contactMobile" />
          </el-form-item>
          <el-form-item :label="$t('member.email')">
            <el-input class="inp"
                      disabled
                      v-model="infoForm.email" />
          </el-form-item>
          <el-form-item :label="$t('member.fullAddress')">
            <el-input class="inp"
                      disabled
                      v-model="infoForm.address" />
            <el-input class="inp"
                      disabled
                      placeholder="Region"
                      v-model="infoForm.region" />
          </el-form-item>
          <el-form-item />
          <el-form-item :label="$t('member.bankname')">
            <el-input class="inp"
                      disabled
                      v-model="infoForm.bank" />
          </el-form-item>
          <el-form-item :label="$t('member.accountName')">
            <el-input class="inp"
                      disabled
                      v-model="infoForm.bankAccountName" />
          </el-form-item>
          <el-form-item :label="$t('member.bankAccount_No')">
            <el-input class="inp"
                      disabled
                      v-model="infoForm.bankNumber" />
          </el-form-item>
          <el-form-item :label="$t('member.billingAddress')">
            <el-input class="inp"
                      disabled
                      v-model="infoForm.bankBillAddress" />
            <el-input class="inp"
                      placeholder="Region"
                      disabled
                      v-model="infoForm.bankBillRegion" />
          </el-form-item>
          <el-form-item />
          <el-form-item :label="$t('member.profileDiscription')">
            <el-input class="inp"
                      disabled
                      v-model="infoForm.description"
                      type="textarea"
                      resize="none" />
          </el-form-item>
          <el-form-item :label="$t('member.qualificationInformation')">
            <div style="width:40%;margin-left:15px;">
              <div v-for="(item,index) in credentials"
                   :key="index"
                   style="display:flex;justify-content:space-between;align-items:center;font-size:16px;cursor:pointer;margin-bottom:15px;">
                <span v-if="item.credentialsType == 'affidavit'">{{$t('member.affidavit')}}</span>
                <span v-else-if="item.credentialsType == 'transportation_license'">{{$t('member.transportationLicense')}}</span>
                <span v-else-if="item.credentialsType == 'idcard'">{{$t('member.IDcard')}}</span>
                <span v-else-if="item.credentialsType == 'house_particulars'">{{$t('member.houseParticulars')}}</span>
                <span v-else-if="item.credentialsType == 'bank_account_copy'">{{$t('member.bangAccount')}}</span>
                <span v-else-if="item.credentialsType == 'center_map'">{{$t('member.mapForDistributionCenters')}}</span>
                <span v-else-if="item.credentialsType == 'truck_register_copy'">{{$t('member.carRegistration')}}</span>
                <el-image v-if="item.credentialsType != 'top_up_copy'"
                          style="width: 25px; height: 25px"
                          src="https://cdn.withpush.cn/image/20191011/image-57c2bfd59cb6bdfdb08416c1e5ea11cc.png"
                          :preview-src-list="getSrcList(index)">
                </el-image>
                <!-- <i class="el-icon-paperclip"
                   style="color:#51a9df;"></i> -->
              </div>
            </div>
          </el-form-item>
          <!-- <el-form-item :label="$t('member.contract')">

          </el-form-item> -->
          <el-form-item :label="$t('member.dc')"
                        v-if="applyType == 'SUPPLY'">
            <el-table :data="dcList"
                      border>
              <el-table-column prop="address"
                               :label="$t('member.dcAddress')"></el-table-column>
              <el-table-column prop="years"
                               :label="$t('member.transportationExperience')"></el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       class="submitBtn inp"
                       v-if="auditStatus == 'DEFAULT'"
                       @click="toAccept">{{ $t('member.accept') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="info"
                       class="submitBtn inp"
                       v-if="auditStatus == 'DEFAULT'"
                       @click="toReject">{{ $t('member.reject') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       class="submitBtn inp"
                       v-if="auditStatus == 'ACCEPTED'"
                       @click="toActivate">{{ $t('member.activate') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog :title="$t('member.reasonsForRefusal')"
               :visible.sync="refuseVisible"
               width="40%">
      <div style="display:flex;justify-content:center;align-items:center;">
        {{$t('member.reason')}}：
        <el-input v-model="reason"
                  class="inp"></el-input>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="refuseVisible = false">{{ $t('member.cancel') }}</el-button>
        <el-button type="info"
                   :loading="refuseLoading"
                   @click="rejectIt">{{ $t('member.reject') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { platformList, platformAccept, platformRefuse, platformActive, dcInfo, appliedInfo } from '../../../api/member'

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    auditStatus: {
      type: String,
      default: 'DEFAULT'
    }
  },
  data () {
    return {
      dataList: [],
      page: {
        total: 0,
        currentPage: 1
      },
      pagesize: 20,
      dialogVisible: false,
      infoForm: {},
      applyType: '',
      typeList: [],
      credentials: [],
      curId: null,
      refuseVisible: false,
      reason: '',
      refuseLoading: false,
      url: '',
      srcList: [],
      dcList: []
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
  },
  methods: {
    getSrcList (index) {
      return this.srcList.slice(index).concat(this.srcList.slice(0, index))
    },
    cell ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 7 || columnIndex == 5) {
        return 'text-align:center;color:#168BD5;font-size:23px;'
      }
    },
    getPlatformList () {
      let self = this
      platformList(self.auditStatus, {
        page: self.page.currentPage - 1,
        pagesize: self.pagesize
      }).then(res => {
        self.dataList = res.data.content
        self.page = {
          total: res.data.totalPages,
          currentPage: res.data.number + 1
        }
      })
    },
    pageChange (val) {
      let self = this
      self.page.currentPage = val
      self.getPlatformList()
    },
    pageSizeChange (val) {
      let self = this;
      self.pagesize = val
      self.getPlatformList()
    },
    toShow (row) {
      let self = this
      self.dialogVisible = true
      self.loadDialog_info(row)
      self.curId = row.id
      if (row.applyType == 'SUPPLY') {
        // dc信息
        dcInfo(row.siteId).then(res => {
          self.dcList = res.data
          console.log(res)
          console.log(self.dcList)
        })
      }
      // 会员类型
      appliedInfo(row.siteId).then(res => {
        console.log(res)
        for (let x in res.data) {
          self.typeList.push(res.data[x].applyType)
        }
      })
    },
    // 同意
    toAccept () {
      let self = this
      self
        .$confirm(this.$t('confirm.aysAgree'), this.$t('confirm.tips'), {
          confirmButtonText: this.$t('member.accept'),
          cancelButtonText: this.$t('member.cancel')
        })
        .then(() => {
          platformAccept({
            id: self.curId
          }).then(res => {
            self.$message.success(res.message)
            self.dialogVisible = false
            self.getPlatformList()
          })
        })
        .catch(() => { });
    },
    toReject () {
      let self = this
      self.refuseVisible = true
    },
    // 拒绝
    rejectIt () {
      let self = this
      self.refuseLoading = true
      platformRefuse({
        id: self.curId,
        reason: self.reason
      }).then(res => {
        self.$message.success(res.message)
        self.refuseVisible = false
        self.refuseLoading = false
        self.dialogVisible = false
        self.getPlatformList()
      }).catch(el => {
        self.refuseLoading = false
      })
    },
    // 激活
    toActivate () {
      let self = this
      self
        .$confirm(this.$t('confirm.aysActivate'), this.$t('confirm.tips'), {
          confirmButtonText: this.$t('member.activate'),
          cancelButtonText: this.$t('member.cancel')
        })
        .then(() => {
          platformActive({
            id: self.curId,
          }).then(res => {
            self.$message.success(res.message)
            self.dialogVisible = false
            self.getPlatformList()
          })
        })
        .catch(() => { });
    },
    loadDialog_info (row) {
      const self = this;
      self.infoForm = row.site;
      self.applyType = row.applyType
      self.credentials = row.credentials
      for (let x in self.credentials) {
        if (self.credentials[x].credentialsType != 'top_up_copy') {
          self.srcList.push(self.credentials[x].resource.path)
        }
      }
    },
  },
  created () {

  },
  mounted () {
    this.getPlatformList()

  },
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.manage {
  padding: 20px;
  .inp {
    width: 400px;
  }
}
</style>