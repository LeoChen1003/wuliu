<template>
  <div class="wrapper">
    <div style="margin-bottom:20px;">
      <el-button @click="add" type="primary">{{ $t("resources.add") }}</el-button>
    </div>
    <div class="container">
      <div class="table-box">
        <el-table border v-loading="loading" highlight-current-row :data="data.content">
          <el-table-column header-align="center" align="center" :label="$t('resources.route')">
            <template slot-scope="scope">
              <div>{{ scope.row.fromProvince }} --> {{ scope.row.toProvinceName }}</div>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" :label="$t('resources.origin')">
            <template slot-scope="scope">
              <div>{{ truckObj[scope.row.category] }}</div>
              <div>{{ scope.row.truck.plate }}</div>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" :label="$t('resources.status')">
            <template slot-scope="scope">
              {{ scope.row.status }}
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center">
            <template slot-scope="scope">
              <div>
                <el-button type="primary" style="margin-bottom:5px;width:100%;" @click="edit(scope.row)">
                  {{ $t("resources.edit") }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align:center;margin:20px 0;">
          <el-pagination
            background
            :page-size.sync="data.size"
            :page-count="data.totalElements"
            :total="data.totalElements"
            :current-page.sync="data.number + 1"
            @current-change="pageChange"
            layout="total, prev, pager, next, jumper"
          >
          </el-pagination>
        </div>
      </div>
      <div class="table-box">
        <el-tabs v-model="detailTab"> </el-tabs>
      </div>
    </div>
    <el-dialog :title="$t('route.routeLTL')" :visible.sync="editDialog" center width="1000px">
      <div class="form-box" v-loading="editLoading">
        <el-form label-width="120px">
          <el-form-item required :label="$t('resources.origin')">
            <el-select v-model="form.hubId" placeholder="placeholder">
              <el-option v-for="item in hubList" :key="item.id" :label="item.hubName" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item required :label="$t('resources.cutOffTime')">
            <el-time-select style="width: 200px;" v-model="form.cutOffTime" :picker-options="timeOptions" default-value="18:00" />
          </el-form-item>
        </el-form>
        <el-form label-width="120px">
          <el-form-item required :label="$t('resources.route')">
            <el-select v-model="form.templateId" placeholder="placeholder" @change="templateChange">
              <el-option v-for="item in templateList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item required :label="$t('resources.status')">
            <el-select v-model="form.status">
              <el-option label="Activated" value="ACTIVE" />
              <el-option label="Closed" value="CLOSED" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="edit-tab-box" v-loading="editLoading">
        <el-tabs v-model="editTab">
          <el-tab-pane :label="$t('resources.map')" name="map">
            <div style="text-align: center;height: 50%;">
              <el-image fit="cover" v-if="form.mapUrl !== ''" :src="form.mapUrl" :preview-src-list="preViewList"></el-image>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('resources.deliverableDistrict')" name="deli">
            <el-table border :data="form.cityList" style="width: 100%">
              <el-table-column prop="date" :label="$t('setting.province')" width="180">
                <template slot-scope="scope">
                  <div>{{ scope.row.provinceName }}</div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('setting.deliverableDistrict')">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.cityCodes" style="width: 100%" multiple>
                    <el-option v-for="item in scope.row.cityList" :key="item.id" :label="item.name" :value="item.code" />
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="$t('resources.quotation')" name="quot">
            <div>
              <div style="display: flex;align-items: center;">
                <el-table border :data="sizeInfo" size="mini">
                  <el-table-column prop="date">
                    <template slot-scope="scope">
                      {{ scope.row.type }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="Size-SS">
                    <template slot-scope="scope">
                      {{ scope.row.size_ss }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="Size-S">
                    <template slot-scope="scope">
                      {{ scope.row.size_s }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="Size-M">
                    <template slot-scope="scope">
                      {{ scope.row.size_m }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="Size-L">
                    <template slot-scope="scope">
                      {{ scope.row.size_l }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="Size-XL">
                    <template slot-scope="scope">
                      {{ scope.row.size_xl }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="Extra size">
                    <template slot-scope="scope">
                      {{ scope.row.size_ex }}
                    </template>
                  </el-table-column>
                </el-table>
                <div style="width: 30%;margin-left: 20px;">
                  <div style="display: flex;align-items: center;">
                    <div style="margin-right: 15px;width: 100px;">体积重量换算</div>
                    <el-select v-model="plmodel" placeholder="placeholder">
                      <el-option label="2500" :value="2500"> </el-option>
                      <el-option label="3000" :value="3000"> </el-option>
                      <el-option label="3500" :value="3500"> </el-option>
                    </el-select>
                  </div>
                  <div>
                    <p>体积换算成重量举例：</p>
                    <p>假设换算比为2500、体积=100*80*20=160000cm³,那么，重量=160000/2500=64kg</p>
                  </div>
                </div>
              </div>
              <el-table border style="margin-top: 15px;" :data="lineList">
                <el-table-column label="Line" width="200px">
                  <template slot-scope="scope"> {{ scope.row.provinceName }} - {{ scope.row.kind }} </template>
                </el-table-column>
                <el-table-column label="Size_SS">
                  <template slot-scope="scope">
                    <el-input
                      :disabled="scope.row.disable"
                      type="number"
                      @mousewheel.native.prevent
                      v-model.number="scope.row.sizeSSPrice"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="Size_S">
                  <template slot-scope="scope">
                    <el-input
                      :disabled="scope.row.disable"
                      type="number"
                      @mousewheel.native.prevent
                      v-model.number="scope.row.sizeSPrice"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="Size_M">
                  <template slot-scope="scope">
                    <el-input
                      :disabled="scope.row.disable"
                      type="number"
                      @mousewheel.native.prevent
                      v-model.number="scope.row.sizeMPrice"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="Size_L">
                  <template slot-scope="scope">
                    <el-input
                      :disabled="scope.row.disable"
                      type="number"
                      @mousewheel.native.prevent
                      v-model.number="scope.row.sizeLPrice"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="Size_XL">
                  <template slot-scope="scope">
                    <el-input
                      :disabled="scope.row.disable"
                      type="number"
                      @mousewheel.native.prevent
                      v-model.number="scope.row.sizeXLPrice"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="Size_EX">
                  <template slot-scope="scope">
                    <el-input
                      :disabled="scope.row.disable"
                      type="number"
                      @mousewheel.native.prevent
                      v-model.number="scope.row.unitPrice"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="minPrice">
                  <template slot-scope="scope">
                    <el-input
                      :disabled="scope.row.disable"
                      type="number"
                      @mousewheel.native.prevent
                      v-model.number="scope.row.minPrice"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('resources.priceCoefficient')" name="pic">
            <div style="display: flex;justify-content: space-around;width: 100%;">
              <div style="width: 49%;">
                <el-table border :data="form.propertyDiscountList">
                  <el-table-column label="货物类型">
                    <template slot-scope="scope">
                      {{ scope.row.propertyType }}
                    </template>
                  </el-table-column>
                  <el-table-column label="价格系数">
                    <template slot-scope="scope">
                      <el-input type="number" @mousewheel.native.prevent v-model.number="scope.row.discount" />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div style="width: 49%;">
                <el-table border :data="form.numberDiscountList">
                  <el-table-column label="总件数">
                    <template slot-scope="scope">
                      {{ scope.row.minNumber }}
                    </template>
                  </el-table-column>
                  <el-table-column label="≤">
                    <template slot-scope="scope">
                      <el-input
                        @change="maxNumberChange"
                        type="number"
                        @mousewheel.native.prevent
                        v-model.number="scope.row.maxNumber"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="折扣率">
                    <template slot-scope="scope">
                      <el-input type="number" @mousewheel.native.prevent v-model.number="scope.row.discount"></el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('resources.availableDate')" name="ava">
            有效日期
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { getCityList, getHub } from "@api/data";
import { getLineTemplate } from "@api/setting";
import { addLTLRoute } from "@api/resources";

let self;

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    return {
      loading: false,
      plmodel: 2500,
      data: [],
      detailTab: 0,
      editDialog: false,
      editLoading: false,
      editTab: "map",
      hubList: [],
      templateList: [],
      form: {
        hubId: "",
        templateId: "",
        mapUrl: "",
      },
      timeOptions: {
        start: "00:00",
        step: "00:15",
        end: "23:45",
      },
      preViewList: [],
      sizeInfo: [
        {
          type: "Dimension(cm)",
          size_ss: "0.01-90",
          size_s: "90.01-110",
          size_m: "110.01-130",
          size_l: "130.01-150",
          size_xl: "150.01-170",
          size_ex: ">170.00",
        },
        {
          type: "Weight(kg)",
          size_ss: "0.01-10",
          size_s: "10.01-20",
          size_m: "20.01-30",
          size_l: "30.01-40",
          size_xl: "40.01-50",
          size_ex: ">50",
        },
      ],
      lineList: [],
      cityObj: {},
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
    "form.hubId"(id) {
      let params = {
        hubId: id,
        pagesize: 999,
      };
      getLineTemplate(params).then(res => {
        self.templateList = res.data.content;
      });
    },
  },
  mounted() {
    getHub().then(res => {
      self.hubList = res.data;
      self.form.hubId = res.data[0].id;
    });
    getCityList().then(res => {
      let cityObj = new Object();
      for (let i of res.data) {
        cityObj[i.code] = i;
      }
      self.cityObj = cityObj;
    });
  },
  methods: {
    add() {
      self.editDialog = true;
    },
    templateChange(id) {
      let form = JSON.parse(JSON.stringify(self.form));
      let template;
      let index = 0;
      let list = [];
      self.editLoading = true;

      for (let i of self.templateList) {
        if (i.id === id) {
          template = i;
        }
      }
      // for (let x in template.lineTemplateProvinces) {
      //   cityList.push({
      //     provinceCode: template.lineTemplateProvinces[x].provinceCode,
      //     provinceName: template.lineTemplateProvinces[x].provinceName,
      //     ltlLineCityList: [],
      //     cityCodes: [],
      //   });
      //   for (let i of template.lineTemplateProvinces[x].lineTemplateCitys) {
      //     cityList[x].cityCodes.push(i.cityCode);
      //   }
      // }

      // 整理cityList格式
      parse();
      function parse() {
        let params = `provinceCodes=${template.lineTemplateProvinces[index].provinceCode}`;
        getCityList(params).then(res => {
          list.push({
            provinceCode: template.lineTemplateProvinces[index].provinceCode,
            provinceName: template.lineTemplateProvinces[index].provinceName,
            cityList: res.data,
            cityCodes: [],
            selectedCity: [],
          });
          for (let i of template.lineTemplateProvinces[index].lineTemplateCitys) {
            list[index].cityCodes.push(i.cityCode);
          }
          if (index < parseInt(template.lineTemplateProvinces.length) - 1) {
            index++;
            parse();
          } else {
            self.editLoading = false;
            self.parseLine();
          }
        });
      }
      form = {
        ...form,
        mapUrl: template.mapUrl,
        cutOffTime: template.cutOffTime,
        name: template.name,
        cityList: list,
        numberDiscountList: [
          {
            minNumber: 0,
            maxNumber: "",
            discount: 0,
          },
        ],
        propertyDiscountList: [
          {
            discount: 100,
            propertyType: "CONSUMER_PRODUCT",
          },
          {
            discount: 100,
            propertyType: "RAW_MATERIAL",
          },
          {
            discount: 100,
            propertyType: "SPECIAL_HANDLING",
          },
        ],
      };
      self.preViewList = [form.mapUrl];
      self.form = form;
    },
    // 格式化站点报价数据
    parseLine() {
      let cityList = JSON.parse(JSON.stringify(self.form.cityList));
      let lineList = [];
      for (let i of cityList) {
        let cap = {
          provinceName: i.provinceName,
          provinceCode: i.provinceCode,
          kind: "CAPITAL",
          minPrice: "",
          sizeLPrice: "",
          sizeMPrice: "",
          sizeSPrice: "",
          sizeSSPrice: "",
          sizeXLPrice: "",
          unitPrice: "",
          disable: true,
        };
        let com = {
          provinceName: i.provinceName,
          provinceCode: i.provinceCode,
          kind: "COMMON",
          minPrice: "",
          sizeLPrice: "",
          sizeMPrice: "",
          sizeSPrice: "",
          sizeSSPrice: "",
          sizeXLPrice: "",
          unitPrice: "",
          disable: true,
        };
        for (let t of i.cityCodes) {
          if (t.kind === "CAPITAL") {
            cap.disable = false;
          } else {
            com.disable = false;
          }
        }
        lineList.push(cap, com);
        // 计算是否禁用
      }
      self.lineList = lineList;
    },
    pageChange(e) {
      self.loading = true;
    },
    // 最大值更变
    maxNumberChange(val) {
      let list = JSON.parse(JSON.stringify(self.form.numberDiscountList));
      let sameCount = 0;
      for (let i of list) {
        if (val == i.minNumber || val == i.maxNumber) {
          sameCount++;
          if (sameCount >= 2) {
            return self.$message.warning("已存在的系数");
          }
        }
      }
      // 操作队列
      list.push({
        minNumber: list[list.length - 1].maxNumber,
        maxNumber: "",
        discount: 0,
      });
      // 重新排序
      list.sort((a, b) => {
        if (a.minNumber < b.minNumber) {
          return -1;
        } else if (a.minNumber === b.minNumber) {
          return 0;
        } else {
          return 1;
        }
      });
      // 设置最大值
      for (let x in list) {
        console.log(x);
        if (x != list.length - 1) {
          console.log(list);
          console.log(parseInt(x) + 1);
          list[x].maxNumber = list[parseInt(x) + 1].minNumber;
        }
      }
      list[list.length - 1].maxNumber = "";
      self.form.numberDiscountList = list;
    },
  },
  created() {
    self = this;
  },
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类

//@import url(); 引入公共css类
.wrapper {
  box-sizing: border-box;
  padding: 20px;
}

.container {
  display: flex;
  justify-content: space-between;
}

.table-box {
  width: 49%;
  position: relative;

  .editBtn {
    position: absolute;
    left: 150px;
    z-index: 50;
    top: 6px;
  }
}

.formSelect {
  width: 100%;
}

.date-header {
  display: flex;
  align-items: center;

  div {
    margin-right: 10px;
  }
}

.date-list {
  display: flex;
  flex-wrap: wrap;
}

.day-item {
  width: 12%;
  margin: 2% 2% 0 0;
  user-select: none;

  .day {
    width: 100%;
    height: 50px;
    font-size: 24px;
    line-height: 50px;
    text-align: center;
    cursor: pointer;
    transition: all 0.1s;
    border-width: 2px;
  }

  .nop {
    cursor: auto;
  }

  .day_ph {
    opacity: 0;
  }

  .week {
    font-size: 20px;
  }
}

.edit-box {
  .edit-top {
    display: flex;
    justify-content: space-between;
  }

  .edit-right {
    width: 550px;
  }
}

.form-box {
  display: flex;
  justify-content: space-around;
}

.add-citylist {
  width: 100%;
  height: 50px;
  border: 1px solid rgb(235, 238, 245);
  border-top: none;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.tab-wrapper::-webkit-scrollbar {
  display: none;
}

.tab-wrapper {
  height: 550px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 25px;
}
</style>
