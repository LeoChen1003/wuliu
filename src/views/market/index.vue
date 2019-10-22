<template>
  <div class="wrapper">
    <div class="searchBox">
      <el-form ref="searchForm"
               :show-message="false"
               label-width="140px"
               :model="searchForm">
        <el-form-item :label="$t('market.origin')">
          <el-select v-model="searchForm.pickUpRegion"
                     class="formSelect"
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
          <el-select v-model="searchForm.deliveryRegion"
                     clearable
                     class="formSelect"
                     filterable
                     placeholder="province">
            <el-option v-for="(item,index) in provinceList"
                       :key='index'
                       :label="item.name"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('market.pickupDate')">
          <el-date-picker v-model="searchForm.pickUpDate"
                          value-format='yyyy-MM-dd'
                          type="date">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('market.truckType')">
          <el-select v-model="searchForm.truckCategory"
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
          <el-button type="primary"
                     @click="searchIt">{{$t('market.search')}}</el-button>
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
        <el-table-column>
          <template slot-scope="scope">
            <el-button type="primary"
                       @click="toquotePrice(scope.row)">{{$t('market.quoteAPrice')}}</el-button>
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
    </div>
    <el-dialog :title="$t('market.quoteAPrice')"
               :visible.sync="quotePriceDialog"
               top='1vh'
               center
               width="60%">
      <el-form :model="quotePriceCon"
               size="small"
               label-position="top"
               :show-message="false">
        <div style="display:flex;">
          <div style="width:50%;">
            <el-form-item :label="$t('booking.sender')">
              <el-input v-model="quotePriceCon.senderAddress.name"
                        class="inp"
                        disabled></el-input>
            </el-form-item>
            <el-form-item :label="$t('booking.pickupPoint')">
              <el-input v-model="quotePriceCon.senderAddress.name"
                        class="inp"
                        disabled></el-input>
              <el-input v-model="quotePriceCon.senderAddress.mobile"
                        class="inp"
                        disabled></el-input>
              <el-input v-model="quotePriceCon.senderAddress.addressDetail"
                        class="inp"
                        disabled></el-input>
              <el-input v-model="quotePriceCon.senderAddress.fullName"
                        class="inp"
                        disabled></el-input>
            </el-form-item>
            <el-form-item :label="$t('booking.pickupTime')">
              <el-date-picker v-model="quotePriceCon.senderAddress.pickAt"
                              class="inp"
                              disabled
                              type="datetime">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('booking.deliveryPoint')">
              <el-input v-model="quotePriceCon.receiverAddress.name"
                        class="inp"
                        disabled></el-input>
              <el-input v-model="quotePriceCon.receiverAddress.mobile"
                        class="inp"
                        disabled></el-input>
              <el-input v-model="quotePriceCon.receiverAddress.addressDetail"
                        class="inp"
                        disabled></el-input>
              <el-input v-model="quotePriceCon.receiverAddress.fullName"
                        class="inp"
                        disabled></el-input>
            </el-form-item>
            <el-form-item :label="$t('booking.truckType')">
              <el-select v-model="quotePriceCon.transport.carType"
                         class="inp"
                         disabled
                         :placeholder="$t('placeholder.pleaseChoose')">
                <el-option v-for="item in truckTypes.categories"
                           :key="item.key"
                           :label="item.value"
                           :value="item.key" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('booking.shareTruck')">
              <el-radio-group v-model="shareTruck"
                              disabled>
                <el-radio :label="false">{{$t('booking.fullTruckLoad')}}</el-radio>
                <el-radio :label="true">{{$t('booking.sharetruckLoad')}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div style="width:50%;">
            <el-form-item :label="$t('booking.valueAddedService')">
              <el-tag v-for="item in quotePriceCon.chargeList"
                      :key="item.id"
                      v-if="item.chargeType!='CARPOOL'"
                      type="info"
                      style="margin-right:5px;">
                {{  serveObj[item.chargeType]}}
              </el-tag>
            </el-form-item>
            <el-form-item :label="$t('booking.referenceNo')">
              <el-input v-model="quotePriceCon.outNumber"
                        disabled
                        class="inp" />
            </el-form-item>
            <el-form-item :label="$t('booking.remarks')">
              <el-input v-model="quotePriceCon.remark"
                        disabled
                        type="textarea"
                        class="inp" />
            </el-form-item>
            <el-form-item :label="$t('market.demandPrice')">
              <el-input v-model="quotePriceCon.settlementAmount"
                        disabled
                        class="inp" />
            </el-form-item>
            <el-form-item :label="$t('booking.myQuotaion')">
              <el-input v-model="quotePriceForm.money"
                        class="inp" />
            </el-form-item>
            <el-form-item :label="$t('market.licencePlate')">
              <el-select v-model="quotePriceForm.truck_id"
                         @change="truckSelect"
                         class="inp">
                <el-option v-for="item in truckData"
                           :key="item.id"
                           :label="item.plate"
                           :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('market.truckType')">
              <el-select v-model="quotePriceForm.category"
                         class="inp"
                         :placeholder="$t('placeholder.pleaseChoose')">
                <el-option v-for="item in truckTypes.categories"
                           :key="item.key"
                           :label="item.value"
                           :value="item.key" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('market.loaderType')">
              <el-select v-model="quotePriceForm.subCategory"
                         class="inp"
                         :placeholder="$t('placeholder.pleaseChoose')">
                <el-option v-for="item in truckTypes.subCategories"
                           :key="item.key"
                           :label="item.value"
                           :value="item.key" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         class="inp"
                         :loading="confirmLoading"
                         style="margin-top:30px;"
                         @click="quotePriceConfirm">{{$t('booking.confirm')}}</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { getTruckType, getProvinceList, getCityList, getExtraServer, getGoodsProperty, getProvinceArea, getSupplyTD } from '../../api/data'
import { orderShop, quoteOrder } from '../../api/market.js'

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
      truckObj: {},
      searchForm: {
        pickUpRegion: '',
        deliveryRegion: '',
        pickUpDate: '',
        truckCategory: '',
        page: 0
      },
      quotePriceDialog: false,
      quotePriceCon: {
        lineType: 'FTL',
        outNumber: '',
        remark: '',
        senderAddress: {
          pickAt: '',
          name: '',
          mobile: '',
          addressDetail: '',
          code: '',
        },
        receiverAddress: {
          name: '',
          mobile: '',
          addressDetail: '',
          code: '',
        },
        transport: {
          companyName: '',
          ftlLineId: '',
          carType: '',
          carriage: '',
          supplyId: null
        },
        chargeList: [],
        propertyList: []
      },
      quotePriceForm: {
        money: null,
        truck_id: null,
        category: '',
        subCategory: ''
      },
      shareTruck: false,
      truckData: [],
      confirmLoading: false
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
      const self = this
      self.searchForm.pickUpDate = self.searchForm.pickUpDate ? self.searchForm.pickUpDate + ' 00:00:00' : ''
      orderShop(self.searchForm).then(res => {
        self.data = res.data;
        if (cb) {
          cb();
        }
      })
    },
    pageChange (e) {
      self.searchForm.page = e - 1
      self.loadData()
    },
    toquotePrice (row) {
      const self = this
      self.quotePriceDialog = true
      self.quotePriceCon = row
      self.shareTruck = row.chargeList[0].chargeIntro == 'false' ? false : true
      getSupplyTD().then(res => {
        self.truckData = res.data.trucks
      })
    },
    truckSelect (val) {
      const self = this
      self.truckData.forEach((item) => {
        if (item.id == val) {
          self.quotePriceForm.category = item.category
          self.quotePriceForm.subCategory = item.subCategory
          return
        }
      })
    },
    // 报价抢单
    quotePriceConfirm () {
      const self = this
      self.confirmLoading = true
      quoteOrder(self.quotePriceCon.id, self.quotePriceForm).then(res => {
        self.$message.success(res.message)
        self.confirmLoading = false
        self.quotePriceDialog = false
        self.loadData();
      }).catch(() => {
        self.confirmLoading = false
      })
    },
    searchIt () {
      const self = this
      self.data = {}
      self.loadData()
    }
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

.inp {
  width: 300px;
}

.formSelect {
  width: 100%;
}
</style>