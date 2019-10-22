<template>
  <div class="manage">
    <div style="display:flex;box-sizing:border-box;padding:0 20px;">
      <!-- 导航 -->
      <div style="height:100%;">
        <div class="statusText">{{ $t('billing.billingStatus') }}</div>
        <el-tabs v-model="tabActive"
                 tab-position="left"
                 @tab-click="changeTab"
                 style="height:calc(100% - 50px);">
          <el-tab-pane label="0">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('tracking.Pending')}}<sub class="badge">{{statusCount.WAITTING}}</sub></div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane label="2">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('tracking.toBeconfirmedOrderbyDemand')}}<sub class="badge">{{statusCount.DEMMANDACCEPT}}</sub></div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('tracking.toBeconfirmedOrderbySupply')}}<sub class="badge">{{statusCount.SUPPLYACCEPT}}</sub></div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('tracking.tobePickedUp')}}<sub class="badge">{{statusCount.WILLPICK}}</sub></div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('tracking.intransit')}}<sub class="badge">{{statusCount.SENDING}}</sub></div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('tracking.documentTobereturned')}}<sub class="badge">{{statusCount.WILLRETURN}}</sub></div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('tracking.completed')}}<sub class="badge">{{statusCount.COMPLETE}}</sub></div>
              </div>
            </span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 表格 -->
      <div class="container">
        <el-table :data="data.content"
                  style="width:98%;"
                  border>
          <el-table-column :label="$t('tracking.tracking')"
                           prop="orderNo"></el-table-column>
          <el-table-column :label="$t('tracking.deliveryPoint')">
            <template slot-scope="scope"
                      v-if="scope.row.receiverAddress">
              <div>{{scope.row.receiverAddress.name}} {{scope.row.receiverAddress.mobile}}</div>
              <div>{{scope.row.receiverAddress.addressDetail}}</div>
              <div>{{scope.row.receiverAddress.province}} {{scope.row.receiverAddress.city}} {{scope.row.receiverAddress.district}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tracking.supply')">
            <template slot-scope="scope">
              <div v-if="!(tabActive=='0'||tabActive=='1') && scope.row.transport.supply">
                <div>
                  {{scope.row.transport.supply.companyName }}
                </div>
                <div>
                  {{scope.row.transport.supply.contactMobile }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tracking.remarks')">
            <template slot-scope="scope">
              <div>
                {{ scope.row.remark }}
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="tabActive != '0'">
            <template slot-scope="scope">
              <el-button type="primary"
                         v-if="tabActive == '1'"
                         @click="toShowConfirm(scope.row)">{{$t('tracking.confirm')}}</el-button>
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
    <el-dialog :title="$t('tracking.confirm')"
               width="50%"
               :visible.sync="confirmDialog"
               center>
      <el-table :data="quotedata"
                highlight-current-row
                @row-click="showRow"
                border>
        <el-table-column :label="$t('tracking.supply')">
          <template slot-scope="scope">
            <div>
              {{ scope.row.supply.companyName }}
            </div>
            <div>
              <img :src="scope.row.supply.companyLogo"
                   alt="logo">
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column :label="$t('tracking.KPI')">
          <template slot-scope="scope">
            <div>
              {{ scope.row }}
            </div>
          </template>
        </el-table-column> -->
        <el-table-column :label="$t('tracking.truckType')">
          <template slot-scope="scope">
            <div>
              {{ truckObj[scope.row.carType] }} {{subtruckObj[scope.row.carriage]}}
            </div>
            <div>{{scope.row.plate}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('tracking.quotation')">
          <template slot-scope="scope">
            <div>
              {{ scope.row.money }}
            </div>
          </template>
        </el-table-column>
        <el-table-column width="55">
          <template slot-scope="scope">
            <el-radio class="radio"
                      v-model="radio"
                      :label="scope.$index">&nbsp;</el-radio>
          </template>
        </el-table-column>

      </el-table>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="confirmDialog = false">取 消</el-button>
        <el-button @click="confirmIt">{{$t('tracking.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { getTruckType, getProvinceList, getCityList, getExtraServer, getGoodsProperty } from '../../api/data'
import { demandOrderList, demandStatusCount, demandquoteList, demandquoteConfirm } from '../../api/tracking.js'

let self;
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    return {
      data: {},
      quotedata: [],
      tabActive: '0',
      statusCount: [],
      printeDialog: false,
      confirmDialog: false,
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
      unitObj: {},
      truckObj: {},
      subtruckObj: {},
      radio: '',
      selected: {},
      curId: null
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
      console.log(res)
      let truckObj = new Object();
      let subtruckObj = new Object()
      for (let i of res.data.categories) {
        truckObj[i.key] = i.value;
      }
      for (let i of res.data.subCategories) {
        subtruckObj[i.key] = i.value;
      }
      self.truckObj = truckObj;
      self.subtruckObj = subtruckObj;
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
    self.getCount()
  },
  methods: {
    loadData (cb) {
      const self = this
      demandOrderList({ status: self.tabActive }).then(res => {
        self.data = res.data;
        if (cb) {
          cb();
        }
      })
    },
    getCount () {
      const self = this
      demandStatusCount().then(res => {
        self.statusCount = res.data
      })
    },
    pageChange (e) {
      getRoute({
        page: e - 1,
      }).then(res => {
        self.data = res.data;
      })
    },
    changeTab () {
      this.data = {}
      this.loadData()
    },
    // 点击确认
    toShowConfirm (row) {
      const self = this
      self.confirmDialog = true
      self.curId = row.id
      demandquoteList(row.id).then(res => {
        self.quotedata = res.data
      })
    },
    showRow (row) {
      //赋值给radio
      this.radio = this.quotedata.indexOf(row);
      this.selected = row;
      console.log(this.selected)
    },
    confirmIt () {
      const self = this
      demandquoteConfirm(self.curId, self.selected.id).then(res => {
        self.confirmDialog = false
        self.$message.success(res.message)
        self.loadData()
      })
    }
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