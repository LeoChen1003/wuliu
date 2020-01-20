<template>
  <div class="manage tracking">
    <div style="display:flex;box-sizing:border-box;padding-left:20px;height:100%;">
      <!-- 导航 -->
      <div style="height:100%;" class="nav">
        <el-tabs v-model="tabActive" tab-position="left" @tab-click="changeTab" style="height:100%;">
          <el-tab-pane name="WAITTING">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.Pending") }}<sub class="badge">{{ statusCount.WAITTING }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="CANCELED">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.canceled") }}<sub class="badge">{{ statusCount.CANCELED }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="WAIT_DEMAND_TO_ACCEPT">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.toBeconfirmedOrderbyDemand")
                  }}<sub class="badge red">{{ statusCount.WAIT_DEMAND_TO_ACCEPT }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="WAIT_SUPPLY_TO_ACCEPT">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.toBeconfirmedOrderbySupply") }}<sub class="badge">{{ statusCount.WAIT_SUPPLY_TO_ACCEPT }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="WILL_PICK">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.tobePickedUp") }}<sub class="badge">{{ statusCount.WILL_PICK }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="SENDING">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.intransit") }}<sub class="badge">{{ statusCount.SENDING }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="WILL_RETURN">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.documentTobereturned") }}<sub class="badge">{{ statusCount.WILL_RETURN }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="COMPLETE">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.completed") }}<sub class="badge">{{ statusCount.COMPLETE }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 表格 -->
      <div class="container" v-loading="tableLoading">
        <div style="width:49%;">
          <el-table
            :data="data.content"
            style="width:100%;"
            :max-height="tableHeight"
            border
            highlight-current-row
            @current-change="handleCurrentChange"
          >
            <el-table-column :label="$t('tracking.tracking')">
              <template slot-scope="scope">
                <!-- <el-button style="width:100%;text-align:left;" @click="orderLog(scope.row.id)"> -->
                <div>{{ scope.row.orderNo }}</div>
                <div>{{ scope.row.outNumber }}</div>
                <div>{{ scope.row.createdAt }}</div>
                <!-- </el-button> -->
              </template>
            </el-table-column>
            <el-table-column :label="$t('tracking.deliveryPoint')">
              <template slot-scope="scope" v-if="scope.row.receiverAddressList">
                <!-- <el-card
                shadow="never"
                style="margin-bottom:5px;"
                v-for="(receiverAddress, index) in scope.row.receiverAddressList"
                :key="index"
              > -->
                <div>
                  {{ scope.row.receiverAddressList[0].name }}
                  {{ scope.row.receiverAddressList[0].mobile }}
                </div>
                <div>{{ scope.row.receiverAddressList[0].addressDetail }}</div>
                <div>
                  {{ scope.row.receiverAddressList[0].district }}
                  {{ scope.row.receiverAddressList[0].city }}
                  {{ scope.row.receiverAddressList[0].province }}
                </div>
                <div v-if="scope.row.receiverAddressList.length > 1" style="margin-top:15px;">
                  {{ $t("tracking.Total") }} {{ scope.row.receiverAddressList.length }} {{ $t("tracking.deliverypoints") }}
                </div>
                <!-- </el-card> -->
              </template>
            </el-table-column>
            <el-table-column :label="$t('tracking.supply')">
              <template slot-scope="scope">
                <div v-if="!(tabActive == '0' || tabActive == '1') && scope.row.transport.supply">
                  <div>
                    {{
                      scope.row.transport.supply.companyName == ""
                        ? scope.row.transport.supply.humanName
                        : scope.row.transport.supply.companyName
                    }}
                  </div>
                  <!-- <div>
                    {{ scope.row.transport.supply.contactMobile }}
                  </div> -->
                  <div>
                    {{ truckObj[scope.row.transport.carType] }}
                    {{ subtruckObj[scope.row.transport.carriage] }}
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
            <!-- <el-table-column :label="$t('tracking.remarks')">
            <template slot-scope="scope">
              <div>
                {{ scope.row.remark }}
              </div>
            </template>
          </el-table-column> -->
            <!-- <el-table-column v-if="tabActive != 'WAITTING'">
            <template slot-scope="scope">
              <div style="text-align:center;">
                <el-button
                  type="primary"
                  v-if="scope.row.status == 'WAIT_DEMAND_TO_ACCEPT'"
                  :disabled="!permissions.DemandOrderManage"
                  @click="toShowConfirm(scope.row)"
                  >{{ $t("tracking.confirm") }}</el-button
                >
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
        <div style="width:49%;">
          <el-tabs v-model="curTab" @tab-click="handleClick">
            <el-tab-pane :label="$t('tracking.OrderDetails')" name="detail" class="trackingDetail">
              <div v-if="thisRow">
                <div class="rightDetail" :style="`max-height:${detailHeight}px;`">
                  <el-form label-position="left" label-width="200px">
                    <el-form-item :label="$t('booking.logisiticsType')">{{ thisRow.lineType }}</el-form-item>
                    <el-form-item :label="$t('tracking.remarks')">{{ thisRow.remark }}</el-form-item>
                    <el-form-item :label="$t('booking.truckType')">
                      <div v-if="thisRow.transport">
                        {{ truckObj[thisRow.transport.carType] }} {{ subtruckObj[thisRow.transport.carriage] }}
                      </div>
                    </el-form-item>
                    <el-form-item :label="$t('booking.valueAddedService')">
                      <span v-for="(item, index) in thisRow.chargeList" :key="index"> {{ serveObj[item.chargeType] + " " }}</span>
                    </el-form-item>
                    <el-form-item :label="$t('tracking.price')">
                      <div v-if="thisRow.settlementAmount">{{ $t("booking.totalamt") }}：{{ thisRow.settlementAmount }}</div>
                      <div v-if="thisRow.settlementAmount" style="line-height:20px;">
                        <div>{{ $t("billing.freight") }}：{{ thisRow.settlementAmount - thisRow.serviceAmount }}</div>
                        <div v-for="(item, index) in thisRow.chargeList" :key="index">
                          {{ serveObj[item.chargeType] }}：{{ item.money }}
                        </div>
                      </div>
                    </el-form-item>
                    <el-form-item :label="$t('booking.expectedDeliveryTime')">
                      {{ thisRow.receiverAddressList[0].receiveAt }}
                    </el-form-item>
                    <el-form-item :label="$t('booking.pickupTime')">{{ thisRow.senderAddress.pickAt }}</el-form-item>
                    <el-form-item :label="$t('booking.sender')">{{ thisRow.senderAddress.name }}</el-form-item>
                    <el-form-item :label="$t('booking.pickupPoint')">
                      <div>
                        <div>{{ thisRow.senderAddress.name }} {{ thisRow.senderAddress.mobile }}</div>
                        <div style="line-height:20px;">
                          {{ thisRow.senderAddress.addressDetail }} {{ thisRow.senderAddress.district }}
                          {{ thisRow.senderAddress.city }}
                          {{ thisRow.senderAddress.province }}
                        </div>
                      </div>
                    </el-form-item>
                  </el-form>
                  <el-table
                    :data="thisRow.receiverAddressList ? thisRow.receiverAddressList : []"
                    style="width:100%;border-top:1px solid #ebeef5;margin-top:5px;"
                  >
                    <el-table-column :label="$t('booking.deliveryPoint')">
                      <template slot-scope="scope">
                        <div>
                          {{ scope.row.name }}
                          {{ scope.row.mobile }}
                        </div>
                        <div>
                          {{ scope.row.addressDetail }}
                        </div>
                        <div>
                          {{ scope.row.district }}
                          {{ scope.row.city }}
                          {{ scope.row.province }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('booking.cargoList')">
                      <template slot-scope="scope">
                        <div v-for="(item, index) in scope.row.propertyList" :key="index">
                          <div v-if="item.name">
                            {{ propertyObj[item.propertyType] }} {{ item.name }} {{ item.number }} {{ sizeObj[item.sizeType] }}
                            {{ item.weightOfEach }}
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div style="margin-top:10px;text-align:center;">
                  <el-button
                    type="primary"
                    v-if="thisRow.status == 'WAIT_DEMAND_TO_ACCEPT'"
                    :disabled="!permissions.DemandOrderManage"
                    @click="toShowConfirm(thisRow)"
                    >{{ $t("tracking.confirm") }}</el-button
                  >
                  <el-button
                    type="primary"
                    :disabled="!permissions.DemandOrderManage"
                    v-if="thisRow.status == 'COMPLETE' && thisRow.rating == null"
                    @click="rating(thisRow)"
                    >{{ $t("tracking.rating") }}</el-button
                  >
                  <el-rate v-if="thisRow.status == 'COMPLETE' && thisRow.rating" disabled v-model="thisRow.rating.rating / 2">
                  </el-rate>
                  <el-button
                    type="primary"
                    v-if="thisRow.status == 'WILL_RETURN'"
                    :disabled="!permissions.DemandOrderManage"
                    @click="rdConfirmShow(thisRow)"
                    >{{ $t("tracking.confirm") }}</el-button
                  >
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('tracking.orderLog')" name="log">
              <div class="rightDetail" :style="`max-height:${detailHeight + 40}px;`">
                <el-timeline :reverse="true" style="margin-top:15px;">
                  <el-timeline-item v-for="(item, index) in logs" :key="index" :timestamp="item.createdAt">
                    {{ item.introduce }}
                  </el-timeline-item>
                </el-timeline>
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="$t('tracking.Receipt')"
              name="r"
              v-if="tabActive == 'SENDING' || tabActive == 'WILL_RETURN' || tabActive == 'COMPLETE'"
            >
              <div class="rightDetail fixcollapse" :style="`max-height:${detailHeight + 40}px;`" v-if="thisRow">
                <el-collapse v-model="activeModel" @change="activeModelChange">
                  <el-collapse-item name="1">
                    <template slot="title"> {{ $t("tracking.Pickupinformation") }} </template>
                    <div>
                      <el-row :gutter="7" style="max-height:100px;overflow:hidden;">
                        <el-col :span="8">
                          <div>
                            <div>{{ thisRow.senderAddress.name }} {{ thisRow.senderAddress.mobile }}</div>
                            <div>{{ thisRow.senderAddress.addressDetail }}</div>
                            <div style="line-height:20px;">
                              {{ thisRow.senderAddress.district }}
                              {{ thisRow.senderAddress.city }}
                              {{ thisRow.senderAddress.province }}
                            </div>
                          </div>
                        </el-col>
                        <el-col :span="6">
                          <div style="margin-top:23px;">{{ thisRow.handoverTime }}</div>
                        </el-col>
                        <el-col :span="5">
                          <div style="height:100px;width:100px;">
                            <el-image
                              :src="thisRow.pickupSignature"
                              v-if="thisRow.pickupSignature"
                              :preview-src-list="[thisRow.pickupSignature]"
                               fit="contain"
                               style="height:100px;width:100px;"
                            ></el-image>
                          </div>
                        </el-col>
                        <el-col :span="5">
                          <div style="height:100px;width:100px;">
                            <el-image
                              :src="thisRow.pickupPicture"
                              v-if="thisRow.pickupPicture"
                              :preview-src-list="[thisRow.pickupPicture]"
                               fit="contain"
                               style="height:100px;width:100px;"
                            ></el-image>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item name="2">
                    <template slot="title"> {{ $t("tracking.Deliverylist") }} </template>
                    <div v-for="(item, index) in thisRow.receiverAddressList" :key="index" style="margin-bottom:10px;">
                      <el-row :gutter="7" style="max-height:100px;overflow:hidden;">
                        <el-col :span="8">
                          <div>
                            {{ item.name }}
                            {{ item.mobile }}
                          </div>
                          <div>
                            {{ item.addressDetail }}
                          </div>
                          <div>
                            {{ item.district }}
                            {{ item.city }}
                            {{ item.province }}
                          </div>
                        </el-col>
                        <el-col :span="6">
                          <div style="margin-top:23px;">{{ item.deliveryAt }}</div>
                        </el-col>
                        <el-col :span="5">
                          <div style="height:100px;width:100px;">
                            <el-image
                              :src="item.deliverySignature"
                              v-if="item.deliverySignature"
                              :preview-src-list="[item.deliverySignature]"
                              fit="contain"
                              style="height:100px;width:100px;"
                            ></el-image>
                          </div>
                        </el-col>
                        <el-col :span="5">
                          <div style="height:100px;width:100px;">
                            <el-image
                              :src="item.deliveryPicture"
                              v-if="item.deliveryPicture"
                              :preview-src-list="[item.deliveryPicture]"
                              fit="contain"
                              style="height:100px;width:100px;"
                            ></el-image>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </el-tab-pane>
          </el-tabs>
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
    <el-dialog :title="$t('tracking.confirm')" width="50%" :visible.sync="confirmDialog" center>
      <el-table :data="quotedata" highlight-current-row @row-click="showRow" border>
        <!-- <el-table-column width="55">
          <template slot-scope="scope">
            <div style="width:100%;text-align:center;">
              <el-radio class="radio"
                        v-model="radio"></el-radio>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column :label="$t('tracking.supply')">
          <template slot-scope="scope">
            <div>
              {{
                scope.row.supply
                  ? scope.row.supply.type == "COMPANY"
                    ? scope.row.supply.companyName
                    : scope.row.supply.humanName
                  : ""
              }}
            </div>
            <div v-if="scope.row.supply.companyLogo">
              <el-image
                style="width: 50px;max-height:100px;overflow:hidden;"
                :src="scope.row.supply.companyLogo"
                fit="contain"
              ></el-image>
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
              {{ truckObj[scope.row.carType] }}
              {{ subtruckObj[scope.row.carriage] }}
            </div>
            <div>{{ scope.row.plate }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('tracking.quotation')">
          <template slot-scope="scope">
            <div>
              {{ scope.row.money }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmDialog = false">取 消</el-button>
        <el-button :disabled="radio === ''" type="primary" :loading="confirmLoading" @click="confirmIt">{{
          $t("tracking.confirm")
        }}</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="$t('tracking.orderLog')" :visible.sync="logDialog">
      <el-timeline :reverse="true">
        <el-timeline-item v-for="(item, index) in logs" :key="index" :timestamp="item.createdAt">
          {{ item.introduce }}
        </el-timeline-item>
      </el-timeline>
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
    <el-dialog :title="$t('tracking.confirmReceiptOfDocument')" :visible.sync="rdDialog" center width="600px">
      <div style="text-alitn:center;">
        <div style="text-align:center;margin-bottom:10px;">
          {{ $t("tracking.areYouSure") }}
        </div>
        <div class="img-box" style="width:100%;display:flex;flex-wrap:wrap;justify-content:space-around;">
          <el-image
            v-for="(img, index) in imgList"
            :src="img"
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
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { getTruckType, getProvinceList, getCityList, getExtraServer, getGoodsProperty } from "../../api/data";
import {
  demandOrderList,
  demandStatusCount,
  demandquoteList,
  demandquoteConfirm,
  getOrderLog,
  orderRating,
  getImg,
  confirmRD,
} from "../../api/tracking.js";
import { mapGetters } from "vuex";

let self;
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    return {
      data: {},
      quotedata: [],
      tabActive: "WAITTING",
      statusCount: [],
      printeDialog: false,
      confirmDialog: false,
      logDialog: false,
      ratingDialog: false,
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
      truckObj: {},
      subtruckObj: {},
      radio: "",
      selected: {},
      curId: null,
      tableLoading: false,
      logs: [],
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      ratingForm: {
        rating: 0,
        remark: "",
      },
      rdDialog: false,
      imgList: [],
      rdRow: {},
      rdLoading: false,
      confirmLoading: false,
      curTab: "detail",
      thisRow: null,
      tableHeight: 0,
      detailHeight: 0,
      activeModel: ["1", "2"],
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
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 91 - 40 - 32 - 20;
      this.detailHeight = window.innerHeight - 91 - 40 - 40 - 30 - 20;
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
      let subtruckObj = new Object();
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
    activeModelChange() {
      self.activeModel = ["1", "2"];
    },
    loadData(cb) {
      const self = this;
      self.tableLoading = true;
      let page = self.data.number ? self.data.number : 0;
      self.getCount();
      demandOrderList({ status: self.tabActive, page: page }).then(res => {
        self.data = res.data;
        self.tableLoading = false;
        if (cb) {
          cb();
        }
      });
    },
    handleClick() {
      if (self.curTab == "log" && self.thisRow) {
        self.orderLog(self.thisRow.id);
      }
    },
    handleCurrentChange(val) {
      self.thisRow = val;
      if (self.curTab == "log" && self.thisRow) {
        self.orderLog(self.thisRow.id);
      } else {
        self.logs = [];
      }
    },
    getCount() {
      const self = this;
      demandStatusCount().then(res => {
        self.statusCount = res.data;
      });
    },
    pageChange(e) {
      self.tableLoading = true;
      demandOrderList({
        status: self.tabActive,
        page: e - 1,
      }).then(res => {
        self.data = res.data;
        self.tableLoading = false;
      });
    },
    changeTab() {
      self.data = {};
      self.loadData();
      self.thisRow = null;
      self.logs = [];
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
    showRow(row) {
      //赋值给radio
      this.radio = this.quotedata.indexOf(row);
      this.selected = row;
    },
    confirmIt() {
      const self = this;
      self.confirmLoading = true;
      demandquoteConfirm(self.curId, self.selected.id)
        .then(res => {
          self.$message.success(res.message);
          self.loadData();
          self.radio = "";
          self.confirmDialog = false;
          self.confirmLoading = false;
        })
        .catch(() => {
          self.confirmLoading = false;
        });
    },
    orderLog(id) {
      getOrderLog(id).then(res => {
        self.logs = res.data;
      });
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
        self.loadData();
      });
    },
    // 返回文件确认
    rdConfirmShow(row) {
      self.rdRow = row;
      if (row.photoIds) {
        getImg(row.photoIds).then(res => {
          let arr = [];
          for (let i of res.data) {
            arr.push(i.path);
          }
          self.imgList = arr;
          self.rdDialog = true;
        });
      } else {
        self.imgList = [];
        self.rdDialog = true;
      }
    },
    rdConfirmIt() {
      self.rdLoading = true;
      confirmRD(self.rdRow.id).then(() => {
        self.loadData(() => {
          self.$message.success(self.$t("tracking.successful"));
          self.rdDialog = false;
          self.rdLoading = false;
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
.manage {
  box-sizing: border-box;
  height: calc(100vh - 91px);
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
  height: 100%;
  display: flex;
  justify-content: space-between;
  overflow: scroll;
  padding: 20px;
  background: #fff;
}

div::-webkit-scrollbar {
  display: none;
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

.rightDetail {
  overflow: scroll;
}
</style>
<style lang="scss">
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

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}

.trackingDetail {
  .el-form-item {
    margin-bottom: 0px !important;
  }
  .el-table__header tr,
  .el-table__header th {
    padding: 0;
    height: 40px;
  }
  .el-table__body tr,
  .el-table__body td {
    padding: 0;
    height: 40px;
  }
}

.fixcollapse {
  .el-collapse-item__arrow.is-active {
    color: #fff;
  }
}
</style>
