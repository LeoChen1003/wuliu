<template>
  <div>
    <div v-if="!toggleLang">
      <el-select
        v-model="language"
        placeholder="请选择"
        @change="handleSetLanguage"
        size="small"
        style="width:100%;"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div v-if="toggleLang">
      <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
        <div>
          <svg-icon style="font-size:20px;" class-name="international-icon" icon-class="language" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :disabled="language==='zh'" command="zh">中文</el-dropdown-item>
          <el-dropdown-item :disabled="language==='en'" command="en">English</el-dropdown-item>
          <el-dropdown-item :disabled="language==='th'" command="th">ไทย</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    toggleLang: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [
        {
          value: "zh",
          label: "中文"
        },
        {
          value: "en",
          label: "English"
        },
        {
          value: "th",
          label: "ไทย"
        }
      ]
    };
  },
  computed: {
    language: {
      get() {
        return this.$store.getters.language;
      },
      set(val) {
        this.$store.dispatch("app/setLanguage", val);
      }
    }
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang;
      this.$store.dispatch("app/setLanguage", lang);
    }
  }
};
</script>
