<template>
  <div class='wrapper'>
    <div style="margin-bottom:20px;">
      <el-button @click="add"
                 type="primary">添加</el-button>
    </div>
    <el-table border
              :data="data.content">
      <el-table-column header-align="center"
                       align="center"
                       :label="$t('resources.route')">
        <template slot-scope="scope">
          <div>
            <!-- 获取一行数据 -->
            {{ scope.row.fromProvince }} --> {{ scope.row.toCity }}
          </div>
        </template>
      </el-table-column>
      <el-table-column header-align="center"
                       align="center"
                       :label="$t('resources.status')">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status == 'ACTIVE' ? 'status' : 'info'">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column header-align="center"
                       align="center"
                       :label="$t('resources.distance_KM')">
        <template slot-scope="scope">
          <div>
            {{ scope.row.miles }}KM
          </div>
        </template>
      </el-table-column>
      <el-table-column header-align="center"
                       align="center"
                       :label="$t('resources.truckType')">
        <template slot-scope="scope">
          <div>
            {{ truckObj[scope.row.category] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column header-align="center"
                       align="center"
                       :label="$t('resources.price')">
        <template slot-scope="scope">
          <div>
            {{ scope.row.charge }}
          </div>
        </template>
      </el-table-column>
      <el-table-column header-align="center"
                       align="center"
                       :label="$t('resources.cutOffTime')">
        <template slot-scope="scope">
          <div>
            {{ scope.row.finishedAt }}
          </div>
        </template>
      </el-table-column>
      <el-table-column header-align="center"
                       align="center">
        <template slot-scope="scope">
          <el-button type="primary"
                     @click="edit(scope.row)">{{$t('resources.edit')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align:center;margin:20px 0;">
      <el-pagination background
                     :page-size.sync="data.size"
                     :page-count="data.totalPages"
                     :total="data.totalElements"
                     :current-page.sync="data.number + 1"
                     @current-change="pageChange"
                     layout="total, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <!-- 编辑框 -->
    <el-dialog :visible.sync="editDialog"
               :title="$t('resources.edit')"
               :close-on-click-modal="false"
               width="600px">
      <el-form :label-width="$store.getters.language == 'zh_CN' ? '150px' : '220px'"
               :show-message="false"
               :model="form"
               ref='form'>
        <el-form-item :label="$t('resources.origin')"
                      prop="fromProvinceCode"
                      required>
          <el-select v-model="form.fromProvinceCode"
                     class="formSelect"
                     filterable
                     placeholder="province">
            <el-option v-for="(item,index) in provinceList"
                       :key='index'
                       :label="item.name"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('resources.destination')"
                      prop="toCityCode"
                      required>
          <el-select v-model="form.toCityCode"
                     filterable
                     class="formSelect"
                     placeholder="city">
            <el-option v-for="(item,index) in cityList"
                       :key='index'
                       :label="item.name"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('resources.distance_KM')"
                      required
                      @mousewheel.native.prevent
                      type="number"
                      prop="miles">
          <el-input v-model="form.miles"></el-input>
        </el-form-item>
        <el-form-item :label="$t('resources.truckType')"
                      prop="category"
                      required>
          <el-select v-model="form.category"
                     filterable
                     class="formSelect"
                     placeholder="Truck type">
            <el-option v-for="(item,index) in truckTypes.categories"
                       :key='index'
                       :label="item.value"
                       :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('resources.truckSubType')"
                      prop="subCategory"
                      required>
          <el-select v-model="form.subCategory"
                     filterable
                     class="formSelect"
                     placeholder="Truck sub type">
            <el-option v-for="(item,index) in truckTypes.subCategories"
                       :key='index'
                       :label="item.value"
                       :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('resources.price')"
                      prop="charge"
                      required>
          <el-input v-model="form.charge"
                    @mousewheel.native.prevent
                    type="number"></el-input>
        </el-form-item>
        <el-form-item :label="$t('resources.supportLoading')"
                      prop="supportLoading"
                      required>
          <el-select class="formSelect"
                     v-model="form.supportLoading">
            <el-option :label="$t('resources.require')"
                       :value="1">
            </el-option>
            <el-option :label="$t('resources.notRequired')"
                       :value="0">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('resources.humanWorkDay')"
                      required
                      prop="humanWorkDay"
                      v-if="form.supportLoading">
          <el-input v-model="form.humanWorkDay"
                    @mousewheel.native.prevent
                    type="number"></el-input>
        </el-form-item>
        <el-form-item :label="$t('resources.moneyPerDay')"
                      required
                      prop="supportLoading"
                      v-if="form.supportLoading">
          <el-input v-model="form.moneyPerDay"
                    type="number"
                    @mousewheel.native.prevent></el-input>
        </el-form-item>
        <el-form-item :label="$t('resources.cutOffTime')"
                      prop="finishedAt">
          <el-time-select v-model="form.finishedAt"
                          style="width:100%;"
                          :picker-options="timeOptions"
                          default-value="18:00">
          </el-time-select>
        </el-form-item>
        <el-form-item :label="$t('resources.status')"
                      prop="status"
                      required>
          <el-select class="formSelect"
                     v-model="form.status">
            <el-option :label="$t('resources.activated')"
                       value="ACTIVE">
            </el-option>
            <el-option :label="$t('resources.closed')"
                       value="CLOSED">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="confirmIt">{{$t('resources.confirm')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { getRoute, getProvince, getCity, getTruckTypes, addRoute, updateRoute } from '@/api/resources'

let self;
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    return {
      data: {},
      editDialog: false,
      form: {
        category: '',
        subCategory: '',
        charge: '',
        finishedAt: '',
        fromProvinceCode: '',
        toCityCode: '',
        miles: '',
        supportLoading: '',
        humanWorkDay: '',
        moneyPerDay: '',
        status: '',
      },
      provinceList: [],
      cityList: [],
      truckTypes: {
        categories: [],
        subCategories: []
      },
      truckObj: {},
      editType: 'add',
      timeOptions: {
        start: '00:00',
        step: '00:15',
        end: '23:45'
      }
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  methods: {
    loadData (cb) {
      getRoute().then(res => {
        self.data = res.data;
        if (cb) {
          cb();
        }
      });
      getProvince().then(res => {
        self.provinceList = res.data;
      });
      getCity().then(res => {
        self.cityList = res.data;
      });
      getTruckTypes().then(res => {
        self.truckTypes = res.data;
        let truckObj = new Object();
        for (let i of res.data.categories) {
          truckObj[i.key] = i.value;
        }
        self.truckObj = truckObj;
      });
    },
    pageChange (e) {
      getRoute({
        page: e - 1,
      }).then(res => {
        self.data = res.data;
      })
    },
    // 添加按钮
    add () {
      self.editType = 'add';
      self.editDialog = true;
    },
    // 编辑按钮
    edit (item) {
      console.log(item)
      self.editType = 'update';
      self.form = item;
      self.editDialog = true;
      self.thisId = item.id;
    },
    // 提交修改
    confirmIt () {
      let form = JSON.parse(JSON.stringify(self.form));
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (form.miles == '') {
            form.miles = 0;
          }
          if (form.humanWorkDay == '') {
            form.humanWorkDay == 0;
          }
          if (form.moneyPerDay == '') {
            form.moneyPerDay == 0;
          }
          if (self.editType == 'add') {
            addRoute(form).then(res => {
              self.loadData(() => {
                self.editDialog = false;
                this.$refs.form.resetFields();
              });
            })
          } else if (self.editType == 'update') {
            updateRoute(self.thisId, form).then(res => {
              self.loadData(() => {
                self.editDialog = false;
                this.$refs.form.resetFields();
              });
            })
          }
        } else {
          return false;
        }
      });
    }
  },
  created () {
    self = this;
  },
  mounted () {
    self.loadData();
  }
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.wrapper {
  box-sizing: border-box;
  padding: 20px;
}

.formSelect {
  width: 100%;
}
</style>
<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
</style>