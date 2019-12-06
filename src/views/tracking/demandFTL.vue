<template>
  <div class="manage">
    <div style="display:flex;box-sizing:border-box;padding:0 20px;">
      <!-- 导航 -->
      <div style="height:100%;">
        <div class="statusText">{{ $t("billing.billingStatus") }}</div>
        <el-tabs
          v-model="tabActive"
          tab-position="left"
          @tab-click="changeTab"
          style="height:calc(100% - 50px);"
        >
          <el-tab-pane name="WAITTING">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.Pending")
                  }}<sub class="badge">{{ statusCount.WAITTING }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="CANCELED">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.canceled")
                  }}<sub class="badge">{{ statusCount.CANCELED }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="WAIT_DEMAND_TO_ACCEPT">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.toBeconfirmedOrderbyDemand")
                  }}<sub class="badge red">{{
                    statusCount.WAIT_DEMAND_TO_ACCEPT
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
                  }}<sub class="badge">{{
                    statusCount.WAIT_SUPPLY_TO_ACCEPT
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
                  }}<sub class="badge">{{ statusCount.WILL_PICK }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="SENDING">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.intransit")
                  }}<sub class="badge">{{ statusCount.SENDING }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="WILL_RETURN">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.documentTobereturned")
                  }}<sub class="badge">{{ statusCount.WILL_RETURN }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="COMPLETE">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("tracking.completed")
                  }}<sub class="badge">{{ statusCount.COMPLETE }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 表格 -->
      <div class="container" v-loading="tableLoading">
        <el-table :data="data.content" style="width:98%;" border>
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
          <el-table-column :label="$t('tracking.supply')">
            <template slot-scope="scope">
              <div
                v-if="
                  !(tabActive == '0' || tabActive == '1') &&
                    scope.row.transport.supply
                "
              >
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
                  {{ truckObj[scope.row.transport.transport] }}
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
          <el-table-column :label="$t('tracking.remarks')">
            <template slot-scope="scope">
              <div>
                {{ scope.row.remark }}
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="tabActive != 'WAITTING'">
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
                  v-if="
                    scope.row.status == 'COMPLETE' && scope.row.rating == null
                  "
                  @click="rating(scope.row)"
                  >{{ $t("tracking.rating") }}</el-button
                >
                <el-rate
                  v-if="scope.row.status == 'COMPLETE' && scope.row.rating"
                  disabled
                  v-model="scope.row.rating.rating / 2"
                >
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
      :title="$t('tracking.confirm')"
      width="50%"
      :visible.sync="confirmDialog"
      center
    >
      <el-table
        :data="quotedata"
        highlight-current-row
        @row-click="showRow"
        border
      >
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
                style="width: 50px;max-height:100px;"
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
        <el-button :disabled="radio === ''" type="primary" @click="confirmIt">{{
          $t("tracking.confirm")
        }}</el-button>
      </span>
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
    <el-dialog
      :title="$t('tracking.rating')"
      :visible.sync="ratingDialog"
      width="500px"
    >
      <div style="text-align:center;">
        <el-rate style="margin-bottom:20px;" v-model="ratingForm.rating">
        </el-rate>
        <el-input
          v-model="ratingForm.remark"
          type="textarea"
          :placeholder="$t('tracking.remark')"
          resize="none"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ratingDialog = false">取 消</el-button>
        <el-button type="primary" @click="ratingConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="$t('tracking.confirmReceiptOfDocument')"
      :visible.sync="rdDialog"
      center
      width="600px"
    >
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
        <el-button @click="rdDialog = false">{{
          $t("tracking.cancel")
        }}</el-button>
        <el-button type="primary" :loading="rdLoading" @click="rdConfirmIt">{{
          $t("tracking.confirm")
        }}</el-button>
      </span>
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
  demandOrderList,
  demandStatusCount,
  demandquoteList,
  demandquoteConfirm,
  getOrderLog,
  orderRating,
  getImg,
  confirmRD
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
        remark: ""
      },
      rdDialog: false,
      imgList: [],
      rdRow: {},
      rdLoading: false
    };
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapGetters(["permissions"])
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
        page: e - 1
      }).then(res => {
        self.data = res.data;
        self.tableLoading = false;
      });
    },
    changeTab() {
      this.data = {};
      this.loadData();
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
      demandquoteConfirm(self.curId, self.selected.id).then(res => {
        self.$message.success(res.message);
        self.loadData();
        self.radio = "";
        self.confirmDialog = false;
      });
    },
    orderLog(id) {
      getOrderLog(id).then(res => {
        self.logs = res.data;
        self.logDialog = true;
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
      orderRating(
        self.thisId,
        self.ratingForm.rating * 2,
        self.ratingForm.remark
      ).then(res => {
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
      confirmRD(self.rdRow.id).then(res => {
        self.loadData(() => {
          self.$message.success(self.$t("tracking.successful"));
          self.rdDialog = false;
          self.rdLoading = false;
        });
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
  border-bottom: 2px solid #dfe4ed;
  margin-right: 9px;
  box-sizing: border-box;
  padding-bottom: 10px;
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
  margin-top: 28px;
  height: calc(100vh - 141px);
  overflow: auto;
}

div::-webkit-scrollbar {
  display: none;
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
</style>
