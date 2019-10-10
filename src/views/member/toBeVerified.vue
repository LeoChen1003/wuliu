<template>
  <div class='manage'>
    <el-table :data="dataList"
              border
              highlight-current-row
              @current-change="handleCurrentChange"
              :cell-style="cell">
      <el-table-column prop="name"
                       :highlight-current-row='true'
                       :label="$t('resources.driver_name')"></el-table-column>
      <el-table-column prop="phone"
                       :label="$t('resources.phoneNo')"></el-table-column>
      <el-table-column prop="activeStatus"
                       :label="$t('resources.status')"></el-table-column>
      <el-table-column width='80px;'>
        <template slot-scope="scope">
          <div style="cursor: pointer;"
               @click="toEdit(scope.row)">
            <i class="el-icon-edit"></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    return {

    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  methods: {

  },
  created () {

  },
  mounted () {

  },
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.manage {
  padding: 20px;
}
</style>