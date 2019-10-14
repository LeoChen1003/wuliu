<template>
  <div class="manage">
    <div class="statusHeader">
      <div class="status-txt">{{ $t('billing.billingStatus') }}</div>
    </div>
    <el-tabs v-model="tabActive"
             tab-position="left"
             style="height:calc(100% - 50px);">
      <el-tab-pane :label="$t('tracking.Pending')">
        <div class="container">
          <el-table :data="[{},{},{}]"
                    border
                    :cell-style="cell">
            <el-table-column :label="$t('tracking.tracking')" />
            <el-table-column :label="$t('tracking.deliveryPoint')" />
            <el-table-column :label="$t('tracking.supply')" />
            <el-table-column :label="$t('tracking.remarks')">
              <el-checkbox v-model="checked" />
            </el-table-column>
            <el-table-column>
              <div>
                <el-button size="small"
                           type="primary"
                           @click="printeDialog = true">{{ $t('tracking.print') }}</el-button>
                <el-button size="small"
                           type="primary"
                           @click="comfirmDialog = true">{{ $t('tracking.confirm') }}</el-button>
              </div>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('tracking.toBeconfirmedOrderbyDemand')">
        <div class="container" />
      </el-tab-pane>
      <el-tab-pane :label="$t('tracking.toBeconfirmedOrderbySupply')">
        <div class="container" />
      </el-tab-pane>
      <el-tab-pane :label="$t('tracking.tobePickedUp')">
        <div class="container" />
      </el-tab-pane>
      <el-tab-pane :label="$t('tracking.intransit')">
        <div class="container" />
      </el-tab-pane>
      <el-tab-pane :label="$t('tracking.documentTobereturned')">
        <div class="container" />
      </el-tab-pane>
      <el-tab-pane :label="$t('tracking.completed')">
        <div class="container" />
      </el-tab-pane>
    </el-tabs>

    <el-dialog :title="$t('tracking.confirm')"
               :visible.sync="comfirmDialog"
               width="65%"
               class="comfirmDialog">
      <el-table :data="[{},{},{}]"
                border>
        <el-table-column :label="$t('tracking.supply')" />
        <el-table-column :label="$t('tracking.KPI')" />
        <el-table-column :label="$t('tracking.truckType')" />
        <el-table-column :label="$t('tracking.quotation')" />
      </el-table>
      <span slot="footer">
        <div class="footerBtn">
          <el-button size="small"
                     plain
                     style="width:300px;"
                     @click="printeDialog = false">{{ $t('tracking.confirm') }}</el-button>
        </div>
      </span>
    </el-dialog>
    <el-dialog :title="$t('tracking.print')"
               :visible.sync="printeDialog"
               width="65%"
               class="comfirmDialog">
      打印
      <span slot="footer">
        <div class="footerBtn">
          <el-button size="small"
                     plain
                     style="width:300px;"
                     @click="printeDialog = false">{{ $t('tracking.confirm') }}</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { truckType } from '../../api/data'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    return {
      comfirmDialog: false,
      printeDialog: false,
      categoryList: [],
      subCategoryList: []
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  created () { },
  mounted () {
    truckType().then(res => {
      self.categoryList = res.data.categories
      self.subCategoryList = res.data.subCategories
    })
  },
  methods: {
    cell () { }
  }
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.manage {
  height: 100%;
  padding-top: 20px;
  box-sizing: border-box;
}
.statusHeader {
  display: flex;
  .status-txt {
    height: 40px;
    line-height: 40px;
    padding-left: 40px;
    margin-bottom: 10px;
    width: 225px;
    font-size: 20px;
  }
}
.comfirmDialog {
  .footerBtn {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>
