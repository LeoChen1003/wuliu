<template>
  <div class="manage cardFix">
    <!-- 搜索 -->
    <div class="statusHeader">
      <el-form ref="searchForm" inline :show-message="false">
        <el-form-item :label="$t('tracking.destinaiton')">
          <div class="search_item">
            <el-button size="mini" @click="proDialog = true" style="margin-right:5px;" icon="el-icon-more"></el-button>
            <el-select
              v-model="provinces"
              style="width:240px;"
              class="formSelect"
              clearable
              filterable
              multiple
              collapse-tags
              placeholder="province"
            >
              <el-option v-for="(item, index) in provinceList" :key="index" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item :label="$t('tracking.pickupDate')">
          <bcTime @changeBCtime="changeBCtime" :dateDefault="[]" style="width:100%;" :timeType="'all'"></bcTime>
        </el-form-item>
        <el-form-item :label="$t('tracking.tracking')">
          <el-input v-model="orderNo" :placeholder="$t('placeholder.pleaseInput')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="searchIt">{{ $t("tracking.search") }}</el-button>
          <el-button type="primary" @click="assignMultiple">{{ $t("tracking.assignTruckAndDriver") }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="display:flex;box-sizing:border-box;padding:0 20px;">
      <!-- 导航 -->
      <div style="height:100%;padding-right:18px;">
        <div class="statusText">{{ $t("billing.billingStatus") }}</div>
        <el-tabs v-model="tabActive" tab-position="left" @tab-click="tabChange" style="height:calc(100% - 50px);">
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
          <el-tab-pane name="WILL_PICK">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.toBeHandedOverToSupply") }}<sub class="badge">{{ orderStatus.WILL_PICK }}</sub>
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
        </el-tabs>
      </div>
      <!-- 表格 -->
      <div class="container">
        <el-table :data="data.content" v-loading="loading" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"> </el-table-column>
          <el-table-column :label="$t('tracking.TrackingNoAndDemand')">
            <template slot-scope="scope">
              <el-button style="width:100%;text-align:left;" @click="orderLog(scope.row.order.id)">
                <div>{{ scope.row.order.orderNo }}</div>
                <div>{{ scope.row.order.outNumber }}</div>
                <div>{{ scope.row.order.createdAt }}</div>
                <div>{{ scope.row.ownerName }}</div>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tracking.Discription')">
            <template slot-scope="scope">
              <!-- <el-card shadow="never"> -->
              <span v-for="(item, index) in scope.row.order.propertyList" :key="index">
                {{
                  `${parseInt(index) + 1}.${propertyObj[item.propertyType]} ${item.name} ${sizeObj[item.sizeType]} ${
                    item.number
                  }${unitObj[item.unit]} `
                }}
              </span>
              <!-- </el-card> -->
              <!-- <el-card shadow="never" style="margin-top:5px;" v-if="scope.row.order.chargeList.length > 0"> -->
              <div style="display:flex;margin-top:5px;" v-for="(item, index) in scope.row.order.chargeList" :key="index + '1'">
                <div>{{ serveObj[item.chargeType] }}</div>
              </div>
              <!-- </el-card> -->
              <div style="margin-top:5px;">Total Amt：{{ scope.row.order.settlementAmount }}</div>
              <!-- </el-card> -->
            </template>
          </el-table-column>
          <el-table-column :label="$t('tracking.deliveryPoint')">
            <template slot-scope="scope">
              <div v-if="scope.row.order.receiverAddress">
                <div>
                  {{ scope.row.order.receiverAddress.name }}
                  {{
                    tabActive == "toBeconfirmedOrderbyDemand" || tabActive == "toBeconfirmedOrderbySupply"
                      ? ""
                      : scope.row.order.receiverAddress.mobile
                  }}
                </div>
                <div>{{ scope.row.order.receiverAddress.addressDetail }}</div>
                <div>
                  {{ scope.row.order.receiverAddress.district }}
                  {{ scope.row.order.receiverAddress.city }}
                  {{ scope.row.order.receiverAddress.province }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tracking.pickupPoint')">
            <template slot-scope="scope">
              <div v-if="scope.row.order.senderAddress">
                <div>
                  {{ scope.row.order.senderAddress.name }}
                  {{
                    tabActive == "toBeconfirmedOrderbyDemand" || tabActive == "toBeconfirmedOrderbySupply"
                      ? ""
                      : scope.row.order.senderAddress.mobile
                  }}
                </div>
                <div>{{ scope.row.order.senderAddress.addressDetail }}</div>
                <div>
                  {{ scope.row.order.senderAddress.province }}
                  {{ scope.row.order.senderAddress.city }}
                  {{ scope.row.order.senderAddress.district }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tracking.VechicleDriver')">
            <template slot-scope="scope">
              <div>{{ scope.row.plate }}</div>
              <div>{{ scope.row.driverName }}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column :label="$t('tracking.ETD')"></el-table-column> -->
          <el-table-column :label="$t('tracking.Operation')">
            <template slot-scope="scope">
              <div style="text-align:center;">
                <el-button
                  v-if="
                    scope.row.order.status == 'WAIT_SEND_TO_HUB' ||
                      scope.row.order.status == 'WAIT_HUB_TO_PUT' ||
                      scope.row.order.status == 'WILL_PICK'
                  "
                  @click="assignItem(scope.row)"
                  :disabled="!permissions.SupplyOrderManage"
                  type="primary"
                  >{{ $t("tracking.assignTruckAndDriver") }}</el-button
                >
                <el-button
                  v-if="scope.row.order.status == 'WAIT_SUPPLY_TO_ACCEPT'"
                  @click="confirmB(scope.row.order)"
                  :disabled="!permissions.SupplyOrderManage"
                  type="primary"
                  >{{ $t("tracking.confirm") }}</el-button
                >
                <el-button
                  v-if="scope.row.order.status == 'WAIT_SUPPLY_TO_ACCEPT'"
                  @click="reject(scope.row.order)"
                  :disabled="!permissions.SupplyOrderManage"
                  type="primary"
                  >{{ $t("tracking.reject") }}</el-button
                >
                <!-- <el-button
                  v-if="scope.row.order.status == 'WILL_PICK' && scope.row.ordertransport && scope.row.order.transport.driverName == null"
                  @click="confirmB(scope.row.order)"
                  :disabled="!permissions.SupplyOrderManage"
                  type="primary"
                  >{{ $t("tracking.operation") }}</el-button
                > -->
                <el-button
                  v-if="scope.row.order.status == 'SENDING' || scope.row.order.status == 'WILL_PICK'"
                  @click="returnShow(scope.row.order)"
                  :disabled="scope.row.order.publishBack == 1 || !permissions.SupplyResourceManage"
                  type="primary"
                  >{{ $t("tracking.returnTruck") }}</el-button
                >
                <el-button
                  v-if="scope.row.order.status == 'WILL_RETURN'"
                  :disabled="scope.row.order.returnType == 1 || scope.row.order.returnType == 2 || !permissions.SupplyOrderManage"
                  @click="rdShow(scope.row.order)"
                  type="primary"
                  >{{ $t("tracking.returnDocument") }}</el-button
                >
              </div>
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
    <el-dialog :title="$t('tracking.returnTruck')" width="600px" :visible.sync="returnDialog">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item :label="$t('tracking.origin')">
          {{ returnForm_show.sender }}
        </el-form-item>
        <el-form-item :label="$t('tracking.destination')">
          {{ returnForm_show.receiver }}
        </el-form-item>
        <el-form-item :label="$t('tracking.truckType')">
          {{ truckObj[returnForm_show.truck] }}
        </el-form-item>
        <el-form-item :label="$t('tracking.backTime')" required>
          <el-cascader
            v-model="dateCascader"
            class="innerInp"
            :options="options"
            :props="props"
            separator="-"
            style="margin-right:5px;"
            @change="dateChange"
          ></el-cascader>
          <el-time-picker
            v-model="returnTime"
            format="HH:mm:ss"
            class="innerInp"
            :clearable="false"
            style="width:50%;"
            value-format="HH:mm:ss"
          >
          </el-time-picker>
        </el-form-item>
        <el-form-item :label="$t('tracking.quotation')" required>
          <el-input v-model="returnCharge" @mousewheel.native.prevent type="number"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="returnLoading"
            :disabled="returnCharge == '' || returnDate == '' || returnTime == ''"
            @click="returnIt"
            >{{ $t("tracking.confirm") }}</el-button
          >
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
          <div>0</div>
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
    <el-dialog :title="$t('tracking.returnDocument')" width="600px" @close="dialogClose" :visible.sync="rdDialog">
      <el-form :model="rdForm" size="mini" label-width="150px">
        <el-form-item :label="$t('tracking.trackingNo')">
          {{ rdRow.orderNo }}
        </el-form-item>
        <el-form-item :label="$t('tracking.deliveryChannel')" required>
          <el-select v-model="rdForm.returnType" class="rdFormWidth">
            <el-option :label="$t('tracking.expressDelivery')" :value="1"> </el-option>
            <el-option :label="$t('tracking.faceToFace')" :value="2"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tracking.expressWaybillNo')" v-if="rdForm.returnType == 1" required>
          <el-input class="rdFormWidth" v-model="rdForm.courierNumber"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tracking.photo')" v-if="rdForm.returnType == 1">
          <div class="upload-box">
            <el-upload
              class="upload-box"
              ref="photoIds"
              :action="env + '/api/file/upload'"
              :on-preview="handlePreview"
              multiple
              :file-list="fileList"
              :headers="headers"
              :limit="5"
              :on-exceed="outLimit"
              accept="image/*"
              list-type="picture-card"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="rdFormWidth" @click="rdIt" type="primary">{{ $t("tracking.confirm") }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="proDialog" :close-on-click-modal="false" width="600px">
      <el-tabs tabPosition="left" v-model="proActive">
        <el-tab-pane v-for="(item, index) in proArea" :key="index" :label="item.sortingNoTrans" :name="item.sortingNo">
          <el-button
            :type="provinces.indexOf(pro.name) > -1 ? 'info' : 'primary'"
            class="proItem"
            @click="tapPro(pro)"
            :key="proInd"
            v-for="(pro, proInd) in proArea[index].provinceList"
            >{{ pro.name }}</el-button
          >
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="proDialog = false">取 消</el-button>
        <el-button type="primary" @click="proDialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="previewDialog">
      <img width="100%" :src="previewImg" />
    </el-dialog>
    <el-dialog :visible.sync="assignDialog" width="950px" :title="$t('tracking.assignTruckAndDriver')" center>
      <el-form
        ref="assignForm"
        :model="assignForm"
        :rules="assignRules"
        hide-required-asterisk
        label-position="right"
        label-width="90px"
        style="width100%;display:flex;flex-direction:column;justify-content:center;align-items:center;"
      >
        <el-form-item prop="driverId" :label="$t('tracking.driver')">
          <el-select v-model="assignForm.driverId" filterable style="width:250px;margin-left:10px;">
            <el-option v-for="item in td.drivers" :key="item.value" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="truckId" :label="$t('tracking.truck')">
          <el-select v-model="assignForm.truckId" filterable style="width:250px;margin-left:10px;">
            <el-option v-for="item in td.trucks" :key="item.value" :label="item.plate" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tracking.orderQty')">
          <div style="width:250px;margin-left:10px;">{{ assignOrderList.length }}</div>
        </el-form-item>
      </el-form>
      <el-table :data="assignOrderList" border>
        <el-table-column :label="$t('tracking.trackingNo')">
          <template slot-scope="scope">
            {{ scope.row.order.orderNo }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('tracking.deliveryPoint')">
          <template slot-scope="scope">
            <div v-if="scope.row.order.receiverAddress">
              <div>
                {{ scope.row.order.receiverAddress.name }}
                {{
                  tabActive == "toBeconfirmedOrderbyDemand" || tabActive == "toBeconfirmedOrderbySupply"
                    ? ""
                    : scope.row.order.receiverAddress.mobile
                }}
              </div>
              <div>{{ scope.row.order.receiverAddress.addressDetail }}</div>
              <div>
                {{ scope.row.order.receiverAddress.district }}
                {{ scope.row.order.receiverAddress.city }}
                {{ scope.row.order.receiverAddress.province }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('tracking.cargo')">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.order.propertyList" :key="index">
              {{
                `${parseInt(index) + 1}.${propertyObj[item.propertyType]} ${item.name} ${sizeObj[item.sizeType]} ${item.number}${
                  unitObj[item.unit]
                } `
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('tracking.VAS')">
          <div style="display:flex;margin-top:5px;" v-for="(item, index) in scope.row.order.chargeList" :key="index + '1'">
            <div>{{ serveObj[item.chargeType] }}</div>
          </div>
        </el-table-column>
      </el-table>
      <div style="display:flex;justify-content:flex-end;margin-top:20px;">
        <el-button @click="assignDialog = false" type="info">取 消</el-button>
        <el-button type="primary" style="width:150px;" @click="assignConfirm">确 定</el-button>
      </div>
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
  getGoodsProperty,
  getSupplyTD,
  getBcYear,
  getBcDay,
  getProvinceArea,
} from "../../api/data";
import {
  confirmOrder,
  updateOrderInfo,
  rejectOrder,
  getOrderLog,
  getOrderStatus,
  returnTruck,
  returnDocument,
  getSupplyLTLOrder,
  supplyStatusCount,
  chooseDriverAndTruck,
} from "../../api/tracking.js";
import bcTime from "@/components/bcTime";
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";

let self;
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { bcTime },
  data() {
    return {
      env: process.env.VUE_APP_BASE_API,
      headers: {
        Authorization: getToken(),
      },
      orderList: [],
      data: {},
      tabActive: "WAIT_SEND_TO_HUB",
      printeDialog: false,
      returnDialog: false,
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
        WAIT_DEMAND_TO_ACCEPT: 0,
        SENDING: 0,
        WAIT_SUPPLY_TO_ACCEPT: 0,
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
      returnLoading: false,
      searchForm: {
        province: "",
      },
      logs: [],
      returnForm_show: {},
      returnCharge: "",
      returnDate: "",
      returnTime: "",
      dateCascader: "",
      options: [],
      truckObj: {},
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          let year = self.bcYear;
          let date = new Date();
          let month = node.label == year ? date.getMonth() + 1 : 1;
          let day = date.getDate();
          if (node.level == 0) {
            getBcYear().then(res => {
              self.bcYear = res.data;
              let years = [
                {
                  label: self.bcYear,
                  value: self.bcYear,
                },
                {
                  label: self.bcYear + 1,
                  value: self.bcYear + 1,
                },
              ];
              resolve(years);
            });
          } else if (node.level == 1) {
            let months = [];
            for (let y = month; y <= 12; y++) {
              months.push({
                label: y,
                value: y,
              });
            }
            resolve(months);
          } else if (node.level == 2) {
            getBcDay(node.parent.value, node.value).then(res => {
              let days = res.data;
              let dateList = [];
              let d = node.parent.value == self.bcYear && node.value == date.getMonth() + 1 ? day : 1;
              for (let x = d; x <= days; x++) {
                dateList.push({
                  label: x,
                  value: x,
                  leaf: true,
                });
              }
              resolve(dateList);
            });
          }
        },
      },
      rdDialog: false,
      rdForm: {
        returnType: 1,
      },
      fileList: [],
      previewDialog: false,
      previewImg: "",
      rdRow: {},
      orderNo: "",
      pickAt: "",
      provinces: [],
      proDialog: false,
      proActive: "B",
      proArea: [],
      assignDialog: false,
      assignOrderList: [],
      assignOrderListSelect: [],
      assignForm: {
        driverId: null,
        truckId: null,
      },
      assignRules: {
        driverId: [{ required: true, message: " ", trigger: "change" }],
        truckId: [{ required: true, message: " ", trigger: "change" }],
      },
    };
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapGetters(["permissions"]),
    phoFileList: function() {
      return self.$refs.photoIds.uploadFiles;
    },
  },
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
    getSupplyTD().then(res => {
      self.td = res.data;
    });
    getProvinceArea().then(res => {
      self.proArea = res.data;
    });
    self.loadData();
  },
  methods: {
    loadData(cb) {
      self.loading = true;
      let page = self.data.number ? self.data.number : 0;
      getSupplyLTLOrder({
        orderStatus: self.tabActive,
        orderNo: self.orderNo,
        pickAt: self.pickAt ? self.pickAt + " 00:00:00" : "",
        provinces: self.provinces,
        page: page,
      }).then(res => {
        self.data = res.data;
        self.loading = false;
        if (cb) {
          cb();
        }
      });
      supplyStatusCount({
        orderNo: self.orderNo,
        pickAt: self.pickAt ? self.pickAt + " 00:00:00" : "",
        provinces: self.provinces,
      }).then(res => {
        self.orderStatus = res.data;
      });
    },
    // 搜索
    searchIt() {
      self.loadData();
    },
    // 目的地选择
    tapPro(pro) {
      if (self.provinces.indexOf(pro.name) < 0) {
        self.provinces.push(pro.name);
      } else {
        self.provinces.splice(self.provinces.indexOf(pro.name), 1);
      }
    },
    // 揽件日期选择
    changeBCtime(time) {
      self.pickAt = time;
    },
    // 选择订单
    handleSelectionChange(val) {
      self.assignOrderListSelect = val;
    },
    // 批量操作指定车辆和司机
    assignMultiple() {
      self.assignOrderList = self.assignOrderListSelect;
      if (self.assignOrderList.length <= 0) {
        self.$message.warning("请选择一个订单");
        return;
      }
      self.assignDialog = true;
    },
    // 单个操作指定车辆和司机
    assignItem(item) {
      self.assignDialog = true;
      self.assignOrderList = [];
      self.assignOrderList.push(item);
    },
    // 确认指定车辆和司机
    assignConfirm() {
      this.$refs.assignForm.validate(valid => {
        if (valid) {
          let orderIds = [];
          for (let item of self.assignOrderList) {
            orderIds.push(item.order.id);
          }
          self.assignForm.orderIds = orderIds;
          chooseDriverAndTruck(self.assignForm).then(res => {
            self.assignDialog = false;
            self.loadData();
            self.assignForm.truckId = null;
            self.assignForm.driverId = null;
          });
        }
      });
    },
    pageChange(e) {
      self.loading = true;
      getSupplyLTLOrder({
        status: self.tabActive,
        page: e - 1,
      }).then(res => {
        self.data = res.data;
        self.loading = false;
      });
    },
    tabChange() {
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
          inputPattern: /\S/,
          inputErrorMessage: self.$t("tracking.pleaseEnterTheRejectionReason"),
        })
        .then(({ value }) => {
          rejectOrder(item.id, value).then(() => {
            self.loadData();
          });
        })
        .catch(() => {});
    },
    confirmIt() {
      self.confirmLoading = true;
      if (self.orderInfo.status == "WAIT_SUPPLY_TO_ACCEPT") {
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
      getOrderLog(id).then(res => {
        self.logs = res.data;
        self.logDialog = true;
      });
    },
    returnShow(item) {
      self.returnForm_show = {
        sender: item.receiverAddress.province,
        receiver: item.senderAddress.city,
        truck: item.transport.carType,
        subType: item.transport.carriage,
      };
      self.returnCharge = "";
      self.returnDate = "";
      self.returnTime = "";
      self.dateCascader = [];
      self.returnId = item.id;
      self.returnDialog = true;
    },
    dateChange(e) {
      self.returnDate = `${e[0]}-${e[1]}-${e[2]}`;
    },
    returnIt() {
      self.returnLoading = true;
      let returnDate = `${self.returnDate} ${self.returnTime}`;
      returnTruck(self.returnId, self.returnCharge, returnDate).then(() => {
        self.loadData(() => {
          self.returnLoading = false;
          self.returnDialog = false;
        });
      });
    },
    rdShow(row) {
      self.rdRow = row;
      self.rdDialog = true;
    },
    handlePreview(file) {
      this.previewImg = file.url;
      this.previewDialog = true;
    },
    dialogClose() {
      self.fileList = [];
      self.rdForm = {
        returnType: 1,
      };
    },
    outLimit() {
      self.$message.warning(self.$t("resources.outLimit"));
    },
    rdIt() {
      let rdForm = JSON.parse(JSON.stringify(self.rdForm));
      if (rdForm.returnType == 1 && rdForm.courierNumber == "") {
        return self.$message.warning(self.$t("tracking.courierNumberRequired"));
      }
      if (rdForm.returnType != 2) {
        // 整理photoIds
        let phoArr = [];
        for (let i of self.phoFileList) {
          if (i.response) {
            phoArr.push(i.response.data.id);
          } else {
            phoArr.push(i.id);
          }
        }
        rdForm.photoIds = phoArr.toString();
      }
      returnDocument(self.rdRow.id, rdForm).then(() => {
        self.loadData(() => {
          self.$message.success(self.$t("tracking.successful"));
          self.rdDialog = false;
        });
      });
    },
  },
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
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;

  .search_item {
    display: flex;
  }
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
  margin-top: 48px;
  height: calc(100vh - 161px);
  overflow: auto;
}

div::-webkit-scrollbar {
  display: none;
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

.rdFormWidth {
  width: 300px;
}

.upload-box {
  width: 350px;
  height: 70px;
  overflow: hidden;
}

.proItem {
  margin: 0 10px 10px 0;

  .proItemActive {
    background: red;
    color: #fff;
  }
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

.el-upload {
  width: 60px !important;
  height: 60px !important;
}

.el-upload-list {
  .is-success,
  .is-uploading,
  .is-ready {
    width: 60px !important;
    height: 60px !important;
  }
}

.upload-box {
  .el-icon-plus {
    transform: translateY(-38px) !important;
  }
}
</style>
