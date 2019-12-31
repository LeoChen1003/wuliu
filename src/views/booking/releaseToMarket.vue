<template>
  <div class="manage booking">
    <div style="display:flex;align-items:center;margin-bottom:15px;">
      <el-button
        icon="el-icon-arrow-left
"
        @click="$router.go(-1)"
        >{{ $t("booking.back") }}</el-button
      >
    </div>
    <el-form ref="releaseform" :model="releaseForm" :rules="releaseRules" :show-message="false" label-position="top" size="small">
      <el-row class="itemRow" style="border-top: 1px solid #dfe4ed;">
        <el-col :span="8">
          <el-form-item :label="$t('booking.logisiticsType')">
            <el-select
              v-model="releaseForm.orderInfo.lineType"
              disabled
              :placeholder="$t('placeholder.pleaseChoose')"
              class="inputWidth"
            >
              <el-option v-for="item in logisticType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="transportInfo" :label="$t('booking.truckType')">
            <div class="inputWidth" style="display:flex;">
              <el-select
                v-model="releaseForm.transportInfo.carType"
                :placeholder="$t('placeholder.pleaseChoose')"
                style="margin-right:5px;"
              >
                <el-option v-for="item in categoryList" :key="item.key" :label="item.value" :value="item.key" />
              </el-select>
              <el-select v-model="releaseForm.transportInfo.carriage" :placeholder="$t('placeholder.pleaseChoose')">
                <el-option v-for="item in subCategoryList" :key="item.key" :label="item.value" :value="item.key" />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item prop="pickAt" :label="$t('booking.pickupTime')">
            <div class="inputWidth" style="display:flex;">
              <!-- <el-date-picker v-model="releaseForm.senderAddress.pickAt"
                              type="date"
                              value-format='yyyy-MM-dd'
                              style="margin-right:5px;"
                              :placeholder="$t('placeholder.chooseDate')">
              </el-date-picker> -->
              <bcTime @changeBCtime="changeBCtime" :dateDefault="pickDateDefault" style="margin-right:5px;"></bcTime>
              <el-time-picker
                v-model="time"
                format="HH:mm:ss"
                value-format="HH:mm:ss"
                :placeholder="$t('placeholder.chooseTime')"
              >
              </el-time-picker>
            </div>
          </el-form-item>
          <el-form-item prop="receiveAt" :label="$t('booking.expectedDeliveryTime')">
            <div class="inputWidth" style="display:flex;">
              <bcTime @changeBCtime="changeBCtimeReceive" :dateDefault="[]" style="margin-right:5px;"></bcTime>
              <el-time-picker
                v-model="receive_time"
                format="HH:mm:ss"
                value-format="HH:mm:ss"
                :placeholder="$t('placeholder.chooseTime')"
              >
              </el-time-picker>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
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
          <el-form-item prop="senderAddress" :label="$t('booking.pickupPoint')">
            <el-input
              :placeholder="$t('placeholder.placeEnterSenderName')"
              v-model="releaseForm.senderAddress.name"
              class="inputWidth inputBottom"
            ></el-input>
            <el-input
              :placeholder="$t('placeholder.pleaseEnterTelNumber')"
              v-model="releaseForm.senderAddress.mobile"
              class="inputWidth inputBottom"
            ></el-input>
            <el-input
              :placeholder="$t('member.address')"
              v-model="releaseForm.senderAddress.addressDetail"
              class="inputWidth inputBottom"
            ></el-input>
            <el-select
              v-model="releaseForm.senderAddress.code"
              filterable
              remote
              reserve-keyword
              class="inputWidth"
              v-el-select-loadmore="loadmore"
              :placeholder="$t('member.region')"
              :remote-method="pickUpMethod"
              @focus="clearSelect('pk')"
              :loading="searchloading"
            >
              <el-option v-for="item in pickUpRegionList" :key="item.code" :label="item.fullname" :value="item.code"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="orderInfo" :label="$t('booking.price')">
            <el-input
              v-model.number="releaseForm.orderInfo.settlementAmount"
              type="number"
              @change="moneyChange"
              class="inputWidth"
            />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item prop="receiverAddress" :label="$t('booking.destination')">
            <el-input
              :placeholder="$t('placeholder.pleaseEnterRecipieName')"
              v-model="releaseForm.receiverAddress.name"
              class="inputWidth inputBottom"
            ></el-input>
            <el-input
              :placeholder="$t('placeholder.pleaseEnterTelNumber')"
              v-model="releaseForm.receiverAddress.mobile"
              class="inputWidth inputBottom"
            ></el-input>
            <el-input
              :placeholder="$t('member.address')"
              v-model="releaseForm.receiverAddress.addressDetail"
              class="inputWidth inputBottom"
            ></el-input>
            <el-select
              v-model="releaseForm.receiverAddress.code"
              filterable
              remote
              reserve-keyword
              @focus="clearSelect('del')"
              class="inputWidth"
              v-el-select-loadmore="loadmore"
              :placeholder="$t('member.region')"
              :remote-method="pickUpMethod"
              :loading="searchloading"
            >
              <el-option v-for="item in delRegionList" :key="item.code" :label="item.fullname" :value="item.code"> </el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item :label="$t('booking.valueAddedService')">
            <el-checkbox
              v-model="unloading"
              class="inputWidth inputBottom"
              style="margin-left: 10px;"
              :label="$t('booking.unloading')"
              border
            ></el-checkbox>
            <el-checkbox v-model="loading" class="inputWidth inputBottom" :label="$t('booking.loading')" border></el-checkbox>
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
          </el-form-item>
          <el-form-item :label="$t('booking.referenceNo')">
            <el-input v-model="releaseForm.orderInfo.outNumber" class="inputWidth" />
          </el-form-item>
          <el-form-item :label="$t('booking.remarks')">
            <el-input v-model="releaseForm.orderInfo.remark" type="textarea" class="inputWidth" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="itemRow">
        <!-- <el-col :span="8">
          <el-form-item :label="$t('booking.shareTruck')">
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
          </el-form-item>
        </el-col> -->
        <el-col :span="8"> </el-col>
      </el-row>
      <el-row class="itemRow">
        <!-- 收货地址列表 -->
        <el-form-item prop="receiverAddressList">
          <div style="display:flex;align-items: flex-end;">
            <el-table :data="releaseForm.receiverAddressList" border :header-cell-style="headerCellStyle" style="width:95%;">
              <el-table-column prop="name" :label="$t('booking.destination')">
                <template slot-scope="scope">
                  <el-input :placeholder="$t('placeholder.pleaseEnterRecipieName')" v-model="scope.row.name"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="mobile">
                <template slot-scope="scope">
                  <el-input :placeholder="$t('placeholder.pleaseEnterTelNumber')" v-model="scope.row.mobile"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="addressDetail">
                <template slot-scope="scope">
                  <el-input :placeholder="$t('member.address')" v-model="scope.row.addressDetail"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="code">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.code"
                    filterable
                    remote
                    reserve-keyword
                    @focus="clearSelect('del')"
                    class="inputWidth"
                    v-el-select-loadmore="loadmore"
                    :placeholder="$t('member.region')"
                    :remote-method="pickUpMethod"
                    :loading="searchloading"
                  >
                    <el-option v-for="item in delRegionList" :key="item.code" :label="item.fullname" :value="item.code">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="propertyList" :label="$t('booking.cargoList')">
                <template slot-scope="scope">
                  <div class="el_item edit_input">
                    <el-input
                      type="text"
                      :value="scope.row.propertyListContent"
                      :placeholder="$t('booking.cargoList')"
                      style="width:100%;"
                    />
                    <div class="el_item_icon" @click="showCargoListDialog(scope.row, scope.$index)">
                      <i class="el-icon-edit cargo_edit"></i>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="50" align="center">
                <template slot-scope="scope">
                  <div class="table-op">
                    <div @click="addressDel(scope.row, scope.$index)">
                      <i
                        class="el-icon-delete"
                        :style="releaseForm.receiverAddressList.length > 1 ? 'color:#F25C5C;' : 'color: #ccc;cursor: no-drop;'"
                      ></i>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin-bottom: 10px;margin-left: 10px;">
              <el-button type="primary" icon="el-icon-plus" circle @click="addressPush" />
            </div>
          </div>
        </el-form-item>
      </el-row>
    </el-form>
    <div style="display:flex;justify-content:flex-end;align-items:center;margin-bottom:15px;margin-top:30px;">
      <el-button
        style="width:200px;"
        @click="todoIt"
        :loading="todoLoading"
        :disabled="!permissions.DemandNewOrderOrRelease"
        type="primary"
        >{{ $t("booking.releaseToMarket") }}</el-button
      >
    </div>
    <!-- 货物清单 dialog -->
    <el-dialog :visible.sync="cargoListDialog" :title="$t('booking.cargoList')" width="1250px" center>
      <!-- size 说明 -->
      <el-table :data="cargoTip" border style="width:730px;margin-bottom:20px;">
        <el-table-column width="130">
          <template slot-scope="scope">{{ $t(`booking.${scope.row.unit}`) }}</template>
        </el-table-column>
        <el-table-column prop="ss" label="Size-SS" width="100"></el-table-column>
        <el-table-column prop="s" label="Size-S" width="100"></el-table-column>
        <el-table-column prop="m" label="Size-M" width="100"></el-table-column>
        <el-table-column prop="l" label="Size-L" width="100"></el-table-column>
        <el-table-column prop="xl" label="Size-XL" width="100"></el-table-column>
        <el-table-column prop="eSize" label="Extra size" width="100"></el-table-column>
      </el-table>
      <!-- 清单列表 -->
      <div style="display:flex;align-items: flex-end;">
        <el-form ref="cargoform" :model="itemForm" :rules="cargoRules" :show-message="false" style="width:95%;">
          <el-form-item prop="propertyList">
            <el-table border :data="itemForm.propertyList">
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
              <el-table-column prop="wide" :label="$t('booking.width')">
                <template slot-scope="scope">
                  <el-input
                    type="number"
                    v-model="scope.row.wide"
                    :disabled="scope.row.sizeType != 'EXTRA_SIZE'"
                    @keyup.native="checkNumInt(scope.row.wide, scope.$index, 'wide')"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="length" :label="$t('booking.Length')">
                <template slot-scope="scope">
                  <el-input
                    type="number"
                    v-model="scope.row.length"
                    :disabled="scope.row.sizeType != 'EXTRA_SIZE'"
                    @keyup.native="checkNumInt(scope.row.length, scope.$index, 'length')"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="high" :label="$t('booking.height')">
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
                    :disabled="scope.row.sizeType != 'EXTRA_SIZE'"
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
                        :style="itemForm.propertyList.length > 1 ? 'color:#F25C5C;' : 'color: #ccc;cursor: no-drop;'"
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
import { mapGetters } from "vuex";
import { releaseOrder } from "../../api/booking";
import { getTruckType, findDistrictFullList, getGoodsProperty, getSenderList, getTransportList } from "../../api/data";
import bcTime from "@/components/bcTime";

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
  components: { bcTime },
  data() {
    const validatorOrderInfo = (rule, value, callback) => {
      if (!value.settlementAmount) {
        callback(new Error(""));
      } else {
        callback();
      }
    };
    const validatorSenderAddress = (rule, value, callback) => {
      if (!value.name || !value.mobile || !value.addressDetail || !value.code) {
        callback(new Error(""));
      } else {
        callback();
      }
    };
    const validatorpickAt = (rule, value, callback) => {
      if (!self.time_at) {
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
    const validatorPropertyList = (rule, value, callback) => {
      for (let x in value) {
        if (
          !value[x].propertyType ||
          !value[x].name ||
          !value[x].number ||
          !value[x].unit ||
          !value[x].sizeType ||
          (value[x].sizeType &&
            value[x].sizeType == "EXTRA_SIZE" &&
            (!value[x].weightOfEach || !value[x].high || !value[x].length || !value[x].wide))
        ) {
          callback(new Error(" "));
        } else if (x == value.length - 1) {
          callback();
        }
      }
    };
    const validatorTransportInfo = (rule, value, callback) => {
      if (!value.carType) {
        callback(new Error(""));
      } else {
        callback();
      }
    };
    return {
      releaseForm: {
        orderInfo: {
          lineType: "FTL",
          outNumber: "",
          remark: "",
          settlementAmount: null,
        },
        senderAddress: {
          pickAt: "",
          name: "",
          mobile: "",
          addressDetail: "",
          code: "",
        },
        // receiverAddress: {
        //   receiveAt: "",
        //   name: "",
        //   mobile: "",
        //   addressDetail: "",
        //   code: "",
        // },
        receiverAddressList: [
          {
            name: "",
            mobile: "",
            addressDetail: "",
            code: "",
            propertyList: [{}],
            propertyListContent: "",
          },
        ],
        transportInfo: {
          carType: "",
          carriage: "",
        },
        chargeList: [
          {
            chargeType: "CARPOOL",
            chargeIntro: "false",
            money: 0,
          },
        ],
      },
      releaseRules: {
        senderAddress: [
          {
            required: true,
            trigger: "change",
            validator: validatorSenderAddress,
          },
        ],
        receiverAddress: [
          {
            required: true,
            trigger: "change",
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
        transportInfo: [
          {
            required: true,
            trigger: "change",
            validator: validatorTransportInfo,
          },
        ],
        pickAt: [{ required: true, trigger: "change", validator: validatorpickAt }],
        receiveAt: [{ required: true, trigger: "change", validator: validatorpickAt }],
      },
      documentReturn: false,
      liability: false,
      liabilityCon: null,
      liabilitySelect: "PCS",
      loading: false,
      unloading: false,
      time: "",
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
      propertyTypeList: [],
      sizeTypeList: [],
      unitList: [],
      propertyTypeListObj: {},
      sizeTypeListObj: {},
      unitListObj: {},
      shareTruck: false,
      cargoShape: "1",
      cargoShapeList: [{}, {}, {}, {}, {}, {}, {}, {}],
      amountList: [],
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
      todoLoading: false,
      time_at: "",
      receive_time_at: "",
      receive_time: "",
      releaseInfo: {},
      pickDateDefault: [],
      cargoListDialog: false,
      cargoTip: [
        {
          unit: "Dimension",
          ss: "0.01-90",
          s: "90.01-110",
          m: "110.01-130",
          l: "130.01-150",
          xl: "150.01-170",
          eSize: ">170.00",
        },
        {
          unit: "Weight",
          ss: "0.01-10",
          s: "10.01-20",
          m: "20.01-30",
          l: "30.01-40",
          xl: "40.01-50",
          eSize: ">50",
        },
      ],
      itemForm: {},
      curCargoIndex: null,
      cargoRules: {
        propertyList: [
          {
            required: true,
            trigger: "change",
            validator: validatorPropertyList,
          },
        ],
      },
    };
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapGetters(["permissions"]),
  },
  // 监控data中的数据变化
  watch: {
    shareTruck(val) {
      if (val) {
        self.releaseForm.chargeList[0].chargeIntro = self.cargoShape;
      } else {
        self.releaseForm.chargeList[0].chargeIntro = "false";
      }
    },
    cargoShape(val) {
      if (self.shareTruck) {
        self.releaseForm.chargeList[0].chargeIntro = val;
      }
    },
    documentReturn(val) {
      if (val) {
        self.amountList.push({
          key: "RETURN_DOCUMENT",
          amount: 10,
          label: self.$t("booking.documentReturn"),
        });
      } else {
        self.amountWatch("RETURN_DOCUMENT");
      }
    },
    loading(val) {
      if (val) {
        self.amountList.push({
          key: "LOADING",
          amount: 0,
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
          amount: 0,
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
    time_at(val) {
      console.log(val);
      let t = self.time ? self.time : "23:59:59";
      self.releaseForm.senderAddress.pickAt = val + ` ${t}`;
    },
    time(val) {
      let t = val ? val : "23:59:59";
      self.releaseForm.senderAddress.pickAt = self.time_at + ` ${val}`;
    },
    receive_time_at(val) {
      let t = self.receive_time ? self.receive_time : "23:59:59";
      self.releaseForm.receiverAddressList[0].receiveAt = val + ` ${t}`;
    },
    receive_time(val) {
      let t = val ? val : "23:59:59";
      self.releaseForm.receiverAddressList[0].receiveAt = self.receive_time_at + ` ${val}`;
    },
  },
  created() {
    self = this;
    let releaseInfo = JSON.parse(localStorage.getItem("releaseInfo"));
    self.releaseInfo = releaseInfo;
    self.pickDateDefault = releaseInfo.searchForm.pickUpDate.split("-").map(Number);
  },
  mounted() {
    let releaseInfo = self.releaseInfo;
    if (releaseInfo) {
      let release = self.releaseForm;
      let type = releaseInfo.logisticType;
      self.pickUpRegionList = releaseInfo.pickUpRegionList;
      self.delRegionList = releaseInfo.delRegionList;
      release.orderInfo.lineType = type;
      release.senderAddress.code = releaseInfo.searchForm.pickUpRegion;
      self.time_at = releaseInfo.searchForm.pickUpDate;
      self.time = releaseInfo.time;
      // release.receiverAddress.code = releaseInfo.searchForm.deliveryRegion;
    }
    // 卡车类型
    getTruckType().then(res => {
      self.categoryList = res.data.categories;
      self.subCategoryList = res.data.subCategories;
    });
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
    // 寄件人列表
    getSenderList().then(res => {
      self.senderList = res.data;
    });
  },
  methods: {
    headerCellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 1) {
        return "border-right:none;";
      }
    },
    amountWatch(name) {
      for (let x in self.amountList) {
        if (self.amountList[x].key == name) {
          self.amountList.splice(x, 1);
        }
      }
    },
    changeBCtime(time) {
      self.time_at = time;
    },
    changeBCtimeReceive(time) {
      self.receive_time_at = time;
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
      self.releaseForm.senderAddress.name = self.senderList[val].name;
      self.releaseForm.senderAddress.mobile = self.senderList[val].mobile;
      self.releaseForm.senderAddress.addressDetail = self.senderList[val].addressDetail;
      self.releaseForm.senderAddress.code = self.senderList[val].code;
      self.curSelect = "pk";
      self.pickUpRegionList = [
        {
          code: self.senderList[val].code,
          fullname: self.senderList[val].fullName,
        },
      ];
    },
    // 下单
    todoIt() {
      this.$refs.releaseform.validate(valid => {
        if (valid) {
          self.todoLoading = true;
          self.releaseForm.chargeList.splice(1);
          // self.releaseForm.senderAddress.pickAt += ' ' + self.time
          for (let x in self.amountList) {
            self.releaseForm.chargeList.push({
              chargeType: self.amountList[x].key,
              chargeIntro: self.amountList[x].key == "INSURANCE" ? self.liabilitySelect : "true",
              money: self.amountList[x].key == "INSURANCE" ? self.liabilityCon : 0,
            });
          }
          if (self.releaseForm.orderInfo.settlementAmount == "" || self.releaseForm.orderInfo.settlementAmount == null) {
            self.releaseForm.orderInfo.settlementAmount = 0;
          }
          releaseOrder(self.releaseForm)
            .then(res => {
              self.todoLoading = false;
              self.$message.success(res.message);
              self.$router.replace("/tracking/FTL");
            })
            .catch(el => {
              self.todoLoading = false;
            });
        }
      });
    },
    // 增加派件点
    addressPush() {
      self.releaseForm.receiverAddressList.push({
        name: "",
        mobile: "",
        addressDetail: "",
        code: "",
        propertyList: [{}],
        propertyListContent: "",
      });
    },
    // 删除一个派件点
    addressDel(row, index) {
      self
        .$confirm(this.$t("booking.aysDel"), this.$t("confirm.tips"), {
          confirmButtonText: this.$t("booking.delete"),
          cancelButtonText: this.$t("member.cancel"),
        })
        .then(() => {
          self.releaseForm.receiverAddressList.splice(index, 1);
        })
        .catch(() => {});
    },
    // 编辑货物清单
    showCargoListDialog(item, index) {
      self.cargoListDialog = true;
      self.curCargoIndex = index;
      self.itemForm = item;
    },
    // 增加货物
    pushIt() {
      self.itemForm.propertyList.push({
        propertyType: "",
        name: "",
        number: null,
        unit: "",
        sizeType: "",
        weightOfEach: null,
      });
    },
    // 删除一行货物
    delIt(row, index) {
      self
        .$confirm(this.$t("booking.aysDel"), this.$t("confirm.tips"), {
          confirmButtonText: this.$t("booking.delete"),
          cancelButtonText: this.$t("member.cancel"),
        })
        .then(() => {
          self.itemForm.propertyList.splice(index, 1);
        })
        .catch(() => {});
    },
    moneyChange(e) {
      if (e < 0) {
        self.releaseForm.orderInfo.settlementAmount = null;
      } else if (e > 1000000) {
        self.releaseForm.orderInfo.settlementAmount = 1000000;
      }
    },
    // 选择非额外尺寸时 删除长宽高属性
    sizeSelect(val, index) {
      if (val != "EXTRA_SIZE") {
        delete self.itemForm.propertyList[index].high;
        delete self.itemForm.propertyList[index].wide;
        delete self.itemForm.propertyList[index].length;
      }
    },
    // 货物清单确认
    propertyListConfirm() {
      this.$refs.cargoform.validate(valid => {
        if (valid) {
          self.cargoListDialog = false;
          self.itemForm.propertyListContent = "";
          let list = self.itemForm.propertyList;
          let content = "";
          for (let x in list) {
            content += `${parseInt(x) + 1}.${self.propertyTypeListObj[list[x].propertyType]} ${list[x].name} ${
              self.sizeTypeListObj[list[x].sizeType]
            } ${list[x].number}${self.unitListObj[list[x].unit]} `;
          }
          self.itemForm.propertyListContent = content;
          self.releaseForm.receiverAddressList[self.curCargoIndex] = self.itemForm;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
.manage {
  padding: 20px;
  padding-top: 0px;
  box-sizing: border-box;

  .go_back {
    width: 22px;
    height: 22px;
    cursor: pointer;

    .back_svg {
      width: 100%;
      height: 100%;
    }
  }

  .itemRow {
    // border-top: 1px solid #dfe4ed;
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
      right: 0;
      z-index: 1;
      width: 35px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;

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
  margin-bottom: 5px;
}
</style>

<style>
.booking .el-input-group__append {
  width: 40%;
}
.edit_input .el-input__inner {
  padding: 0 30px 0 15px;
}
</style>
