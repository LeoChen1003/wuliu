<template>
  <div class="wrapper">
    <el-row type="flex" justify="space-around">
      <el-col :span="3">
        <el-button @click="add" class="full-width" type="primary">{{ $t("resources.add") }}</el-button>
      </el-col>
      <el-col :span="10">
        <el-select v-model="status" placeholder="placeholder" clearable>
          <el-option label="Activated" value="ACTIVE" />
          <el-option label="Closed" value="CLOSED" />
        </el-select>
        <el-button type="primary" style="margin-left: 20px;" @click="loadData()">Search</el-button>
      </el-col>
      <el-col :span="10"></el-col>
    </el-row>
    <el-row type="flex" justify="space-around" class="container">
      <el-col :span="3" class="nav">
        <div class="nav-title">{{ $t("setting.origin") }}</div>
        <div class="item-box">
          <div
            v-for="item in hubList"
            class="nav-item"
            @click="tapHub(item.id)"
            :class="item.id === activeHub ? 'nav-active' : ''"
          >
            {{ item.hubName }}
            <div class="nav-count">{{ hubCount[item.id] }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="10">
        <el-table
          :data="data.content"
          style="width: 100%"
          v-loading="tableLoading"
          highlight-current-row
          @current-change="tapRow"
        >
          <el-table-column prop="name" :label="$t('setting.routeName')" />
          <el-table-column prop="cutOffTime" :label="$t('setting.cutOffTime')" />
          <el-table-column :label="$t('setting.status')">
            <template slot-scope="scope">
              {{ scope.row.status === "ACTIVE" ? "Activated" : "Closed" }}
            </template>
          </el-table-column>
          <el-table-column prop="columnProp" :label="$t('setting.operation')" align="center">
            <template slot-scope="scope">
              <div class="btn-box">
                <el-button @click="edit(scope.row)" class="btn" type="primary">{{ $t("setting.edit") }}</el-button>
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
      </el-col>
      <el-col :span="10">
        <el-tabs v-model="detailTab">
          <el-tab-pane :label="$t('setting.routeDetails')" name="detail">
            <el-table :data="thisRow ? thisRow.lineTemplateProvinces : []" style="width: 100%">
              <el-table-column prop="provinceName" :label="$t('setting.province')" width="180px"> </el-table-column>
              <el-table-column :label="$t('setting.deliverableDistrict')">
                <template slot-scope="scope">
                  <el-tag v-for="item in scope.row.lineTemplateCitys" style="margin-right: 10px;">
                    {{ item.cityName }}
                  </el-tag>
                </template>
              </el-table-column>
              <!--<el-table-column prop="address" :label="$t('setting.undeliverableDistrict')"> </el-table-column>-->
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="$t('setting.map')" name="map">
            <div style="text-align: center;height: 50%;">
              <el-image fit="cover" v-if="thisRow" :src="thisRow.mapUrl" :preview-src-list="preViewList"></el-image>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-dialog
      class="edit-box"
      :title="$t('setting.edit')"
      :visible.sync="editDialog"
      width="1000px"
      :close-on-click-modal="false"
    >
      <div>
        <div class="edit-form-box">
          <el-form label-width="120px">
            <el-form-item required :label="$t('setting.routeName')">
              <el-input class="form-input" v-model="form.name" />
            </el-form-item>
            <el-form-item required :label="$t('setting.cutOffTime')">
              <div style="width: 200px;">
                <el-time-select
                  v-model="form.cutOffTime"
                  style="width:100%;"
                  :picker-options="timeOptions"
                  default-value="18:00"
                />
              </div>
            </el-form-item>
          </el-form>
          <el-form label-width="120px">
            <el-form-item required :label="$t('setting.origin')">
              <el-select v-model="form.hubId">
                <el-option v-for="item in hubList" :label="item.hubName" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item required :label="$t('setting.status')">
              <el-select v-model="form.status">
                <el-option label="Activated" value="ACTIVE" />
                <el-option label="Closed" value="CLOSED" />
              </el-select>
            </el-form-item>
          </el-form>
          <el-form label-width="120px">
            <el-form-item required :label="$t('setting.map')">
              <el-upload
                class="upload-box"
                ref="upload1"
                :action="env + '/api/file/upload'"
                :on-preview="handlePreview"
                multiple
                :file-list="fileList1"
                :headers="headers"
                :limit="1"
                :on-exceed="outLimit"
                accept="image/*"
                list-type="picture-card"
              >
                <i class="el-icon-plus" />
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <div class="edit-container" v-loading="editLoading">
          <el-table border :data="list" style="width: 100%">
            <el-table-column prop="date" :label="$t('setting.province')" width="180">
              <template slot-scope="scope">
                <el-select v-model="scope.row.provinceCode" @change="provinceChange(scope.row, scope.$index)">
                  <el-option
                    v-for="item in provinceList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.code"
                    :disabled="item.disable"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column :label="$t('setting.deliverableDistrict')">
              <template slot-scope="scope">
                <el-select v-model="scope.row.cityCodes" style="width: 100%" multiple>
                  <el-option v-for="item in scope.row.cityList" :key="item.id" :label="item.name" :value="item.code" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" width="180">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.$index !== 0"
                  @click="delRow(scope.row, scope.$index)"
                  type="primary"
                  icon="el-icon-delete"
                  circle
                />
              </template>
            </el-table-column>
          </el-table>
          <div class="add-box">
            <el-button @click="addRow" type="primary" icon="el-icon-plus" circle />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmIt">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="previewDialog">
      <img width="100%" :src="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import { getProvinceList, getCityList, getHub } from "@api/data";
import { saveLineTemplate, getLineTemplate, getLineTemplateCount } from "@api/setting";
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
import { demandOrderList } from "@api/tracking";

let self;
export default {
  name: "route",
  data() {
    return {
      env: process.env.VUE_APP_BASE_API,
      headers: {
        Authorization: getToken(),
      },
      previewDialog: false,
      detailTab: "detail",
      editDialog: false,
      activeHub: "",
      fileList1: [],
      previewImg: "",
      optionsList: [1, 2, 3],
      model: 1,
      provinceList: [],
      list: [
        {
          provinceCode: "",
          cityList: [],
          cityCodes: [],
        },
      ],
      form: {
        status: "CLOSED",
        cutOffTime: "",
        name: "",
        hubId: "",
      },
      timeOptions: {
        start: "00:00",
        step: "00:15",
        end: "23:45",
      },
      hubList: [],
      hubCount: [],
      proObj: {},
      cityObj: {},
      status: "",
      data: {},
      tableLoading: false,
      editLoading: false,
      thisRow: null,
      editType: "add",
    };
  },
  computed: {
    fileList: function() {
      return self.$refs.upload1.uploadFiles;
    },
    ...mapGetters(["permissions"]),
  },
  created() {
    self = this;
  },
  mounted() {
    getProvinceList().then(res => {
      self.provinceList = res.data;
      let proObj = new Object();
      for (let i of res.data) {
        proObj[i.code] = i.name;
      }
      self.proObj = proObj;
    });
    getHub().then(res => {
      self.hubList = res.data;
      self.tapHub(res.data[0].id);
    });
    getCityList().then(res => {
      let cityObj = new Object();
      for (let i of res.data) {
        cityObj[i.code] = i.name;
      }
      self.cityObj = cityObj;
    });
  },
  methods: {
    loadData(cb) {
      self.tableLoading = true;
      let params = {
        page: self.data.number ? self.data.number : 0,
        hubId: self.activeHub,
      };
      if (self.status !== "") {
        params.status = self.status;
      }
      getLineTemplate(params).then(res => {
        self.data = res.data;
        self.tableLoading = false;
        if (cb) {
          cb();
        }
      });
      getLineTemplateCount({ status: self.status }).then(res => {
        let hubCount = new Object();
        for (let i of res.data) {
          hubCount[i.hubId] = i.number;
        }
        self.hubCount = hubCount;
      });
    },
    tapHub(id) {
      self.activeHub = id;
      self.loadData();
    },
    pageChange(e) {
      self.tableLoading = true;
      let params = {
        page: self.data.number ? self.data.number : 0,
        hubId: self.activeHub,
      };
      if (self.status !== "") {
        params.status = self.status;
      }
      getLineTemplate(params).then(res => {
        self.data = res.data;
        self.tableLoading = false;
      });
    },
    add() {
      self.list = [
        {
          provinceCode: "",
          cityList: [],
          cityCodes: [],
        },
      ];
      self.form = {
        status: "CLOSED",
        cutOffTime: "",
        name: "",
        hubId: "",
      };
      self.fileList1 = [];
      self.editType = "add";
      self.editDialog = true;
    },
    edit(row) {
      self.form = {
        status: row.status,
        cutOffTime: row.cutOffTime,
        name: row.name,
        hubId: row.hubId,
        id: row.id,
      };
      let list = [];
      self.editLoading = true;
      let x = 0;
      parse();
      function parse() {
        let params = `provinceCodes=${row.lineTemplateProvinces[x].provinceCode}`;
        getCityList(params).then(res => {
          list.push({
            provinceCode: row.lineTemplateProvinces[x].provinceCode,
            cityList: res.data,
            cityCodes: [],
          });
          for (let i of row.lineTemplateProvinces[x].lineTemplateCitys) {
            list[x].cityCodes.push(i.cityCode);
          }
          if (x < parseInt(row.lineTemplateProvinces.length) - 1) {
            x++;
            parse();
          } else {
            self.editLoading = false;
          }
        });
      }
      let fileList = [{ url: row.mapUrl }];
      self.fileList1 = fileList;
      self.list = list;
      self.filteProvince();
      self.editDialog = true;
    },
    handlePreview(file) {
      this.previewImg = file.url;
      this.previewDialog = true;
    },
    outLimit() {
      self.$message.warning(self.$t("resources.outLimit"));
    },
    addRow() {
      let list = JSON.parse(JSON.stringify(self.list));
      list.push({
        provinceCode: "",
        cityList: [],
        cityCodes: [],
      });
      self.list = list;
    },
    delRow(row, index) {
      self.list.splice(index, 1);
      self.filteProvince();
    },
    provinceChange(row, index) {
      let list = JSON.parse(JSON.stringify(self.list));
      let params = `provinceCodes=${row.provinceCode}`;
      getCityList(params).then(res => {
        list[index].cityList = res.data;
        list[index].cityCodes = [];
        self.list = list;
        self.filteProvince();
      });
    },
    filteProvince() {
      let list = JSON.parse(JSON.stringify(self.list));
      let provinceList = JSON.parse(JSON.stringify(self.provinceList));
      // 过滤可选省
      let checkedProvinceList = [];
      for (let i of list) {
        if (i.provinceCode !== "") {
          checkedProvinceList.push(i.provinceCode);
        }
      }
      for (let i of provinceList) {
        for (let t of checkedProvinceList) {
          if (i.code === t) {
            i.disable = true;
            break;
          } else {
            i.disable = false;
          }
        }
      }
      self.provinceList = provinceList;
    },
    confirmIt() {
      let list = JSON.parse(JSON.stringify(self.list));
      let form = JSON.parse(JSON.stringify(self.form));
      if (form.name === "") {
        return self.$message.warning("name不能为空");
      } else if (form.cutOffTime === "") {
        return self.$message.warning("time不能为空");
      } else if (form.hubId === "") {
        return self.$message.warning("hub不能为空");
      } else if (self.fileList.length === 0) {
        return self.$message.warning("map不能为空");
      }
      if (self.fileList[0].response) {
        form.mapUrl = self.fileList[0].response.data.path;
      } else {
        form.mapUrl = self.fileList[0].url;
      }
      let lineTemplateProvinces = [];
      for (let i of self.hubList) {
        if (i.id === form.hubId) {
          form.hubName = i.hubName;
          break;
        }
      }
      for (let x in list) {
        if (list[x].hasOwnProperty("provinceCode")) {
          if (list[x].provinceCode === "" || list[x].cityCodes.length === 0) {
            return self.$message.warning("table不能为空");
          }
        }
        lineTemplateProvinces.push({
          provinceCode: list[x].provinceCode,
          provinceName: self.proObj[list[x].provinceCode],
          orderNum: x,
          lineTemplateCitys: [],
        });
        if (list[x].hasOwnProperty("cityCodes")) {
          for (let y in list[x].cityCodes) {
            lineTemplateProvinces[x].lineTemplateCitys.push({
              cityCode: list[x].cityCodes[y],
              cityName: self.cityObj[list[x].cityCodes[y]],
            });
          }
        }
      }
      form.lineTemplateProvinces = lineTemplateProvinces;
      saveLineTemplate(form).then(() => {
        self.loadData(() => {
          self.editDialog = false;
        });
      });
    },
    tapRow(row) {
      if (row) {
        self.thisRow = row;
        self.preViewList = [row.mapUrl];
      } else {
        self.thisRow = null;
      }
    },
  },
};
</script>

<style scoped lang="scss">
$border: 1px solid #ddd;
.wrapper {
  height: calc(100% - 40px);
  box-sizing: border-box;
  padding: 20px;

  .header {
    margin-bottom: 20px;
  }

  .full-width {
    width: 100%;
  }
}

.container {
  margin-top: 20px;
  height: 100%;

  .nav {
    border: $border;

    .nav-title {
      width: 100%;
      text-align: center;
      height: 40px;
      border-bottom: $border;
      line-height: 40px;
    }

    .item-box {
      box-sizing: border-box;
      padding: 5px;

      .nav-item {
        height: 70px;
        line-height: 70px;
        text-align: center;
        box-sizing: border-box;
        font-weight: normal;
        border: $border;
        border-radius: 3px;
        margin-bottom: 10px;
        transition: all 0.3s;
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
        cursor: pointer;
        position: relative;
        background: #fff;

        &:hover {
          color: red;
          box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.1);
        }

        .nav-count {
          min-width: 20px;
          position: absolute;
          right: 10px;
          bottom: 10px;
          line-height: normal;
          border: 1px solid #ddd;
          background: #ddd;
          border-radius: 30px;
          font-size: 10px;
          box-sizing: border-box;
          padding: 2px;
        }
      }

      .nav-active {
        font-weight: bold;
        color: red;
        box-shadow: 1px 1px 7px 1px rgba(0, 0, 0, 0.2);
      }
    }
  }
  .btn-box {
    width: 100%;

    .btn {
      width: 100%;
    }
  }
}

.edit-box {
  .edit-form-box {
    display: flex;
    justify-content: space-around;
    align-items: center;

    .form-input {
      width: 200px;
    }

    .form-upload {
      width: 100px;
    }
  }

  .edit-container {
    max-height: 400px;
    overflow: scroll;
  }
}

.upload-box {
  width: 100px;
  height: 100px;
  overflow: hidden;

  .el-icon-plus {
    transform: translateY(-25px) !important;
  }
}

.add-box {
  text-align: center;
  border: 1px solid #ebeef5;
  border-top: none;
  box-sizing: border-box;
  padding: 5px;
}

div::-webkit-scrollbar {
  display: none;
}
</style>
<style lang="scss">
.el-upload {
  width: 90px !important;
  height: 90px !important;
}

.el-upload-list {
  .is-success,
  .is-uploading,
  .is-ready {
    width: 90px !important;
    height: 90px !important;
  }
}
</style>
