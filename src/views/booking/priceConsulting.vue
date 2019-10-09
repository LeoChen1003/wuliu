<template>
  <div class="manage">
    <el-row style="height:100%;">
      <el-col :span="6" style="height:100%;" class="searchBox">
        <div>
          <el-form
            ref="form"
            :model="searchForm"
            label-position="top"
            size="small"
            label-width="80px"
          >
            <el-form-item :label="$t('booking.logisiticsType')">
              <el-select v-model="searchForm.lt" class="inputWidth">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('booking.pickupPoint')">
              <el-input v-model="searchForm.lt" class="inputWidth" />
            </el-form-item>
            <el-form-item :label="$t('booking.pickupTime')">
              <el-date-picker
                v-model="searchForm.times"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="small"
                class="inputWidth"
              />
            </el-form-item>
            <el-form-item :label="$t('booking.deliveryPoint')">
              <el-input v-model="searchForm.lt" class="inputWidth" />
            </el-form-item>
            <el-form-item :label="$t('booking.truckType')">
              <el-select v-model="searchForm.lt" style="width:45%;">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select v-model="searchForm.lt" style="width:45%;">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <div style="display:flex;justify-content:center;align-items:center;width:90%;">
                <el-button>{{ $t('booking.searchSupply') }}</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="18">
        <el-table :data="[{},{},{}]" border style="width: 97%;margin-left:20px;">
          <el-table-column :label="$t('booking.supply')"></el-table-column>
          <el-table-column :label="$t('booking.route')"></el-table-column>
          <el-table-column :label="$t('booking.price')"></el-table-column>
          <el-table-column>
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

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    return {
      searchForm: {
        lt: "",
        times: []
      },
      options: []
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  created() {},
  mounted() {},
  methods: {
    toBooking() {
      this.$router.push("/placeOrder");
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
