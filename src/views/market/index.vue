<template>
  <div class="wrapper">
    <div class="container">
      <div class="searchBox">
        <el-form ref="searchForm" inline :show-message="false" :model="searchForm">
          <el-form-item :label="$t('market.origin')">
            <div class="form-item">
              <el-button size="mini" @click="showProDialog('origin')" style="margin-right:5px;" icon="el-icon-more"></el-button>
              <el-select v-model="searchForm.pickUpRegion" class="formSelect" clearable filterable placeholder="province">
                <el-option v-for="(item, index) in provinceList" :key="index" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item :label="$t('market.destinaiton')">
            <div class="form-item">
              <el-button
                size="mini"
                @click="showProDialog('destinaiton')"
                style="margin-right:5px;"
                icon="el-icon-more"
              ></el-button>
              <el-select v-model="searchForm.deliveryRegion" clearable class="formSelect" filterable placeholder="province">
                <el-option v-for="(item, index) in provinceList" :key="index" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item :label="$t('market.pickupDate')">
            <bc-picker @changeBCtime="dateChange" style="margin-right:5px;"></bc-picker>
          </el-form-item>
          <el-form-item :label="$t('market.truckType')">
            <el-select v-model="searchForm.truckCategory" clearable filterable class="formSelect" placeholder="Truck type">
              <el-option
                v-for="(item, index) in truckTypes.categories"
                :key="index"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchIt">{{ $t("market.search") }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="data.content" v-loading="tableLoading" border>
        <el-table-column :label="$t('market.pickupTime')">
          <template slot-scope="scope" v-if="scope.row.senderAddress">
            <div>
              {{ scope.row.senderAddress.pickAt }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('tracking.route')">
          <template slot-scope="scope" v-if="scope.row.senderAddress && scope.row.receiverAddressList">
            <div v-for="(receiverAddress, index) in scope.row.receiverAddressList" :key="index">
              <div>{{ scope.row.senderAddress.province }}-->{{ receiverAddress.province }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('tracking.truckType')">
          <template slot-scope="scope">
            <div>{{ truckObj[scope.row.transport.carType] }}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column :label="$t('tracking.cargo')">
          <template slot-scope="scope">
            <el-card v-for="(item,index) in scope.row.propertyList"
                     :key="index">
              <div>{{propertyObj[item.propertyType]}}</div>
              <div>{{item.number}} {{unitObj[item.unit]}} {{item.name}} {{sizeObj[item.sizeType]}}</div>
            </el-card>
          </template>
        </el-table-column> -->
        <el-table-column :label="$t('tracking.remarks')">
          <template slot-scope="scope">
            <div>{{ scope.row.remark }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('tracking.price')">
          <template slot-scope="scope">
            <div>
              {{ scope.row.settlementAmount > 0 ? scope.row.settlementAmount : "" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <div style="text-align:center;">
              <el-button type="primary" :disabled="!permissions.SupplyQuoteOrder" @click="toquotePrice(scope.row)">{{
                $t("market.quoteAPrice")
              }}</el-button>
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
    <el-dialog :title="$t('market.quoteAPrice')" :visible.sync="quotePriceDialog" top="1vh" center width="60%">
      <div>
        <el-form
          :model="quotePriceForm"
          :rules="quotePriceRule"
          :show-message="false"
          size="small"
          label-position="top"
          ref="quotePriceForm"
          class="quotePrice"
        >
          <div style="display:flex;">
            <div style="width:50%;">
              <el-form-item :label="$t('booking.pickupTime')">
                <el-date-picker v-model="quotePriceCon.senderAddress.pickAt" class="inp" disabled type="datetime">
                </el-date-picker>
              </el-form-item>
              <el-form-item prop="receiveAt" :label="$t('booking.expectedDeliveryTime')" v-if="quotePriceCon.receiverAddressList">
                <el-date-picker v-model="quotePriceCon.receiverAddressList[0].receiveAt" class="inp" disabled type="datetime">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label="$t('booking.truckType')">
                <el-select
                  v-model="quotePriceCon.transport.carType"
                  class="inp"
                  disabled
                  :placeholder="$t('placeholder.pleaseChoose')"
                >
                  <el-option v-for="item in truckTypes.categories" :key="item.key" :label="item.value" :value="item.key" />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('booking.sender')">
                <el-input v-model="quotePriceCon.senderAddress.name" class="inp" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('booking.pickupPoint')">
                <el-input v-model="quotePriceCon.senderAddress.name" class="inp" disabled></el-input>
                <!-- <el-input v-model="quotePriceCon.senderAddress.mobile"
                        class="inp"
                        disabled></el-input> -->
                <el-input v-model="quotePriceCon.senderAddress.addressDetail" class="inp" disabled></el-input>
                <el-input
                  type="textarea"
                  resize="none"
                  v-model="quotePriceCon.senderAddress.fullName"
                  class="inp"
                  disabled
                ></el-input>
              </el-form-item>
              <!-- <el-form-item :label="$t('booking.shareTruck')">
              <el-radio-group v-model="shareTruck"
                              disabled>
                <el-radio :label="false">{{$t('booking.fullTruckLoad')}}</el-radio>
                <el-radio :label="true">{{$t('booking.sharetruckLoad')}}</el-radio>
              </el-radio-group>
            </el-form-item> -->
            </div>
            <div style="width:50%;">
              <el-form-item :label="$t('booking.remarks')">
                <el-input v-model="quotePriceCon.remark" disabled type="textarea" resize="none" class="inp" />
              </el-form-item>
              <el-form-item :label="$t('booking.valueAddedService')">
                <el-tag
                  v-for="item in quotePriceCon.chargeList"
                  :key="item.id"
                  v-if="item.chargeType != 'CARPOOL'"
                  type="info"
                  style="margin-right:5px;"
                >
                  {{ serveObj[item.chargeType] }}
                </el-tag>
              </el-form-item>
              <!-- <el-form-item :label="$t('booking.referenceNo')">
              <el-input v-model="quotePriceCon.outNumber"
                        disabled
                        class="inp" />
            </el-form-item> -->

              <el-form-item :label="$t('market.demandPrice')">
                <el-input v-model="quotePriceCon.settlementAmount" disabled class="inp" />
              </el-form-item>
              <el-form-item prop="money" :label="$t('booking.myQuotaion')">
                <el-input
                  v-model.number="quotePriceForm.money"
                  @mousewheel.native.prevent
                  @change="moneyChange"
                  type="number"
                  class="inp"
                />
              </el-form-item>
              <el-form-item prop="truck_id" :label="$t('market.licencePlate')">
                <el-select v-model="quotePriceForm.truck_id" @change="truckSelect" class="inp">
                  <el-option v-for="item in truckData" :key="item.id" :label="item.plate" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('market.truckType')">
                <el-select v-model="quotePriceForm.category" class="inp" disabled :placeholder="$t('placeholder.pleaseChoose')">
                  <el-option v-for="item in truckTypes.categories" :key="item.key" :label="item.value" :value="item.key" />
                </el-select>
                <el-select
                  v-model="quotePriceForm.subCategory"
                  class="inp"
                  disabled
                  :placeholder="$t('placeholder.pleaseChoose')"
                >
                  <el-option v-for="item in truckTypes.subCategories" :key="item.key" :label="item.value" :value="item.key" />
                </el-select>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <el-table
          :data="quotePriceCon.receiverAddressList ? quotePriceCon.receiverAddressList : []"
          style="width:100%;border-top:1px solid #ebeef5;margin-top:5px;"
        >
          <el-table-column :label="$t('booking.deliveryPoint')">
            <template slot-scope="scope">
              <div>
                {{ scope.row.name }}
                <!-- {{ scope.row.mobile }} -->
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

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="inp" :loading="confirmLoading" @click="quotePriceConfirm">{{
          $t("booking.confirm")
        }}</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="proDialog" :close-on-click-modal="false" width="600px">
      <el-tabs tabPosition="left" v-model="proActive">
        <el-tab-pane v-for="(item, index) in proArea" :key="index" :label="item.sortingNoTrans" :name="item.sortingNo">
          <el-button
            type="primary"
            class="proItem"
            @click="tapPro(pro)"
            :key="proInd"
            v-for="(pro, proInd) in proArea[index].provinceList"
            >{{ pro.name }}</el-button
          >
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="proDialog = false">{{ $t("route.cancel") }}</el-button>
        <el-button type="primary" @click="proDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { mapGetters } from "vuex";
import {
  getTruckType,
  getProvinceList,
  getCityList,
  getExtraServer,
  getGoodsProperty,
  getProvinceArea,
  getSupplyTD,
  getBcYear,
  getBcDay,
} from "../../api/data";
import { orderShop, quoteOrder } from "../../api/market.js";

let self;
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    const validatorTruck = (rule, value, callback) => {
      if (!self.quotePriceForm.truck_id) {
        callback(new Error(" "));
      } else {
        callback();
      }
    };
    return {
      proDialog: false,
      proActive: "B",
      data: {},
      provinceList: [],
      cityList: [],
      truckTypes: {
        categories: [],
        subCategories: [],
      },
      serveObj: {},
      propertyObj: {},
      sizeObj: {},
      unitObj: {},
      truckObj: {},
      searchForm: {
        pickUpRegion: "",
        deliveryRegion: "",
        pickUpDate: "",
        truckCategory: "",
        page: 0,
      },
      quotePriceDialog: false,
      quotePriceCon: {
        lineType: "FTL",
        outNumber: "",
        remark: "",
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
        transport: {
          companyName: "",
          ftlLineId: "",
          carType: "",
          carriage: "",
          supplyId: null,
        },
        chargeList: [],
        propertyList: [],
      },
      quotePriceForm: {
        money: null,
        truck_id: null,
        category: "",
        subCategory: "",
      },
      quotePriceRule: {
        money: [{ required: true, message: " ", trigger: "change" }],
        truck_id: [{ required: true, validator: validatorTruck }],
      },
      shareTruck: false,
      truckData: [],
      confirmLoading: false,
      proType: "origin",
      proArea: [],
      tableLoading: false,
    };
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapGetters(["permissions"]),
  },
  // 监控data中的数据变化
  watch: {
    "$store.getters.language"() {
      self.init();
    },
  },
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
    self.init();
    self.loadData();
  },
  methods: {
    init() {
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
      getProvinceArea().then(res => {
        self.proArea = res.data;
      });
    },
    loadData(cb) {
      self.tableLoading = true;
      self.searchForm.pickUpDate = self.searchForm.pickUpDate ? self.searchForm.pickUpDate : "";
      orderShop(self.searchForm).then(res => {
        self.data = res.data;
        self.tableLoading = false;
        if (cb) {
          cb();
        }
      });
    },
    pageChange(e) {
      self.searchForm.page = e - 1;
      self.loadData();
    },
    toquotePrice(row) {
      getSupplyTD().then(res => {
        self.truckData = res.data.trucks;
      });
      self.quotePriceDialog = true;
      this.$nextTick(() => {
        self.quotePriceCon = row;
      });
      self.quotePriceForm.money = null;
      self.quotePriceForm.truck_id = null;
      self.shareTruck = row.chargeList[0].chargeIntro == "false" ? false : true;
    },
    truckSelect(val) {
      self.truckData.forEach(item => {
        if (item.id == val) {
          self.quotePriceForm.category = item.category;
          self.quotePriceForm.subCategory = item.subCategory;
          return;
        }
      });
    },
    // 报价抢单
    quotePriceConfirm() {
      this.$refs.quotePriceForm.validate(valid => {
        if (valid) {
          self.confirmLoading = true;
          quoteOrder(self.quotePriceCon.id, self.quotePriceForm)
            .then(res => {
              self.$message.success(res.message);
              self.confirmLoading = false;
              self.quotePriceDialog = false;
              self.loadData();
            })
            .catch(() => {
              self.confirmLoading = false;
            });
        }
      });
    },
    searchIt() {
      // if (self.searchForm.pickUpRegion == "" || self.searchForm.deliveryRegion == "" || self.searchForm.pickUpDate == "") {
      //   return self.$message.warning(self.$t("market.theSearchTermCannotBeEmpty"));
      // }
      self.data = {};
      self.loadData();
    },
    dateChange(time) {
      self.searchForm.pickUpDate = time;
    },
    showProDialog(type) {
      self.proType = type;
      self.proDialog = true;
    },
    tapPro(pro) {
      if (self.proType == "origin") {
        self.searchForm.pickUpRegion = pro.name;
      } else {
        self.searchForm.deliveryRegion = pro.name;
      }
      self.proDialog = false;
    },
    moneyChange(e) {
      if (e < 0) {
        self.quotePriceForm.money = null;
      } else if (e > 1000000) {
        self.quotePriceForm.money = 1000000;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
.wrapper {
  box-sizing: border-box;
  padding: 20px;
  display: flex;
}
.searchBox {
  // box-sizing: border-box;
  // padding-right: 24px;
  // height: 100%;

  .form-item {
    width: 200px;
    display: flex;
  }

  .formSelect {
    width: 100%;
  }
}

.container {
  width: 100%;
}

.inp {
  width: 300px;
}

.proItem {
  margin: 0 10px 10px 0;
}

.innerInp {
  width: 130px;
}
</style>

<style lang="scss">
.quotePrice {
  .el-form-item {
    margin-bottom: 5px;
  }

  .el-form-item__label {
    padding: 0px;
  }
}
</style>
