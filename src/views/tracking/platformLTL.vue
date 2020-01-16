<template>
  <div class="manage cardFix tracking">
    <div style="display:flex;box-sizing:border-box;padding-left:20px;height:100%;">
      <!-- 导航 -->
      <div style="height:100%;" class="nav">
        <el-tabs v-model="tabActive" tab-position="left" @tab-click="tabChange" style="height:100%;">
          <el-tab-pane name="WAIT_SEND_TO_HUB">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.toBeSentCargoToHub") }}<sub class="badge">{{ orderStatus.WAIT_SEND_TO_HUB }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="WAIT_HUB_TO_PUT">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.toBeconfirmedReceiptByHub") }}<sub class="badge">{{ orderStatus.WAIT_HUB_TO_PUT }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="HUB_PUT">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.cargoArrivedAtHUB") }}<sub class="badge red">{{ orderStatus.HUB_PUT }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="WILL_PICK">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.tobePickedUp") }}<sub class="badge red">{{ orderStatus.WILL_PICK }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="SENDING">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.intransit") }}<sub class="badge">{{ orderStatus.SENDING }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="WILL_RETURN">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.documentTobereturned") }}<sub class="badge">{{ orderStatus.WILL_RETURN }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="COMPLETE">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.completed") }}<sub class="badge">{{ orderStatus.COMPLETE }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane> </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 表格 -->
      <div class="container">
        <div style="margin-bottom:20px;">
          <el-input v-model="orderNo" style="width: 200px;" :placeholder="$t('tracking.trackingNo')"></el-input>
          <el-button type="primary" style="margin-left:20px;" @click="search">{{ $t("tracking.search") }}</el-button>
        </div>
        <el-table :data="data.content" v-loading="loading" border :max-height="tableHeight">
          <el-table-column :label="$t('tracking.tracking')">
            <template slot-scope="scope">
              <el-button style="width:100%;text-align:left;" @click="orderLog(scope.row.order.id)">
                <div>{{ scope.row.order.orderNo }}</div>
                <div>{{ scope.row.order.outNumber }}</div>
                <div>{{ scope.row.order.createdAt }}</div>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tracking.cargo_VAS')">
            <template slot-scope="scope">
              <el-card v-for="(item, index) in scope.row.order.propertyList" :key="index">
                <div>{{ propertyObj[item.propertyType] }}</div>
                <div>
                  {{ item.number }} {{ unitObj[item.unit] }} {{ item.name }}
                  {{ sizeObj[item.sizeType] }}
                </div>
              </el-card>
              <el-card
                shadow="never"
                v-for="(item, index) in scope.row.order.chargeList"
                :key="index + item"
                style="margin-top:5px;"
                v-if="item.chargeIntro == 'true'"
              >
                <div style="display:flex;">
                  <div>{{ serveObj[item.chargeType] }}</div>
                </div>
              </el-card>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tracking.deliveryPoint')">
            <template slot-scope="scope" v-if="scope.row.order.receiverAddressList">
              <el-card
                shadow="never"
                style="margin-bottom:5px;"
                v-for="(receiverAddress, index) in scope.row.order.receiverAddressList"
                :key="index"
              >
                <div>
                  {{ receiverAddress.name }}
                  {{ receiverAddress.mobile }}
                </div>
                <div>{{ receiverAddress.addressDetail }}</div>
                <div>
                  {{ receiverAddress.district }}
                  {{ receiverAddress.city }}
                  {{ receiverAddress.province }}
                </div>
              </el-card>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tracking.price')">
            <template slot-scope="scope">
              <div>
                {{ scope.row.order.settlementAmount }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tracking.pickupPoint')">
            <template slot-scope="scope" v-if="scope.row.order.senderAddress != null">
              <div>
                {{ scope.row.order.senderAddress.name }}
                {{ scope.row.order.senderAddress.mobile }}
              </div>
              <div>{{ scope.row.order.senderAddress.addressDetail }}</div>
              <div>
                {{ scope.row.order.senderAddress.province }}
                {{ scope.row.order.senderAddress.city }}
                {{ scope.row.order.senderAddress.district }}
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column :label="$t('tracking.ETD')"></el-table-column> -->
          <!-- <el-table-column>
            <template slot-scope="scope">
              <div style="text-align:center;">
                <el-button v-if="scope.row.order.status == 'WAIT_SUPPLY_TO_ACCEPT'"
                           @click="confirmB(scope.row.order)"
                           type="primary">{{$t('tracking.confirm')}}</el-button>
                <el-button v-if="scope.row.order.status == 'WAIT_SUPPLY_TO_ACCEPT'"
                           @click="reject(scope.row.order)"
                           type="primary">{{$t('tracking.reject')}}</el-button>
                <el-button v-if="scope.row.order.status == 'WILL_PICK' && scope.row.order.transport.driverName == null"
                           @click="confirmB(scope.row.order)"
                           type="primary">{{$t('tracking.operation')}}</el-button>
              </div>
            </template>
          </el-table-column> -->
        </el-table>
        <div style="text-align:center;margin:20px 0;">
          <el-pagination
            background
            :page-size.sync="data.size"
            :page-count="data.totalElements"
            :total="data.totalElements"
            :current-page.sync="data.number + 1"
            @current-change="pageChange"
            layout="total, prev, pager, next, jumper"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <el-dialog :title="$t('tracking.print')" :visible.sync="printeDialog" width="65%" class="comfirmDialog">
      打印
      <span slot="footer">
        <div class="footerBtn">
          <el-button size="small" plain style="width:300px;" @click="printeDialog = false">{{
            $t("tracking.confirm")
          }}</el-button>
        </div>
      </span>
    </el-dialog>
    <el-dialog :title="$t('tracking.edit')" width="600px" :visible.sync="editDialog">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item :label="$t('tracking.origin')" required>
          <el-select v-model="form.fromProvinceCode" class="formSelect" filterable placeholder="province">
            <el-option v-for="(item, index) in provinceList" :key="index" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tracking.destination')" required>
          <el-select v-model="form.toCityCode" filterable class="formSelect" placeholder="city">
            <el-option v-for="(item, index) in cityList" :key="index" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tracking.truckType')" required>
          <el-select v-model="form.category" filterable class="formSelect" placeholder="Truck type">
            <el-option
              v-for="(item, index) in truckTypes.categories"
              :key="index"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tracking.availableCapacity')" required>
          <el-input v-model="form.availableCapacity"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tracking.payload')">
          <el-input v-model="form.payload"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tracking.cutoffTime')" required>
          <el-time-select v-model="form.finishedAt" style="width:100%;" :picker-options="timeOptions" default-value="18:00">
          </el-time-select>
        </el-form-item>
        <el-form-item :label="$t('tracking.quotation')" required>
          <el-input v-model="form.charge" @mousewheel.native.prevent type="number"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="$t('tracking.confirmOrder')" width="600px" v-if="orderInfo" :visible.sync="confirmDialog">
      <el-form label-width="130px">
        <el-form-item :label="$t('tracking.trackingNo')">
          <div>{{ orderInfo.orderNo }}</div>
        </el-form-item>
        <el-form-item :label="$t('tracking.logisticType')">
          <div>{{ orderInfo.lineType }}</div>
        </el-form-item>
        <el-form-item :label="$t('tracking.destination')">
          <div>
            {{ orderInfo.receiverAddress.city }}
            {{ orderInfo.receiverAddress.district }}
          </div>
        </el-form-item>
        <el-form-item :label="$t('tracking.qty')">
          <div>{{ orderInfo.orderNo }}</div>
        </el-form-item>
        <el-form-item :label="$t('tracking.driver')">
          <el-select v-model="confirmForm.driverId" filterable>
            <el-option v-for="item in td.drivers" :key="item.value" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tracking.plateLicense')">
          <el-select v-model="confirmForm.truckId" filterable>
            <el-option v-for="item in td.trucks" :key="item.value" :label="item.plate" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="confirmLoading"
            :disabled="confirmForm.truckId == '' || confirmForm.driverId == ''"
            @click="confirmIt"
            >{{ $t("tracking.confirm") }}</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="$t('tracking.orderLog')" :visible.sync="logDialog">
      <el-timeline :reverse="true">
        <el-timeline-item v-for="(item, index) in logs" :key="index" :timestamp="item.createdAt">
          {{ item.introduce }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { getTruckType, getProvinceList, getCityList, getExtraServer, getGoodsProperty } from "../../api/data";
import {
  confirmOrder,
  updateOrderInfo,
  rejectOrder,
  getOrderLTLPF,
  getOrderLogPF,
  getOrderLTLStatusPF,
} from "../../api/tracking.js";

let self;
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    return {
      orderList: [],
      data: {},
      tabActive: "WAIT_SEND_TO_HUB",
      printeDialog: false,
      editDialog: false,
      confirmDialog: false,
      logDialog: false,
      form: {
        category: "",
        subCategory: "",
        charge: "",
        finishedAt: "",
        fromProvinceCode: "",
        toCityCode: "",
        miles: "",
        supportLoading: "",
        humanWorkDay: "",
        moneyPerDay: "",
        status: "",
      },
      provinceList: [],
      cityList: [],
      truckTypes: {
        categories: [],
        subCategories: [],
      },
      timeOptions: {
        start: "00:00",
        step: "00:15",
        end: "23:45",
      },
      serveObj: {},
      propertyObj: {},
      sizeObj: {},
      unitObj: {},
      orderStatus: {
        COMPLETE: 0,
        // WAIT_DEMAND_TO_ACCEPT: 0,
        SENDING: 0,
        // WAIT_SUPPLY_TO_ACCEPT: 0,
        WAIT_SEND_TO_HUB: 0,
        WAIT_HUB_TO_PUT: 0,
        HUB_PUT: 0,
        WAITTING: 0,
        WILL_PICK: 0,
        WILL_RETURN: 0,
      },
      orderInfo: null,
      td: {},
      confirmForm: {
        dirverId: "",
        truckId: "",
      },
      loading: false,
      confirmLoading: false,
      orderDialog: false,
      searchForm: {
        province: "",
      },
      logs: [],
      orderNo: "",
      tableHeight: 0,
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  created() {
    self = this;
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 91 - 40 - 36 - 20 - 32 - 40;
    });
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
    });
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
    });
    self.loadData();
  },
  methods: {
    loadData(cb) {
      self.loading = true;
      let page = self.data.number ? self.data.number : 0;
      getOrderLTLPF({
        orderStatus: self.tabActive,
        orderNo: self.orderNo,
        page: page,
      }).then(res => {
        self.data = res.data;
        self.loading = false;
        if (cb) {
          cb();
        }
      });
      getOrderLTLStatusPF({
        orderNo: self.orderNo,
      }).then(res => {
        self.orderStatus = res.data;
      });
    },
    pageChange(e) {
      self.loading = true;
      getOrderLTLPF({
        orderStatus: self.tabActive,
        page: e - 1,
      }).then(res => {
        self.data = res.data;
        self.loading = false;
      });
    },
    tabChange(e) {
      self.data.number = 0;
      self.loadData();
    },
    confirmB(item) {
      self.orderInfo = item;
      self.confirmDialog = true;
    },
    reject(item) {
      self
        .$prompt(self.$t("tracking.pleaseEnterTheRejectionReason"), "", {
          confirmButtonText: self.$t("tracking.confirm"),
          cancelButtonText: self.$t("tracking.cancel"),
        })
        .then(({ value }) => {
          rejectOrder(item.id, value).then(() => {
            self.loadData();
          });
        });
    },
    confirmIt() {
      self.confirmLoading = true;
      if (self.orderInfo.status == "WAIT_DEMAND_TO_ACCEPT") {
        confirmOrder(self.orderInfo.id, self.confirmForm.truckId, self.confirmForm.driverId).then(() => {
          self.loadData(() => {
            self.confirmDialog = false;
            self.confirmForm = {
              dirverId: "",
              truckId: "",
            };
            self.$message.success(self.$t("tracking.successful"));
            self.confirmLoading = false;
          });
        });
      } else if (self.orderInfo.status == "WILL_PICK") {
        updateOrderInfo(self.orderInfo.id, self.confirmForm.truckId, self.confirmForm.driverId).then(() => {
          self.loadData(() => {
            self.confirmDialog = false;
            self.confirmForm = {
              dirverId: "",
              truckId: "",
            };
            self.$message.success(self.$t("tracking.successful"));
            self.confirmLoading = false;
          });
        });
      }
    },
    orderLog(id) {
      getOrderLogPF(id).then(res => {
        self.logs = res.data;
        self.logDialog = true;
      });
    },
    search() {
      self.loadData();
    },
  },
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
.manage {
  height: 100%;
  box-sizing: border-box;
}
.statusHeader {
  display: flex;
  margin-bottom: 20px;
}

.comfirmDialog {
  .footerBtn {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}

.container {
  width: 100%;
  background: #fff;
  padding: 20px;
  height: calc(100vh - 91px);
  overflow: auto;
  box-sizing: border-box;
}

.container-header {
  height: 50px;
  display: flex;
  align-items: center;
  div {
    margin-right: 20px;
  }
}

.tabLabel {
  display: flex;
  justify-content: flex-end;

  .text {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 150px;
    white-space: normal;
    word-break: break-all;
    line-height: 16px;
  }

  .badge {
    font-size: 12px;
    margin-left: 5px;
    color: #aaa;
    width: 25px;
    text-align: right;
  }

  .red {
    color: red;
  }
}
.formSelect {
  width: 100%;
}
</style>
<style lang="scss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
.cardFix .el-card__body {
  padding: 5px 10px;
}

.tracking .nav {
  .el-tabs--left .el-tabs__item.is-left {
    text-align: left;
    height: 50px;
  }

  .el-tabs__content {
    background-color: #fff;
  }

  .el-tabs__active-bar {
    width: 0;
    height: 0;
    background-color: #fff;
  }

  .el-tabs--left .el-tabs__active-bar.is-left {
    width: 0;
    height: 0;
  }

  .el-tabs__nav-wrap::after {
    background-color: #fff;
  }

  .el-tabs--left .el-tabs__nav-wrap.is-left {
    width: 185px;
    padding-top: 20px;
  }

  .el-tabs--left .el-tabs__header.is-left {
    margin-left: -10px;
    background-color: #fff;
  }

  .el-table__header-wrapper {
    background-color: #ccc !important;
  }

  .el-table__header {
    background-color: #ccc !important;
  }
}
</style>
