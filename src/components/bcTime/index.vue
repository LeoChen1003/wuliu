<template>
  <div>
    <el-cascader
      v-model="dateCascader"
      class="innerInp"
      :options="options"
      :props="props"
      separator="-"
      style="width:100%;"
      @change="dateChange"
    ></el-cascader>
  </div>
</template>

<script>
import { getBcYear, getBcDay } from "../../api/data";

let self;
export default {
  props: {
    timeType: {
      type: String,
      default: "",
    },
    dateDefault: {
      type: Array,
      default: () => {},
    },
  },
  data() {
    return {
      dateCascader: [],
      options: [],
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          let year = self.bcYear;
          let date = new Date();
          let month = self.timeType == "all" ? 1 : node.label == year ? date.getMonth() + 1 : 1;
          let day = date.getDate();
          let options = [];
          if (node.level == 0) {
            getBcYear().then(res => {
              self.bcYear = res.data;
              let years = [
                {
                  label: self.bcYear,
                  value: self.bcYear,
                },
                {
                  label: self.bcYear + 1,
                  value: self.bcYear + 1,
                },
              ];
              resolve(years);
            });
          } else if (node.level == 1) {
            let months = [];
            for (let y = month; y <= 12; y++) {
              months.push({
                label: y,
                value: y,
              });
            }
            resolve(months);
          } else if (node.level == 2) {
            getBcDay(node.parent.value, node.value).then(res => {
              let days = res.data;
              let dateList = [];
              let d =
                self.timeType == "all" ? 1 : node.parent.value == self.bcYear && node.value == date.getMonth() + 1 ? day : 1;
              for (let x = d; x <= days; x++) {
                dateList.push({
                  label: x,
                  value: x,
                  leaf: true,
                });
              }
              resolve(dateList);
            });
          }
        },
      },
    };
  },
  methods: {
    dateChange(e) {
      let time = `${e[0]}-${e[1]}-${e[2]}`;
      this.$emit("changeBCtime", time);
    },
  },
  created() {
    self = this;
    self.dateCascader = self.dateDefault.map(Number);
  },
  mounted() {},
};
</script>
<style scope lang="scss"></style>
