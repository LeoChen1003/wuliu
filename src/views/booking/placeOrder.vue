<template>
  <div class="manage booking">
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
                       disabled
                       :placeholder="$t('placeholder.pleaseChoose')"
                       class="inputWidth">
              <el-option v-for="item in logisticType"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('booking.sender')">
            <el-select v-model="bookingForm.senderAddress.name"
                       :placeholder="$t('placeholder.pleaseChoose')"
                       class="inputWidth">
              <el-option v-for="item in senderList"
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
                              disabled
                              value-format='yyyy-MM-dd'
                              style="margin-right:5px;"
                              :placeholder="$t('placeholder.chooseDate')">
              </el-date-picker>
              <el-time-picker v-model="time"
                              disabled
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
                       disabled
                       remote
                       reserve-keyword
                       class="inputWidth"
                       v-el-select-loadmore="loadmore"
                       :placeholder="$t('placeholder.administrativeDivision')"
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
                       disabled
                       reserve-keyword
                       @focus="clearSelect('del')"
                       class="inputWidth"
                       v-el-select-loadmore="loadmore"
                       :placeholder="$t('placeholder.administrativeDivision')"
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
                         :disabled="consultInfo.data.supportLoading == 0"
                         :label="$t('booking.unloading')"
                         border></el-checkbox>
            <el-checkbox v-model="loading"
                         class="inputWidth inputBottom"
                         :disabled="consultInfo.data.supportLoading == 0"
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
            <el-input :placeholder="$t('placeholder.amount')"
                      type="number"
                      v-if="liability"
                      style="margin-left:10px;"
                      v-model="liabilityCon"
                      class="inputWidth">
              <el-select v-model="liabilitySelect"
                         slot="append"
                         :placeholder="$t('placeholder.pleaseChoose')">
                <el-option label="PCS"
                           value="PCS"></el-option>
                <el-option label="Shipment"
                           value="Shipment"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('booking.truckType')">
            <el-select v-model="bookingForm.transportInfo.carType"
                       disabled
                       :placeholder="$t('placeholder.pleaseChoose')"
                       style="width:45%;">
              <el-option v-for="item in categoryList"
                         :key="item.key"
                         :label="item.value"
                         :value="item.key" />
            </el-select>
            <el-select v-model="bookingForm.transportInfo.carriage"
                       disabled
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
                       disabled
                       class="inputWidth">
              <el-option v-for="item in supplyList"
                         :key="item.site.companyName"
                         :label="item.site.companyName"
                         :value="item.site.companyName" />
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
            <el-radio-group v-model="shareTruck">
              <el-radio :label="false"
                        border>{{$t('booking.fullTruckLoad')}}</el-radio>
              <el-radio :label="true"
                        border>{{$t('booking.sharetruckLoad')}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('booking.cargoShape')"
                        v-if="shareTruck">
            <el-radio v-model="cargoShape"
                      :label="`${index+1}`"
                      border
                      style="margin-left:0px;"
                      v-for="(item,index) in cargoShapeList"
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
                           :placeholder="$t('placeholder.pleaseChoose')">
                  <el-option v-for="item in propertyTypeList"
                             :key="item.key"
                             :label="item.value"
                             :value="item.key"></el-option>
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
                <el-select :placeholder="$t('placeholder.pleaseChoose')"
                           v-model="scope.row.unit">
                  <el-option v-for="item in unitList"
                             :key="item.key"
                             :label="item.value"
                             :value="item.key"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="sizeType"
                             :label="$t('booking.size')">
              <template slot-scope="scope">
                <el-select v-model="scope.row.sizeType"
                           @change="(val)=>sizeSelect(val,scope.$index)"
                           :placeholder="$t('placeholder.pleaseChoose')">
                  <el-option v-for="item in sizeTypeList"
                             :key="item.key"
                             :label="item.value"
                             :value="item.key"></el-option>

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
          <!-- <el-button type="primary"
                     @click="viewIt"
                     style="margin-bottom:10px;"
                     icon="el-icon-s-order">{{$t('booking.viewValuation')}}</el-button> -->
          <el-table :data="amountList"
                    ref="amountTable"
                    show-summary
                    :sum-text="$t('booking.totalamt')"
                    border>
            <el-table-column prop="label"
                             label="item"></el-table-column>
            <el-table-column prop="amount"
                             label="Amount"></el-table-column>

          </el-table>
          <el-form-item :label="$t('booking.accountBalance')"
                        style="margin-top:30px;">
            <div style="display:flex;justify-content:space-between;">
              <el-tag style="width:100px;text-align:center;">{{currentBalance}}</el-tag>
              <el-button style="width:150px;"
                         type="primary">{{$t('booking.topUp')}}</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog :visible.sync="sizeDialog"
               width="30%"
               title="extra_size"
               center>
      <div>
        <el-form label-position='right'
                 label-width="120px">
          <el-form-item :label="$t('placeholder.width')+':'">
            <el-input type="number"
                      :placeholder="$t('placeholder.width')"
                      style="width:200px;"
                      v-model="size_width"
                      size="small"></el-input>
          </el-form-item>
          <el-form-item :label="$t('placeholder.length')+':'">
            <el-input type="number"
                      :placeholder="$t('placeholder.length')"
                      style="width:200px;"
                      v-model="size_length"
                      size="small"></el-input>
          </el-form-item>
          <el-form-item :label="$t('placeholder.height')+':'">
            <el-input type="number"
                      :placeholder="$t('placeholder.height')"
                      style="width:200px;"
                      v-model="size_height"
                      size="small"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="sizeConfirm"
                   style="width:150px;">{{$t('booking.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { ftlCharge, placeOrder } from '../../api/booking'
import { getTruckType, findDistrictFullList, getGoodsProperty, getSenderList, getTransportList, myAccount } from '../../api/data'

export default {
  directives: {
    'el-select-loadmore': {
      bind (el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
        SELECTWRAP_DOM.addEventListener('scroll', function () {
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
    const self = this
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
          {
            chargeType: "CARPOOL",
            chargeIntro: "false",
            money: 0
          }
        ],
        propertyList: [{
          propertyType: '',
          name: '',
          number: null,
          unit: '',
          sizeType: '',
          weightOfEach: null
        }]
      },
      documentReturn: false,
      liability: false,
      liabilityCon: null,
      liabilitySelect: 'PCS',
      loading: false,
      unloading: false,
      time: '00:00:00',
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
      propertyTypeList: [],
      sizeTypeList: [],
      unitList: [],
      supplyList: [],
      shareTruck: false,
      cargoShape: '1',
      cargoShapeList: [{}, {}, {}, {}, {}, {}, {}, {}],
      amountList: [],
      sizeDialog: false,
      size_width: null,
      size_length: null,
      size_height: null,
      sizeCurIndex: null,
      logisticType: [
        {
          value: 'FTL',
          label: 'FTL'
        }, {
          value: 'LTL',
          label: 'LTL'
        }
      ],
      senderList: [],
      consultInfo: {},
      currentBalance: null
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    shareTruck (val) {
      console.log(val)
      const self = this
      if (val) {
        self.bookingForm.chargeList[0].chargeIntro = self.cargoShape
      } else {
        self.bookingForm.chargeList[0].chargeIntro = 'false'
      }
    },
    cargoShape (val) {
      const self = this
      if (self.shareTruck) {
        self.bookingForm.chargeList[0].chargeIntro = val
      }
    },
    documentReturn (val) {
      const self = this
      if (val) {
        self.amountList.push({
          key: 'RETURN_DOCUMENT',
          amount: 10,
          label: self.$t('booking.documentReturn'),
        })
      } else {
        self.amountWatch('RETURN_DOCUMENT')
      }
    },
    loading (val) {
      const self = this
      if (val) {
        self.amountList.push({
          key: 'LOADING',
          amount: self.consultInfo.data.loadingOrUnloadingHumanWorkDay * self.consultInfo.data.moneyPerDay,
          label: self.$t('booking.loading'),
        })
      } else {
        self.amountWatch('LOADING')
      }
    },
    unloading (val) {
      const self = this
      if (val) {
        self.amountList.push({
          key: 'UNLOADING',
          amount: self.consultInfo.data.loadingOrUnloadingHumanWorkDay * self.consultInfo.data.moneyPerDay,
          label: self.$t('booking.unloading'),
        })
      } else {
        self.amountWatch('UNLOADING')
      }
    },
    liability (val) {
      const self = this
      if (val) {
        self.amountList.push({
          key: 'INSURANCE',
          amount: 0,
          label: self.$t('booking.liability'),
        })
      } else {
        self.amountWatch('INSURANCE')
      }
    }
  },
  created () {
    const self = this
    let consultInfo = JSON.parse(localStorage.getItem('consultInfo'))
    self.consultInfo = consultInfo
  },
  mounted () {
    const self = this
    console.log(JSON.parse(localStorage.getItem('consultInfo')))
    // 卡车类型
    getTruckType().then(res => {
      self.categoryList = res.data.categories
      self.subCategoryList = res.data.subCategories
    })
    let consultInfo = self.consultInfo
    if (consultInfo) {
      let booking = self.bookingForm
      self.pickUpRegionList = consultInfo.pickUpRegionList
      self.delRegionList = consultInfo.delRegionList
      booking.orderInfo.lineType = consultInfo.logisticType
      booking.senderAddress.code = consultInfo.searchForm.pickUpRegion
      booking.senderAddress.pickAt = consultInfo.searchForm.pickUpDate
      self.time = consultInfo.time
      booking.receiverAddress.code = consultInfo.searchForm.deliveryRegion
      booking.transportInfo.carType = consultInfo.searchForm.truckCategory
      booking.transportInfo.carriage = consultInfo.searchForm.truckSubCategory
      booking.transportInfo.companyName = consultInfo.data.site.companyName
      booking.transportInfo.ftlLineId = consultInfo.data.id
      self.amountList.push({
        label: self.$t('booking.feight'),
        amount: consultInfo.data.charge,
        key: 'FREIGHT'
      })
    }
    // 货物属性
    getGoodsProperty().then(res => {
      self.propertyTypeList = res.data.propertyType
      self.sizeTypeList = res.data.sizeType
      self.unitList = res.data.unit
    })
    // 寄件人列表 
    getSenderList().then(res => {
      console.log(res)
      self.senderList = res.data
    })
    // 运输公司列表 
    getTransportList().then(res => {
      self.supplyList = res.data
    })
    // 会员余额
    myAccount(localStorage.getItem('curRole')).then(res => {
      self.currentBalance = res.data.currentBalance
    })
  },
  methods: {
    amountWatch (name) {
      const self = this
      for (let x in self.amountList) {
        if (self.amountList[x].key == name) {
          self.amountList.splice(x, 1)
        }
      }
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
      self.page = 0
      self.isLast = false
    },
    // 下单
    todoIt () {
      const self = this
      // self.bookingForm.senderAddress.pickAt += " " + self.time ? self.time : '00:00:00'
      console.log(self.bookingForm)
      placeOrder(self.bookingForm).then(res => {

      })
    },
    viewIt () {
      const self = this
      let transportInfo = self.bookingForm.transportInfo
      ftlCharge({
        documentReturn: self.documentReturn,
        liability: self.liability,
        loading: self.loading,
        unloading: self.unloading,
        supply_id: 0,
        ftl_line_id: 140,
        truckCategory: transportInfo.carType,
        truckSubCategory: transportInfo.carriage,
      }).then(res => {
        console.log(res)
        self.amountList = res.data
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
    },
    sizeSelect (val, index) {
      const self = this
      console.log(val)
      if (val == 'extra_size') {
        self.sizeDialog = true
        self.sizeCurIndex = index
      }
    },
    sizeConfirm () {
      const self = this
      self.sizeDialog = false
      let size = self.size_length + '*' + self.size_width + '*' + self.size_height
      self.sizeTypeList.push({
        key: size,
        value: size
      })
      self.bookingForm.propertyList[self.sizeCurIndex].sizeType = size
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

<style>
.booking .el-input-group__append {
  width: 40%;
}
</style>
