<template>
  <div class="manage">
    <div class="status_header">
      <div class="route_btn_box">
        <div class="route_btn_item" :class="status == 'WAIT_PUT' ? 'route_btn_active' : ''" @click="changeStatus('WAIT_PUT')">
          {{ $t("inbound.TobeConfirmedReceipt") }}
        </div>
        <div class="route_btn_item" :class="status == 'HANDOVER' ? 'route_btn_active' : ''" @click="changeStatus('HANDOVER')">
          {{ $t("inbound.Received") }}
        </div>
      </div>
      <div class="search_box">
        <el-select v-model="searchType" :placeholder="$t('placeholder.pleaseChoose')" class="select_btn">
          <el-option :label="$t('inbound.LicensePlate')" :value="'plate'"> </el-option>
          <el-option :label="$t('inbound.sendNo')" :value="'sendNo'"> </el-option>
        </el-select>
        <el-input v-model="like" :placeholder="$t('placeholder.pleaseInput')" class="input_btn"></el-input>
        <div style="margin-right:10px;">{{ $t("inbound.print") }}:</div>
        <el-select v-model="needPrint" :placeholder="$t('placeholder.pleaseChoose')" class="select_btn">
          <el-option :label="$t('inbound.all')" :value="'all'"> </el-option>
          <el-option :label="$t('inbound.needPrint')" :value="'print'"> </el-option>
        </el-select>
        <el-button @click="searchIt">{{ $t("tracking.search") }}</el-button>
      </div>
    </div>
    <div class="content">
      <div class="content_left">
        <el-table :data="data.content" highlight-current-row @current-change="handleCurrentChange" border v-loading="loading">
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
          <el-table-column :label="$t('inbound.EstimateTimeofArrival')">
            <template slot-scope="scope">
              <div>{{ scope.row.estimateTime.slice(0, 10) + " " + scope.row.estimateTime.slice(11, 19) }}</div>
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
        <el-table :data="rightData" border v-loading="rightLoading">
          <el-table-column prop="orderNo" :label="$t('inbound.TrackingNo')"></el-table-column>
          <el-table-column :label="$t('inbound.QtyofShipment')">
            <template slot-scope="scope">
              <div>{{ scope.row.sum }} {{ unitObj[scope.row.unit] }} {{ sizeObj[scope.row.sizeType] }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('inbound.QtyofHUBScanIn')">
            <template slot-scope="scope">
              <el-input></el-input>
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
                v-if="!scope.row.hubLtLStatus"
                style="width:90%;margin:0;"
                @click="receiptIt(scope.row)"
                >{{ $t("inbound.ConfirmReceipt") }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { getInboundList, getInboundProperty } from "../../api/inbound";
import { getGoodsProperty } from "../../api/data";

let self;
export default {
  data() {
    return {
      status: "WAIT_PUT",
      loading: false,
      rightLoading: false,
      data: [],
      rightData: [],
      sizeObj: {},
      unitObj: {},
      searchType: "plate",
      like: "",
      needPrint: "all",
    };
  },
  methods: {
    loadData(cb) {
      self.loading = true;
      self.rightData = [];
      let page = self.data.number ? self.data.number : 0;
      getInboundList(self.status, {
        searchType: self.searchType,
        like: self.like,
        needPrint: self.needPrint,
        page: page,
      }).then(res => {
        self.data = res.data;
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
          self.rightLoading = false;
        });
      }
    },
    printIt() {},
    receiptIt() {},
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
