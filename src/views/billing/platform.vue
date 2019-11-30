<template>
  <div class="manage billing">
    <div class="statusHeader">
      <div class="status-txt">{{ $t('billing.billingStatus') }}</div>
      <div class="date-box">
        <span style="margin: 0 10px;">{{$t('billing.date')}}</span>
        <bcTime @changeBCtime="changeBCtimeFrom"
                :timeType="'all'"
                :dateDefault='[0,0,0]'></bcTime>
        <span style="margin:0 5px;">~</span>
        <bcTime @changeBCtime="changeBCtimeTo"
                :dateDefault='[0,0,0]'
                style="margin-left:5px;"
                :timeType="'all'"></bcTime>
      </div>
      <span style="margin: 0 10px 0 15px;">{{$t('placeholder.amount')}}</span>
      <el-input type="number"
                v-model.number="amount"
                style="width:200px;"></el-input>
      <span style="margin: 0 10px 0 15px;">{{$t('billing.member')}}</span>
      <el-input v-model="member"
                style="width:200px;"></el-input>
      <el-button style='margin-left:10px;'
                 icon="el-icon-search"
                 @click="searchIt"
                 type="primary">{{ $t('billing.search') }}</el-button>
      <el-button @click="cancelIt">{{ $t('billing.cancel') }}</el-button>
    </div>
    <div class="content">
      <div>
        <el-tabs v-model="tabActive"
                 tab-position="left"
                 @tab-click="handleClick"
                 style="height:100%;">
          <el-tab-pane name="DEFAULT">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('billing.toBeConfirmed')}}<sub class="badge red">{{statusCount.DEFAULT}}</sub></div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="ACCEPT">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('billing.confirmed')}}<sub class="badge">{{statusCount.ACCEPT}}</sub></div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="REJECTED">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('billing.rejected')}}<sub class="badge">{{statusCount.REJECTED}}</sub></div>
              </div>
            </span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="container">
        <div class="center">
          <el-table :data="dataList"
                    highlight-current-row
                    @current-change="handleCurrentChange"
                    border>
            <el-table-column prop="operateAt"
                             width="100"
                             :label="$t('billing.date')">
              <template slot-scope="scope">
                {{scope.row.operateAt.slice(0,10) + ' ' +scope.row.operateAt.slice(11,19)}}
              </template>
            </el-table-column>
            <el-table-column :label="$t('billing.description')">
              <template slot-scope="scope">
                <div>{{ scope.row.financeAccountType }}</div>
                <div>{{ scope.row.site.type == "COMPANY" ? scope.row.site.companyName : scope.row.site.humanName }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="amount"
                             :label="$t('billing.amount')">
              <template slot-scope="scope">
                {{scope.row.amount}}
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
        <el-card class="right"
                 shadow="never">
          <el-image :src='thisRow.resource.path'
                    :preview-src-list="thisRow.preViewList"
                    v-if="thisRow">
            <!-- <div slot="error"
                 class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div> -->
          </el-image>
          <div class="note-box"
               v-if="thisRow">
            {{ $t('billing.note') }}:{{ thisRow.remarks }}
          </div>
          <div class="handle-box"
               v-if="thisRow && (tabActive == 'ACCEPT' || tabActive == 'REJECTED')">
            <el-form label-width="150px"
                     label-position="left"
                     size="small">
              <el-form-item :label="$t('billing.confirmedBy')">
                {{ thisRow.handledName }}
              </el-form-item>
              <el-form-item :label="$t('billing.date')">
                {{ thisRow.handledAt }}
              </el-form-item>
              <el-form-item :label="$t('billing.note')"
                            v-if="tabActive == 'REJECTED'">
                {{ thisRow.handleNote }}
              </el-form-item>
            </el-form>
          </div>
          <div class="btn-box"
               v-if="thisRow && tabActive == 'DEFAULT'">
            <el-button type="primary"
                       @click="confirmDialog = true">{{$t('billing.confirm')}}</el-button>
            <el-button type="info"
                       @click="refuseVisible = true;reason='';">{{$t('billing.reject')}}</el-button>
          </div>
        </el-card>
      </div>
    </div>
    <el-dialog :title="$t('billing.refuseTitle')"
               :visible.sync="refuseVisible"
               center
               width="600px">
      <div>
        <div style="text-align:center;margin-bottom:20px;">{{$t('member.reasonsForRefusal')}}</div>
        <div>
          <el-input v-model="reason"
                    type="textarea"
                    style="resize:none;width:100%;"
                    class="inp"></el-input>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="refuseVisible = false">{{ $t('member.cancel') }}</el-button>
        <el-button type="info"
                   :loading="refuseLoading"
                   @click="rejectIt">{{ $t('member.reject') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="$t('billing.confirmTitle')"
               :visible.sync="confirmDialog"
               center
               width="700px">
      <div>
        <el-form label-width="200px"
                 v-if='thisRow'>
          <el-form-item :label="$t('billing.date')">
            {{ thisRow.operateAt }}
          </el-form-item>
          <el-form-item :label="$t('billing.member')">
            {{thisRow.site.type == "COMPANY" ? thisRow.site.companyName : thisRow.site.humanName }}
          </el-form-item>
          <el-form-item :label="$t('billing.rechargeType')">
            {{ thisRow.financeAccountType }}
          </el-form-item>
          <el-form-item :label="$t('billing.amount')">
            {{ thisRow.amount }}
          </el-form-item>
        </el-form>
        <div class="confirm-text">
          {{$t('billing.confirmText')}}
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="confirmDialog = false">{{$t('billing.cancel')}}</el-button>
        <el-button type="primary"
                   @click="confirmIt">{{$t('billing.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { billingList, billingAccept, billingReject, billplatformCount } from "../../api/billing"
import { getToken } from '@/utils/auth'
import { getTime, parseTime, getLastMonthTime } from '../../utils/index'
import bcTime from "@/components/bcTime";

let self;

export default {
  // import引入的组件需要注入到对象中才能使用
  components: { bcTime },
  data () {
    const self = this;
    return {
      tabActive: 'DEFAULT',
      loading: false,
      refuseVisible: false,
      refuseLoading: false,
      curId: null,
      reason: '',
      value1: '',
      dataList: [],
      showUrl: '',
      page: {
        total: 0,
        currentPage: 1
      },
      pagesize: 20,
      amount: null,
      statusCount: {},
      thisRow: null,
      confirmDialog: false,
      fromDate: null,
      toDate: null,
      member: ''
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
    self = this;
  },
  mounted () {
    this.getList();
    this.getCount();
  },
  methods: {
    getList () {
      let form = {
        audit_status: self.tabActive,
        amount: self.amount ? self.amount : 0,
        memberName: self.member,
        start: self.fromDate,
        end: self.toDate
      }
      billingList(form, {
        page: self.page.currentPage - 1,
        pagesize: self.pagesize,
      }).then(res => {
        self.dataList = res.data.content
        self.page = {
          total: res.data.totalElements,
          currentPage: res.data.number + 1
        }
      })
    },
    getCount () {
      billplatformCount(self.apply_type).then(res => {
        self.statusCount = res.data
      })
    },
    searchIt () {
      self.getList()
      self.getCount();
    },
    cancelIt () {
      self.amount = null;
      self.fromDate = null;
      self.toDate = null;
      self.member = '';
      self.getList()
    },
    changeBCtimeFrom (time) {
      self.fromDate = time
    },
    changeBCtimeTo (time) {
      self.toDate = time
    },
    pageChange (val) {
      self.page.currentPage = val;
      self.getList();
    },
    pageSizeChange (val) {
      self.pagesize = val;
      self.getList();
    },
    handleClick () {
      self.thisRow = null;
      this.getList();
    },
    handleCurrentChange (val) {
      if (val) {
        val.preViewList = [val.resource.path];
        self.thisRow = val;
      }
    },
    // 确认
    confirmIt () {
      billingAccept({
        id: self.thisRow.id,
      }).then(res => {
        self.$message.success(res.message);
        self.confirmDialog = false;
        self.getList();
        self.getCount();
      })
    },
    // 拒绝
    rejectIt () {
      if(self.reason == ''){
        return self.$message.warning(self.$t('billing.pleaseEnterTheReasonForRejection'))
      }
      self.refuseLoading = true;
      billingReject({
        id: self.thisRow.id,
        note: self.reason
      }).then(res => {
        self.$message.success(res.message);
        self.refuseVisible = false;
        self.refuseLoading = false;
        self.dialogVisible = false;
        self.getList();
        self.getCount();
      }).catch(el => {
        self.refuseLoading = false;
      })
    },
  }
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.manage {
  box-sizing: border-box;
  height: 100%;
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
    padding-left: 30px;
  }
  .content {
    padding-left: 25px;
    display: flex;
    height: calc(100% - 50px);
    .container {
      display: flex;
      padding-left: 20px;
      padding-top: 20px;
      width: 100%;
      overflow: scroll;
      .center {
        width: 49%;
        margin-right: 1%;
      }
      .right {
        width: 49%;
        padding: 0 10px;
        overflow: scroll;
        text-align: center;
        // min-height: calc(100% - 50px);
        // border: 2px solid #dfe6ec;
        // display: flex;
        // justify-content: center;
        // align-items: center;
      }
    }
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: -100px;
  }
}
.inputWidth {
  width: 350px;
}
.inp {
  width: 400px;
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

.confirm-text {
  margin: 10px 0;
  color: red;
  text-align: center;
}

.btn-box {
  text-align: center;
  margin-top: 20px;
}

.note-box {
  box-sizing: border-box;
  padding: 20px;
  border-bottom: 1px solid #ccc;
  text-align: left;
}

.handle-box {
  text-align: left;
  box-sizing: border-box;
  padding-left: 100px;
}

.date-box {
  display: flex;
  align-items: center;
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
