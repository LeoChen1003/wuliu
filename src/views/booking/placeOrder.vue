<template>
  <div class="manage">
    <div style="display:flex;justify-content:flex-end;align-items:center;margin-bottom:15px;">
      <el-button style="width:150px;"
                 @click="todoIt"
                 type="primary">{{$t('booking.placeOrder')}}</el-button>
    </div>
    <el-form ref="bookingform"
             :model="bookingForm"
             label-position="top"
             size="small">
      <el-row class="itemRow">
        <el-col :span="8">
          <el-form-item :label="$t('booking.logisiticsType')">
            <el-select v-model="bookingForm.orderInfo.lineType"
                       :placeholder="$t('placeholder.pleaseChoose')"
                       class="inputWidth">
              <el-option v-for="item in logisticType"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('booking.sender')">
            <el-select v-model="bookingForm.lt"
                       :placeholder="$t('placeholder.pleaseChoose')"
                       class="inputWidth">
              <el-option v-for="item in options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('booking.pickupTime')">
            <div class="inputWidth"
                 style="display:flex;">
              <el-date-picker v-model="bookingForm.senderAddress.pickAt"
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
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('booking.pickupPoint')">
            <el-input :placeholder="$t('placeholder.placeEnterSenderName')"
                      v-model="bookingForm.senderAddress.name"
                      class="inputWidth inputBottom"></el-input>
            <el-input :placeholder="$t('placeholder.pleaseEnterTelNumber')"
                      v-model="bookingForm.senderAddress.mobile"
                      class="inputWidth inputBottom"></el-input>
            <el-input :placeholder="$t('placeholder.pleaseEnterDetailAddress')"
                      v-model="bookingForm.senderAddress.addressDetail"
                      class="inputWidth inputBottom"></el-input>
            <el-select v-model="bookingForm.senderAddress.code"
                       filterable
                       remote
                       reserve-keyword
                       class="inputWidth"
                       v-el-select-loadmore="loadmore"
                       :placeholder="$t('placeholder.pleaseEnterLeywords')"
                       :remote-method="pickUpMethod"
                       @focus="clearSelect('pk')"
                       :loading="searchloading">
              <el-option v-for="item in pickUpRegionList"
                         :key="item.fullname"
                         :label="item.fullname"
                         :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('booking.destination')">
            <el-input :placeholder="$t('placeholder.pleaseEnterRecipieName')"
                      v-model="bookingForm.receiverAddress.name"
                      class="inputWidth inputBottom"></el-input>
            <el-input :placeholder="$t('placeholder.pleaseEnterTelNumber')"
                      v-model="bookingForm.receiverAddress.mobile"
                      class="inputWidth inputBottom"></el-input>
            <el-input :placeholder="$t('placeholder.pleaseEnterDetailAddress')"
                      v-model="bookingForm.receiverAddress.addressDetail"
                      class="inputWidth inputBottom"></el-input>
            <el-select v-model="bookingForm.receiverAddress.code"
                       filterable
                       remote
                       reserve-keyword
                       @focus="clearSelect('del')"
                       class="inputWidth"
                       v-el-select-loadmore="loadmore"
                       :placeholder="$t('placeholder.pleaseEnterLeywords')"
                       :remote-method="pickUpMethod"
                       :loading="searchloading">
              <el-option v-for="item in delRegionList"
                         :key="item.fullname"
                         :label="item.fullname"
                         :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="itemRow">
        <el-col :span="8">
          <el-form-item :label="$t('booking.valueAddedService')">
            <el-checkbox v-model="unloading"
                         class="inputWidth inputBottom"
                         style="margin-left: 10px;"
                         :label="$t('booking.unloading')"
                         border></el-checkbox>
            <el-checkbox v-model="loading"
                         class="inputWidth inputBottom"
                         :label="$t('booking.loading')"
                         border></el-checkbox>
            <el-checkbox v-model="documentReturn"
                         class="inputWidth inputBottom"
                         :label="$t('booking.documentReturn')"
                         border></el-checkbox>
            <el-checkbox v-model="liability"
                         class="inputWidth inputBottom"
                         :label="$t('booking.liability')"
                         border></el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('booking.truckType')">
            <el-select v-model="bookingForm.truckCategory"
                       :placeholder="$t('placeholder.pleaseChoose')"
                       style="width:45%;">
              <el-option v-for="item in categoryList"
                         :key="item.key"
                         :label="item.value"
                         :value="item.key" />
            </el-select>
            <el-select v-model="bookingForm.truckSubCategory"
                       :placeholder="$t('placeholder.pleaseChoose')"
                       style="width:45%;">
              <el-option v-for="item in subCategoryList"
                         :key="item.key"
                         :label="item.value"
                         :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('booking.supply')">
            <el-select v-model="bookingForm.transportInfo.companyName"
                       class="inputWidth">
              <el-option v-for="item in options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('booking.referenceNo')">
            <el-input v-model="bookingForm.orderInfo.outNumber"
                      class="inputWidth" />
          </el-form-item>
          <el-form-item :label="$t('booking.remarks')">
            <el-input v-model="bookingForm.orderInfo.remark"
                      type="textarea"
                      class="inputWidth" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('booking.shareTruck')">
            <el-radio v-model="radio"
                      label="1"
                      border>{{$t('booking.fullTruckLoad')}}</el-radio>
            <el-radio v-model="radio"
                      label="2"
                      border>{{$t('booking.sharetruckLoad')}}</el-radio>
          </el-form-item>
          <el-form-item :label="$t('booking.cargoShape')">
            <el-radio v-model="radio"
                      :label="index+1"
                      border
                      style="margin-left:0px;"
                      v-for="(item,index) in [{},{},{},{},{},{},{},{}]"
                      :key="index"></el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="itemRow"
              :gutter="40">
        <el-col :span="15">
          <el-button type="primary"
                     @click="pushIt"
                     style="margin-bottom:10px;"
                     icon="el-icon-circle-plus-outline">{{$t('booking.add')}}</el-button>
          <el-table border
                    :data="bookingForm.propertyList">
            <el-table-column prop="propertyType"
                             :label="$t('booking.cargoType')">
              <template slot-scope="scope">
                <el-select v-model="scope.row.propertyType"
                           :placeholder="$t('placeholder.pleaseChoose')">>
                  <el-option v-for="item in sexList"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="name"
                             :label="$t('booking.commodity')">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="number"
                             :label="$t('booking.qty')">
              <template slot-scope="scope">
                <el-input type="number"
                          v-model="scope.row.number"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="unit"
                             :label="$t('booking.unit')">
              <template slot-scope="scope">
                <el-select :placeholder="$t('placeholder.pleaseChoose')">>
                  <el-option v-for="item in sexList"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="sizeType"
                             :label="$t('booking.size')">
              <template slot-scope="scope">
                <el-select v-model="scope.row.sex"
                           :placeholder="$t('placeholder.pleaseChoose')">
                  <el-option v-for="item in sexList"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="weightOfEach"
                             :label="$t('booking.weight')">
              <template slot-scope="scope">
                <el-input type="number"
                          v-model="scope.row.weightOfEach"></el-input>
              </template>
            </el-table-column>
            <el-table-column width="50">
              <template slot-scope="scope">
                <div class="table-op">

                  <div @click="delIt(scope.row,scope.$index)">
                    <i class="el-icon-delete"
                       style="color:#F25C5C;"></i>
                  </div>
                </div>
              </template>
            </el-table-column>

          </el-table>
        </el-col>
        <el-col :span="7">
          <el-table :data="[]"
                    border>
            <el-table-column label="item"></el-table-column>
            <el-table-column label="Amount"></el-table-column>
          </el-table>

          <el-form-item :label="$t('booking.accountBalance')"
                        style="margin-top:30px;">
            <div style="display:flex;justify-content:space-between;">
              <el-tag style="width:100px;text-align:center;">1500</el-tag>
              <el-button style="width:150px;"
                         type="primary">{{$t('booking.topUp')}}</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { ftlCharge, placeOrder } from '../../api/booking'
import { truckType, districtFullList } from '../../api/data'

export default {
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
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    return {
      bookingForm: {
        orderInfo: {
          lineType: 'FTL',
          outNumber: '',
          remark: ''
        },
        senderAddress: {
          pickAt: '',
          name: '',
          mobile: '',
          addressDetail: '',
          code: '',
        },
        receiverAddress: {
          name: '',
          mobile: '',
          addressDetail: '',
          code: '',
        },
        transportInfo: {
          companyName: '',
          ftlLineId: '',
          carType: '',
          carriage: ''
        },
        chargeList: [

        ],
        propertyList: [{
          propertyType: 'CONSUMER_PRODUCT',
          name: 'minafei',
          number: 1,
          unit: 'BAG',
          sizeType: '1',
          weightOfEach: 28
        }]
      },
      documentReturn: false,
      liability: false,
      loading: false,
      unloading: false,
      time: '',
      searchloading: false,
      pickUpQuery: '',
      pickUpRegionList: [],
      delRegionList: [],
      delQuery: '',
      isLast: false,
      page: 0,
      curSelect: '',
      categoryList: [],
      subCategoryList: [],
      sexList: [{ label: "nan", value: "1" }, { label: "nv", value: "0" }],
      options: [],
      logisticType: [
        {
          value: 'FTL',
          label: 'FTL'
        }, {
          value: 'LTL',
          label: 'LTL'
        }
      ],
      value1: "",
      checked: false,
      radio: "2",
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
    ftlCharge({
      deliveryAddress: '',
      deliveryContact: '12',
      deliveryMobile: '32',
      deliveryRegion: 'TH010701',
      documentReturn: self.documentReturn,
      liability: self.liability,
      loading: self.loading,
      unloading: self.unloading,
      pickUpDate: '2019-10-14',
      pickUpRegion: 'TH010701',
      pickUpAddress: '345',
      pickUpMobile: '12345',
      pickUpContact: 'nihao',
      supply_id: 0,
      ftl_line_id: 140,
      truckCategory: 'WHEEL4',
      truckSubCategory: 'Corral',
    }).then(res => {

    })
  },
  methods: {
    pickUpMethod (query) {
      const self = this
      console.log(query)
      if (query !== '') {
        if (self.curSelect == 'pk') {
          self.pickUpQuery = query
        } else {
          self.delQuery = query
        }
        self.searchloading = true;
        setTimeout(() => {
          self.searchloading = false;
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
    todoIt () {
      const self = this
      console.log(self.bookingForm)
      placeOrder(self.bookingForm).then(res => {

      })
    },
    pushIt () {
      const self = this
      self.bookingForm.propertyList.push({
        propertyType: '',
        name: '',
        number: null,
        unit: '',
        sizeType: '',
        weightOfEach: null
      })
    },
    delIt (row, index) {
      const self = this
      self
        .$confirm(this.$t('booking.aysDel'), this.$t('confirm.tips'), {
          confirmButtonText: this.$t('booking.delete'),
          cancelButtonText: this.$t('member.cancel')
        })
        .then(() => {
          self.bookingForm.propertyList.splice(index, 1)
        })
        .catch(() => { });
    }
  }
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.manage {
  padding: 20px;
  box-sizing: border-box;
  .itemRow {
    border-top: 1px solid #dfe4ed;
    padding: 10px;
    box-sizing: border-box;
  }
  .table-op {
    display: flex;
    align-items: center;
    font-size: 20px;
    color: #168bd5;
    div {
      width: 100%;
      text-align: center;
      cursor: pointer;
    }
  }
}
.inputWidth {
  width: 80%;
}
.inputBottom {
  margin-bottom: 20px;
}
</style>
