<template>
  <div class="manage cardFix">
    <!-- <div class="statusHeader">
      <el-button type="primary">{{$t('tracking.releaseAReturnTruck')}}</el-button>
    </div> -->
    <div style="display:flex;box-sizing:border-box;padding:0 20px;">
      <!-- 导航 -->
      <div style="height:100%;padding-right:18px;">
        <div class="statusText">{{ $t("billing.billingStatus") }}</div>
        <el-tabs
          v-model="tabActive"
          tab-position="left"
          @tab-click="tabChange"
          style="height:calc(100% - 50px);"
        >
          <el-tab-pane name="WAIT_DEMAND_TO_ACCEPT">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.toBeconfirmedOrderbyDemand")
                  }}<sub class="badge">{{
                    orderStatus.WAIT_DEMAND_TO_ACCEPT
                  }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="WAIT_SUPPLY_TO_ACCEPT">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.toBeconfirmedOrderbySupply")
                  }}<sub class="badge red">{{
                    orderStatus.WAIT_SUPPLY_TO_ACCEPT
                  }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="WILL_PICK">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.tobePickedUp")
                  }}<sub class="badge red">{{ orderStatus.WILL_PICK }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="SENDING">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.intransit")
                  }}<sub class="badge">{{ orderStatus.SENDING }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="WILL_RETURN">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.documentTobereturned")
                  }}<sub class="badge">{{ orderStatus.WILL_RETURN }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="COMPLETE">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.completed")
                  }}<sub class="badge">{{ orderStatus.COMPLETE }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane> </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 表格 -->
      <div class="container">
        <!-- <div class="container-header">
          <div>
            <el-select v-model="searchForm.province"
                       filterable
                       class="formSelect"
                       :placeholder="$t('tracking.destination')">
              <el-option v-for="(item,index) in provinceList"
                         :key='index'
                         :label="item.name"
                         :value="item.code"></el-option>
            </el-select>
          </div>
          <div>
            <el-input prefix-icon="el-icon-search"></el-input>
          </div>`
          <el-button type="primary">{{$t('tracking.search')}}</el-button>
        </div> -->
        <el-table :data="data.content" v-loading="loading" border>
          <el-table-column :label="$t('tracking.tracking')">
            <template slot-scope="scope">
              <el-button
                style="width:100%;text-align:left;"
                @click="orderLog(scope.row.id)"
              >
                <div>{{ scope.row.orderNo }}</div>
                <div>{{ scope.row.outNumber }}</div>
                <div>{{ scope.row.createdAt }}</div>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tracking.cargo_VAS')">
            <template slot-scope="scope">
              <el-card
                v-for="(item, index) in scope.row.propertyList"
                :key="index"
              >
                <div>{{ propertyObj[item.propertyType] }}</div>
                <div>
                  {{ item.number }} {{ unitObj[item.unit] }} {{ item.name }}
                  {{ sizeObj[item.sizeType] }}
                </div>
              </el-card>
              <el-card
                shadow="never"
                v-for="(item, index) in scope.row.chargeList"
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
            <template slot-scope="scope">
              <div>
                {{ scope.row.receiverAddress.name }}
                {{ scope.row.receiverAddress.mobile }}
              </div>
              <div>{{ scope.row.receiverAddress.addressDetail }}</div>
              <div>
                {{ scope.row.receiverAddress.district }}
                {{ scope.row.receiverAddress.city }}
                {{ scope.row.receiverAddress.province }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tracking.price')">
            <template slot-scope="scope">
              <div>
                {{ scope.row.settlementAmount }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tracking.pickupPoint')">
            <template slot-scope="scope">
              <div>
                {{ scope.row.senderAddress.name }}
                {{ scope.row.senderAddress.mobile }}
              </div>
              <div>{{ scope.row.senderAddress.addressDetail }}</div>
              <div>
                {{ scope.row.senderAddress.province }}
                {{ scope.row.senderAddress.city }}
                {{ scope.row.senderAddress.district }}
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column :label="$t('tracking.ETD')"></el-table-column> -->
          <!-- <el-table-column>
            <template slot-scope="scope">
              <div style="text-align:center;">
                <el-button v-if="scope.row.status == 'WAIT_SUPPLY_TO_ACCEPT'"
                           @click="confirmB(scope.row)"
                           type="primary">{{$t('tracking.confirm')}}</el-button>
                <el-button v-if="scope.row.status == 'WAIT_SUPPLY_TO_ACCEPT'"
                           @click="reject(scope.row)"
                           type="primary">{{$t('tracking.reject')}}</el-button>
                <el-button v-if="scope.row.status == 'WILL_PICK' && scope.row.transport.driverName == null"
                           @click="confirmB(scope.row)"
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

    <el-dialog
      :title="$t('tracking.print')"
      :visible.sync="printeDialog"
      width="65%"
      class="comfirmDialog"
    >
      打印
      <span slot="footer">
        <div class="footerBtn">
          <el-button
            size="small"
            plain
            style="width:300px;"
            @click="printeDialog = false"
            >{{ $t("tracking.confirm") }}</el-button
          >
        </div>
      </span>
    </el-dialog>
    <el-dialog
      :title="$t('tracking.edit')"
      width="600px"
      :visible.sync="editDialog"
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item :label="$t('tracking.origin')" required>
          <el-select
            v-model="form.fromProvinceCode"
            class="formSelect"
            filterable
            placeholder="province"
          >
            <el-option
              v-for="(item, index) in provinceList"
              :key="index"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tracking.destination')" required>
          <el-select
            v-model="form.toCityCode"
            filterable
            class="formSelect"
            placeholder="city"
          >
            <el-option
              v-for="(item, index) in cityList"
              :key="index"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tracking.truckType')" required>
          <el-select
            v-model="form.category"
            filterable
            class="formSelect"
            placeholder="Truck type"
          >
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
          <el-time-select
            v-model="form.finishedAt"
            style="width:100%;"
            :picker-options="timeOptions"
            default-value="18:00"
          >
          </el-time-select>
        </el-form-item>
        <el-form-item :label="$t('tracking.quotation')" required>
          <el-input
            v-model="form.charge"
            @mousewheel.native.prevent
            type="number"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      :title="$t('tracking.confirmOrder')"
      width="600px"
      v-if="orderInfo"
      :visible.sync="confirmDialog"
    >
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
            <el-option
              v-for="item in td.drivers"
              :key="item.value"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tracking.plateLicense')">
          <el-select v-model="confirmForm.truckId" filterable>
            <el-option
              v-for="item in td.trucks"
              :key="item.value"
              :label="item.plate"
              :value="item.id"
            >
            </el-option>
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
        <el-timeline-item
          v-for="(item, index) in logs"
          :key="index"
          :timestamp="item.createdAt"
        >
          {{ item.introduce }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  getTruckType,
  getProvinceList,
  getCityList,
  getExtraServer,
  getGoodsProperty
} from "../../api/data";
import {
  confirmOrder,
  updateOrderInfo,
  rejectOrder,
  getOrderPF,
  getOrderLogPF,
  getOrderStatusPF
} from "../../api/tracking.js";

let self;
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    return {
      orderList: [],
      data: {},
      tabActive: "WAIT_DEMAND_TO_ACCEPT",
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
        status: ""
      },
      provinceList: [],
      cityList: [],
      truckTypes: {
        categories: [],
        subCategories: []
      },
      timeOptions: {
        start: "00:00",
        step: "00:15",
        end: "23:45"
      },
      serveObj: {},
      propertyObj: {},
      sizeObj: {},
      unitObj: {},
      orderStatus: {
        COMPLETE: 0,
        WAIT_DEMAND_TO_ACCEPT: 0,
        SENDING: 0,
        WAIT_SUPPLY_TO_ACCEPT: 0,
        WAITTING: 0,
        WILL_PICK: 0,
        WILL_RETURN: 0
      },
      orderInfo: null,
      td: {},
      confirmForm: {
        dirverId: "",
        truckId: ""
      },
      loading: false,
      confirmLoading: false,
      orderDialog: false,
      searchForm: {
        province: ""
      },
      logs: []
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
      getOrderPF({
        status: self.tabActive,
        page: page
      }).then(res => {
        self.data = res.data;
        self.loading = false;
        if (cb) {
          cb();
        }
      });
      getOrderStatusPF().then(res => {
        self.orderStatus = res.data;
      });
    },
    pageChange(e) {
      self.loading = true;
      getOrderPF({
        status: self.tabActive,
        page: e - 1
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
          cancelButtonText: self.$t("tracking.cancel")
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
        confirmOrder(
          self.orderInfo.id,
          self.confirmForm.truckId,
          self.confirmForm.driverId
        ).then(() => {
          self.loadData(() => {
            self.confirmDialog = false;
            self.confirmForm = {
              dirverId: "",
              truckId: ""
            };
            self.$message.success(self.$t("tracking.successful"));
            self.confirmLoading = false;
          });
        });
      } else if (self.orderInfo.status == "WILL_PICK") {
        updateOrderInfo(
          self.orderInfo.id,
          self.confirmForm.truckId,
          self.confirmForm.driverId
        ).then(() => {
          self.loadData(() => {
            self.confirmDialog = false;
            self.confirmForm = {
              dirverId: "",
              truckId: ""
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
    }
  }
};
</script>
<style lang="scss" scoped>
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
  height: 50px;
  border-bottom: 2px solid #dfe4ed;
  margin-right: 9px;
  box-sizing: border-box;
  padding-bottom: 30px;
  line-height: 50px;
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

  .badge {
    font-size: 12px;
    margin-left: 5px;
    color: #aaa;
  }

  .red {
    color: red;
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
.cardFix .el-card__body {
  padding: 5px 10px;
}
</style>
