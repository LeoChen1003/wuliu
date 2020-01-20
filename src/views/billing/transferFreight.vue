<template>
  <div class="manage billing">
    <div class="content">
      <div style="height:100%;" class="nav">
        <el-tabs v-model="tabActive" tab-position="left" @tab-click="handleClick" style="height:100%;">
          <el-tab-pane name="UNPAID">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("billing.unpaid_TF") }}<sub class="badge red">{{ statusCount.UNPAID }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="PAID">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">
                  {{ $t("billing.paid_TF") }}<sub class="badge">{{ statusCount.PAID }}</sub>
                </div>
              </div>
            </span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="container">
        <div class="statusHeader">
          <div>
            <span style="margin-right:10px;font-size:16px;">{{ $t("billing.supply") }}</span>
            <el-select v-model="supply" clearable placeholder="请选择">
              <el-option v-for="item in supplyList" :key="item.supply_id" :label="item.company_name" :value="item.supply_id">
              </el-option>
            </el-select>
          </div>
          <span style="margin:0 10px 0 20px;font-size:16px;">{{ $t("billing.deliveredDate") }}</span>
          <div class="timePicker">
            <bc-picker :dateType="'daterange'" @changeBCtime="changeBCtime"></bc-picker>
            <el-button @click="searchIt" style="width:100px;margin-left:20px;">{{ $t("billing.search") }}</el-button>
            <el-button
              @click="confirmShow"
              v-if="tabActive == 'UNPAID'"
              :disabled="!permissions.PlatformFianceConfirm"
              type="primary"
              style="margin-left:20px;"
              >{{ $t("billing.transferFreight") }}</el-button
            >
          </div>
        </div>
        <div class="containerContent">
          <div class="center">
            <el-table
              :data="tableData"
              highlight-current-row
              v-loading="loading"
              @current-change="handleCurrentChange"
              border
              :max-height="tableHeight"
            >
              <el-table-column prop="orderNo" :label="$t('billing.trackingNo')" />
              <el-table-column :label="$t('billing.supply')">
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.supplyName }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="settlementAmount" :label="$t('billing.totalAmount')" />
              <el-table-column align="right" header-align="center" v-if="tabActive == 'UNPAID'" width="50px">
                <template slot="header" slot-scope="scope">
                  <el-checkbox v-model="allChecked" @change="allCheckChange" />
                </template>
                <template slot-scope="scope">
                  <div class="check-box">
                    <el-checkbox @change="checkChange(scope.row)" :disabled="!scope.row.canCheck" v-model="scope.row.checked" />
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              style="margin-top:10px;text-align: center;margin-bottom:10px;"
              background
              :page-sizes="[1, 5, 10, 20, 50]"
              :page-size="pagesize"
              @size-change="pageSizeChange"
              :current-page.sync="page.currentPage"
              @current-change="pageChange"
              layout="prev, pager, next, jumper"
              :total="page.total"
            />
          </div>
          <div class="right">
            <el-card shadow="never" v-if="thisRow" :style="`max-height:${detailHeight}px;overflow:scroll;`">
              <el-form label-width="150px" v-if="thisRow" size="mini" label-position="left">
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
                  {{ thisRow.actualAmount }}
                </el-form-item>
                <el-form-item :label="$t('billing.operator')" v-if="thisRow.orderRefunds">
                  {{ thisRow.orderRefunds.handleName }}
                </el-form-item>
                <el-form-item :label="$t('billing.transferNo')" v-if="thisRow.orderRefunds">
                  {{ thisRow.orderRefunds.sn }}
                </el-form-item>
                <el-form-item :label="$t('billing.transferedDate')" v-if="thisRow.orderRefunds">
                  {{ thisRow.orderRefunds.refundDateTime }}
                </el-form-item>
                <el-form-item :label="$t('billing.transferVoucher')" v-if="thisRow.orderRefunds">
                  <el-image
                    v-for="(img, index) in thisRow.imgList"
                    :key="index"
                    style="margin-right:20px;"
                    :src="img + '?x-oss-process=style/th-90'"
                    :preview-src-list="thisRow.imgList"
                  >
                  </el-image>
                </el-form-item>
              </el-form>
            </el-card>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :title="$t('billing.transferFreight')" :visible.sync="confirmDialog" center @close="dialogClose" width="600px">
      <div>
        <el-form label-width="120px" v-if="form.orders.length != 0">
          <el-form-item :label="$t('billing.member')">
            {{ form.member }}
          </el-form-item>
          <el-form-item :label="$t('billing.amountPayable')">
            {{ form.countAmount }}
          </el-form-item>
          <el-form-item :label="$t('billing.orderQty')">
            {{ form.orders.length }}
          </el-form-item>
          <el-form-item :label="$t('billing.transferVoucher')">
            <div class="inputWidth">
              <el-upload
                class="upload-box"
                ref="upload1"
                :action="env + '/api/file/upload'"
                :on-preview="handlePreview"
                multiple
                :file-list="fileList1"
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
        </el-form>
        <div style="color:red;margin:0 20px;text-align:center;">
          {{ $t("billing.thisOperationIsIrrevocable") }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmDialog = false">{{ $t("billing.cancel") }}</el-button>
        <el-button type="primary" :loading="confirmLoading" @click="confirmIt">{{ $t("billing.confirm") }}</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="previewDialog">
      <img width="100%" :src="previewImg" alt="image" />
    </el-dialog>
  </div>
</template>

<script>
import { supplyFinance, billsupplyCount, getSupplyList, getRefundList, getRefundCount, confirmRefund } from "../../api/billing";
import { getTime, parseTime, getLastMonthTime } from "../../utils/index";
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";

let self;
export default {
  data() {
    return {
      env: process.env.VUE_APP_BASE_API,
      headers: {
        Authorization: getToken(),
      },
      tabActive: "UNPAID",
      tableData: [],
      page: {
        total: 0,
        currentPage: 1,
      },
      pagesize: 20,
      loading: false,
      detailData: [],
      statusCount: {},
      supplyList: [],
      supply: "",
      fromDate: null,
      toDate: null,
      allChecked: false,
      confirmDialog: false,
      thisRow: null,
      form: {
        member: "",
        countdAmount: "",
        orders: "",
      },
      fileList1: [],
      previewDialog: false,
      previewImg: "",
      confirmLoading: false,
      tableHeight: 0,
      detailHeight: 0,
    };
  },
  // 监听属性 类似于data概念
  computed: {
    fromDateDeFault() {
      return self.fromDate.split("-");
    },
    toDateDeFault() {
      return self.toDate.split("-");
    },
    fileList: function() {
      return self.$refs.upload1.uploadFiles;
    },
    ...mapGetters(["permissions"]),
  },
  // 监控data中的数据变化
  watch: {},
  created() {
    self = this;
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 91 - 40 - 42 - 20 - 32 - 20;
      this.detailHeight = window.innerHeight - 91 - 40 - 42 - 20;
    });
    self.loadData();
  },
  methods: {
    changeBCtime(time) {
      self.fromDate = time[0];
      self.toDate = time[1];
    },
    pageChange(val) {
      self.page.currentPage = val;
      self.loadData();
    },
    pageSizeChange(val) {
      self.pagesize = val;
      self.loadData();
    },
    loadData() {
      self.loading = true;
      getRefundList(self.tabActive, {
        start: self.fromDate,
        end: self.toDate,
        supplyId: self.supply,
        page: self.page.currentPage - 1,
        pagesize: self.pagesize,
      })
        .then(res => {
          let data = res.data.content;
          for (let i of data) {
            i.supplyName = i.supply.type == "COMPANY" ? i.supply.companyName : i.supply.humanName;
            if (self.tabActive == "PAID") {
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
            currentPage: res.data.number + 1,
          };
          self.loading = false;
          self.allChecked = false;
        })
        .catch(res => {
          self.loading = false;
          self.allChecked = false;
        });
      getRefundCount({
        start: self.fromDate,
        end: self.toDate,
        supplyId: self.supply,
      }).then(res => {
        self.statusCount = res.data;
      });
      getSupplyList(self.tabActive).then(res => {
        self.supplyList = res.data;
      });
    },
    searchIt() {
      self.loadData();
    },
    handleClick() {
      self.loadData();
    },
    handleCurrentChange(val) {
      // if(val.canCheck){
      //   val.checked = true;
      // }
      self.thisRow = val;
    },
    handlePreview(file) {
      this.previewImg = file.url;
      this.previewDialog = true;
    },
    outLimit() {
      self.$message.warning(self.$t("resources.outLimit"));
    },
    dialogClose() {
      self.fileList1 = [];
    },
    // 单选
    checkChange(row) {
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
    allCheckChange(val) {
      let data = JSON.parse(JSON.stringify(self.tableData));
      let supplyName = "";

      if (val) {
        // 判断是否已有check的supply
        for (let i of data) {
          if (i.checked) {
            supplyName = i.supplyName;
            break;
          }
        }

        // 如果没有则取第一个
        if (supplyName == "") {
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
    },
    confirmShow() {
      let data = JSON.parse(JSON.stringify(self.tableData));
      let orders = [];
      let member = {};
      let countAmount = 0;

      for (let i of data) {
        if (i.checked) {
          countAmount += i.actualAmount;
          orders.push(i.id);
          member = i.supplyName;
        }
      }
      if (orders.length == 0) {
        return self.$message.warning(self.$t("billing.cantConfirm"));
      }

      self.form = {
        member: member,
        countAmount: countAmount,
        orders: orders,
      };
      self.confirmDialog = true;
    },
    confirmIt() {
      let resourceIds = [];
      if (self.fileList.length == 0) {
        return self.$message.warning(self.$t("billing.cantRefund"));
      }
      self.confirmLoading = true;
      for (let i of self.fileList) {
        if (i.response) {
          resourceIds.push(i.response.data.id);
        }
      }
      confirmRefund({
        resourceIds: resourceIds.toString(),
        orderIds: self.form.orders.toString(),
      })
        .then(res => {
          self.loadData();
          self.confirmLoading = false;
          self.confirmDialog = false;
        })
        .catch(() => {
          self.confirmLoading = true;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.manage {
  height: 100%;
  box-sizing: border-box;
  .statusHeader {
    display: flex;
    box-sizing: border-box;
    margin-bottom: 20px;
    align-items: center;
    justify-content: flex-start;
  }
  .timePicker {
    height: 42px;
    line-height: 40px;
    display: flex;
    align-items: center;
  }
  .content {
    height: 100%;
    padding-left: 20px;
    display: flex;
    .container {
      width: 100%;
      background: #fff;
      padding: 20px;
      height: calc(100vh - 91px);
      overflow: auto;
      box-sizing: border-box;

      .containerContent {
        display: flex;
      }
      .center {
        width: 49%;
        margin-right: 1%;
      }

      .right {
        width: 49%;
        background: #fff;
        box-sizing: border-box;
      }
    }
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

.check-box {
  text-align: center;
}
</style>
<style lang="scss">
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

.inputWidth {
  .el-icon-plus {
    transform: translateY(-38px) !important;
  }
}

.billing .nav {
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
</style>
