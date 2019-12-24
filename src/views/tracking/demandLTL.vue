<template>
  <div class="LTL_manage">
    <el-input :placeholder="$t('tracking.trackingNo')" style="margin-left: 300px; width: 200px;" v-model="trackingNo"></el-input>
    <el-button type="primary" style="margin-left: 20px;" @click="search">{{ $t("tracking.search") }}</el-button>
    <el-button type="primary" class="ltl_btn" @click="sendToHubAll()">{{$t('tracking.sendCargoToHUB')}}</el-button>
    <div style="display:flex;box-sizing:border-box;padding:0 20px;">
      <!-- 导航 -->
      <div style="height:100%;">
        <div class="statusText">{{ $t("billing.billingStatus") }}</div>
        <el-tabs v-model="tabActive" tab-position="left" @tab-click="changeTab" style="height:calc(100% - 50px);">
          <el-tab-pane name="WAIT_SEND_TO_HUB">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{$t('tracking.toBeSentCargoToHUB')}}<sub class="badge red">{{ orderStatus.WAIT_SEND_TO_HUB }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="WAIT_HUB_TO_PUT">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{$t('tracking.toBeConfirmedReceiptByHUB')}}<sub class="badge">{{ orderStatus.WAIT_HUB_TO_PUT }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="HUB_PUT">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{$t('tracking.cargoArrivedAtHUB')}}<sub class="badge">{{ orderStatus.HUB_PUT }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="WILL_PICK">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.tobePickedUp") }}<sub class="badge">{{ orderStatus.WILL_PICK }}</sub>
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
                  {{ $t("tracking.documentTobereturned") }}<sub class="badge red">{{ orderStatus.WILL_RETURN }}</sub>
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
        </el-tabs>
      </div>
      <!-- 表格 -->
      <div class="container" v-loading="tableLoading">
        <el-table
          style="width:98%;"
          border
          :data="data.content"
          ref="multipleTable"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" width="55"> </el-table-column>
          <el-table-column :label="$t('tracking.tracking')">
            <template slot-scope="scope">
              <el-button @click="orderLog(scope.row.id)" style="width:100%;text-align:left;">
                <div>{{ scope.row.orderNo }}</div>
              </el-button>
              <!-- <div>{{ scope.row.outNumber }}</div>
							<div>{{ scope.row.createdAt }}</div> -->
            </template>
          </el-table-column>
          <el-table-column :label="$t('tracking.pickupPoint')">
            <template slot-scope="scope" v-if="scope.row.senderAddress">
              <div>
                {{ scope.row.senderAddress.name }}
                {{ scope.row.senderAddress.mobile }}
              </div>
              <div>{{ scope.row.senderAddress.addressDetail }}</div>
              <div>
                {{ scope.row.senderAddress.district }}
                {{ scope.row.senderAddress.city }}
                {{ scope.row.receiverAddress.province }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tracking.deliveryPoint')">
            <template slot-scope="scope" v-if="scope.row.receiverAddress">
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
          <el-table-column :label="$t('billing.description')">
            <template slot-scope="scope">
              <div>
                {{ scope.row.remark }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tracking.supply')">
            <template slot-scope="scope">
              <div v-if="!(tabActive == '0' || tabActive == '1') && scope.row.transport">
                <div>
                  {{
                    scope.row.transport.supply.companyName == ""
                      ? scope.row.transport.supply.humanName
                      : scope.row.transport.supply.companyName
                  }}
                </div>
                <div>
                  {{ scope.row.transport.supply.contactMobile }}
                </div>
                <div>
                  {{ scope.row.transport.transport }}
                </div>
                <div>
                  {{ scope.row.transport.plate }}
                </div>
                <div v-if="scope.row.transport.driver">
                  {{ scope.row.transport.driver.name }}
                </div>
                <div v-if="scope.row.transport.driver">
                  {{ scope.row.transport.driver.phone }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('billing.operation')">
            <template slot-scope="scope">
              <el-button
                type="primary"
                style="width:120px;margin-left:20px"
                v-if="tabActive === 'WAIT_SEND_TO_HUB'"
                @click="sendToHub(scope.row)"
              >
                {{$t('tracking.sendCargoToHUB')}}
              </el-button>
              <el-button type="primary" style="width:120px;margin-left:20px" v-if="tabActive === 'WAIT_HUB_TO_PUT'" @click="print(scope.row)" :loading="scope.row.loading1 == 1">
                {{ $t("tracking.print") }}
              </el-button>
            </template>
          </el-table-column>
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
    <el-dialog :visible.sync="dialogVisible" :title="$t('tracking.sendCargoToHUB')" width="90%" center>
      <el-form :model="form" :rules="rules" :show-message="false" ref="ruleForm" :label-width="formLabelWidth">
        <el-form-item :label="$t('tracking.deliveryNoteNo')" >
          <span class="span">{{ randomNumber }}</span>
        </el-form-item>
        <el-form-item :label="$t('tracking.orderQuatity')" >
          <!-- <el-input v-model="form.name" style="width: 50%;margin-left:137px;"></el-input> -->
          <span class="span">{{ gridData.length }}</span>
        </el-form-item>
        <el-form-item :label="$t('tracking.cargoQuatity')" >
          <span class="span">{{ totalNumber }}</span>
        </el-form-item>
        <el-form-item :label="$t('tracking.truckTypeAll')" prop="truckCategory">
          <el-select v-model="form.truckCategory" :disabled="isChange">
            <el-option v-for="(index, i) of truckType" :label="index.value" :value="index.key" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tracking.licensePlate')" prop="plate">
          <el-input v-model="form.plate" style="width: 50%;" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tracking.Driver')">
          <el-input
            v-model="form.driverName"
            style="width: 24%;"
            :placeholder="$t('resources.name')"
            :disabled="isChange"
          ></el-input>
          <el-input
            v-model="form.phone"
            style="width: 24%;"
            :placeholder="$t('resources.phone')"
            :disabled="isChange"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('tracking.estiameteTimeOfArrival')" :show-message="false" prop="estimateTime">
          <div style="display:flex;align-items:center" class="inputWidth">
            <bcTime
              @changeBCtime="changeBCtime"
              style="width:26.7%;"
              :timeType="'all'"
              :dateDefault="isChange ? timeArr : []"
              :isChange="isChange"
            ></bcTime>
            <el-time-picker
              v-model="time"
              format="HH:mm:ss"
              class="innerInp"
              :disabled="isChange"
              style="width:26.7%;margin-left:17px;"
              value-format="HH:mm:ss"
              :placeholder="$t('placeholder.chooseTime')"
            >
            </el-time-picker>
          </div>
        </el-form-item>
      </el-form>
      <el-table :data="gridData" :span-method="objectSpanMethod" border show-summary :summary-method="getSummaries">
        <el-table-column prop="orderNo" :label="$t('tracking.trackingNo')" width="140"> </el-table-column>
        <el-table-column prop="outNumber" :label="$t('tracking.referenceNo')" width="140"> </el-table-column>
        <el-table-column :label="$t('tracking.cargoType')">
          <template slot-scope="scope">
            <el-table :data="scope.row.propertyList" border :show-header="false" style="width:100%;">
              <el-table-column>
                <template slot-scope="prop">
                  <div>{{ propertyObj[prop.row.propertyType] }}</div>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="prop">
                  <div>{{ prop.row.name }}</div>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="prop">
                  <div>{{ prop.row.number }}</div>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="prop">
                  <div>{{ sizeObj[prop.row.sizeType] }}</div>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="prop">
                  <div>{{ prop.row.weightOfEach }}</div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column :label="$t('tracking.commodity')"> </el-table-column>
        <el-table-column :label="$t('tracking.qty')"> </el-table-column>
        <el-table-column :label="$t('tracking.size')"> </el-table-column>
        <el-table-column :label="$t('tracking.weight')"> </el-table-column>
      </el-table>
      <el-button type="primary" style="width:300px;margin-top: 100px; margin-left: 100px;" :disabled="btn_show" @click="print1">
        {{ $t("tracking.printPreview") }}
      </el-button>
      <el-button type="primary" style="width:300px;margin-top: 100px; margin-left: 200px;" @click="confirm">
        {{ $t("tracking.confirm") }}
      </el-button>
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
let self;
import { getLtlOrders, getLtlOrdersCount, postsendtohub,ordersPrint,getOrderLog } from "../../api/tracking.js";
import { getGoodsProperty, getTruckType } from "../../api/data.js";
import { getToken} from '../../utils/auth' 
import bcTime from "@/components/bcTime";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {
    bcTime,
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (self.time_at === "" || self.time === "") {
        callback(new Error(" "));
      } else {
        callback();
      }
    };
    return {
      logDialog: false,
      logs: [],
      statusCount: [],
      tableLoading: false,
      data: {},
      status: "",
      tabActive: "WAIT_SEND_TO_HUB",
      page: "",
      dialogVisible: false,
      orderStatus: {
        COMPLETE: 0,
        WAIT_DEMAND_TO_ACCEPT: 0,
        SENDING: 0,
        WAIT_SUPPLY_TO_ACCEPT: 0,
        WAITTING: 0,
        WILL_PICK: 0,
        WILL_RETURN: 0,
        WAIT_HUB_TO_PUT: 0,
        WAIT_SEND_TO_HUB: 0,
        HUB_PUT: 0,
      },
      form: {
        plate: "",
        driverName: "",
        phone: "",
        orderIds: "",
        estimateTime: "",
        truckCategory: "",
      },
      time_at: "",
      time: "",
      formLabelWidth: "300px",
      gridData: [],
      checked: false,
      orderNo: "",
      proList: [],
      proList1: [],
      propertyObj: {},
      sizeObj: {},
      unitObj: {},
      totalNumber: 0,
      chooseNumber: 0,
      allOrder: "",
      driver_name: "",
      plate: "",
      driver_phone: "",
      orderId: "",
      isChange: false,
      randomNumber: "",
      timeArr: [],
      trackingNo: "",
      rules: {
        plate: [{ required: true, trigger: "blur" }],
        estimateTime: [{ required: true, validator: validatePass, trigger: "change" }],
        truckCategory: [{required: true, trigger: "change"}],
      },
      truckType: [],
      truckValue: "",
      btn_show: true,
      sendtohubid: "",
      loading1: false,
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
    self.getData();
    self.getCount();
    // self.sendToHub();
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
      // console.log(self.propertyObj)
    });
    getTruckType().then(res => {
      self.truckType = res.data.categories;
      self.truckValue = self.truckType.value;
    });
  },
  methods: {
    getSummaries(param){
       const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = 'Total';
            return;
          }
        })
        sums[4] = self.totalNumber;
        return sums;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 2) {
        return {
          rowspan: 1,
          colspan: 5,
        };
      } else if (columnIndex > 2) {
        return {
          rowspan: 0,
          colspan: 0,
        };
      }
    },
    sendToHubAll() {
      // self.totalNumber = 0;
      if (self.chooseNumber === 0) {
        self.dialogVisible = false;
        this.$message("请先选择需要发货的订单");
      } else {
        if (self.randomNumber != null) {
          self.randomNumber = "";
          self.isChange = false;
          self.timeArr = null;
          self.form.plate = "";
          self.form.driverName = "";
          self.form.phone = "";
          self.time_at = "";
          self.time = "";
          self.form.truckCategory = "";
        }
        self.dialogVisible = true;
        self.totalNumber = 0;
        self.gridData = self.allOrder;
        for (let i in self.gridData) {
          self.proList1 = self.gridData[i].propertyList;
          for (let j in self.proList1) {
            self.totalNumber += self.proList1[j].number;
          }
        }

      }
    },
    handleSelectionChange(val) {
      // window.console.log(val);
      self.allOrder = val;
      self.chooseNumber = val.length;
    },
    changeBCtime(time) {
      const self = this;
      self.time_at = time;
    },
    changeTab() {
      self.tableLoading = true;
      self.getData();
      // window.console.log(self.tabActive);
    },
    getData() {
      const self = this;
      self.tableLoading = true;
      getLtlOrders(self.tabActive, { no: this.trackingNo, page: this.page }).then(res => {
        // window.console.log(res.data);
        self.tableLoading = false;
        for(let i of res.data.content){
          i.loading1 = 0
        }
        self.data = res.data;
        this.page = self.data.number ? self.data.number : 0;
      });

      // self.sendToHub();
    },
    search() {
      self.getData();
    },
    getCount() {
      getLtlOrdersCount().then(res => {
        // window.console.log(res.data);
        this.orderStatus.WAIT_HUB_TO_PUT = res.data.WAIT_HUB_TO_PUT;
        this.orderStatus.WAIT_SEND_TO_HUB = res.data.WAIT_SEND_TO_HUB;
        this.orderStatus.WILL_PICK = res.data.WILL_PICK;
        this.orderStatus.HUB_PUT = res.data.HUB_PUT;
        this.orderStatus.WILL_RETURN = res.data.WILL_RETURN;
        this.orderStatus.SENDING = res.data.SENDING;
        this.orderStatus.COMPLETE = res.data.COMPLETE;
      });
    },
    sendToHub(item) {
      if (self.randomNumber != null) {
        self.isChange = false;
        self.randomNumber = "";
        self.timeArr = null;
        self.form.plate = "";
        self.form.driverName = "";
        self.form.phone = "";
        self.time_at = "";
        self.time = "";
        self.form.truckCategory = "";
      }
      self.totalNumber = 0;
      self.orderId = item.id;
      // window.console.log(id);
      this.dialogVisible = true;
      self.gridData = [item];
      self.proList = [item.propertyList];
      self.proList = self.proList[0];
      for (let i in self.gridData) {
        for (let j in self.proList) {
          self.totalNumber += self.proList[j].number;
        }
      }
      getTruckType().then(res => {
        console.log(res.data);
        self.truckType = res.data.categories;
        self.truckValue = self.truckType.value;
        console.log(self.truckType);
      });
    },
    pageChange(e) {
      self.tableLoading = true;
      this.page = e - 1;
      self.getData();
    },
    confirm() {
      // let orderIds = [];
      self.form.orderIds = [];
      for (let i in self.gridData) {
        self.form.orderIds.push(self.gridData[i].id);
      }
      self.form.estimateTime = self.time_at + " " + (self.time ? self.time : "00:00:00");
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          postsendtohub(self.form).then(res => {
            console.log(res.data);
            this.$message({
              message: "保存成功",
              type: 'success'});
            self.randomNumber = res.data.deliveryNo;
            self.isChange = true;
            self.timeArr = self.time_at.split("-");
            self.btn_show = false;
            self.sendtohubid = res.data.id;
          });
        }
      });
    },
    orderLog(id) {
      getOrderLog(id).then(res => {
        self.logs = res.data;
        self.logDialog = true;
      });
    },
    print(row,index){
      row.loading1 = 1;
      // window.printJS(ordersPrint(6489).then(res=>{}));
      window.printJS({printable:`${process.env.VUE_APP_BASE_API}/api/token/pdf/downloadInvoice?sendToHubId=${row.id}&token=${getToken()}&Locale=${self.$store.state.app.language}`,onLoadingEnd:()=>{row.loading1 = 0}});
      // setTimeout(()=>{row.loading1 = 0;console.log(row.loading1)},3000)
      
    },
    print1(){
      self.loading1 = 1;
     window.printJS({printable:`${process.env.VUE_APP_BASE_API}/api/token/pdf/downloadInvoice?sendToHubId=${self.sendtohubid}&token=${getToken()}&Locale=${self.$store.state.app.language}`,onLoadingEnd:()=>{self.loading1 = 0}});
    }
  },
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
.LTL_manage {
  width: 100%;
  height: 100%;
  padding-top: 20px;
  box-sizing: border-box;
  position: relative;
  .ltl_btn {
    margin-left: 20px;
  }
  .statusText {
    border-bottom: 2px solid #dfe4ed;
    margin-right: 9px;
    box-sizing: border-box;
    padding-bottom: 10px;
  }
  .container {
    width: 90%;
    margin-top: 28px;
    height: calc(100vh - 141px);
    overflow: auto;
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
}
.mouse{
  cursor:pointer !important;
}
</style>

<style lang="scss">
.LTL_manage {
  .el-form-item__label {
    text-align: left;
  }
  .el-table__footer-wrapper{
    background-color: #fff;
  }
}
</style>
