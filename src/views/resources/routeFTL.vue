<template>
  <div class='wrapper'>
    <div style="margin-bottom:20px;">
      <el-button type="primary">添加</el-button>
    </div>
    <el-table border>
      <el-table-column header-align="center"
                       align="center"
                       :label="$t('resources.route')">
        <template slot-scope="scope">
          <div>
            <!-- 获取一行数据 -->
            {{ scope.row }}
          </div>
        </template>
      </el-table-column>
      <el-table-column header-align="center"
                       align="center"
                       :label="$t('resources.status')">
        <template slot-scope="scope">
          <div>
            <!-- 获取一行数据 -->
            {{ scope.row }}
          </div>
        </template>
      </el-table-column>
      <el-table-column header-align="center"
                       align="center"
                       :label="$t('resources.distance_KM')">
        <template slot-scope="scope">
          <div>
            <!-- 获取一行数据 -->
            {{ scope.row }}
          </div>
        </template>
      </el-table-column>
      <el-table-column header-align="center"
                       align="center"
                       :label="$t('resources.truckType')">
        <template slot-scope="scope">
          <div>
            <!-- 获取一行数据 -->
            {{ scope.row }}
          </div>
        </template>
      </el-table-column>
      <el-table-column header-align="center"
                       align="center"
                       :label="$t('resources.price')">
        <template slot-scope="scope">
          <div>
            <!-- 获取一行数据 -->
            {{ scope.row }}
          </div>
        </template>
      </el-table-column>
      <el-table-column header-align="center"
                       align="center"
                       :label="$t('resources.cutOffTime')">
        <template slot-scope="scope">
          <div>
            <!-- 获取一行数据 -->
            {{ scope.row }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑框 -->
    <el-dialog :visible.sync="editDialog"
               :title="$t('resources.edit')"
               :close-on-click-modal="false"
               width="568px">
      <el-form label-width="150px">
        <el-form-item :label="$t('resources.origin')"
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
        <el-form-item :label="$t('resources.distance_KM')">
          <el-input v-model="form.miles"></el-input>
        </el-form-item>
        <el-form-item :label="$t('resources.truckType')"
                      required>
          <el-select v-model="form.categroy"
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
                      required>
          <el-input v-model="form.charge"></el-input>
        </el-form-item>
        <el-form-item :label="$t('resources.supportLoading')"
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
                      v-if="form.supportLoading">
          <el-input v-model="form.humanWorkDay"
                    @mousewheel.native.prevent
                    type="number"></el-input>
        </el-form-item>
        <el-form-item :label="$t('resources.moneyPerDay')"
                      v-if="form.supportLoading">
          <el-input v-model="form.moneyPerDay"
                    type="number"
                    @mousewheel.native.prevent></el-input>
        </el-form-item>
        <el-form-item :label="$t('resources.cutOffTime')">
          <el-input v-model="form.finishedAt"></el-input>
        </el-form-item>
        <el-form-item :label="$t('resources.status')"
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
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { getRoute, getProvince, getCity, getTruckTypes } from '@/api/resources'

let self;
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    return {
      editDialog: true,
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
      }
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  methods: {
    loadData () {
      getRoute();
      getProvince().then(res => {
        self.provinceList = res.data;
      });
      getCity().then(res => {
        self.cityList = res.data;
      });
      getTruckTypes().then(res => {
        self.truckTypes = res.data;
      })
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