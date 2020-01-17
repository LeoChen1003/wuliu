<template>
  <div>
    <el-date-picker
      v-model="valueS"
      type="date"
      value-format="yyyy-MM-dd"
      format="dd-MM-yyyy"
      style="width:100%;"
      :placeholder="$t('placeholder.chooseDate')"
      :disabled="isChange"
      @change="dateStringChange"
      :picker-options="timeType == 'all' ? '' : pickerOptions"
      v-if="dateType == 'date'"
    >
    </el-date-picker>
    <el-date-picker
      v-model="valueA"
      type="daterange"
      value-format="yyyy-MM-dd"
      format="dd-MM-yyyy"
      style="width:100%;"
      :clearable="false"
      :disabled="isChange"
      :placeholder="$t('placeholder.chooseDate')"
      @change="dateArrChange"
      :picker-options="timeType == 'all' ? '' : pickerOptions"
      v-if="dateType == 'daterange'"
    >
    </el-date-picker>
  </div>
</template>

<script>
let self;
export default {
  props: {
    timeType: {
      type: String,
      default: "all",
    },
    dateType: {
      type: String,
      default: "date",
    },
    dateString: {
      type: String,
      default: () => {},
    },
    dateArray: {
      type: Array,
      default: () => {},
    },
    isChange: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      valueS: "",
      valueA: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
    };
  },
  methods: {
    dateStringChange(val) {
      let arr;
      if (val) {
        arr = val.split("-");
        arr[0] = parseInt(arr[0]) + 543;
      }
      let time = val ? arr.join("-") : "";
      this.$emit("changeBCtime", time);
    },
    dateArrChange(val) {
      if (val) {
        let timeArr = JSON.parse(JSON.stringify(val));
        for (let x in timeArr) {
          let arr = timeArr[x].split("-");
          arr[0] = parseInt(arr[0]) + 543;
          let time = arr.join("-");
          timeArr[x] = time;
        }
        this.$emit("changeBCtime", timeArr);
      } else {
        this.$emit("changeBCtime", ["", ""]);
      }
    },
    clearData() {
      self.valueS = "";
    },
    setData(time) {
      let arr = time.split("/");
      arr[2] = arr[2] - 543;
      self.valueS = arr.reverse().join("-");
    },
  },
  created() {
    self = this;
    self.valueS = self.dateString;
    self.valueA = self.dateArray;
  },
  mounted() {},
};
</script>
<style scope lang="scss"></style>
