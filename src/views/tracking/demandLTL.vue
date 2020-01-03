<template>
  <div class="LTL_manage">
    <el-input :placeholder="$t('tracking.trackingNo')" style="margin-left: 300px; width: 200px;" v-model="trackingNo"></el-input>
    <el-button type="primary" style="margin-left: 20px;" @click="search">{{ $t("tracking.search") }}</el-button>
    <el-button type="primary" class="ltl_btn" @click="sendToHubAll()" v-if="tabActive=='WAIT_SEND_TO_HUB'">{{ $t("tracking.sendCargoToHUB") }}</el-button>
    <div style="display:flex;box-sizing:border-box;padding:0 20px;">
      <!-- 导航 -->
      <div style="height:100%;">
        <div class="statusText">{{ $t("billing.billingStatus") }}</div>
        <el-tabs v-model="tabActive" tab-position="left" @tab-click="changeTab" style="height:calc(100% - 50px);">
          <el-tab-pane name="WAIT_SEND_TO_HUB">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.toBeSentCargoToHUB") }}<sub class="badge red">{{ orderStatus.WAIT_SEND_TO_HUB }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="WAIT_HUB_TO_PUT">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.toBeConfirmedReceiptByHUB") }}<sub class="badge">{{ orderStatus.WAIT_HUB_TO_PUT }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="HUB_PUT">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.cargoArrivedAtHUB") }}<sub class="badge">{{ orderStatus.HUB_PUT }}</sub>
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
          style="width:100%;"
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
                {{ scope.row.senderAddress.province }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tracking.deliveryPoint')">
            <template slot-scope="scope" v-if="scope.row.receiverAddressList">
              <el-card
                shadow="never"
                style="margin-bottom:5px;"
                v-for="(receiverAddress, index) in scope.row.receiverAddressList"
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
          <el-table-column :label="$t('billing.description')">
            <template slot-scope="scope">
              <div>
                {{ scope.row.remark }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tracking.supply')">
            <template slot-scope="scope">
              <div v-if="!(tabActive == '0' || tabActive == '1')">
                <div>
                  {{
                    scope.row.supply.type == "COMPANY"
                      ? scope.row.supply.companyName
                      : scope.row.supply.humanName
                  }}
                </div>
                <div>
                  {{ scope.row.supply.contactMobile }}
                </div>
                <div>
                  {{ scope.row.driverAndTruckVo.plate }}
                </div>
                <div v-if="scope.row.driverAndTruckVo">
                  {{ scope.row.driverAndTruckVo.driverName }}
                </div>
                <div v-if="scope.row.driverAndTruckVo">
                  {{ scope.row.driverAndTruckVo.driverPhone }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('billing.operation')">
            <template slot-scope="scope">
              <el-button
                type="primary"
                style="width:140px;text-align:center; padding: 10px 5px;margin-left: 8%;"
                v-if="tabActive === 'WAIT_SEND_TO_HUB'"
                @click="sendToHub(scope.row)"
              >
                {{ $t("tracking.sendCargoToHUB") }}
              </el-button>
              <el-button
                type="primary"
                style="width:140px;text-align:center; padding: 10px 5px;margin-left: 8%;"
                v-if="tabActive === 'WAIT_HUB_TO_PUT'"
                @click="print(scope.row)"
                :loading="scope.row.loading1 == 1"
              >
                {{ $t("tracking.print") }}
              </el-button>
              <el-button
                  type="primary"
                  :disabled="!permissions.DemandOrderManage"
                  v-if="scope.row.status == 'COMPLETE' && scope.row.rating == null"
                  @click="rating(scope.row)"
                  >{{ $t("tracking.rating") }}</el-button
                >
                <el-rate v-if="scope.row.status == 'COMPLETE' && scope.row.rating" disabled v-model="scope.row.rating.rating / 2">
                </el-rate>
                <el-button
                  type="primary"
                  v-if="scope.row.status == 'WILL_RETURN'"
                  :disabled="!permissions.DemandOrderManage"
                  @click="rdConfirmShow(scope.row)"
                  >{{ $t("tracking.confirm") }}</el-button
                >
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
    <el-dialog :visible.sync="dialogVisible" :title="$t('tracking.sendCargoToHUB')" width="90%" center @close="clear">
      <el-form :model="form" :rules="rules" :show-message="false" ref="ruleForm" :label-width="formLabelWidth">
        <el-form-item :label="$t('tracking.deliveryNoteNo')">
          <span class="span">{{ randomNumber }}</span>
        </el-form-item>
        <el-form-item :label="$t('tracking.orderQuatity')">
          <!-- <el-input v-model="form.name" style="width: 50%;margin-left:137px;"></el-input> -->
          <span class="span">{{ gridData.length }}</span>
        </el-form-item>
        <el-form-item :label="$t('tracking.cargoQuatity')">
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
          <el-input v-model="form.phone" style="width: 24%;" :placeholder="$t('resources.phone')" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tracking.estiameteTimeOfArrival')" :show-message="false" prop="estimateTime">
          <div style="display:flex;align-items:center" class="inputWidth">
            <bcTime
              @changeBCtime="changeBCtime"
              style="width:26.7%;"
              :timeType="'all'"
              :dateDefault="isChange ? timeArr : []"
              :isChange="isChange"
              ref="mychild"
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
            <el-table :data="scope.row.receiverAddressList" border :show-header="false" style="width:100%;">
              <el-table-column>
                <template slot-scope="prop">
                  <div>{{ propertyObj[prop.row.propertyList[0].propertyType] }}</div>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="prop">
                  <div>{{ prop.row.propertyList[0].name }}</div>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="prop">
                  <div>{{ prop.row.propertyList[0].number }}</div>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="prop">
                  <div>{{ sizeObj[prop.row.propertyList[0].sizeType] }}</div>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="prop">
                  <div>{{ prop.row.propertyList[0].weightOfEach }}</div>
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
    <el-dialog :title="$t('tracking.confirmReceiptOfDocument')" :visible.sync="rdDialog" center width="600px">
      <div style="text-alitn:center;">
        <div style="text-align:center;margin-bottom:10px;">
          {{ $t("tracking.areYouSure") }}
        </div>
        <div class="img-box">
          <el-image
            v-for="(img, index) in imgList"
            :src="img + '?x-oss-process=style/th-90'"
            :key="index"
            style="width: 100px; height: 100px;margin-right:10px;"
            :preview-src-list="imgList"
          ></el-image>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rdDialog = false">{{ $t("tracking.cancel") }}</el-button>
        <el-button type="primary" :loading="rdLoading" @click="rdConfirmIt">{{ $t("tracking.confirm") }}</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="$t('tracking.rating')" :visible.sync="ratingDialog" width="500px">
      <div style="text-align:center;">
        <el-rate style="margin-bottom:20px;" v-model="ratingForm.rating"> </el-rate>
        <el-input v-model="ratingForm.remark" type="textarea" :placeholder="$t('tracking.remark')" resize="none"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ratingDialog = false">取 消</el-button>
        <el-button type="primary" @click="ratingConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
let self;
import printJS from '../../printjs/src'
import { getLtlOrders, getLtlOrdersCount, postsendtohub,getOrderLog, demandquoteList, getImg, confirmRD, orderRating } from "../../api/tracking.js";
import { getGoodsProperty, getTruckType } from "../../api/data.js";
import { getToken } from "../../utils/auth";
import bcTime from "@/components/bcTime";
import { mapGetters } from "vuex";
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
      ratingForm: {
        rating: 0,
        remark: "",
      },
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
        truckCategory: [{ required: true, trigger: "change" }],
      },
      truckType: [],
      truckValue: "",
      btn_show: true,
      sendtohubid: "",
      loading1: false,
      rdDialog: false,
      imgList: [],
      rdLoading: false,
      ratingDialog: false,
    };
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapGetters(["permissions"]),
  },
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
    });
    getTruckType().then(res => {
      self.truckType = res.data.categories;
      self.truckValue = self.truckType.value;
    });
  },
  methods: {
    clear(){
      if (self.randomNumber != null) {
          self.randomNumber = "";
          self.isChange = false;
          // self.timeArr = null;
          // self.timeArr = [];
          self.timeArr.length = 0;
          self.form.plate = "";
          self.form.driverName = "";
          self.form.phone = "";
          self.time_at = "";
          self.time = "";
          self.form.truckCategory = "";
          self.clearTime();
        }
        self.getData();
    },
    rating(item) {
      self.thisId = item.id;
      self.ratingForm.rating = 0;
      self.ratingForm.remark = "";
      self.ratingDialog = true;
    },
    ratingConfirm() {
      if (self.ratingForm.rating == 0) {
        return self.$message.warning(self.$t("tracking.ratingIsRequired"));
      }
      orderRating(self.thisId, self.ratingForm.rating * 2, self.ratingForm.remark).then(() => {
        self.ratingDialog = false;
        self.getData();
      });
    },
    // 返回文件确认
    rdConfirmShow(row) {
      self.rdRow = row;
      console.log(row)
      if (row.photoIds) {
        getImg(row.photoIds).then(res => {
          let arr = [];
          for (let i of res.data) {
            arr.push(i.path);
            self.imgList = arr;
            self.rdDialog = true;
          }
        });
      } else {
        self.imgList = [];
        self.rdDialog = true;
      }
    },
    rdConfirmIt() {
      self.rdLoading = true;
      confirmRD(self.rdRow.id).then(() => {
        self.getData(() => {
          self.$message.success(self.$t("tracking.successful"));
          self.rdDialog = false;
          self.rdLoading = false;
        });
      });
    },
    // 点击确认
    toShowConfirm(row) {
      const self = this;
      self.confirmDialog = true;
      self.curId = row.id;
      demandquoteList(row.id).then(res => {
        self.quotedata = res.data;
      });
    },
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
      if (self.chooseNumber === 0) {
        self.dialogVisible = false;
        this.$message("请先选择需要发货的订单");
      } else {
        self.dialogVisible = true;
        self.totalNumber = 0;
        self.gridData = self.allOrder;
        for (let i in self.gridData) {
          self.proList1 = self.gridData[i].receiverAddressList;
          for(let j in self.proList1){
            self.totalNumber += self.proList1[j].propertyList[0].number;
          }
        }
      }
    },
    handleSelectionChange(val) {
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
    },
    getData(cb) {
      // self.getCount();
      const self = this;
      self.tableLoading = true;
      getLtlOrders(self.tabActive, { no: this.trackingNo, page: this.page }).then(res => {
        self.tableLoading = false;
        for (let i of res.data.content) {
          i.loading1 = 0;
        }
        self.data = res.data;
        this.page = self.data.number ? self.data.number : 0;
        if (cb) {
          cb();
        }
      });
      self.getCount();
    },
    search() {
      self.getData();
    },
    getCount() {
      getLtlOrdersCount({no: this.trackingNo}).then(res => {
        this.orderStatus = res.data
      });
    },
    sendToHub(item) {
      self.dialogVisible = true;
      self.totalNumber = 0;
      self.orderId = item.id;
      self.gridData = [item];
      self.proList = [item.receiverAddressList];
      self.proList = self.proList[0];
      // for (let i in self.gridData) {
      //   for (let j in self.proList) {
      //     self.totalNumber += self.proList[j].propertyList[0].number;
      //   }
      // }
      for (let i in self.gridData) {
        self.totalNumber += self.proList[0].propertyList[0].number;
      }
      getTruckType().then(res => {
        self.truckType = res.data.categories;
        self.truckValue = self.truckType.value;
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
            this.$message({
              message: "保存成功",
              type: "success",
            });
            self.randomNumber = res.data.deliveryNo;
            self.isChange = true;
            self.timeArr = self.time_at.split("-");
            self.btn_show = false;
            self.sendtohubid = res.data.id;
          });
        }
      });
      // self.timeArr = null;
    },
    orderLog(id) {
      getOrderLog(id).then(res => {
        self.logs = res.data;
        self.logDialog = true;
      });
    },
    print(row, index) {
      row.loading1 = 1;
      // window.printJS(ordersPrint(6489).then(res=>{}));
      printJS({
        printable: `${process.env.VUE_APP_BASE_API}/api/token/pdf/downloadInvoice?sendToHubId=${
          row.sendToHubId
        }&token=${getToken()}&Locale=${self.$store.state.app.language}`,type:'pdf',showModal:true,
        onLoadingEnd: () => {
          row.loading1 = 0;
        },
      });
    },
    print1() {
      self.loading1 = 1;
      console.log("print...");
      printJS({
        printable: `${process.env.VUE_APP_BASE_API}/api/token/pdf/downloadInvoice?sendToHubId=${
          self.sendtohubid
        }&token=${getToken()}&Locale=${self.$store.state.app.language}`,type:'pdf',showModal:true,
        onLoadingEnd: () => {
          self.loading1 = 0;
        },
      });
    },
    clearTime(){
      self.$refs.mychild.clearData();
    }
  }
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
.mouse {
  cursor: pointer !important;
}
</style>

<style lang="scss">
.LTL_manage {
  .el-form-item__label {
    text-align: left;
  }
  .el-table__footer-wrapper {
    background-color: #fff;
  }
}
</style>
