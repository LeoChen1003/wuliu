<template>
  <div class>
    <div>
      <el-button>{{$t('booking.searchSupply')}}</el-button>
    </div>
    <div style="width:30%;">
      <el-form ref="form" :model="searchForm" label-position="top" size="small" label-width="80px">
        <el-form-item :label="$t('booking.logisiticsType')">
          <el-select v-model="searchForm.lt">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('booking.pickupPoint')">
          <el-input v-model="searchForm.lt"></el-input>
        </el-form-item>
        <el-form-item :label="$t('booking.pickupTime')">
          <el-date-picker
            v-model="searchForm.times"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('booking.deliveryPoint')">
          <el-input v-model="searchForm.lt"></el-input>
        </el-form-item>
        <el-form-item :label="$t('booking.truckType')">
          <el-select v-model="searchForm.lt">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="searchForm.lt">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
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
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  methods: {},
  created() {},
  mounted() {}
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>