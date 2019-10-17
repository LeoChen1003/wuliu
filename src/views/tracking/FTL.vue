<template>
  <div class="manage">
    <div class="statusHeader">
      <el-button type="primary">{{$t('tracking.releaseAReturnTruck')}}</el-button>
    </div>
    <div style="display:flex;box-sizing:border-box;padding:0 20px;">
      <!-- 导航 -->
      <div style="height:100%;">
        <div class="statusText">{{ $t('billing.billingStatus') }}</div>
        <el-tabs v-model="tabActive"
                 tab-position="left"
                 style="height:calc(100% - 50px);">
          <el-tab-pane label="1">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('tracking.Pending')}}<sub class="badge">1</sub></div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('tracking.toBeconfirmedOrderbyDemand')}}<sub class="badge">1</sub></div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('tracking.toBeconfirmedOrderbySupply')}}<sub class="badge">1</sub></div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('tracking.tobePickedUp')}}<sub class="badge">1</sub></div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('tracking.intransit')}}<sub class="badge">1</sub></div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('tracking.documentTobereturned')}}<sub class="badge">1</sub></div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 表格 -->
      <div class="container">
        <el-table :data="data.content"
                  border>
          <el-table-column :label="$t('tracking.tracking')"
                           prop="orderNo"></el-table-column>
          <el-table-column :label="$t('tracking.cargo_VAS')">
            <template slot-scope="scope">
              <el-card v-for="(item,index) in scope.row.propertyList"
                       :key="index">
                <div>{{propertyObj[item.propertyType]}}</div>
                <div>{{item.number}} {{unitObj[item.unit]}} {{item.name}} {{sizeObj[item.sizeType]}}</div>
              </el-card>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tracking.deliveryPoint')">
            <template slot-scope="scope">
              <div>{{scope.row.receiverAddress.name}} {{scope.row.receiverAddress.mobile}}</div>
              <div>{{scope.row.receiverAddress.addressDetail}}</div>
              <div>{{scope.row.receiverAddress.province}} {{scope.row.receiverAddress.city}} {{scope.row.receiverAddress.district}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tracking.price')">
            <template slot-scope="scope">
              <div>
                {{ scope.row.payAmount }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tracking.pickupPoint')">
            <template slot-scope="scope">
              <div>{{scope.row.senderAddress.name}} {{scope.row.senderAddress.mobile}}</div>
              <div>{{scope.row.senderAddress.addressDetail}}</div>
              <div>{{scope.row.senderAddress.province}} {{scope.row.senderAddress.city}} {{scope.row.senderAddress.district}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tracking.ETD')"></el-table-column>
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

    <el-dialog :title="$t('tracking.print')"
               :visible.sync="printeDialog"
               width="65%"
               class="comfirmDialog">
      打印
      <span slot="footer">
        <div class="footerBtn">
          <el-button size="small"
                     plain
                     style="width:300px;"
                     @click="printeDialog = false">{{ $t('tracking.confirm') }}</el-button>
        </div>
      </span>
    </el-dialog>
    <el-dialog :title="$t('tracking.edit')"
               width="600px"
               :visible.sync="editDialog">
      <el-form ref="form"
               :model="form"
               label-width="120px">
        <el-form-item :label="$t('tracking.origin')"
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
        <el-form-item :label="$t('tracking.destination')"
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
        <el-form-item :label="$t('tracking.truckType')"
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
        <el-form-item :label="$t('tracking.availableCapacity')"
                      required>
          <el-input v-model="form.availableCapacity"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tracking.payload')">
          <el-input v-model="form.payload"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tracking.cutoffTime')"
                      required>
          <el-time-select v-model="form.finishedAt"
                          style="width:100%;"
                          :picker-options="timeOptions"
                          default-value="18:00">
          </el-time-select>
        </el-form-item>
        <el-form-item :label="$t('tracking.quotation')"
                      required>
          <el-input v-model="form.charge"
                    @mousewheel.native.prevent
                    type="number"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { getTruckType, getProvinceList, getCityList, getExtraServer, getGoodsProperty } from '../../api/data'
import { orderShop } from '../../api/tracking.js'

let self;
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    return {
      orderList: [],
      data: {},
      tabActive: '0',
      printeDialog: false,
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
      timeOptions: {
        start: '00:00',
        step: '00:15',
        end: '23:45'
      },
      serveObj: {},
      propertyObj: {},
      sizeObj: {},
      unitObj: {}
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
.manage {
  height: 100%;
  padding-top: 20px;
  box-sizing: border-box;
}
.statusHeader {
  display: flex;
  margin-bottom: 20px;
}

.statusText {
  border-bottom: 2px solid #dfe4ed;
  margin-right: 9px;
  box-sizing: border-box;
  padding-bottom: 10px;
}

.comfirmDialog {
  .footerBtn {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}

.container {
  width: 90%;
}

.tabLabel {
  display: flex;
  justify-content: flex-end;

  .badge {
    font-size: 12px;
    color: red;
    margin-left: 5px;
  }
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