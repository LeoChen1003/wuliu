<template>
  <el-select v-model="language"
             @change="handleSetLanguage">
    <el-option label="English"
               value="en_US"></el-option>
    <el-option label="中文"
               value="zh_CN"></el-option>
    <el-option label="ไทย"
               value="th_TH"></el-option>
  </el-select>
</template>

<script>
export default {
  computed: {
    language () {
      return this.$store.getters.language
    }
  },
  methods: {
    handleSetLanguage (lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('app/setLanguage', lang)
      // this.$message({
      //   message: 'Switch Language Success',
      //   type: 'success'
      // })
    }
  }
}
</script>
