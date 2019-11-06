<template>
  <div class="manage tabfix">
    <div>
      <el-button type="primary"
                 style="width:150px;margin-bottom:20px;"
                 :disabled="!roles.Demand"
                 @click="toAdd">{{$t('resources.add')}}</el-button>
    </div>
    <el-row :gutter="40">
      <el-col :span="9">
        <el-table :data="dataList"
                  border
                  highlight-current-row
                  @current-change="handleCurrentChange"
                  :cell-style="cell">
          <el-table-column prop="name"
                           :highlight-current-row='true'
                           :label="$t('resources.driver_name')"></el-table-column>
          <el-table-column prop="phone"
                           :label="$t('resources.phoneNo')"></el-table-column>
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
          <el-tab-pane :label="$t('resources.locationTracking')"
                       name="second"></el-tab-pane>
          <el-tab-pane :label="$t('resources.driverLicense')"
                       name="third"></el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-dialog :title="$t('resources.driver')"
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
          <el-form-item prop='name'
                        :label="$t('resources.name')">
            <el-input v-model="detailform.name"
                      class="inputWidth"></el-input>
          </el-form-item>
          <el-form-item prop="phone"
                        :label="$t('resources.phone')">
            <el-input v-model="detailform.phone"
                      class="inputWidth"></el-input>
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
import { mapGetters } from "vuex";
import { driverAdd, driverList, driverEdit } from "../../api/resources";

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    return {
      dataList: [],
      dialogVisible: false,
      detailform: {
        name: '',
        phone: '',
        status: ''
      },
      options: [{
        value: 'ACTIVE',
        label: 'Actived'
      }, {
        value: 'CLOSED',
        label: 'Closed'
      }],
      editType: '',
      detailRules: {
        name: [{ required: true, trigger: "blur" }],
        phone: [
          { required: true, trigger: "blur" }
        ],
        status: [{ required: true }]
      },
      loading: false,
      activeTab: 'first',
      curEditId: null
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
    getDriverList () {
      let self = this
      driverList().then(res => {
        self.dataList = res.data
      })
    },
    toAdd () {
      let self = this
      self.dialogVisible = true
      self.editType = 'add'
      self.detailform = {
        name: '',
        phone: '',
        status: ''
      }
    },
    toEdit (row) {
      let self = this
      self.dialogVisible = true
      self.editType = 'edit'
      self.detailform = {
        name: row.name,
        phone: row.phone,
        status: row.activeStatus
      }
      self.curEditId = row.id
    },
    toConfirm () {
      let self = this
      if (!/^(0|66)\d{9}$/.test(self.detailform.phone)) {
        return self.$message.warning(self.$t('login.phoneWrong'))
      }
      this.$refs.detailform.validate(valid => {
        if (valid) {
          self.loading = true
          if (self.editType == 'add') {
            driverAdd(self.detailform).then(res => {
              self.$message.success(res.message)
              self.loading = false
              self.getDriverList()
              self.dialogVisible = false
            }).catch(el => {
              self.loading = false
            })
          } else if (self.editType == 'edit') {
            driverEdit(self.curEditId, self.detailform).then(res => {
              self.$message.success(res.message)
              self.loading = false
              self.getDriverList()
              self.dialogVisible = false
            }).catch(el => {
              self.loading = false
            })
          }
        }
      })
    },
    handleCurrentChange (val) {
    }
  },
  created () { },
  mounted () {
    this.getDriverList()
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