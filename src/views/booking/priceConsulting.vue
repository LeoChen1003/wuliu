<template>
  <div class="manage">
    <el-row style="height:100%;">
      <el-col :span="6"
              style="height:100%;"
              class="searchBox">
        <div>
          <el-form ref="form"
                   :model="searchForm"
                   label-position="top"
                   size="small"
                   label-width="80px">
            <el-form-item :label="$t('booking.logisiticsType')">
              <el-select v-model="logisticType"
                         class="inputWidth">
                <el-option v-for="item in logisticTypeOption"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('booking.pickupPoint')">
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
            <el-form-item :label="$t('booking.pickupTime')">
              <div style="display:flex;"
                   class="inputWidth">
                <el-date-picker v-model="searchForm.pickUpDate"
                                type="date"
                                value-format='yyyy-MM-dd'
                                style="margin-right:5px;"
                                :placeholder="$t('placeholder.chooseDate')">
                </el-date-picker>
                <el-time-picker v-model="time"
                                value-format='HH-MM-dd'
                                :placeholder="$t('placeholder.chooseTime')">
                </el-time-picker>
              </div>
            </el-form-item>
            <el-form-item :label="$t('booking.deliveryPoint')">
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
            <el-form-item :label="$t('booking.truckType')">
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
      <el-col :span="18">
        <el-table :data="tableList"
                  border
                  style="width: 97%;margin-left:20px;">
          <el-table-column :label="$t('booking.supply')">
            <template slot-scope="scope">
              {{scope.row.site? scope.row.site.companyName:''}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('booking.route')">
            <template slot-scope="scope">
              {{scope.row.site? scope.row.site.companyName:''}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('booking.price')">
            <template slot-scope="scope">
              {{scope.row.charge/100}}
            </template>
          </el-table-column>
          <el-table-column width='150'>
            <template slot-scope="scope">
              <el-button @click="toBooking">{{$t('booking.placeOrder')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { ftlLine } from '../../api/booking';
import { truckType, districtFullList } from '../../api/data'

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
    return {
      searchForm: {
        truckCategory: '',
        truckSubCategory: '',
        pickUpDate: '',
        deliveryRegion: '',
        pickUpRegion: ''
      },
      time: '',
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
      page: 0,
      curSelect: ''
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  created () { },
  mounted () {
    const self = this
    truckType().then(res => {
      self.categoryList = res.data.categories
      self.subCategoryList = res.data.subCategories
    })
  },
  methods: {
    toBooking () {
      this.$router.push("/booking/placeOrder");
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
          self.getdistrictFullList(query, self.page)
        }, 200);
      } else {
        self.regionList = [];
      }
    },
    loadmore () {
      const self = this
      if (!self.isLast) {
        self.page += 1
        if (self.curSelect == 'pk') {
          self.getdistrictFullList(self.pickUpQuery, self.page);
        } else {
          self.getdistrictFullList(self.delQuery, self.page);
        }
      }


    },
    getdistrictFullList (query, page) {
      const self = this
      districtFullList({
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
      self.page = 0
      self.isLast = false
    },
    // 搜索
    searchSupply () {
      const self = this
      self.searchloading = true
      if (self.time) {
        self.searchForm.pickUpDate += ' ' + self.time
      }
      if (self.logisticType == 'FTL') {
        ftlLine(self.searchForm).then(res => {
          self.searchloading = false
          self.tableList = res.data.content
        }).catch(el => {
          self.searchloading = false
        })
      }
    }
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
}
.inputWidth {
  width: 90%;
}
</style>
