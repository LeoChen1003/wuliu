<template>
  <div class="manage">
    <el-row style="height:calc(100vh - 104px);">
      <el-col :span="6"
              style="height:100%;overflow:scroll;"
              class="searchBox">
        <div>
          <el-form ref="searchform"
                   :model="searchForm"
                   :rules="searchRules"
                   label-position="top"
                   :show-message="false"
                   size="small"
                   label-width="80px">
            <el-form-item prop="logisticType"
                          :label="$t('booking.logisiticsType')">
              <el-select v-model="logisticType"
                         class="inputWidth">
                <el-option v-for="item in logisticTypeOption"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item prop="pickUpRegion"
                          :label="$t('booking.pickupPoint')">
              <el-select v-model="searchForm.pickUpRegion"
                         filterable
                         remote
                         reserve-keyword
                         class="inputWidth"
                         v-el-select-loadmore="loadmore"
                         :placeholder="$t('placeholder.pleaseEnterLeywords')"
                         :remote-method="pickUpMethod"
                         @focus="clearSelect('pk')"
                         :loading="loading">
                <el-option v-for="item in pickUpRegionList"
                           :key="item.fullname"
                           :label="item.fullname"
                           :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="pickUpDate"
                          :label="$t('booking.pickupTime')">
              <div style="display:flex;"
                   class="inputWidth">
                <el-date-picker v-model="searchForm.pickUpDate"
                                type="date"
                                value-format='yyyy-MM-dd'
                                style="margin-right:5px;"
                                :placeholder="$t('placeholder.chooseDate')">
                </el-date-picker>
                <el-time-picker v-model="time"
                                format="HH:mm:ss"
                                value-format='HH:mm:ss'
                                :placeholder="$t('placeholder.chooseTime')">
                </el-time-picker>
              </div>
            </el-form-item>
            <el-form-item prop="deliveryRegion"
                          :label="$t('booking.deliveryPoint')">
              <el-select v-model="searchForm.deliveryRegion"
                         filterable
                         remote
                         reserve-keyword
                         @focus="clearSelect('del')"
                         class="inputWidth"
                         v-el-select-loadmore="loadmore"
                         :placeholder="$t('placeholder.pleaseEnterLeywords')"
                         :remote-method="pickUpMethod"
                         :loading="loading">
                <el-option v-for="item in delRegionList"
                           :key="item.fullname"
                           :label="item.fullname"
                           :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="truckCategory"
                          :label="$t('booking.truckType')">
              <el-select v-model="searchForm.truckCategory"
                         :placeholder="$t('placeholder.pleaseChoose')"
                         style="width:45%;">
                <el-option v-for="item in categoryList"
                           :key="item.key"
                           :label="item.value"
                           :value="item.key" />
              </el-select>
              <el-select v-model="searchForm.truckSubCategory"
                         :placeholder="$t('placeholder.pleaseChoose')"
                         style="width:45%;">
                <el-option v-for="item in subCategoryList"
                           :key="item.key"
                           :label="item.value"
                           :value="item.key" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <div style="display:flex;justify-content:center;align-items:center;width:90%;margin-top:20px;">
                <el-button type="primary"
                           @click="searchSupply"
                           :loading="searchloading"
                           class="inputWidth">{{ $t('booking.searchSupply') }}</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="18"
              style="height:100%;overflow:scroll;">
        <el-table :data="tableList"
                  border
                  style="width: 97%;margin-left:20px;">
          <el-table-column :label="$t('booking.supply')">
            <template slot-scope="scope">
              <div class="table_supply">
                <div class="item">{{scope.row.site? scope.row.site.companyName :''}}</div>
                <div class="item">
                  <div>{{$t('booking.loading')}}/{{$t('booking.unloading')}} : <i :class="scope.row.supportLoading == 1?'el-icon-check':'el-icon-close'"></i></div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="250"
                           :label="$t('booking.route')">
            <template slot-scope="scope">
              <div>
                {{ scope.row.fromProvince }} --> {{ scope.row.toCity }}
              </div>
              <div>
                {{$t('booking.transitTime')}} : {{scope.row.transitTime}}days
              </div>
            </template>
          </el-table-column>
          <el-table-column width="250"
                           :label="$t('booking.price')">
            <template slot-scope="scope">
              <div>{{$t('booking.feight')}} : {{scope.row.charge}}</div>
              <div v-if="scope.row.supportLoading == 1">{{$t('booking.loading')}}/{{$t('booking.unloading')}} : {{scope.row.loadingOrUnloadingHumanWorkDay*scope.row.moneyPerDay}}</div>
              <div>{{$t('booking.documentReturn')}} :{{documentReturn}}</div>
              <div>{{$t('booking.totalamt')}} : {{10+scope.row.charge+(scope.row.supportLoading == 1?scope.row.loadingOrUnloadingHumanWorkDay*scope.row.moneyPerDay:0)}}</div>
            </template>
          </el-table-column>
          <el-table-column width='95'>
            <template slot-scope="scope">
              <el-button type="primary"
                         @click="toBooking(scope.row)">{{$t('booking.placeOrder')}}</el-button>
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { ftlLine } from '../../api/booking';
import { getTruckType, findDistrictFullList } from '../../api/data'
import Search from '@/components/HeaderSearch';

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  directives: {
    'el-select-loadmore': {
      bind (el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
        SELECTWRAP_DOM.addEventListener('scroll', function () {
          /**
          * scrollHeight 获取元素内容高度(只读)
          * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
          * clientHeight 读取元素的可见高度(只读)
          * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
          * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
          */
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        });
      }
    }
  },
  data () {
    const self = this
    const validatorTruck = (rule, value, callback) => {
      if (!value || !self.searchForm.truckSubCategory) {
        callback(new Error(''));
      } else {
        callback();
      }
    };
    return {
      searchForm: {
        truckCategory: '',
        truckSubCategory: '',
        pickUpDate: '',
        deliveryRegion: '',
        pickUpRegion: ''
      },
      searchRules: {
        deliveryRegion: [{ required: true, }],
        pickUpRegion: [{ required: true, }],
        pickUpDate: [{ required: true, }],
        truckCategory: [{ required: true, validator: validatorTruck }],
      },
      time: '00:00:00',
      options: [],
      logisticType: 'FTL',
      logisticTypeOption: [
        {
          value: 'FTL',
          label: 'FTL'
        },
        // {
        //   value: 'LTL',
        //   label: 'LTL'
        // }
      ],
      tableList: [],
      loading: false,
      searchloading: false,
      categoryList: [],
      subCategoryList: [],
      pickUpQuery: '',
      pickUpRegionList: [],
      delRegionList: [],
      delQuery: '',
      isLast: false,
      regionPage: 0,
      curSelect: '',
      page: {
        total: 0,
        currentPage: 1
      },
      pagesize: 20,
      documentReturn: 10
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  created () { },
  mounted () {
    const self = this
    getTruckType().then(res => {
      self.categoryList = res.data.categories
      self.subCategoryList = res.data.subCategories
    })
    if (self.$route.query.return == 1) {
      let consultInfo = JSON.parse(localStorage.getItem('consultInfo'))
      console.log(consultInfo)
      self.searchForm = consultInfo.searchForm
      self.logisticType = consultInfo.logisticType
      self.time = consultInfo.time
      self.pickUpRegionList = consultInfo.pickUpRegionList
      self.delRegionList = consultInfo.delRegionList
      self.searchSupply()
    }
  },
  methods: {
    toBooking (row) {
      const self = this
      let consultInfo = {}
      consultInfo.data = row
      consultInfo.pickUpRegionList = self.pickUpRegionList
      consultInfo.delRegionList = self.delRegionList
      consultInfo.searchForm = self.searchForm
      consultInfo.logisticType = self.logisticType
      consultInfo.time = self.time
      localStorage.setItem('consultInfo', JSON.stringify(consultInfo))
      this.$router.replace('/booking/placeOrder');
    },
    pickUpMethod (query) {
      const self = this
      console.log(query)
      if (query !== '') {
        if (self.curSelect == 'pk') {
          self.pickUpQuery = query
        } else {
          self.delQuery = query
        }
        self.loading = true;
        setTimeout(() => {
          self.loading = false;
          self.getdistrictFullList(query, self.regionPage)
        }, 200);
      } else {
        self.regionList = [];
      }
    },
    loadmore () {
      const self = this
      if (!self.isLast) {
        self.regionPage += 1
        if (self.curSelect == 'pk') {
          self.getdistrictFullList(self.pickUpQuery, self.regionPage);
        } else {
          self.getdistrictFullList(self.delQuery, self.regionPage);
        }
      }
    },
    getdistrictFullList (query, page) {
      const self = this
      findDistrictFullList({
        name: query
      }, {
        page: page
      }).then(res => {
        self.isLast = res.data.last
        if (!res.data.first) {
          if (self.curSelect == 'pk') {
            self.pickUpRegionList = self.pickUpRegionList.concat(res.data.content)
          } else {
            self.delRegionList = self.delRegionList.concat(res.data.content)
          }
        } else {
          if (self.curSelect == 'pk') {
            self.pickUpRegionList = res.data.content
          } else {
            self.delRegionList = res.data.content
          }
        }
      })
    },
    // 聚焦初始化     
    clearSelect (type) {
      const self = this
      if (type == 'pk') {
        self.pickUpQuery = ''
        self.curSelect = 'pk'
      } else {
        self.delQuery = ''
        self.curSelect = 'del'
      }
      self.regionPage = 0
      self.isLast = false
    },
    // 搜索
    searchSupply () {
      this.$refs.searchform.validate(valid => {
        if (valid) {
          const self = this
          self.searchloading = true
          if (self.time) {
            self.searchForm.pickUpDate += ' ' + self.time
          }
          if (self.logisticType == 'FTL') {
            ftlLine(self.searchForm, {
              page: self.page.currentPage - 1,
              pagesize: self.pagesize
            }).then(res => {
              self.searchloading = false
              self.tableList = res.data.content
              self.page = {
                total: res.data.totalPages,
                currentPage: res.data.number + 1
              }
            }).catch(el => {
              self.searchloading = false
            })
          }
        }
      })
    },
    pageChange (val) {
      let self = this
      self.page.currentPage = val
      self.searchSupply()
    },
    pageSizeChange (val) {
      let self = this;
      self.pagesize = val
      self.searchSupply()
    },
  }
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.manage {
  padding-top: 20px;
  box-sizing: border-box;
  padding-left: 20px;
  .searchBox {
    border-right: 2px solid #dfe4ed;
  }
  .table_supply {
    display: flex;
    align-items: center;
    .item {
      width: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
}
.inputWidth {
  width: 90%;
}
::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
}
</style>
