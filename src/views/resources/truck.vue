<template>
  <div class="manage tabfix">
    <div>
      <el-button type="primary"
                 style="width:150px;margin-bottom:20px;"
                 :disabled="!roles.Supply"
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
            <el-table :data="[]"
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
               width="700px"
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
            <div class="double">
              <el-select v-model="detailform.category"
                         :placeholder="$t('placeholder.pleaseChoose')"
                         class="inputWidth">
                <el-option v-for="item in categoryList"
                           :key="item.key"
                           :label="item.value"
                           :value="item.key">
                </el-option>
              </el-select>
              <el-select v-model="detailform.subCategory"
                         :placeholder="$t('placeholder.pleaseChoose')"
                         class="inputWidth">
                <el-option v-for="item in subCategoryList"
                           :key="item.key"
                           :label="item.value"
                           :value="item.key">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <!-- <el-form-item prop="subCategory">

          </el-form-item> -->
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
          <!-- <el-form-item>
            <el-upload class="upload-demo"
                       action="https://jsonplaceholder.typicode.com/posts/"
                       :on-preview="handlePreview"
                       :on-remove="handleRemove"
                       :file-list="fileList"
                       list-type="picture">
              <el-button size="small"
                         type="primary">点击上传</el-button>
              <div slot="tip"
                   class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item> -->
          <el-form-item prop="mobile"
                        :label="$t('resources.phone')">
            <el-input v-model="detailform.mobile"
                      @mousewheel.native.prevent
                      type="number"
                      class="inputWidth"></el-input>
          </el-form-item>
          <el-form-item prop="status"
                        :label="$t('resources.status')">
            <el-select v-model="detailform.status"
                       :placeholder="$t('placeholder.pleaseChoose')"
                       class="inputWidth">
              <el-option v-for="item in optionsStatus"
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
              <el-cascader v-model="dateCascader"
                           class="innerInp"
                           :options="options"
                           :props="props"
                           separator='-'
                           style="margin-right:5px;"
                           @change="dateChange"></el-cascader>
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
          <el-form-item v-if="editType == 'edit'">
            <el-button type="primary"
                       style="margin-bottom:20px;"
                       :loading="resetLoading"
                       class="inputWidth"
                       @click="reset">{{$t('resources.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { mapGetters } from "vuex";
import { truckList, truckAdd, truckEdit, resetPassword } from "../../api/resources";
import { getTruckType, getProvinceList, getBcYear, getBcDay } from "../../api/data";

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
        status: 'ACTIVE',
        mobile: ''
      },
      optionsStatus: [{
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
        status: [{ required: true, trigger: "change" }],
        mobile: [{ required: true, trigger: "change" }]
      },
      loading: false,
      resetLoading: false,
      activeTab: 'first',
      curEditId: null,
      dateCascader: [],
      options: [],
      props: {
        lazy: true,
        lazyLoad (node, resolve) {
          let year = self.bcYear;
          let date = new Date();
          let month = node.label == year ? date.getMonth() + 1 : 1;
          let day = date.getD
          let options = [];
          if (node.level == 0) {
            getBcYear().then(res => {
              self.bcYear = res.data;
              let years = []
              for (let x = -1; x < 20; x++) {
                years.push({
                  label: self.bcYear + x,
                  value: self.bcYear + x
                })
              }
              resolve(years);
            })
          } else if (node.level == 1) {
            let months = [];
            for (let y = 1; y <= 12; y++) {
              months.push({
                label: y,
                value: y
              })
            }
            resolve(months)
          } else if (node.level == 2) {
            getBcDay(node.parent.value, node.value).then(res => {
              let days = res.data;
              let dateList = [];
              for (let x = 1; x <= days; x++) {
                dateList.push({
                  label: x,
                  value: x,
                  leaf: true
                })
              }
              resolve(dateList)
            })
          }
        }
      }
    };
  },
  //监听属性 类似于data概念
  computed: {
    ...mapGetters(["roles"])
  },
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
        self.dataList = res.data
      })
    },
    toAdd () {
      let self = this
      self.editType = 'add'
      self.detailform = {
        category: '',
        subCategory: '',
        insuranceAmount: 0,
        insuranceExpiredAt: '2019-01-01',
        insuranceStatus: 'HAS_INSURANCE',
        plate: '',
        registerAtRegion: '',
        status: 'ACTIVE',
        mobile: ''
      }
      if (self.$refs.detailform) {
        self.$refs.detailform.resetFields();
      }
      self.dialogVisible = true
      self.getData()
    },
    getData () {
      let self = this
      getTruckType().then(res => {
        self.categoryList = res.data.categories
        self.subCategoryList = res.data.subCategories
      })
      getProvinceList().then(res => {
        self.provList = res.data
      })
    },
    toEdit (row) {
      let self = this
      self.dialogVisible = true
      self.editType = 'edit'
      self.detailform = {
        category: row.category,
        subCategory: row.subCategory,
        insuranceAmount: row.insuranceAmount,
        insuranceExpiredAt: row.insuranceExpiredAt,
        insuranceStatus: row.insuranceStatus,
        plate: row.plate,
        registerAtRegion: row.registerAtRegion,
        status: row.activeStatus,
        mobile: row.mobile
      }
      self.dateCascader = row.insuranceExpiredAt.split(' ')[0].split('-').map(Number);
      self.curEditId = row.id
      self.getData()
    },
    toConfirm () {
      let self = this
      if (!/^(0|66)\d{9}$/.test(self.detailform.mobile)) {
        return self.$message.warning(self.$t('login.phoneWrong'))
      }
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
    },
    dateChange (e) {
      let self = this;
      self.detailform.insuranceExpiredAt = `${e[0]}-${e[1]}-${e[2]}`;
    },
    reset () {
      let self = this;
      self.resetLoading = true;
      resetPassword(self.curEditId).then(res => {
        self.$message.success(self.$t('resources.successful'))
        self.resetLoading = false;
      })
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

.double {
  width: 350px;
  display: flex;
  justify-content: space-between;

  .inputWidth {
    width: 48%;
  }
}
</style>

<style>
.tabfix .el-tabs__item {
  width: 200px;
  text-align: center;
}
</style>