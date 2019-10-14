<template>
  <div class="manage tabfix">
    <div>
      <el-button type="primary"
                 style="width:150px;margin-bottom:20px;"
                 @click="toAdd">{{$t('resources.add')}}</el-button>
    </div>
    <el-row :gutter="40">
      <el-col :span="9">
        <el-table :data="dataList"
                  border
                  highlight-current-row
                  @current-change="handleCurrentChange"
                  :cell-style="cell">
          <el-table-column prop="plate"
                           :highlight-current-row='true'
                           :label="$t('resources.licensePlate')"></el-table-column>
          <el-table-column prop="category"
                           :label="$t('resources.truckType')"></el-table-column>
          <el-table-column prop="activeStatus"
                           :label="$t('resources.status')"></el-table-column>
          <el-table-column width='80px;'>
            <template slot-scope="scope">
              <div style="cursor: pointer;"
                   @click="toEdit(scope.row)">
                <i class="el-icon-edit"></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="15">
        <el-tabs v-model="activeTab"
                 type="border-card">
          <el-tab-pane :label="$t('resources.task')"
                       name="first">
            <el-table :data="[{},{},{}]"
                      border
                      :cell-style="cell">
              <el-table-column prop=""
                               :label="$t('resources.TaskNo')"></el-table-column>
              <el-table-column prop=""
                               :label="$t('resources.description')"></el-table-column>
              <el-table-column prop=""
                               :label="$t('resources.implementation')"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="$t('resources.detailedInformation')"
                       name="second"></el-tab-pane>
          <el-tab-pane :label="$t('resources.locationTracking')"
                       name="third"></el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-dialog :title="$t('resources.truck')"
               :visible.sync="dialogVisible"
               width="60%"
               center>
      <div>
        <el-form ref="detailform"
                 :model="detailform"
                 :rules="detailRules"
                 class="form"
                 label-position='left'
                 label-width="160px">
          <el-form-item prop='plate'
                        :label="$t('resources.licensePlate')">
            <el-input v-model="detailform.plate"
                      :disabled="editType == 'edit'? true : false"
                      class="inputWidth"></el-input>
          </el-form-item>
          <el-form-item prop="category"
                        :label="$t('resources.truckType')">
            <el-select v-model="detailform.category"
                       :placeholder="$t('placeholder.pleaseChoose')"
                       class="inputWidth">
              <el-option v-for="item in categoryList"
                         :key="item.key"
                         :label="item.value.slice(4)"
                         :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="subCategory">
            <el-select v-model="detailform.subCategory"
                       :placeholder="$t('placeholder.pleaseChoose')"
                       class="inputWidth">
              <el-option v-for="item in subCategoryList"
                         :key="item.key"
                         :label="item.value.slice(4)"
                         :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="registerAtRegion"
                        :label="$t('resources.provinceOfRegistrationPlace')">
            <el-select v-model="detailform.registerAtRegion"
                       :placeholder="$t('placeholder.pleaseChoose')"
                       class="inputWidth">
              <el-option v-for="item in provList"
                         :key="item.code"
                         :label="item.name"
                         :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="status"
                        :label="$t('resources.status')">
            <el-select v-model="detailform.status"
                       :placeholder="$t('placeholder.pleaseChoose')"
                       class="inputWidth">
              <el-option v-for="item in options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop='insuranceExpiredAt'
                        :label="$t('resources.annualProductDamageInsurancePolicy')">
            <template>
              <div class="inputWidth">
                <el-radio v-model="detailform.insuranceStatus"
                          label="HAS_INSURANCE"
                          border>{{$t('resources.HAS_INSURANCE')}}</el-radio>
                <el-radio v-model="detailform.insuranceStatus"
                          label="DO_NOT_HAS_INSURANCE"
                          border>{{$t('resources.DO_NOT_HAS_INSURANCE')}}</el-radio>
              </div>

            </template>

          </el-form-item>
          <div v-if="detailform.insuranceStatus == 'HAS_INSURANCE'">
            <el-form-item prop='insuranceExpiredAt'
                          :label="$t('resources.expireDate')">
              <el-date-picker v-model="detailform.insuranceExpiredAt"
                              type="date"
                              :placeholder="$t('placeholder.pleaseChoose')"
                              value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop='insuranceAmount'
                          :label="$t('resources.IinsuranceValue')">
              <el-input type="number"
                        v-model="detailform.insuranceAmount"
                        class="inputWidth"></el-input>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary"
                       style="margin-bottom:20px;"
                       :loading="loading"
                       class="inputWidth"
                       @click="toConfirm">{{$t('resources.confirm')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { truckList, truckAdd, truckEdit } from "../../api/resources";
import { truckType, provinceList } from "../../api/data";

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    return {
      dataList: [],
      dialogVisible: false,
      detailform: {
        category: '',
        subCategory: '',
        insuranceAmount: 0,
        insuranceExpiredAt: '2019-01-01',
        insuranceStatus: 'HAS_INSURANCE',
        plate: '',
        registerAtRegion: '',
        status: 'ACTIVE'
      },
      options: [{
        value: 'ACTIVE',
        label: 'ACTIVE'
      }, {
        value: 'CLOSED',
        label: 'CLOSED'
      }],
      categoryList: [],
      subCategoryList: [],
      provList: [],
      editType: '',
      detailRules: {
        plate: [{ required: true, trigger: "blur" }],
        registerAtRegion: [{ required: true, trigger: "change" }],
        insuranceStatus: [{ required: true, trigger: "change" }],
        category: [{ required: true, trigger: "change" }],
        subCategory: [{ required: true, trigger: "change" }],
        status: [{ required: true, trigger: "change" }]
      },
      loading: false,
      activeTab: 'first',
      curEditId: null
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  methods: {
    cell ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 3) {
        return 'text-align:center;color:#168BD5;font-size:18px;'
      }
    },
    getTruckList () {
      let self = this
      truckList().then(res => {
        console.log(res)
        self.dataList = res.data
      })
    },
    toAdd () {
      let self = this
      self.dialogVisible = true
      self.editType = 'add'
      self.detailform = {
        category: '',
        subCategory: '',
        insuranceAmount: 0,
        insuranceExpiredAt: '2019-01-01',
        insuranceStatus: 'HAS_INSURANCE',
        plate: '',
        registerAtRegion: '',
        status: 'ACTIVE'
      }
      self.getData()
    },
    getData () {
      let self = this
      truckType().then(res => {
        self.categoryList = res.data.categories
        self.subCategoryList = res.data.subCategories
      })
      provinceList().then(res => {
        console.log(res)
        self.provList = res.data
      })
    },
    toEdit (row) {
      let self = this
      self.dialogVisible = true
      self.editType = 'edit'
      console.log(row)
      self.detailform = {
        category: row.category,
        subCategory: row.subCategory,
        insuranceAmount: row.insuranceAmount,
        insuranceExpiredAt: row.insuranceExpiredAt,
        insuranceStatus: row.insuranceStatus,
        plate: row.plate,
        registerAtRegion: row.registerAtRegion,
        status: row.activeStatus
      }
      self.curEditId = row.id
      self.getData()
    },
    toConfirm () {
      let self = this
      this.$refs.detailform.validate(valid => {
        if (valid) {
          self.loading = true
          if (self.editType == 'add') {
            truckAdd(self.detailform).then(res => {
              self.$message.success(res.message)
              self.loading = false
              self.getTruckList()
              self.dialogVisible = false
            }).catch(el => {
              self.loading = false
            })
          } else if (self.editType == 'edit') {
            self.detailform.id = self.curEditId
            truckEdit(self.detailform).then(res => {
              self.$message.success(res.message)
              self.loading = false
              self.getTruckList()
              self.dialogVisible = false
            }).catch(el => {
              self.loading = false
            })
          }
        }
      })
    },
    handleCurrentChange (val) {
      console.log(val)
    }
  },
  created () { },
  mounted () {
    this.getTruckList()
  }
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.manage {
  padding: 20px;
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: -100px;
  }
  .el-tabs__item {
    width: 200px;
    text-align: center;
  }
}
.inputWidth {
  width: 350px;
}
</style>

<style>
.tabfix .el-tabs__item {
  width: 200px;
  text-align: center;
}
</style>