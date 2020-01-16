<template>
  <div class="manage cardFix tracking">
    <!-- <div class="statusHeader">
      <el-button type="primary">{{$t('tracking.releaseAReturnTruck')}}</el-button>
    </div> -->
    <div style="display:flex;box-sizing:border-box;padding-left:20px;height:100%;">
      <!-- 导航 -->
      <div style="height:100%;padding-right:18px;" class="nav">
        <el-tabs v-model="tabActive" tab-position="left" @tab-click="tabChange" style="height:100%;">
          <el-tab-pane name="WAIT_DEMAND_TO_ACCEPT">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.toBeconfirmedOrderbyDemand") }}<sub class="badge">{{ orderStatus.WAIT_DEMAND_TO_ACCEPT }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="WAIT_SUPPLY_TO_ACCEPT">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.toBeconfirmedOrderbySupply")
                  }}<sub class="badge red">{{ orderStatus.WAIT_SUPPLY_TO_ACCEPT }}</sub>
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
          </div>
          <el-button type="primary">{{$t('tracking.search')}}</el-button>
        </div> -->
        <div class="containerContent">
          <div style="width:49%;">
            <el-table
              :data="data.content"
              v-loading="loading"
              border
              :max-height="tableHeight"
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
              <el-table-column :label="$t('tracking.VAS')">
                <template slot-scope="scope">
                  <!-- <el-card v-for="(item, index) in scope.row.propertyList" :key="index">
                    <div>{{ propertyObj[item.propertyType] }}</div>
                    <div>
                      {{ item.number }} {{ unitObj[item.unit] }} {{ item.name }}
                      {{ sizeObj[item.sizeType] }}
                    </div>
                  </el-card> -->
                  <div v-for="(item, index) in scope.row.chargeList" :key="index + '1'" style="margin-top:5px;">
                    <div style="display:flex;" v-if="item.chargeIntro == 'true'">
                      <div>{{ serveObj[item.chargeType] }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <!-- <el-table-column :label="$t('tracking.deliveryPoint')">
                <template slot-scope="scope">
                  <el-card
                    shadow="never"
                    style="margin-bottom:5px;"
                    v-for="(receiverAddress, index) in scope.row.receiverAddressList"
                    :key="index"
                  >
                    <div>
                      {{ receiverAddress.name }}
                      {{
                        tabActive == "toBeconfirmedOrderbyDemand" || tabActive == "toBeconfirmedOrderbySupply"
                          ? ""
                          : receiverAddress.mobile
                      }}
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
                    {{ scope.row.settlementAmount }}
                  </div>
                </template>
              </el-table-column> -->
              <!-- <el-table-column :label="$t('tracking.pickupPoint')">
                <template slot-scope="scope" v-if="scope.row.senderAddress">
                  <div>
                    {{ scope.row.senderAddress.name }}
                    {{
                      tabActive == "toBeconfirmedOrderbyDemand" || tabActive == "toBeconfirmedOrderbySupply"
                        ? ""
                        : scope.row.senderAddress.mobile
                    }}
                  </div>
                  <div>{{ scope.row.senderAddress.addressDetail }}</div>
                  <div>
                    {{ scope.row.senderAddress.province }}
                    {{ scope.row.senderAddress.city }}
                    {{ scope.row.senderAddress.district }}
                  </div>
                </template>
              </el-table-column> -->
              <!-- <el-table-column :label="$t('tracking.ETD')"></el-table-column> -->
              <!-- <el-table-column>
                <template slot-scope="scope">
                  <div style="text-align:center;">
                    <el-button
                      v-if="scope.row.status == 'WAIT_SUPPLY_TO_ACCEPT'"
                      @click="confirmB(scope.row)"
                      :disabled="!permissions.SupplyOrderManage"
                      type="primary"
                      >{{ $t("tracking.confirm") }}</el-button
                    >
                    <el-button
                      v-if="scope.row.status == 'WAIT_SUPPLY_TO_ACCEPT'"
                      @click="reject(scope.row)"
                      :disabled="!permissions.SupplyOrderManage"
                      type="primary"
                      >{{ $t("tracking.reject") }}</el-button
                    >
                    <el-button
                      v-if="scope.row.status == 'WILL_PICK' && scope.row.transport && scope.row.transport.driverName == null"
                      @click="confirmB(scope.row)"
                      :disabled="!permissions.SupplyOrderManage"
                      type="primary"
                      style="margin-bottom:5px;"
                      >{{ $t("tracking.operation") }}</el-button
                    >
                    <el-button
                      v-if="scope.row.status == 'SENDING' || scope.row.status == 'WILL_PICK'"
                      @click="returnShow(scope.row)"
                      :disabled="scope.row.publishBack == 1 || !permissions.SupplyResourceManage"
                      type="primary"
                      >{{ $t("tracking.returnTruck") }}</el-button
                    >
                    <el-button
                      v-if="scope.row.status == 'WILL_RETURN'"
                      :disabled="scope.row.returnType == 1 || scope.row.returnType == 2 || !permissions.SupplyOrderManage"
                      @click="rdShow(scope.row)"
                      type="primary"
                      >{{ $t("tracking.returnDocument") }}</el-button
                    >
                  </div>
                </template>
              </el-table-column> -->
              <el-table-column :label="$t('tracking.route')">
                <template slot-scope="scope">
                  <div v-if="scope.row.senderAddress">
                    From:{{ scope.row.senderAddress.district }} {{ scope.row.senderAddress.city }}
                    {{ scope.row.senderAddress.province }}
                  </div>
                  <div v-if="scope.row.receiverAddressList.length > 0">
                    To:{{ scope.row.receiverAddressList[0].district }} {{ scope.row.receiverAddressList[0].city }}
                    {{ scope.row.receiverAddressList[0].province }}
                  </div>
                  <div>共{{ scope.row.receiverAddressList.length }}个派送点</div>
                </template>
              </el-table-column>
            </el-table>
            <div style="text-align:center;margin:10px 0;">
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
              <el-tab-pane :label="'订单详情'" name="detail" class="trackingDetail">
                <div v-if="thisRow">
                  <div class="rightDetail" :style="`max-height:${detailHeight}px;`">
                    <el-form label-position="left" label-width="100px">
                      <el-form-item :label="$t('booking.logisiticsType')">{{ thisRow.lineType }}</el-form-item>
                      <el-form-item :label="$t('tracking.remarks')">{{ thisRow.remark }}</el-form-item>
                      <el-form-item :label="$t('booking.truckType')">
                        <div v-if="thisRow.transport">
                          {{ truckObj[thisRow.transport.carType] }} {{ subtruckObj[thisRow.transport.carriage] }}
                        </div>
                      </el-form-item>
                      <el-form-item :label="$t('resources.plateLicense')">
                        <div v-if="thisRow.transport">
                          {{ thisRow.transport.plate }}
                        </div>
                      </el-form-item>
                      <el-form-item :label="$t('resources.driver')">
                        <div v-if="thisRow.transport">
                          {{ thisRow.transport.driverName }}
                        </div>
                      </el-form-item>
                      <el-form-item :label="$t('booking.valueAddedService')">
                        <span v-for="(item, index) in thisRow.chargeList" :key="index">
                          {{ serveObj[item.chargeType] + " " }}</span
                        >
                      </el-form-item>
                      <el-form-item :label="$t('tracking.price')">
                        <div v-if="thisRow.settlementAmount">合计：{{ thisRow.settlementAmount }}</div>
                        <div v-if="thisRow.settlementAmount" style="line-height:20px;">
                          <div>运费：{{ thisRow.settlementAmount - thisRow.serviceAmount }}</div>
                          <div v-for="(item, index) in thisRow.chargeList" :key="index">
                            {{ serveObj[item.chargeType] }}：{{ item.money }}
                          </div>
                        </div>
                      </el-form-item>
                      <el-form-item :label="$t('booking.expectedDeliveryTime')">
                        {{ thisRow.receiverAddressList[0].receiveAt }}
                      </el-form-item>
                      <el-form-item :label="$t('booking.pickupTime')"
                        ><div v-if="thisRow.senderAddress">{{ thisRow.senderAddress.pickAt }}</div></el-form-item
                      >
                      <el-form-item :label="$t('booking.sender')"
                        ><div v-if="thisRow.senderAddress">{{ thisRow.senderAddress.name }}</div></el-form-item
                      >
                      <el-form-item :label="$t('booking.pickupPoint')">
                        <div v-if="thisRow.senderAddress">
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
                  <div style="text-align:center;margin-top:10px;">
                    <el-button
                      v-if="thisRow.status == 'WAIT_SUPPLY_TO_ACCEPT'"
                      @click="confirmB(thisRow)"
                      :disabled="!permissions.SupplyOrderManage"
                      type="primary"
                      >{{ $t("tracking.confirm") }}</el-button
                    >
                    <el-button
                      v-if="thisRow.status == 'WAIT_SUPPLY_TO_ACCEPT'"
                      @click="reject(thisRow)"
                      :disabled="!permissions.SupplyOrderManage"
                      type="primary"
                      >{{ $t("tracking.reject") }}</el-button
                    >
                    <el-button
                      v-if="thisRow.status == 'WILL_PICK' && thisRow.transport && thisRow.transport.driverName == null"
                      @click="confirmB(thisRow)"
                      :disabled="!permissions.SupplyOrderManage"
                      type="primary"
                      style="margin-bottom:5px;"
                      >{{ $t("tracking.operation") }}</el-button
                    >
                    <el-button
                      v-if="thisRow.status == 'SENDING' || thisRow.status == 'WILL_PICK'"
                      @click="returnShow(thisRow)"
                      :disabled="thisRow.publishBack == 1 || !permissions.SupplyResourceManage"
                      type="primary"
                      >{{ $t("tracking.returnTruck") }}</el-button
                    >
                    <el-button
                      v-if="thisRow.status == 'WILL_RETURN'"
                      :disabled="thisRow.returnType == 1 || thisRow.returnType == 2 || !permissions.SupplyOrderManage"
                      @click="rdShow(thisRow)"
                      type="primary"
                      >{{ $t("tracking.returnDocument") }}</el-button
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
              <el-tab-pane :label="'签收凭证'" name="r">
                <div class="rightDetail" :style="`max-height:${detailHeight + 40}px;`"></div>
              </el-tab-pane>
            </el-tabs>
          </div>
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
          <el-select
            style="width:240px;margin-bottom:5px;"
            v-model="returnSenderAddressIndex"
            placeholder="请选择"
            @change="returnSenderAddressChange"
          >
            <el-option v-for="(item, index) in returnForm_show.sender" :key="item.id" :label="item.province" :value="index">
            </el-option>
          </el-select>
          <div>
            <el-select
              v-model="fromCityCode"
              style="width:240px;"
              class="formSelect"
              clearable
              filterable
              multiple
              collapse-tags
              placeholder="city"
            >
              <el-option v-for="(item, index) in fromCityCodeList" :key="index" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item :label="$t('tracking.destination')">
          <div>
            {{ returnForm_show.receiver }}
          </div>
          <el-select
            v-model="toCityCode"
            style="width:240px;"
            class="formSelect"
            clearable
            filterable
            multiple
            collapse-tags
            placeholder="city"
          >
            <el-option v-for="(item, index) in toCityCodeList" :key="index" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tracking.truckType')">
          {{ truckObj[returnForm_show.truck] }}
        </el-form-item>
        <el-form-item :label="$t('tracking.backTime')" required>
          <div style="display:flex;">
            <bc-picker @changeBCtime="dateChange" style="margin-right:5px;" :timeType="''" class="innerInp" ref="bc"></bc-picker>
            <el-time-picker
              v-model="returnTime"
              format="HH:mm:ss"
              class="innerInp"
              :clearable="false"
              style="width:50%;"
              value-format="HH:mm:ss"
            >
            </el-time-picker>
          </div>
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
          <div v-for="(receiverAddress, index) in orderInfo.receiverAddressList" :key="index">
            {{ receiverAddress.city }}
            {{ receiverAddress.district }}
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
    <el-dialog :visible.sync="previewDialog">
      <img width="100%" :src="previewImg" alt="image" />
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
} from "../../api/data";
import {
  confirmOrder,
  updateOrderInfo,
  rejectOrder,
  getOrder,
  getOrderLog,
  getOrderStatus,
  returnTruck,
  returnDocument,
} from "../../api/tracking.js";
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";

let self;
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    return {
      env: process.env.VUE_APP_BASE_API,
      headers: {
        Authorization: getToken(),
      },
      orderList: [],
      data: {},
      tabActive: "WAIT_DEMAND_TO_ACCEPT",
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
      options: [],
      truckObj: {},
      rdDialog: false,
      rdForm: {
        returnType: 1,
      },
      fileList: [],
      previewDialog: false,
      previewImg: "",
      rdRow: {},
      returnSenderAddress: {},
      returnReceiverAddress: {},
      returnSenderAddressIndex: null,
      fromCityCode: [],
      fromCityCodeList: [],
      toCityCode: [],
      toCityCodeList: [],
      curTab: "detail",
      thisRow: null,
      tableHeight: 0,
      detailHeight: 0,
      subtruckObj: {},
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
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 91 - 40 - 32 - 20;
      this.detailHeight = window.innerHeight - 91 - 40 - 40 - 15 - 36 - 10;
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
    getSupplyTD().then(res => {
      self.td = res.data;
    });
    self.loadData();
  },
  methods: {
    loadData(cb) {
      self.loading = true;
      let page = self.data.number ? self.data.number : 0;
      getOrder({
        status: self.tabActive,
        page: page,
      }).then(res => {
        self.data = res.data;
        self.loading = false;
        if (cb) {
          cb();
        }
      });
      getOrderStatus().then(res => {
        self.orderStatus = res.data;
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
    pageChange(e) {
      self.loading = true;
      getOrder({
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
      });
    },
    returnShow(item) {
      let list = JSON.parse(JSON.stringify(item.receiverAddressList));
      let obj = {};
      list = list.reduce(function(item, next) {
        obj[next.province] ? "" : (obj[next.province] = true && item.push(next));
        return item;
      }, []);
      console.log(list);
      console.log(item.senderAddress);
      self.returnForm_show = {
        sender: list,
        receiver: item.senderAddress.province,
        truck: item.transport.carType,
        subType: item.transport.carriage,
      };
      self.returnSenderAddressIndex = list.length - 1;
      self.returnSenderAddress = list[list.length - 1];
      self.returnReceiverAddress = item.senderAddress;
      getCityList(`provinceCodes=${self.returnSenderAddress.code.slice(0, 4)}`).then(res => {
        self.fromCityCodeList = res.data;
      });
      getCityList(`provinceCodes=${self.returnReceiverAddress.code.slice(0, 4)}`).then(res => {
        self.toCityCodeList = res.data;
      });
      self.returnCharge = "";
      self.returnDate = "";
      self.returnTime = "";
      this.$nextTick(() => {
        self.$refs.bc.clearData();
      });
      self.returnId = item.id;
      self.fromCityCode = [];
      self.toCityCode = [];
      self.returnDialog = true;
    },
    dateChange(time) {
      self.returnDate = time;
    },
    returnSenderAddressChange(val) {
      self.returnSenderAddress = self.returnForm_show.sender[val];
      self.fromCityCode = [];
      getCityList(`provinceCodes=${self.returnSenderAddress.code.slice(0, 4)}`).then(res => {
        self.fromCityCodeList = res.data;
      });
    },
    returnIt() {
      self.returnLoading = true;
      let returnDate = `${self.returnDate} ${self.returnTime}`;
      returnTruck(
        self.returnId,
        self.returnCharge,
        returnDate,
        self.returnReceiverAddress.province,
        self.returnSenderAddress.province,
        self.fromCityCode,
        self.toCityCode,
      ).then(() => {
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

  .containerContent {
    width: 100%;
    display: flex;
    justify-content: space-between;
    overflow: scroll;
  }
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

.rdFormWidth {
  width: 300px;
}

.upload-box {
  width: 350px;
  height: 70px;
  overflow: hidden;
}

.rightDetail {
  overflow: scroll;
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
</style>
