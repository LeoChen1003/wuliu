<template>
  <div class="manage billing">
    <div class="statusHeader">
      <div class="status-txt">{{ $t('billing.billingStatus') }}</div>
      <div class="supply-box">
        <span style="margin:0 20px;">{{$t('billing.supply')}}</span>
        <el-select v-model="supply"
                   clearable
                   placeholder="请选择">
          <el-option v-for="item in supplyList"
                     :key="item.supply_id"
                     :label="item.company_name"
                     :value="item.supply_id">
          </el-option>
        </el-select>
      </div>
      <span style="margin:0 10px 0 20px;">{{$t('billing.deliveredDate')}}</span>
      <div class="timePicker">
        <bcTime @changeBCtime="changeBCtimeFrom"
                :timeType="'all'"
                :dateDefault='[0,0,0]'></bcTime>
        <span style="margin:0 5px;">-</span>
        <bcTime @changeBCtime="changeBCtimeTo"
                :dateDefault='[0,0,0]'
                style="margin-left:5px;"
                :timeType="'all'"></bcTime>
        <el-button size="small"
                   @click="searchIt"
                   style='width:100px;margin-left:20px;'>{{ $t('billing.search') }}</el-button>
      </div>
    </div>
    <div class="content">
      <div>
        <el-tabs v-model="tabActive"
                 tab-position="left"
                 @tab-click="handleClick"
                 style="height:calc(100% - 50px);">
          <el-tab-pane name="UNPAID">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('billing.unpaid_TF')}}<sub class="badge red">{{statusCount.UNPAID}}</sub></div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="PAID">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('billing.paid_TF')}}<sub class="badge">{{statusCount.PAID}}</sub></div>
              </div>
            </span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="container">
        <div class="center">
          <el-table :data="tableData"
                    highlight-current-row
                    v-loading="loading"
                    @current-change="handleCurrentChange"
                    border>
            <el-table-column prop="orderNo"
                             :label="$t('billing.trackingNo')" />
            <el-table-column :label="$t('billing.supply')">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.supplyName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="settlementAmount"
                             :label="$t('billing.totalAmount')" />
            <el-table-column align="right"
                             header-align="center"
                             v-if="tabActive == 'UNPAID'"
                             width="50px">
              <template slot="header"
                        slot-scope="scope">
                <el-checkbox v-model="allChecked"
                             @change="allCheckChange"></el-checkbox>
              </template>
              <template slot-scope="scope">
                <div class="check-box">
                  <el-checkbox @change="checkChange(scope.row)"
                               :disabled="!scope.row.canCheck"
                               v-model="scope.row.checked"></el-checkbox>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination style="margin-top:10px;text-align: center;margin-bottom:50px;"
                         background
                         :page-sizes="[1,5,10,20,50]"
                         :page-size="pagesize"
                         @size-change="pageSizeChange"
                         :current-page.sync="page.currentPage"
                         @current-change="pageChange"
                         layout="prev, pager, next, jumper"
                         :total="page.total"></el-pagination>
        </div>
        <div class="right">
          <el-form label-width="150px"
                   v-if="thisRow"
                   size="mini">
            <el-form-item :label="$t('billing.trackingNo')">
              {{ thisRow.orderNo }}
            </el-form-item>
            <el-form-item :label="$t('billing.deliveredDate')">
              {{ thisRow.settleAt }}
            </el-form-item>
            <el-form-item :label="$t('billing.supply')">
              {{ thisRow.supplyName }}
            </el-form-item>
            <el-form-item :label="$t('billing.total')">
              {{ thisRow.payAmount }}
            </el-form-item>
            <el-form-item :label="$t('billing.VATFreight')">
              {{ thisRow.freight }}
            </el-form-item>
            <el-form-item :label="$t('billing.VATService')">
              {{ thisRow.serviceCharge }}
            </el-form-item>
            <el-form-item :label="$t('billing.platformServiceCharge')">
              {{ thisRow.commission }}
            </el-form-item>
            <el-form-item :label="$t('billing.amountPayable')">
              {{ thisRow.payAmount - thisRow.freight - thisRow.serviceCharge - thisRow.commission }}
            </el-form-item>
            <el-form-item :label="$t('billing.operator')"
                          v-if='thisRow.orderRefunds'>
              {{ thisRow.orderRefunds.handleName }}
            </el-form-item>
            <el-form-item :label="$t('billing.transferNo')"
                          v-if='thisRow.orderRefunds'>
              {{ thisRow.orderRefunds.sn }}
            </el-form-item>
            <el-form-item :label="$t('billing.transferedDate')"
                          v-if='thisRow.orderRefunds'>
              {{ thisRow.orderRefunds.refundDateTime }}
            </el-form-item>
            <el-form-item :label="$t('billing.transferVoucher')"
                          v-if='thisRow.orderRefunds'>
              <el-image v-for='(img,index) in thisRow.imgList'
                        :key="index"
                        style="margin-right:20px;"
                        :src="img + '?x-oss-process=style/th-90'"
                        :preview-src-list="thisRow.imgList">
              </el-image>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supplyFinance, billsupplyCount, getSupplyList, getRefundList, getRefundCount } from '../../api/billing'
import { getTime, parseTime, getLastMonthTime } from '../../utils/index'
import bcTime from "@/components/bcTime";

let self
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { bcTime },
  data () {
    return {
      tabActive: 'UNPAID',
      tableData: [],
      page: {
        total: 0,
        currentPage: 1
      },
      pagesize: 20,
      loading: false,
      detailData: [],
      statusCount: {},
      supplyList: [],
      supply: '',
      fromDate: null,
      toDate: null,
      allChecked: false,
      thisRow: null
    };
  },
  // 监听属性 类似于data概念
  computed: {
    fromDateDeFault () {
      return self.fromDate.split('-')
    },
    toDateDeFault () {
      return self.toDate.split('-')
    },
  },
  // 监控data中的数据变化
  watch: {},
  created () {
    self = this
  },
  mounted () {
    self.loadData();
  },
  methods: {
    changeBCtimeFrom (time) {
      self.fromDate = time
    },
    changeBCtimeTo (time) {
      self.toDate = time
    },
    pageChange (val) {
      self.page.currentPage = val
      self.loadData()
    },
    pageSizeChange (val) {
      self.pagesize = val
      self.loadData()
    },
    loadData () {
      self.loading = true
      getRefundList(self.tabActive, {
        start: self.fromDate,
        end: self.toDate,
        supplyId: self.supply,
        page: self.page.currentPage - 1,
        pagesize: self.pagesize
      }).then(res => {
        let data = res.data.content;
        for (let i of data) {
          i.supplyName =
            i.supply.type == 'COMPANY'
              ? i.supply.companyName
              : i.supply.humanName
          if (self.tabActive == 'PAID') {
            let imgList = [];
            for (let t of i.orderRefunds.resourceList) {
              imgList.push(t.path);
            }
            i.imgList = imgList;
          } else {
            for (let i of data) {
              i.checked = false;
              i.canCheck = true;
            }
          }
        }
        self.tableData = data;
        self.page = {
          total: res.data.totalElements,
          currentPage: res.data.number + 1
        }
        self.loading = false
        self.allChecked = false;
      }).catch((res) => {
        self.loading = false
        self.allChecked = false;
      })
      getRefundCount({
        start: self.fromDate,
        end: self.toDate,
        supplyId: self.supply,
      }).then(res => {
        self.statusCount = res.data
      })
      getSupplyList(self.tabActive).then(res => {
        self.supplyList = res.data;
      })
    },
    searchIt () {
      self.loadData()
    },
    handleClick () {
      self.loadData()
    },
    handleCurrentChange (val) {
      self.thisRow = val;
    },
    // 单选
    checkChange (row) {
      let supplyName = row.supplyName;
      let data = JSON.parse(JSON.stringify(self.tableData));
      let hasOtherChecked = false;
      let allChecked = true;

      // 检测是否有其他相同supply的已check
      for (let i of data) {
        if (i.supplyName == supplyName && i.id != row.id && i.checked) {
          hasOtherChecked = true;
          break;
        }
      }

      // 如果没有，则处理
      if (!hasOtherChecked) {
        if (row.checked) {
          for (let i of data) {
            if (i.supplyName == supplyName) {
              i.canCheck = true;
            } else {
              i.canCheck = false;
            }
          }
        } else {
          for (let i of data) {
            i.canCheck = true;
          }
        }
      }

      // allCheck判断
      for (let i of data) {
        if (i.supplyName == supplyName && !i.checked) {
          allChecked = false;
          break;
        }
      }

      self.tableData = data;
      self.allChecked = allChecked;
    },
    // 全选
    allCheckChange (val) {
      let data = JSON.parse(JSON.stringify(self.tableData));
      let supplyName = '';

      if (val) {
        // 判断是否已有check的supply
        for (let i of data) {
          if (i.checked) {
            supplyName = i.supplyName;
            break
          }
        }

        // 如果没有则取第一个
        if (supplyName == '') {
          supplyName = data[0].supplyName;
        }

        // 处理 
        for (let i of data) {
          if (i.supplyName == supplyName) {
            i.checked = true;
            i.canCheck = true;
          } else {
            i.checked = false;
            i.canCheck = false;
          }
        }
      } else {
        for (let i of data) {
          i.checked = false;
          i.canCheck = true;
        }
      }
      self.tableData = data;
    }
  }
};
</script>
<style lang='scss' scoped>
.manage {
  height: 100%;
  box-sizing: border-box;
  .statusHeader {
    display: flex;
    padding: 0px 20px;
    box-sizing: border-box;
    height: 50px;
    border-bottom: 2px solid #dfe4ed;
    align-items: center;
    .status-txt {
      height: 50px;
      line-height: 50px;
      padding-left: 20px;
      font-size: 20px;
      width: 216px;
      box-sizing: border-box;
      border-right: 2px solid #dfe4ed;
    }
  }
  .timePicker {
    height: 42px;
    line-height: 40px;
    display: flex;
    align-items: center;
  }
  .content {
    padding-left: 25px;
    display: flex;
    .container {
      padding-left: 20px;
      padding-top: 20px;
      width: 100%;
      display: flex;

      .center {
        width: 49%;
        margin-right: 1%;
      }

      .right {
        width: 49%;
        background: #fff;
        box-sizing: border-box;
        padding: 20px 0;
      }
    }
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

.supply-box {
  margin-left: 20px;
}

.check-box {
  text-align: center;
}
</style>
<style>
.billing .el-tabs--left .el-tabs__header.is-left {
  margin-right: 0px;
  width: 211px;
}
.billing .el-tabs--left .el-tabs__active-bar.is-left {
  width: 3px;
}
.billing .el-tabs--left .el-tabs__nav-wrap.is-left::after,
.el-tabs--left .el-tabs__nav-wrap.is-right::after,
.el-tabs--right .el-tabs__nav-wrap.is-left::after,
.el-tabs--right .el-tabs__nav-wrap.is-right::after {
  width: 3px;
}
</style>


