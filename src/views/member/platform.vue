<template>
  <div class='manage'>
    <el-table :data="dataList"
              border>
      <el-table-column prop="auditAt"
                       :label="$t('member.dateOfSubmission')"></el-table-column>
      <el-table-column prop="phone"
                       :label="$t('member.platform_name')"></el-table-column>
      <el-table-column prop="activeStatus"
                       :label="$t('member.userName')"></el-table-column>
      <el-table-column prop="applyType"
                       :label="$t('member.partnerType')"></el-table-column>
      <el-table-column prop="activeStatus"
                       :label="$t('member.guarantee')"></el-table-column>
      <el-table-column prop="activeStatus"
                       :label="$t('member.contract')"></el-table-column>
      <el-table-column prop="auditStatus"
                       :label="$t('member.status')"></el-table-column>
      <el-table-column width='80px;'>
        <template slot-scope="scope">
          <div style="cursor: pointer;"
               @click="toShow(scope.row)">
            <i class="el-icon-edit"></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="text-align: center;margin-top:20px;"
                   background
                   :page-sizes="[1,5,10,20,50]"
                   :page-size="20"
                   :current-page.sync="page"
                   @current-change="pageChange"
                   layout="prev, pager, next, jumper"
                   :total="pageTotal"></el-pagination>
    <el-dialog :visible.sync="dialogVisible"
               width="70%">
      <div class="container">
        <el-form ref="form"
                 label-width="150px">
          <!-- 会员类型 -->
          <el-form-item class="choose-type"
                        :label="$t('member.memberType')">
            <el-checkbox-group v-model="typeList">
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
            <el-radio-group v-model="infoForm.type">
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
                       class="submitBtn">{{ $t('member.save') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { platformList, besuper } from '../../api/member'

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    return {
      dataList: [],
      page: 1,
      pagesize: 20,
      pageTotal: 0,
      dialogVisible: false,
      infoForm: {},
      typeList: []
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
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
  methods: {
    getPlatformList () {
      let self = this
      platformList({
        page: self.page - 1,
        pagesize: self.pagesize
      }).then(res => {
        console.log(res)
        self.dataList = res.data.content
        self.pageTotal = res.data.totalPages
      })
    },
    pageChange (val) {
      let self = this
      self.page = val
      self.getPlatformList()
    },
    toShow (row) {
      let self = this
      self.dialogVisible = true
      self.loadDialog_info(row)
    },
    loadDialog_info (row) {
      const self = this;
      self.infoForm = row.site;
      // self.typeList = self.$store.getters.userInfo.roleListStr.split(',');
    },
  },
  created () {

  },
  mounted () {
    // besuper().then(res => {
    //   console.log(res)

    // })
    this.getPlatformList()

  },
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.manage {
  padding: 20px;
}
</style>