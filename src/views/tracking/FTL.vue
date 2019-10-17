<template>
  <div class="manage">
    <div class="statusHeader">
      <el-button type="primary">{{$t('tracking.releaseAReturnTruck')}}</el-button>
    </div>
    <div style="display:flex;box-sizing:border-box;padding:0 20px;">
      <div style="height:100%;">
        <div class="statusText">{{ $t('billing.billingStatus') }}</div>
        <el-tabs v-model="tabActive"
                 tab-position="left"
                 style="height:calc(100% - 50px);">
          <el-tab-pane label="1">
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('tracking.Pending')}}<sub class="badge">1</sub></div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('tracking.toBeconfirmedOrderbyDemand')}}<sub class="badge">1</sub></div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('tracking.toBeconfirmedOrderbySupply')}}<sub class="badge">1</sub></div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('tracking.tobePickedUp')}}<sub class="badge">1</sub></div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('tracking.intransit')}}<sub class="badge">1</sub></div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">
              <div class="tabLabel">
                <div class="text">{{$t('tracking.documentTobereturned')}}<sub class="badge">1</sub></div>
              </div>
            </span>
          </el-tab-pane>
          <el-tab-pane>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="container">
        <el-table :data="[{},{},{}]"
                  border>
          <el-table-column :label="$t('tracking.tracking')"></el-table-column>
          <el-table-column :label="$t('tracking.cargo_VAS')"></el-table-column>
          <el-table-column :label="$t('tracking.deliveryPoint')"></el-table-column>
          <el-table-column :label="$t('tracking.price')"></el-table-column>
          <el-table-column :label="$t('tracking.pickupPoint')"></el-table-column>
          <el-table-column :label="$t('tracking.ETD')"></el-table-column>
          <el-table-column></el-table-column>
        </el-table>
      </div>
    </div>

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
    <el-dialog :title="$t('tracking.edit')"
               width="600px"
               :visible.sync="editDialog">
      <el-form ref="form"
               :model="form"
               label-width="120px">
        <el-form-item :label="$t('tracking.origin')"
                      required>
          <el-select v-model="form.fromProvinceCode"
                     class="formSelect"
                     filterable
                     placeholder="province">
            <el-option v-for="(item,index) in provinceList"
                       :key='index'
                       :label="item.name"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tracking.destination')"
                      required>
          <el-select v-model="form.toCityCode"
                     filterable
                     class="formSelect"
                     placeholder="city">
            <el-option v-for="(item,index) in cityList"
                       :key='index'
                       :label="item.name"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tracking.truckType')"
                      required>
          <el-select v-model="form.category"
                     filterable
                     class="formSelect"
                     placeholder="Truck type">
            <el-option v-for="(item,index) in truckTypes.categories"
                       :key='index'
                       :label="item.value"
                       :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tracking.availableCapacity')"
                      required>
          <el-input v-model="form.availableCapacity"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tracking.payload')">
          <el-input v-model="form.payload"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tracking.cutoffTime')"
                      required>
          <el-time-select v-model="form.finishedAt"
                          style="width:100%;"
                          :picker-options="timeOptions"
                          default-value="18:00">
          </el-time-select>
        </el-form-item>
        <el-form-item :label="$t('tracking.quotation')"
                      required>
          <el-input v-model="form.charge"
                    @mousewheel.native.prevent
                    type="number"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { getTruckType, getProvinceList, getCityList } from '../../api/data'
import { addRoute, updateRoute } from '@/api/resources'

let self;
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    return {
      tabActive: '1',
      printeDialog: false,
      editDialog: true,
      form: {
        category: '',
        subCategory: '',
        charge: '',
        finishedAt: '',
        fromProvinceCode: '',
        toCityCode: '',
        miles: '',
        supportLoading: '',
        humanWorkDay: '',
        moneyPerDay: '',
        status: '',
      },
      provinceList: [],
      cityList: [],
      truckTypes: {
        categories: [],
        subCategories: []
      },
      timeOptions: {
        start: '00:00',
        step: '00:15',
        end: '23:45'
      }
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  created () {
    self = this;
  },
  mounted () {
    self.loadData();
  },
  methods: {
    loadData () {
      getProvinceList().then(res => {
        self.provinceList = res.data;
      });
      getCityList().then(res => {
        self.cityList = res.data;
      });
      getTruckType().then(res => {
        self.truckTypes = res.data;
        let truckObj = new Object();
        for (let i of res.data.categories) {
          truckObj[i.key] = i.value;
        }
        self.truckObj = truckObj;
      });
    },
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
}

.tabLabel {
  display: flex;
  justify-content: flex-end;

  .badge {
    font-size: 12px;
    color: red;
    margin-left: 5px;
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