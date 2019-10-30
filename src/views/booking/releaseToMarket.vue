<template>
  <div class="manage booking">
    <div style="display:flex;justify-content:flex-end;align-items:center;margin-bottom:15px;">
      <el-button style="width:200px;"
                 @click="todoIt"
                 :loading="todoLoading"
                 type="primary">{{$t('booking.releaseToMarket')}}</el-button>
    </div>
    <el-form ref="releaseform"
             :model="releaseForm"
             :rules="releaseRules"
             :show-message="false"
             label-position="top"
             size="small">
      <el-row class="itemRow">
        <el-col :span="8">
          <el-form-item :label="$t('booking.logisiticsType')">
            <el-select v-model="releaseForm.orderInfo.lineType"
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
            <el-select v-model="senderIndex"
                       @change="(val)=>senderSelect(val)"
                       :placeholder="$t('placeholder.pleaseChoose')"
                       class="inputWidth">
              <el-option v-for="(item,index) in senderList"
                         :key="item.id"
                         :label="item.name"
                         :value="index" />
            </el-select>
          </el-form-item>
          <el-form-item prop="pickAt"
                        :label="$t('booking.pickupTime')">
            <div class="inputWidth"
                 style="display:flex;">
              <!-- <el-date-picker v-model="releaseForm.senderAddress.pickAt"
                              type="date"
                              value-format='yyyy-MM-dd'
                              style="margin-right:5px;"
                              :placeholder="$t('placeholder.chooseDate')">
              </el-date-picker> -->
              <bcTime @changeBCtime="changeBCtime"
                      :dateDefault="[]"
                      style="margin-right:5px;"></bcTime>
              <el-time-picker v-model="time"
                              format="HH:mm:ss"
                              value-format='HH:mm:ss'
                              :placeholder="$t('placeholder.chooseTime')">
              </el-time-picker>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="senderAddress"
                        :label="$t('booking.pickupPoint')">
            <el-input :placeholder="$t('placeholder.placeEnterSenderName')"
                      v-model="releaseForm.senderAddress.name"
                      class="inputWidth inputBottom"></el-input>
            <el-input :placeholder="$t('placeholder.pleaseEnterTelNumber')"
                      v-model="releaseForm.senderAddress.mobile"
                      class="inputWidth inputBottom"></el-input>
            <el-input :placeholder="$t('placeholder.pleaseEnterDetailAddress')"
                      v-model="releaseForm.senderAddress.addressDetail"
                      class="inputWidth inputBottom"></el-input>
            <el-select v-model="releaseForm.senderAddress.code"
                       filterable
                       remote
                       reserve-keyword
                       class="inputWidth"
                       v-el-select-loadmore="loadmore"
                       :placeholder="$t('placeholder.administrativeDivision')"
                       :remote-method="pickUpMethod"
                       @focus="clearSelect('pk')"
                       :loading="searchloading">
              <el-option v-for="item in pickUpRegionList"
                         :key="item.code"
                         :label="item.fullname"
                         :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="receiverAddress"
                        :label="$t('booking.destination')">
            <el-input :placeholder="$t('placeholder.pleaseEnterRecipieName')"
                      v-model="releaseForm.receiverAddress.name"
                      class="inputWidth inputBottom"></el-input>
            <el-input :placeholder="$t('placeholder.pleaseEnterTelNumber')"
                      v-model="releaseForm.receiverAddress.mobile"
                      class="inputWidth inputBottom"></el-input>
            <el-input :placeholder="$t('placeholder.pleaseEnterDetailAddress')"
                      v-model="releaseForm.receiverAddress.addressDetail"
                      class="inputWidth inputBottom"></el-input>
            <el-select v-model="releaseForm.receiverAddress.code"
                       filterable
                       remote
                       reserve-keyword
                       @focus="clearSelect('del')"
                       class="inputWidth"
                       v-el-select-loadmore="loadmore"
                       :placeholder="$t('placeholder.administrativeDivision')"
                       :remote-method="pickUpMethod"
                       :loading="searchloading">
              <el-option v-for="item in delRegionList"
                         :key="item.code"
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
                         disabled
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
          <el-form-item prop="transportInfo"
                        :label="$t('booking.truckType')">
            <el-select v-model="releaseForm.transportInfo.carType"
                       :placeholder="$t('placeholder.pleaseChoose')"
                       style="width:45%;">
              <el-option v-for="item in categoryList"
                         :key="item.key"
                         :label="item.value"
                         :value="item.key" />
            </el-select>
            <el-select v-model="releaseForm.transportInfo.carriage"
                       :placeholder="$t('placeholder.pleaseChoose')"
                       style="width:45%;">
              <el-option v-for="item in subCategoryList"
                         :key="item.key"
                         :label="item.value"
                         :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item prop="orderInfo"
                        :label="$t('booking.price')">
            <el-input v-model="releaseForm.orderInfo.settlementAmount"
                      type="number"
                      class="inputWidth" />
          </el-form-item>
          <el-form-item :label="$t('booking.referenceNo')">
            <el-input v-model="releaseForm.orderInfo.outNumber"
                      class="inputWidth" />
          </el-form-item>
          <el-form-item :label="$t('booking.remarks')">
            <el-input v-model="releaseForm.orderInfo.remark"
                      type="textarea"
                      class="inputWidth" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item :label="$t('booking.shareTruck')">
            <el-radio-group v-model="shareTruck">
              <el-radio :label="false"
                        border>{{$t('booking.fullTruckLoad')}}</el-radio>
              <el-radio :label="true"
                        disabled
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
        </el-col> -->
      </el-row>
      <!-- <el-row class="itemRow"
              :gutter="40">
        <el-col :span="15">
          <el-form-item prop="propertyList">
            <el-button type="primary"
                       @click="pushIt"
                       style="margin-bottom:10px;"
                       icon="el-icon-circle-plus-outline">{{$t('booking.add')}}</el-button>
            <el-table border
                      :data="releaseForm.propertyList">
              <el-table-column prop="propertyType"
                               :label="$t('booking.cargoType')">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.propertyType"
                             :placeholder="$t('placeholder.pleaseChoose')">
                    <el-option v-for="item in propertyTypeList"
                               :key="item.key"
                               :label="item.trans"
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
                               :label="item.trans"
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
                               :label="item.trans"
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
          </el-form-item>
        </el-col>
        <el-col :span="7">

        </el-col>
      </el-row> -->
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
import { releaseOrder } from '../../api/booking'
import { getTruckType, findDistrictFullList, getGoodsProperty, getSenderList, getTransportList } from '../../api/data'
import bcTime from "@/components/bcTime";

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
  components: { bcTime },
  data () {
    const self = this
    const validatorOrderInfo = (rule, value, callback) => {
      if (!value.settlementAmount) {
        callback(new Error(''));
      } else {
        callback();
      }
    };
    const validatorSenderAddress = (rule, value, callback) => {
      if (!value.name || !value.mobile || !value.addressDetail || !value.code) {
        callback(new Error(''));
      } else {
        callback();
      }
    };
    const validatorpickAt = (rule, value, callback) => {
      console.log(self.releaseForm.senderAddress.pickAt)
      if (!self.time_at) {
        callback(new Error(''));
      } else {
        callback();
      }
    };
    const validatorReceiverAddress = (rule, value, callback) => {
      if (!value.name || !value.mobile || !value.addressDetail || !value.code) {
        callback(new Error(''));
      } else {
        callback();
      }
    };
    const validatorPropertyList = (rule, value, callback) => {
      for (let x in value) {
        if (!value[x].propertyType || !value[x].name || !value[x].number || !value[x].unit || !value[x].sizeType || !value[x].weightOfEach) {
          callback(new Error(''));
        } else {
          callback();
        }
      }
    };
    const validatorTransportInfo = (rule, value, callback) => {
      if (!value.carType) {
        callback(new Error(''));
      } else {
        callback();
      }
    };
    return {
      releaseForm: {
        orderInfo: {
          lineType: 'FTL',
          outNumber: '',
          remark: '',
          settlementAmount: null
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
        propertyList: [
          //   {
          //   propertyType: '',
          //   name: '',
          //   number: null,
          //   unit: '',
          //   sizeType: '',
          //   weightOfEach: null
          // }
        ],
      },
      releaseRules: {
        orderInfo: [{ required: true, trigger: 'blur', validator: validatorOrderInfo }],
        senderAddress: [{ required: true, trigger: 'change', validator: validatorSenderAddress }],
        receiverAddress: [{ required: true, trigger: 'change', validator: validatorReceiverAddress }],
        propertyList: [{ required: true, trigger: 'change', validator: validatorPropertyList }],
        transportInfo: [{ required: true, trigger: 'change', validator: validatorTransportInfo }],
        pickAt: [{ required: true, trigger: 'change', validator: validatorpickAt }],
      },
      documentReturn: false,
      liability: false,
      liabilityCon: null,
      liabilitySelect: 'PCS',
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
      propertyTypeList: [],
      sizeTypeList: [],
      unitList: [],
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
      senderIndex: null,
      todoLoading: false,
      time_at: ''
    };
  },
  // 监听属性 类似于data概念
  computed: {
  },
  // 监控data中的数据变化
  watch: {
    shareTruck (val) {
      console.log(val)
      const self = this
      if (val) {
        self.releaseForm.chargeList[0].chargeIntro = self.cargoShape
      } else {
        self.releaseForm.chargeList[0].chargeIntro = 'false'
      }
    },
    cargoShape (val) {
      const self = this
      if (self.shareTruck) {
        self.releaseForm.chargeList[0].chargeIntro = val
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
          amount: 0,
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
          amount: 0,
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
    },
    time_at (val) {
      const self = this
      let t = self.time ? self.time : '00:00:00'
      self.releaseForm.senderAddress.pickAt = val + ` ${t}`
    },
    time (val) {
      const self = this
      let t = val ? val : '00:00:00'
      self.releaseForm.senderAddress.pickAt = self.time_at + ` ${val}`
    }
  },
  created () { },
  mounted () {
    const self = this
    // 卡车类型
    getTruckType().then(res => {
      self.categoryList = res.data.categories
      self.subCategoryList = res.data.subCategories
    })
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
    changeBCtime (time) {
      const self = this
      self.time_at = time
      console.log(time)
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
    // 选择寄件人
    senderSelect (val) {
      console.log(val)
      const self = this
      self.releaseForm.senderAddress.name = self.senderList[val].name
      self.releaseForm.senderAddress.mobile = self.senderList[val].mobile
      self.releaseForm.senderAddress.addressDetail = self.senderList[val].addressDetail
      self.releaseForm.senderAddress.code = self.senderList[val].code
      self.curSelect = 'pk'
      console.log(self.senderList[val].fullName)
      self.pickUpRegionList = [{ code: self.senderList[val].code, fullname: self.senderList[val].fullName }]
    },
    // 下单
    todoIt () {
      const self = this
      console.log(self.releaseForm)
      this.$refs.releaseform.validate(valid => {
        if (valid) {
          self.todoLoading = true
          // self.releaseForm.senderAddress.pickAt += ' ' + self.time
          for (let x in self.amountList) {
            self.releaseForm.chargeList.push({
              chargeType: self.amountList[x].key,
              chargeIntro: self.amountList[x].key == 'INSURANCE' ? self.liabilitySelect : 'true',
              money: self.amountList[x].key == 'INSURANCE' ? self.liabilityCon : 0
            })
          }
          releaseOrder(self.releaseForm).then(res => {
            self.todoLoading = false
            self.$message.success(res.message)
            self.$router.replace('/tracking/FTL')
          }).catch(el => {
            self.todoLoading = false
          })
        }
      })
    },
    pushIt () {
      const self = this
      self.releaseForm.propertyList.push({
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
          self.releaseForm.propertyList.splice(index, 1)
        })
        .catch(() => { });
    },
    sizeSelect (val, index) {
      const self = this
      console.log(val)
      if (val == 'EXTRA_SIZE') {
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
      self.releaseForm.propertyList[self.sizeCurIndex].sizeType = size
    },
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
