<template>
  <div class="manage">
    <div style="display:flex;justify-content:flex-end;align-items:center;margin-bottom:15px;">
      <el-button style="width:150px;" type="primary">{{$t('booking.placeOrder')}}</el-button>
    </div>
    <el-form ref="bookingform" :model="bookingForm" label-position="top" size="small">
      <el-row class="itemRow">
        <el-col :span="8">
          <el-form-item :label="$t('booking.logisiticsType')">
            <el-select v-model="bookingForm.lt" class="inputWidth">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('booking.sender')">
            <el-select v-model="bookingForm.lt" class="inputWidth">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('booking.pickupTime')">
            <el-date-picker v-model="value1" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('booking.sender')">
            <el-select v-model="bookingForm.lt" class="inputWidth">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('booking.pickupPoint')">
            <el-input class="inputWidth inputBottom"></el-input>
            <el-input class="inputWidth inputBottom"></el-input>
            <el-input class="inputWidth inputBottom"></el-input>
            <el-select v-model="bookingForm.lt" class="inputWidth inputBottom">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('booking.destination')">
            <el-input class="inputWidth inputBottom"></el-input>
            <el-input class="inputWidth inputBottom"></el-input>
            <el-input class="inputWidth inputBottom"></el-input>
            <el-select v-model="bookingForm.lt" class="inputWidth inputBottom">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="itemRow">
        <el-col :span="8">
          <el-form-item :label="$t('booking.valueAddedService')">
            <el-checkbox
              v-model="checked"
              class="inputWidth inputBottom"
              style="margin-left: 10px;"
              :label="$t('booking.unloading')"
              border
            ></el-checkbox>
            <el-checkbox
              v-model="checked"
              class="inputWidth inputBottom"
              :label="$t('booking.loading')"
              border
            ></el-checkbox>
            <el-checkbox
              v-model="checked"
              class="inputWidth inputBottom"
              :label="$t('booking.documentReturn')"
              border
            ></el-checkbox>
            <el-checkbox
              v-model="checked"
              class="inputWidth inputBottom"
              :label="$t('booking.printSticker')"
              border
            ></el-checkbox>
            <el-checkbox
              v-model="checked"
              class="inputWidth inputBottom"
              :label="$t('booking.liability')"
              border
            ></el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('booking.truckType')">
            <el-select v-model="bookingForm.lt" style="width:45%;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select v-model="bookingForm.lt" style="width:45%;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('booking.supply')">
            <el-select v-model="bookingForm.lt" class="inputWidth">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('booking.referenceNo')">
            <el-input v-model="bookingForm.lt" class="inputWidth" />
          </el-form-item>
          <el-form-item :label="$t('booking.remarks')">
            <el-input v-model="bookingForm.lt" type="textarea" class="inputWidth" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('booking.shareTruck')">
            <el-radio v-model="radio" label="1" border>{{$t('booking.fullTruckLoad')}}</el-radio>
            <el-radio v-model="radio" label="2" border>{{$t('booking.sharetruckLoad')}}</el-radio>
          </el-form-item>
          <el-form-item :label="$t('booking.cargoShape')">
            <el-radio
              v-model="radio"
              :label="index"
              border
              style="margin-left:0px;"
              v-for="(item,index) in [{},{},{},{},{},{},{},{}]"
              :key="index"
            ></el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="itemRow" :gutter="40">
        <el-col :span="15">
          <vxe-table
            border
            show-overflow
            show-footer
            ref="xTable"
            class="vxe-table-element"
            :data="[{sex:'1',num:1},{}]"
            :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
          >
            <vxe-table-column
              field="sex"
              :title="$t('booking.cargoType')"
              :edit-render="{type: 'default'}"
            >
              <template v-slot:edit="scope">
                <el-select v-model="scope.row.sex" @change="$refs.xTable.updateStatus(scope)">
                  <el-option
                    v-for="item in sexList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="num"
              :title="$t('booking.commodity')"
              :edit-render="{type: 'default'}"
            >
              <template v-slot:edit="scope">
                <el-input v-model="scope.row.num" @input="$refs.xTable.updateStatus(scope)"></el-input>
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="num"
              :title="$t('booking.qty')"
              :edit-render="{type: 'default'}"
            >
              <template v-slot:edit="scope">
                <el-input v-model="scope.row.num" @input="$refs.xTable.updateStatus(scope)"></el-input>
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="sex"
              :title="$t('booking.unit')"
              :edit-render="{type: 'default'}"
            >
              <template v-slot:edit="scope">
                <el-select v-model="scope.row.sex" @change="$refs.xTable.updateStatus(scope)">
                  <el-option
                    v-for="item in sexList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="num"
              :title="$t('booking.size')"
              :edit-render="{type: 'default'}"
            >
              <template v-slot:edit="scope">
                <el-select v-model="scope.row.sex" @change="$refs.xTable.updateStatus(scope)">
                  <el-option
                    v-for="item in sexList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="num"
              :title="$t('booking.weight')"
              :edit-render="{type: 'default'}"
            >
              <template v-slot:edit="scope">
                <el-input v-model="scope.row.num" @input="$refs.xTable.updateStatus(scope)"></el-input>
              </template>
            </vxe-table-column>
          </vxe-table>
        </el-col>
        <el-col :span="7">
          <vxe-table highlight-hover-row :data="tableData">
            <vxe-table-column field="num" title="item"></vxe-table-column>
            <vxe-table-column field="sex" title="Amount"></vxe-table-column>
          </vxe-table>
          <el-form-item :label="$t('booking.accountBalance')" style="margin-top:30px;">
            <div style="display:flex;justify-content:space-between;">
              <el-tag style="width:100px;text-align:center;">1500</el-tag>
              <el-button style="width:150px;">{{$t('booking.topUp')}}</el-button>
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

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    return {
      bookingForm: {
        lt: "",
        times: []
      },
      sexList: [{ label: "nan", value: "1" }, { label: "nv", value: "0" }],
      options: [],
      value1: "",
      checked: false,
      radio: "2"
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  created() {},
  mounted() {},
  methods: {}
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
}
.inputWidth {
  width: 80%;
}
.inputBottom {
  margin-bottom: 20px;
}
</style>
