<template>
  <div class="manage">
    <div class="status_header">
      <div class="route_btn_box">
        <div
          class="route_btn_item"
          :class="status == 'WAIT_HANDOVER' ? 'route_btn_active' : ''"
          @click="changeStatus('WAIT_HANDOVER')"
        >
          {{ $t("inbound.TobeHandedOver") }}
        </div>
        <div
          class="route_btn_item"
          :class="status == 'WAIT_DRIVER_CONFIRM' ? 'route_btn_active' : ''"
          @click="changeStatus('WAIT_DRIVER_CONFIRM')"
        >
          {{ $t("inbound.TobeConfirmedbyDriver") }}
        </div>
        <div class="route_btn_item" :class="status == 'HANDOVER' ? 'route_btn_active' : ''" @click="changeStatus('HANDOVER')">
          {{ $t("inbound.HandedOver") }}
        </div>
      </div>
      <div class="search_box">
        <el-select v-model="searchType" :placeholder="$t('placeholder.pleaseChoose')" style="margin:0;" class="select_btn">
          <el-option :label="$t('inbound.LicensePlate')" :value="'plate'"> </el-option>
          <el-option :label="$t('inbound.TrackingNo')" :value="'sendNo'"> </el-option>
        </el-select>
        <el-input v-model="like" :placeholder="$t('placeholder.pleaseInput')" class="input_btn"></el-input>
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
          v-loading="loading"
        >
          <el-table-column :label="$t('inbound.Supply')">
            <template slot-scope="scope">
              <div>{{ scope.row.supplyName }}</div>
              <div v-if="status == 'HANDOVER'">
                {{
                  scope.row.handoverTime ? scope.row.handoverTime.slice(0, 10) + " " + scope.row.handoverTime.slice(11, 19) : ""
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('inbound.LicensePlate')">
            <template slot-scope="scope">
              <div>{{ scope.row.truckPlate }}</div>
              <div>{{ scope.row.driverName }}</div>
              <div>{{ scope.row.driverPhone }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('inbound.TotalQty')">
            <template slot-scope="scope">
              <div>{{ scope.row.count }}</div>
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
      <div class="content_right">
        <el-table
          :data="rightData"
          border
          v-loading="rightLoading"
          ref="rightData"
          :row-style="rowStyle"
          :row-class-name="rowClassName"
        >
          <el-table-column prop="orderNo" :label="$t('inbound.TrackingNo')"></el-table-column>
          <el-table-column :label="$t('inbound.QtyofShipment')">
            <template slot-scope="scope">
              <!-- <div>{{ scope.row.sum }} {{ unitObj[scope.row.unit] }} {{ sizeObj[scope.row.sizeType] }}</div> -->
              <div>{{ scope.row.sum }} {{ scope.row.unit }} {{ scope.row.sizeType }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('inbound.QtyofHUBScanout')">
            <template slot-scope="scope">
              <div v-if="scope.row.hubLtLStatus >= 2">{{ scope.row.sum }}</div>
              <el-input v-model="scope.row.number" type="number" v-else></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('inbound.Operation')">
            <template slot-scope="scope">
              <el-button
                v-if="status == 'WAIT_HANDOVER'"
                type="primary"
                :disabled="scope.row.hubLtLStatus != 1 || !truckInfo"
                style="width:90%;margin:0;"
                @click="confirmIt(scope.row, scope.$index)"
                >{{ $t("tracking.confirm") }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { getOutboundList, getOutorders, confirmhand } from "../../api/inbound";
import { getGoodsProperty } from "../../api/data";

let self;
export default {
  data() {
    return {
      status: "WAIT_HANDOVER",
      loading: false,
      rightLoading: false,
      data: [],
      rightData: [],
      sizeObj: {},
      unitObj: {},
      searchType: "plate",
      like: "",
      selectionRow: [],
      truckInfo: false,
      isChange: false,
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
      let findRow = self.rightData.find(c => c.highLight == rowIndex);
      if (findRow) {
        rowName = "current-row "; // elementUI 默认高亮行的class类 不用再样式了^-^,也可通过css覆盖改变背景颜色
      }
      return rowName; //也可以再加上其他类名 如果有需求的话
    },
    loadData(cb) {
      self.loading = true;
      self.rightData = [];
      let page = self.isChange ? 0 : self.data.number ? self.data.number : 0;
      getOutboundList(self.status, {
        searchType: self.searchType,
        like: self.like,
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
      getOutboundList(self.status, {
        searchType: self.searchType,
        like: self.like,
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
        getOutorders({
          driverId: val.driverId,
          searchType: self.searchType,
          like: self.like,
          status: self.status,
          supplyId: val.supplyId,
          truckId: val.truckId,
        }).then(res => {
          self.truckInfo = val.driverName && val.truckPlate ? true : false;
          self.rightData = res.data;
          self.rightLoading = false;
        });
      }
    },
    // 确认
    confirmIt(item, index) {
      if (item.number && item.number > 0) {
        if (item.number == item.sum) {
          confirmhand({
            count: item.number,
            orderId: item.orderId,
            sizeType: item.sizeType,
            unit: item.unit,
          }).then(res => {
            self.rightData[index].hubLtLStatus = 2;
          });
        } else {
          self.$alert(
            `<div style="margin:50px auto;">${self.$t("inbound.Outboundquantityisnotequaltoorderquantity")}</div>`,
            self.$t("inbound.ConfirmReceipt"),
            {
              confirmButtonText: self.$t("inbound.GotIt"),
              center: true,
              dangerouslyUseHTMLString: true,
            },
          );
        }
      } else {
        self.$message.warning(self.$t("inbound.Pleaseenterthenumberofhandovershipments"));
      }
    },
  },
  created() {
    self = this;
  },
  mounted() {
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
  margin-top: -20px;
  box-sizing: border-box;
  padding-left: 20px;

  .status_header {
    display: flex;

    .search_box {
      margin-left: 20px;
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
