<template>
  <div class="wrapper">
    <div class="searchBox">
      <el-form ref="searchForm"
               label-width="110px"
               :model="searchForm">
        <el-form-item :label="$t('market.origin')">
          <el-select v-model="searchForm.fromProvinceCode"
                     clearable
                     filterable
                     placeholder="province">
            <el-option v-for="(item,index) in provinceList"
                       :key='index'
                       :label="item.name"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('market.destinaiton')">
          <el-select v-model="searchForm.toProvinceCode"
                     clearable
                     filterable
                     placeholder="province">
            <el-option v-for="(item,index) in provinceList"
                       :key='index'
                       :label="item.name"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('market.pickupDate')">
          <el-date-picker v-model="searchForm.pickupDate"
                          type="date">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('market.truckType')">
          <el-select v-model="searchForm.truckType"
                     filterable
                     class="formSelect"
                     placeholder="Truck type">
            <el-option v-for="(item,index) in truckTypes.categories"
                       :key='index'
                       :label="item.value"
                       :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">{{$t('market.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="container">
      <el-table :data="data.content"
                border>
        <el-table-column :label="$t('market.pickupTime')">
          <template slot-scope="scope">
            <div>
              {{ scope.row.senderAddress.pickAt }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('tracking.route')">
          <template slot-scope="scope">
            <div>{{scope.row.senderAddress.province}}-->{{scope.row.receiverAddress.province}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('tracking.truckType')">
          <template slot-scope="scope">
            <div>{{truckObj[scope.row.transport.carType]}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column :label="$t('tracking.cargo')">
          <template slot-scope="scope">
            <el-card v-for="(item,index) in scope.row.propertyList"
                     :key="index">
              <div>{{propertyObj[item.propertyType]}}</div>
              <div>{{item.number}} {{unitObj[item.unit]}} {{item.name}} {{sizeObj[item.sizeType]}}</div>
            </el-card>
          </template>
        </el-table-column> -->
        <el-table-column :label="$t('tracking.remarks')">
          <template slot-scope="scope">
            <div>{{scope.row.remark}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('tracking.price')"></el-table-column>
        <el-table-column></el-table-column>
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
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { getTruckType, getProvinceList, getCityList, getExtraServer, getGoodsProperty, getProvinceArea } from '../../api/data'
import { orderShop } from '../../api/market.js'

let self;
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    return {
      data: {},
      provinceList: [],
      cityList: [],
      truckTypes: {
        categories: [],
        subCategories: []
      },
      serveObj: {},
      propertyObj: {},
      sizeObj: {},
      unitObj: {},
      searchForm: {
        fromProvinceCode: '',
        toProvinceCode: '',
        pickupDate: '',
        truckType: ''
      }
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  created () {
    self = this;
  },
  mounted () {
    getProvinceList().then(res => {
      self.provinceList = res.data;
    });
    getCityList().then(res => {
      self.cityList = res.data;
    });
    getTruckType().then(res => {
      self.truckTypes = res.data;
      let truckObj = new Object();
      for (let i of res.data.categories) {
        truckObj[i.key] = i.value;
      }
      self.truckObj = truckObj;
    });
    getExtraServer().then(res => {
      let serveObj = new Object();
      for (let i of res.data) {
        serveObj[i.key] = i.trans;
      }
      self.serveObj = serveObj;
    })
    getGoodsProperty().then(res => {
      let propertyObj = new Object();
      let sizeObj = new Object();
      let unitObj = new Object();
      for (let i of res.data.propertyType) {
        propertyObj[i.key] = i.trans;
      }
      for (let i of res.data.sizeType) {
        sizeObj[i.key] = i.trans;
      }
      for (let i of res.data.unit) {
        unitObj[i.key] = i.trans;
      }
      self.propertyObj = propertyObj;
      self.sizeObj = sizeObj;
      self.unitObj = unitObj;
    })
    self.loadData();
  },
  methods: {
    loadData (cb) {
      orderShop().then(res => {
        self.data = res.data;
        if (cb) {
          cb();
        }
      })
    },
    pageChange (e) {
      getRoute({
        page: e - 1,
      }).then(res => {
        self.data = res.data;
      })
    },
  }
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.wrapper {
  box-sizing: border-box;
  padding: 20px;
  display: flex;
}
.searchBox {
  // box-sizing: border-box;
  padding-right: 10px;
  height: 100%;
}

.container {
  width: 100%;
}
</style>