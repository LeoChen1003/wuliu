<template>
  <div class="manage booking">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
      <div style="display:flex;width:80%;">
        <el-alert
          show-icon
          :closable="false"
          :title="
            `${$t('title.TheCurrentlySelectedSupplyIs')} ${consultInfo.data.supply.name}，${$t(
              'title.TomodifyPleaseClickButton',
            )}`
          "
          type="info"
        ></el-alert>
        <el-button style="width:200px;margin-left:20px;" size="small" @click="goBack" type="info">{{
          $t("booking.returnConsulting")
        }}</el-button>
      </div>
      <el-button style="width:200px;" @click="todoIt" :loading="todoLoading" type="primary">{{
        $t("booking.placeOrder")
      }}</el-button>
    </div>
    <el-form ref="bookingform" :model="bookingForm" :rules="bookingRules" :show-message="false" label-position="top" size="small">
      <el-row class="itemRow">
        <el-col :span="8">
          <el-form-item :label="$t('booking.logisiticsType')">
            <el-select
              v-model="bookingForm.orderInfo.lineType"
              disabled
              :placeholder="$t('placeholder.pleaseChoose')"
              class="inputWidth"
            >
              <el-option v-for="item in logisticType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('booking.sender')">
            <el-select
              v-model="senderIndex"
              @change="val => senderSelect(val)"
              :placeholder="$t('placeholder.pleaseChoose')"
              class="inputWidth"
            >
              <el-option v-for="(item, index) in senderList" :key="item.id" :label="item.name" :value="index" />
            </el-select>
          </el-form-item>
          <el-form-item prop="senderAddress" :label="$t('booking.pickupTime')">
            <div class="inputWidth" style="display:flex;">
              <el-date-picker
                v-model="bookingForm.senderAddress.pickAt"
                type="date"
                disabled
                value-format="yyyy-MM-dd"
                style="margin-right:5px;"
                :placeholder="$t('placeholder.chooseDate')"
              >
              </el-date-picker>
              <el-time-picker
                v-model="time"
                disabled
                format="HH:mm:ss"
                value-format="HH:mm:ss"
                :placeholder="$t('placeholder.chooseTime')"
              >
              </el-time-picker>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="senderAddress" :label="$t('booking.pickupPoint')">
            <el-input
              :placeholder="$t('placeholder.placeEnterSenderName')"
              v-model="bookingForm.senderAddress.name"
              class="inputWidth inputBottom"
            ></el-input>
            <el-input
              :placeholder="$t('placeholder.pleaseEnterTelNumber')"
              v-model="bookingForm.senderAddress.mobile"
              class="inputWidth inputBottom"
            ></el-input>
            <el-input
              :placeholder="$t('member.address')"
              v-model="bookingForm.senderAddress.addressDetail"
              class="inputWidth inputBottom"
            ></el-input>
            <el-select
              v-model="bookingForm.senderAddress.code"
              filterable
              disabled
              remote
              reserve-keyword
              class="inputWidth"
              v-el-select-loadmore="loadmore"
              :placeholder="$t('member.region')"
              :remote-method="pickUpMethod"
              @focus="clearSelect('pk')"
              :loading="searchloading"
            >
              <el-option v-for="item in pickUpRegionList" :key="item.fullname" :label="item.fullname" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="receiverAddress" :label="$t('booking.destination')">
            <el-input
              :placeholder="$t('placeholder.pleaseEnterRecipieName')"
              v-model="bookingForm.receiverAddress.name"
              class="inputWidth inputBottom"
            ></el-input>
            <el-input
              :placeholder="$t('placeholder.pleaseEnterTelNumber')"
              v-model="bookingForm.receiverAddress.mobile"
              class="inputWidth inputBottom"
            ></el-input>
            <el-input
              :placeholder="$t('member.address')"
              v-model="bookingForm.receiverAddress.addressDetail"
              class="inputWidth inputBottom"
            ></el-input>
            <el-select
              v-model="bookingForm.receiverAddress.code"
              filterable
              remote
              disabled
              reserve-keyword
              @focus="clearSelect('del')"
              class="inputWidth"
              v-el-select-loadmore="loadmore"
              :placeholder="$t('member.region')"
              :remote-method="pickUpMethod"
              :loading="searchloading"
            >
              <el-option v-for="item in delRegionList" :key="item.fullname" :label="item.fullname" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="itemRow">
        <el-col :span="8">
          <el-form-item :label="$t('booking.valueAddedService')">
            <div v-if="bookingForm.orderInfo.lineType == 'FTL'">
              <el-checkbox
                v-model="unloading"
                class="inputWidth inputBottom"
                style="margin-left: 10px;"
                :disabled="consultInfo.data.supportLoading == 0"
                :label="$t('booking.unloading')"
                border
              ></el-checkbox>
              <el-checkbox
                v-model="loading"
                class="inputWidth inputBottom"
                :disabled="consultInfo.data.supportLoading == 0"
                :label="$t('booking.loading')"
                border
              ></el-checkbox>
              <el-checkbox
                v-model="documentReturn"
                class="inputWidth inputBottom"
                :label="$t('booking.documentReturn')"
                border
              ></el-checkbox>
              <el-checkbox
                v-model="liability"
                disabled
                class="inputWidth inputBottom"
                :label="$t('booking.liability')"
                border
              ></el-checkbox>
              <el-input
                :placeholder="$t('placeholder.amount')"
                type="number"
                v-if="liability"
                style="margin-left:10px;"
                v-model="liabilityCon"
                class="inputWidth"
              >
                <el-select v-model="liabilitySelect" slot="append" :placeholder="$t('placeholder.pleaseChoose')">
                  <el-option label="PCS" value="PCS"></el-option>
                  <el-option label="Shipment" value="Shipment"></el-option>
                </el-select>
              </el-input>
            </div>
            <div v-else>
              <el-checkbox
                v-model="documentReturn"
                class="inputWidth inputBottom"
                :label="$t('booking.documentReturn')"
                border
              ></el-checkbox>
              <el-checkbox
                v-model="printSticker"
                class="inputWidth inputBottom"
                style="margin-left:0px;"
                :label="$t('booking.printSticker')"
                border
              ></el-checkbox>
            </div>
          </el-form-item>
          <el-form-item :label="$t('booking.cargoList')" class="el_item" v-if="bookingForm.orderInfo.lineType == 'LTL'">
            <el-input v-model="propertyListContent" :rows="3" disabled resize="none" type="textarea" class="inputWidth" />
            <div class="el_item_icon" @click="cargoListDialog = true">
              <i class="el-icon-edit cargo_edit"></i>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('booking.truckType')" v-if="bookingForm.orderInfo.lineType == 'FTL'">
            <el-select
              v-model="bookingForm.transportInfo.carType"
              disabled
              :placeholder="$t('placeholder.pleaseChoose')"
              style="width:45%;"
            >
              <el-option v-for="item in categoryList" :key="item.key" :label="item.value" :value="item.key" />
            </el-select>
            <el-select
              v-model="bookingForm.transportInfo.carriage"
              disabled
              :placeholder="$t('placeholder.pleaseChoose')"
              style="width:45%;"
            >
              <el-option v-for="item in subCategoryList" :key="item.key" :label="item.value" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('booking.supply')">
            <el-select v-model="bookingForm.transportInfo.companyName" disabled class="inputWidth">
              <el-option
                v-for="item in supplyList"
                :key="item.site.companyName"
                :label="item.site.companyName"
                :value="item.site.companyName"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('booking.referenceNo')">
            <el-input v-model="bookingForm.orderInfo.outNumber" class="inputWidth" />
          </el-form-item>
          <el-form-item :label="$t('booking.remarks')">
            <el-input v-model="bookingForm.orderInfo.remark" resize="none" type="textarea" class="inputWidth" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- <el-form-item :label="$t('booking.shareTruck')">
            <el-radio-group v-model="shareTruck">
              <el-radio :label="false"
                        border>{{$t('booking.fullTruckLoad')}}</el-radio>
              <el-radio :label="true"
                        disabled
                        border>{{$t('booking.sharetruckLoad')}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('booking.cargoShape')"
                        v-if="shareTruck">
            <el-radio v-model="cargoShape"
                      :label="`${index+1}`"
                      border
                      style="margin-left:0px;"
                      v-for="(item,index) in cargoShapeList"
                      :key="index"></el-radio>
          </el-form-item> -->
          <el-table :data="amountList" ref="amountTable" show-summary :sum-text="$t('booking.totalamt')" border>
            <el-table-column prop="label" label="item"></el-table-column>
            <el-table-column prop="amount" label="Amount"></el-table-column>
          </el-table>
          <el-form-item :label="$t('booking.accountBalance')" style="margin-top:30px;">
            <div style="display:flex;justify-content:space-between;">
              <el-tag style="width:100px;text-align:center;">{{ currentBalance }}</el-tag>
              <el-button style="width:150px;" @click="toTopUp" type="info">{{ $t("booking.topUp") }}</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 货物清单 -->
    <el-dialog :visible.sync="cargoListDialog" :title="$t('booking.cargoList')" width="85%" center>
      <!-- size 说明 -->
      <el-table :data="cargoTip" border style="width:730px;margin-bottom:20px;">
        <el-table-column prop="unit" width="130"></el-table-column>
        <el-table-column prop="ss" label="Size-SS" width="100"></el-table-column>
        <el-table-column prop="s" label="Size-S" width="100"></el-table-column>
        <el-table-column prop="m" label="Size-M" width="100"></el-table-column>
        <el-table-column prop="l" label="Size-L" width="100"></el-table-column>
        <el-table-column prop="xl" label="Size-XL" width="100"></el-table-column>
        <el-table-column prop="eSize" label="Extra size" width="100"></el-table-column>
      </el-table>
      <!-- 清单列表 -->
      <div style="display:flex;align-items: flex-end;">
        <el-form ref="cargoform" :model="bookingForm" :rules="cargoRules" :show-message="false" style="width:95%;">
          <el-form-item prop="propertyList">
            <el-table border :data="bookingForm.propertyList">
              <el-table-column prop="propertyType" :label="$t('booking.cargoType')">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.propertyType" :placeholder="$t('placeholder.pleaseChoose')">
                    <el-option v-for="item in propertyTypeList" :key="item.key" :label="item.trans" :value="item.key"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="name" :label="$t('booking.commodity')">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.name"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="number" :label="$t('booking.qty')">
                <template slot-scope="scope">
                  <el-input type="number" v-model="scope.row.number"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="unit" :label="$t('booking.unit')">
                <template slot-scope="scope">
                  <el-select :placeholder="$t('placeholder.pleaseChoose')" v-model="scope.row.unit">
                    <el-option v-for="item in unitList" :key="item.key" :label="item.trans" :value="item.key"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="sizeType" :label="$t('booking.size')">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.sizeType"
                    :placeholder="$t('placeholder.pleaseChoose')"
                    @change="val => sizeSelect(val, scope.$index)"
                  >
                    <el-option v-for="item in sizeTypeList" :key="item.key" :label="item.trans" :value="item.key"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="wide" :label="$t('booking.weight')">
                <template slot-scope="scope">
                  <el-input
                    type="number"
                    v-model="scope.row.wide"
                    :disabled="scope.row.sizeType != 'EXTRA_SIZE'"
                    @keyup.native="checkNumInt(scope.row.wide, scope.$index, 'wide')"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="length" :label="$t('booking.weight')">
                <template slot-scope="scope">
                  <el-input
                    type="number"
                    v-model="scope.row.length"
                    :disabled="scope.row.sizeType != 'EXTRA_SIZE'"
                    @keyup.native="checkNumInt(scope.row.length, scope.$index, 'length')"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="high" :label="$t('booking.weight')">
                <template slot-scope="scope">
                  <el-input
                    type="number"
                    v-model="scope.row.high"
                    :disabled="scope.row.sizeType != 'EXTRA_SIZE'"
                    @keyup.native="checkNumInt(scope.row.high, scope.$index, 'high')"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="weightOfEach" :label="$t('booking.weight')">
                <template slot-scope="scope">
                  <el-input
                    type="number"
                    v-model="scope.row.weightOfEach"
                    @keyup.native="checkNumfloat(scope.row.weightOfEach, scope.$index, 'weightOfEach')"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column width="50" align="center">
                <template slot-scope="scope">
                  <div class="table-op">
                    <div @click="delIt(scope.row, scope.$index)">
                      <i
                        class="el-icon-delete"
                        :style="bookingForm.propertyList.length > 1 ? 'color:#F25C5C;' : 'color: #ccc;cursor: no-drop;'"
                      ></i>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <div style="margin-bottom: 30px;margin-left: 10px;">
          <el-button type="primary" icon="el-icon-plus" circle @click="pushIt" />
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" style="width:250px;" @click="propertyListConfirm">{{ $t("booking.confirm") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { ftlCharge, placeOrder, placeOrderLTL, calculationOrder } from "../../api/booking";
import { getTruckType, findDistrictFullList, getGoodsProperty, getSenderList, getTransportList, myAccount } from "../../api/data";
import path from "path";

let self;

export default {
  directives: {
    "el-select-loadmore": {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector(".el-select-dropdown .el-select-dropdown__wrap");
        SELECTWRAP_DOM.addEventListener("scroll", function() {
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        });
      },
    },
  },
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    const validatorSenderAddress = (rule, value, callback) => {
      if (!value.pickAt || !value.name || !value.mobile || !value.addressDetail || !value.code) {
        callback(new Error(""));
      } else {
        callback();
      }
    };
    const validatorReceiverAddress = (rule, value, callback) => {
      if (!value.name || !value.mobile || !value.addressDetail || !value.code) {
        callback(new Error(""));
      } else {
        callback();
      }
    };
    const validatorPropertyListDialog = (rule, value, callback) => {
      for (let x in value) {
        if (
          !value[x].propertyType ||
          !value[x].name ||
          !value[x].number ||
          !value[x].unit ||
          !value[x].sizeType ||
          !value[x].weightOfEach ||
          (value[x].sizeType && value[x].sizeType == "EXTRA_SIZE" && (!value[x].high || !value[x].length || !value[x].wide))
        ) {
          callback(new Error(" "));
        } else if (x == value.length - 1) {
          callback();
        }
      }
    };
    const validatorPropertyList = (rule, value, callback) => {
      if (self.propertyListContent.length > 0) {
        callback();
      } else {
        callback(new Error(" "));
      }
    };
    return {
      bookingForm: {
        orderInfo: {
          lineType: "",
          outNumber: "",
          remark: "",
        },
        senderAddress: {
          pickAt: "",
          name: "",
          mobile: "",
          addressDetail: "",
          code: "",
        },
        receiverAddress: {
          name: "",
          mobile: "",
          addressDetail: "",
          code: "",
        },
        transportInfo: {
          companyName: "",
          ftlLineId: "",
          carType: "",
          carriage: "",
          supplyId: null,
        },
        chargeList: [],
        propertyList: [
          //   {
          //   propertyType: '',
          //   name: '',
          //   number: null,
          //   unit: '',
          //   sizeType: '',
          //   weightOfEach: null
          // }
        ],
      },
      bookingRules: {
        senderAddress: [{ required: true, trigger: "blur", validator: validatorSenderAddress }],
        receiverAddress: [
          {
            required: true,
            trigger: "blur",
            validator: validatorReceiverAddress,
          },
        ],
        propertyList: [
          {
            required: true,
            trigger: "change",
            validator: validatorPropertyList,
          },
        ],
      },
      cargoRules: {
        propertyList: [
          {
            required: true,
            trigger: "change",
            validator: validatorPropertyListDialog,
          },
        ],
      },
      printSticker: false,
      documentReturn: false,
      liability: false,
      liabilityCon: null,
      liabilitySelect: "PCS",
      loading: false,
      unloading: false,
      time: "00:00:00",
      searchloading: false,
      pickUpQuery: "",
      pickUpRegionList: [],
      delRegionList: [],
      delQuery: "",
      isLast: false,
      page: 0,
      curSelect: "",
      categoryList: [],
      subCategoryList: [],
      supplyList: [],
      shareTruck: false,
      cargoShape: "1",
      cargoShapeList: [{}, {}, {}, {}, {}, {}, {}, {}],
      amountList: [],
      sizeDialog: false,
      size_width: null,
      size_length: null,
      size_height: null,
      sizeCurIndex: null,
      logisticType: [
        {
          value: "FTL",
          label: "FTL",
        },
        {
          value: "LTL",
          label: "LTL",
        },
      ],
      senderList: [],
      senderIndex: null,
      consultInfo: {},
      currentBalance: null,
      todoLoading: false,
      propertyListContent: "",
      cargoListDialog: false,
      cargoTip: [
        {
          unit: "Dimension(cm)",
          ss: "0.01-90",
          s: "90.01-110",
          m: "110.01-130",
          l: "130.01-150",
          xl: "150.01-170",
          eSize: ">170.00",
        },
        {
          unit: "Weight(kg)",
          ss: "0.01-10",
          s: "10.01-20",
          m: "20.01-30",
          l: "30.01-40",
          xl: "40.01-50",
          eSize: ">50",
        },
      ],
      propertyTypeList: [],
      sizeTypeList: [],
      unitList: [],
      propertyTypeListObj: {},
      sizeTypeListObj: {},
      unitListObj: {},
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    shareTruck(val) {
      if (val) {
        self.bookingForm.chargeList[0].chargeIntro = self.cargoShape;
      } else {
        self.bookingForm.chargeList[0].chargeIntro = "false";
      }
    },
    cargoShape(val) {
      if (self.shareTruck) {
        self.bookingForm.chargeList[0].chargeIntro = val;
      }
    },
    documentReturn(val) {
      if (val) {
        self.amountList.push({
          key: "RETURN_DOCUMENT",
          amount: 0,
          label: self.$t("booking.documentReturn"),
        });
      } else {
        self.amountWatch("RETURN_DOCUMENT");
      }
    },
    printSticker(val) {
      if (val) {
        self.amountList.push({
          key: "PRINT_STICKER",
          amount: 0,
          label: self.$t("booking.printSticker"),
        });
      } else {
        self.amountWatch("PRINT_STICKER");
      }
    },
    loading(val) {
      if (val) {
        self.amountList.push({
          key: "LOADING",
          amount: self.consultInfo.data.loadingOrUnloadingHumanWorkDay * self.consultInfo.data.moneyPerDay,
          label: self.$t("booking.loading"),
        });
      } else {
        self.amountWatch("LOADING");
      }
    },
    unloading(val) {
      if (val) {
        self.amountList.push({
          key: "UNLOADING",
          amount: self.consultInfo.data.loadingOrUnloadingHumanWorkDay * self.consultInfo.data.moneyPerDay,
          label: self.$t("booking.unloading"),
        });
      } else {
        self.amountWatch("UNLOADING");
      }
    },
    liability(val) {
      if (val) {
        self.amountList.push({
          key: "INSURANCE",
          amount: 0,
          label: self.$t("booking.liability"),
        });
      } else {
        self.amountWatch("INSURANCE");
      }
    },
    "$store.getters.language"() {
      self.init();
    },
  },
  created() {
    self = this;
    let consultInfo = JSON.parse(localStorage.getItem("consultInfo"));
    self.consultInfo = consultInfo;
  },
  mounted() {
    // 卡车类型
    self.init();
    let consultInfo = self.consultInfo;
    if (consultInfo) {
      let booking = self.bookingForm;
      let type = consultInfo.logisticType;
      self.pickUpRegionList = consultInfo.pickUpRegionList;
      self.delRegionList = consultInfo.delRegionList;
      booking.orderInfo.lineType = type;
      booking.senderAddress.code = consultInfo.searchForm.pickUpRegion;
      // booking.senderAddress.code = 2100;
      booking.senderAddress.pickAt = consultInfo.searchForm.pickUpDate;
      self.time = consultInfo.time;
      self.propertyListContent = type == "LTL" ? consultInfo.searchForm.propertyListContent : "";
      booking.receiverAddress.code = consultInfo.searchForm.deliveryRegion;
      // booking.receiverAddress.code = 1111;
      booking.transportInfo.carType = consultInfo.searchForm.truckCategory;
      booking.transportInfo.carriage = consultInfo.searchForm.truckSubCategory;
      booking.transportInfo.companyName = consultInfo.data.supply.name;
      booking.transportInfo.ftlLineId = type == "FTL" ? consultInfo.data.ftlLineId : consultInfo.data.ltlLine.id;
      booking.transportInfo.ftlLineInstanceId = consultInfo.data.id;
      booking.transportInfo.supplyId = consultInfo.data.supplyId;
      booking.chargeList =
        type == "FTL"
          ? [
              {
                chargeType: "CARPOOL",
                chargeIntro: "false",
                money: 0,
              },
            ]
          : [];
      booking.propertyList = type == "FTL" ? [] : consultInfo.searchForm.propertyList;
      self.amountList.push({
        label: self.$t("booking.feight"),
        amount: type == "FTL" ? consultInfo.data.charge : consultInfo.data.money,
        key: "FREIGHT",
      });
    }
    // 寄件人列表
    getSenderList().then(res => {
      self.senderList = res.data;
    });
    // 运输公司列表
    getTransportList().then(res => {
      self.supplyList = res.data;
    });
    // 会员余额
    myAccount(localStorage.getItem("curRole")).then(res => {
      self.currentBalance = res.data.currentBalance;
    });
  },
  methods: {
    init() {
      getTruckType().then(res => {
        self.categoryList = res.data.categories;
        self.subCategoryList = res.data.subCategories;
        // 货物属性
        getGoodsProperty().then(res => {
          self.propertyTypeList = res.data.propertyType;
          self.sizeTypeList = res.data.sizeType;
          self.unitList = res.data.unit;
          let propertyTypeListObj = new Object();
          for (let i of self.propertyTypeList) {
            propertyTypeListObj[i.key] = i.trans;
          }
          self.propertyTypeListObj = propertyTypeListObj;
          let sizeTypeListObj = new Object();
          for (let i of self.sizeTypeList) {
            sizeTypeListObj[i.key] = i.trans;
          }
          self.sizeTypeListObj = sizeTypeListObj;
          let unitListObj = new Object();
          for (let i of self.unitList) {
            unitListObj[i.key] = i.trans;
          }
          self.unitListObj = unitListObj;
        });
      });
    },
    amountWatch(name) {
      for (let x in self.amountList) {
        if (self.amountList[x].key == name) {
          self.amountList.splice(x, 1);
        }
      }
    },
    pickUpMethod(query) {
      if (query !== "") {
        if (self.curSelect == "pk") {
          self.pickUpQuery = query;
        } else {
          self.delQuery = query;
        }
        self.searchloading = true;
        setTimeout(() => {
          self.searchloading = false;
          self.getdistrictFullList(query, self.page);
        }, 200);
      } else {
        self.regionList = [];
      }
    },
    loadmore() {
      if (!self.isLast) {
        self.page += 1;
        if (self.curSelect == "pk") {
          self.getdistrictFullList(self.pickUpQuery, self.page);
        } else {
          self.getdistrictFullList(self.delQuery, self.page);
        }
      }
    },
    getdistrictFullList(query, page) {
      findDistrictFullList({
        name: query,
        page: page,
      }).then(res => {
        self.isLast = res.data.last;
        if (!res.data.first) {
          if (self.curSelect == "pk") {
            self.pickUpRegionList = self.pickUpRegionList.concat(res.data.content);
          } else {
            self.delRegionList = self.delRegionList.concat(res.data.content);
          }
        } else {
          if (self.curSelect == "pk") {
            self.pickUpRegionList = res.data.content;
          } else {
            self.delRegionList = res.data.content;
          }
        }
      });
    },
    // 聚焦初始化
    clearSelect(type) {
      if (type == "pk") {
        self.pickUpQuery = "";
        self.curSelect = "pk";
      } else {
        self.delQuery = "";
        self.curSelect = "del";
      }
      self.page = 0;
      self.isLast = false;
    },
    // 选择寄件人
    senderSelect(val) {
      self.bookingForm.senderAddress.name = self.senderList[val].name;
      self.bookingForm.senderAddress.mobile = self.senderList[val].mobile;
      self.bookingForm.senderAddress.addressDetail = self.senderList[val].addressDetail;
    },
    // 下单
    todoIt() {
      this.$refs.bookingform.validate(valid => {
        if (valid) {
          self.todoLoading = true;
          self.bookingForm.chargeList.splice(1);
          self.bookingForm.senderAddress.pickAt = self.bookingForm.senderAddress.pickAt.split(" ")[0] + ` ${self.time}`;
          for (let x in self.amountList) {
            if (self.amountList[x].key != "FREIGHT") {
              self.bookingForm.chargeList.push({
                chargeType: self.amountList[x].key,
                chargeIntro: self.amountList[x].key == "INSURANCE" ? self.liabilitySelect : "true",
                money: self.amountList[x].amount,
              });
            }
          }
          if (self.bookingForm.orderInfo.lineType == "FTL") {
            placeOrder(self.bookingForm)
              .then(res => {
                self.todoLoading = false;
                self.$message.success(res.message);
                self.$router.replace("/tracking/FTL");
              })
              .catch(el => {
                self.todoLoading = false;
              });
          } else {
            self.bookingForm.ltlLineId = self.bookingForm.transportInfo.ftlLineId;
            self.bookingForm.outNumber = self.bookingForm.orderInfo.outNumber;
            self.bookingForm.remark = self.bookingForm.orderInfo.remark;
            console.log(self.bookingForm);
            // return;
            placeOrderLTL(self.bookingForm).then(res => {
              self.todoLoading = false;
              self.$message.success(res.message);
              // self.$router.replace('')
            });
          }
        }
      });
    },
    viewIt() {
      let transportInfo = self.bookingForm.transportInfo;
      ftlCharge({
        documentReturn: self.documentReturn,
        liability: self.liability,
        loading: self.loading,
        unloading: self.unloading,
        supply_id: 0,
        ftl_line_id: 140,
        truckCategory: transportInfo.carType,
        truckSubCategory: transportInfo.carriage,
      }).then(res => {
        self.amountList = res.data;
      });
    },
    checkNumInt(val, index, type) {
      val = val.split(".")[0];
      self.bookingForm.propertyList[index][type] = val;
    },
    checkNumfloat(obj, index, type) {
      obj = Number(obj.toString().match(/^\d+(?:\.\d{0,2})?/));
      self.searchForm.propertyList[index][type] = obj == 0 ? "" : obj;
    },
    // 新增一行货物清单
    pushIt() {
      self.bookingForm.propertyList.push({
        propertyType: "",
        name: "",
        number: null,
        unit: "",
        sizeType: "",
        weightOfEach: null,
      });
    },
    // 删除一行货物清单
    delIt(row, index) {
      if (self.bookingForm.propertyList.length > 1) {
        self
          .$confirm(this.$t("booking.aysDel"), this.$t("confirm.tips"), {
            confirmButtonText: this.$t("booking.delete"),
            cancelButtonText: this.$t("member.cancel"),
          })
          .then(() => {
            self.bookingForm.propertyList.splice(index, 1);
          })
          .catch(() => {});
      }
    },
    // 选择非额外尺寸时 删除长宽高属性
    sizeSelect(val, index) {
      if (val != "EXTRA_SIZE") {
        delete self.bookingForm.propertyList[index].high;
        delete self.bookingForm.propertyList[index].wide;
        delete self.bookingForm.propertyList[index].length;
        console.log(self.bookingForm.propertyList);
      }
    },
    // 货物清单确认
    propertyListConfirm() {
      this.$refs.cargoform.validate(valid => {
        if (valid) {
          self.cargoListDialog = false;
          self.propertyListContent = "";
          let list = self.bookingForm.propertyList;
          let content = "";
          for (let x in list) {
            content += `${parseInt(x) + 1}.${self.propertyTypeListObj[list[x].propertyType]} ${list[x].name} ${
              self.sizeTypeListObj[list[x].sizeType]
            } ${list[x].number}${self.unitListObj[list[x].unit]} `;
          }
          self.propertyListContent = content;
          self.bookingForm.ltlLineId = self.bookingForm.transportInfo.ftlLineId;
          self.bookingForm.outNumber = self.bookingForm.orderInfo.outNumber;
          self.bookingForm.remark = self.bookingForm.orderInfo.remark;
          self.bookingForm.senderAddress.pickAt = self.bookingForm.senderAddress.pickAt.split(" ")[0] + ` ${self.time}`;
          calculationOrder(self.bookingForm).then(res => {
            console.log(res);
            for (let i of self.amountList) {
              if (i.key == "FREIGHT") {
                i.amount = res.data.orderMoney;
              }
            }
          });
        }
      });
    },
    toTopUp() {
      self.$router.replace("/billing/topUp");
    },
    goBack() {
      if (self.bookingForm.orderInfo.lineType == "LTL") {
        self.consultInfo.searchForm.propertyList = self.bookingForm.propertyList;
        self.consultInfo.searchForm.propertyListContent = self.propertyListContent;
        localStorage.setItem("consultInfo", JSON.stringify(self.consultInfo));
      }
      self.$router.replace({
        path: "/booking/priceConsulting",
        query: { return: 1 },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
.manage {
  padding: 20px;
  box-sizing: border-box;
  .itemRow {
    border-top: 1px solid #dfe4ed;
    padding: 10px;
    box-sizing: border-box;
  }
  .table-op {
    display: flex;
    align-items: center;
    font-size: 20px;
    color: #168bd5;
    div {
      width: 100%;
      text-align: center;
      cursor: pointer;
    }
  }

  .el_item {
    position: relative;

    .el_item_icon {
      position: absolute;
      right: 20%;
      z-index: 1;
      width: 35px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      top: -42px;
      cursor: pointer;

      .pick_up_location_svg {
        width: 20px;
        height: 20px;
      }

      .cargo_edit {
        font-size: 20px;
        color: #45a3df;
      }
    }
  }
}
.inputWidth {
  width: 80%;
}
.inputBottom {
  margin-bottom: 20px;
}
</style>

<style>
.booking .el-input-group__append {
  width: 40%;
}
</style>
