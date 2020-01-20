<template>
  <div class="manage">
    <div class="status_header">
      <div class="search_box">
        <el-select
          v-model="searchType"
          :placeholder="$t('placeholder.pleaseChoose')"
          style="margin:0;width: 170px;"
          class="select_btn"
        >
          <el-option :label="$t('inbound.sendNo')" :value="'sendNo'"> </el-option>
          <el-option :label="$t('inbound.LicensePlate')" :value="'plate'"> </el-option>
        </el-select>
        <el-input v-model="like" :placeholder="$t('placeholder.pleaseInput')" class="input_btn"></el-input>
        <div style="margin-right:10px;font-size:14px;">{{ $t("inbound.print") }}</div>
        <el-select v-model="needPrint" :placeholder="$t('placeholder.pleaseChoose')" class="select_btn">
          <el-option :label="$t('inbound.all')" :value="'all'"> </el-option>
          <el-option :label="$t('inbound.needPrint')" :value="'print'"> </el-option>
        </el-select>
        <el-button @click="searchIt">{{ $t("tracking.search") }}</el-button>
      </div>
    </div>
    <div class="content">
      <div class="content_left">
        <el-table
          ref="leftData"
          :data="data.content"
          highlight-current-row
          @current-change="handleCurrentChange"
          border
          :max-height="tableHeight"
          v-loading="loading"
        >
          <el-table-column :label="$t('inbound.Demand')">
            <template slot-scope="scope">
              <div>{{ scope.row.demandName }}</div>
              <div>{{ scope.row.deliveryNo }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('inbound.LicensePlate')">
            <template slot-scope="scope">
              <div>{{ scope.row.plate }}</div>
              <div>{{ scope.row.driverName }}</div>
              <div>{{ scope.row.phone }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="status == 'HANDOVER' ? $t('inbound.ActualTimeofArrival') : $t('inbound.EstimateTimeofArrival')"
          >
            <template slot-scope="scope">
              <div v-if="status == 'WAIT_PUT'">
                {{
                  scope.row.estimateTime ? scope.row.estimateTime.slice(0, 10) + " " + scope.row.estimateTime.slice(11, 19) : ""
                }}
              </div>
              <div v-if="status == 'HANDOVER'">
                {{ scope.row.actualTime ? scope.row.actualTime.slice(0, 10) + " " + scope.row.actualTime.slice(11, 19) : "" }}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align:center;margin-top:20px;">
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
      <div class="content_right">
        <el-table
          :data="rightData"
          border
          v-loading="rightLoading"
          ref="rightData"
          :row-style="rowStyle"
          :max-height="tableHeight + 52"
          :row-class-name="rowClassName"
        >
          <el-table-column prop="orderNo" :label="$t('inbound.TrackingNo')"></el-table-column>
          <el-table-column :label="$t('inbound.QtyofShipment')">
            <template slot-scope="scope">
              <!-- <div>{{ scope.row.sum }} {{ unitObj[scope.row.unit] }} {{ sizeObj[scope.row.sizeType] }}</div> -->
              <div>{{ scope.row.sum }} {{ scope.row.unit }} {{ scope.row.sizeType }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('inbound.QtyofHUBScanIn')">
            <template slot-scope="scope">
              <div v-if="scope.row.hubLtLStatus">{{ scope.row.sum }}</div>
              <el-input v-model="scope.row.number" type="number" v-else></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('inbound.Operation')">
            <template slot-scope="scope">
              <el-button
                type="primary"
                v-if="RegExp(/PRINT_STICKER/).test(scope.row.services)"
                style="width:90%;margin:0;margin-bottom:5px;"
                @click="printIt(scope.row)"
                >{{ $t("inbound.print") }}</el-button
              >
              <el-button
                type="primary"
                :disabled="scope.row.hubLtLStatus != null"
                v-if="status == 'WAIT_PUT'"
                style="width:90%;margin:0;"
                @click="receiptIt(scope.row, scope.$index)"
                >{{ $t("inbound.ConfirmReceipt") }}</el-button
              >
              <!-- <el-button
                type="primary"
                v-if="status == 'HANDOVER' && RegExp(/PRINT_STICKER/).test(scope.row.services)"
                style="width:90%;margin:0;"
                @click="reprintIt(scope.row, scope.$index)"
                >{{ $t("inbound.print") }}</el-button
              > -->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :title="$t('inbound.print')" :visible.sync="printeDialog" width="450px" class="comfirmDialog" center>
      <div style="display:flex;align-items:center;margin:30px 0;">
        <span style="margin-left:30px;">{{ $t("inbound.PrintingNumber") }}</span>
        <el-input
          :placeholder="$t('placeholder.pleaseInput')"
          v-model="printNumber"
          style="width:250px;margin-left:10px;"
        ></el-input>
      </div>
      <span slot="footer">
        <div class="footerBtn">
          <el-button size="small" type="primary" style="width:150px;" @click="confirmPrint">{{
            $t("tracking.confirm")
          }}</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import printJS from "../../../printjs/src";
import { getInboundList, getInboundProperty, confirmput } from "../../../api/inbound";
import { getGoodsProperty } from "../../../api/data";
import { getToken } from "../../../utils/auth";

let self;
export default {
  props: {
    status: {
      type: String,
      default: "WAIT_PUT",
    },
  },
  data() {
    return {
      loading: false,
      rightLoading: false,
      printeDialog: false,
      data: [],
      rightData: [],
      sizeObj: {},
      unitObj: {},
      searchType: "sendNo",
      like: "",
      needPrint: "all",
      selectionRow: [],
      printNumber: null,
      printId: null,
      isChange: false,
      tableHeight: 0,
    };
  },
  methods: {
    rowStyle({ row, rowIndex }) {
      Object.defineProperty(row, "rowIndex", {
        //给每一行添加不可枚举属性rowIndex来标识当前行
        value: rowIndex,
        writable: true,
        enumerable: false,
      });
    },
    rowClassName({ row, rowIndex }) {
      let rowName = "";
      let findRow = self.selectionRow.find(c => c.rowIndex === row.rowIndex);
      if (findRow) {
        rowName = "current-row "; // elementUI 默认高亮行的class类 不用再样式了^-^,也可通过css覆盖改变背景颜色
      }
      return rowName; //也可以再加上其他类名 如果有需求的话
    },
    loadData(cb) {
      self.loading = true;
      self.rightData = [];
      let page = self.isChange ? 0 : self.data.number ? self.data.number : 0;
      getInboundList(self.status, {
        searchType: self.searchType,
        like: self.like,
        needPrint: self.needPrint,
        page: page,
      }).then(res => {
        self.data = res.data;
        self.$refs.leftData.setCurrentRow(self.data.content[0]);
        self.loading = false;
        if (cb) {
          cb();
        }
      });
    },
    pageChange(e) {
      self.loading = true;
      getInboundList(self.status, {
        searchType: self.searchType,
        like: self.like,
        needPrint: self.needPrint,
        page: e - 1,
      }).then(res => {
        self.data = res.data;
        self.loading = false;
      });
    },
    // 搜索
    searchIt() {
      self.loadData();
    },
    // 清空搜索条件
    clearSearch() {
      self.searchType = "plate";
      self.like = "";
      self.needPrint = "all";
    },
    // 切换status
    changeStatus(type) {
      self.status = type;
      self.isChange = true;
      self.clearSearch();
      self.loadData();
    },
    // 选中左侧table
    handleCurrentChange(val) {
      if (val) {
        self.rightLoading = true;
        getInboundProperty(val.id, self.status, {
          needPrint: self.needPrint,
        }).then(res => {
          self.rightData = res.data;
          // let x = self.rightData[1];
          // x.rowIndex = 1;
          // self.selectionRow = [x];
          self.rightLoading = false;
        });
      }
    },
    // 打印
    printIt(row) {
      self.printeDialog = true;
      self.printId = row.orderId;
      self.printNumber = null;
    },
    // 确认打印
    confirmPrint() {
      if (!self.printNumber) {
        self.$message.warning(self.$t("inbound.Pleaseenterthenumberofprints"));
        return;
      }
      printJS({
        printable: `${process.env.VUE_APP_BASE_API}/api/token/pdf/downloadHub?orderId=${self.printId}&number=${
          self.printNumber
        }&token=${getToken()}&Locale=${self.$store.state.app.language}`,
        type: "pdf",
        showModal: true,
      });
    },
    // 确认收货
    receiptIt(item, index) {
      if (item.number && item.number > 0) {
        if (item.number == item.sum) {
          confirmput({
            count: item.number,
            orderId: item.orderId,
            sizeType: item.sizeType,
            unit: item.unit,
          }).then(res => {
            self.rightData[index].hubLtLStatus = 1;
          });
        } else {
          self.$alert(
            `<div style="margin:50px auto;">${self.$t("inbound.Receiptquantityisnotequaltoorderquantity")}</div>`,
            self.$t("inbound.ConfirmReceipt"),
            {
              confirmButtonText: self.$t("inbound.GotIt"),
              center: true,
              dangerouslyUseHTMLString: true,
            },
          );
        }
      } else {
        self.$message.warning(self.$t("inbound.Pleaseenterthenumberofreceivedshipments"));
      }
    },
  },
  created() {
    self = this;
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 91 - 40 - 36 - 20 - 32 - 20;
    });
    getGoodsProperty().then(res => {
      // let propertyObj = new Object();
      let sizeObj = new Object();
      let unitObj = new Object();
      // for (let i of res.data.propertyType) {
      //   propertyObj[i.key] = i.trans;
      // }
      for (let i of res.data.sizeType) {
        sizeObj[i.key] = i.trans;
      }
      for (let i of res.data.unit) {
        unitObj[i.key] = i.trans;
      }
      // self.propertyObj = propertyObj;
      self.sizeObj = sizeObj;
      self.unitObj = unitObj;
    });
    self.loadData();
  },
};
</script>
<style lang="scss" scoped>
.manage {
  box-sizing: border-box;
  padding: 20px;

  .status_header {
    display: flex;

    .search_box {
      // margin-left: 20px;
      display: flex;
      line-height: 35px;
    }

    .input_btn {
      width: 250px;
      margin-right: 20px;
    }

    .select_btn {
      width: 120px;
      margin-right: 10px;
    }
  }

  .route_btn_box {
    display: flex;

    .route_btn_item {
      cursor: pointer;
      width: 145px;
      height: 35px;
      line-height: 35px;
      text-align: center;
      border: 1px solid #ccc;
      color: #1e1e1e;
      font-size: 12px;
      margin-right: 15px;
    }

    .route_btn_active {
      background: red;
      color: #fff;
      font-weight: 600;
    }

    .route_btn_jy {
      color: #ccc;
      cursor: no-drop;
    }
  }

  .content {
    margin-top: 20px;
    width: 99%;
    display: flex;
    justify-content: space-between;

    .content_left {
      width: 43%;
    }

    .content_right {
      width: 55%;
    }
  }
}
</style>
