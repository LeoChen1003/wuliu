<template>
  <div class="manage tabfix">
    <div>
      <el-button
        type="primary"
        style="width:150px;margin-bottom:20px;"
        @click="toAdd"
        >{{ $t("resources.add") }}</el-button
      >
    </div>
    <el-row :gutter="40">
      <el-col :span="12">
        <el-table
          :data="dataList"
          border
          highlight-current-row
          @current-change="handleCurrentChange"
          :cell-style="cell"
        >
          <el-table-column
            prop="name"
            :highlight-current-row="true"
            :label="$t('resources.driver_name')"
          ></el-table-column>
          <el-table-column
            prop="phone"
            :label="$t('resources.phoneNo')"
          ></el-table-column>
          <el-table-column
            prop="activeStatus"
            :label="$t('resources.status')"
          ></el-table-column>
          <el-table-column width="200px;">
            <template slot-scope="scope">
              <div style="box-sizing:border-box;padding:0 5px;">
                <el-button
                  type="primary"
                  style="margin-bottom:5px;width:100%;"
                  @click="toEdit(scope.row)"
                >
                  {{ $t("resources.edit") }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <el-tabs v-model="activeTab" type="border-card">
          <el-tab-pane :label="$t('resources.task')" name="first">
            <el-table :data="[]" border :cell-style="cell">
              <el-table-column
                prop=""
                :label="$t('resources.TaskNo')"
              ></el-table-column>
              <el-table-column
                prop=""
                :label="$t('resources.description')"
              ></el-table-column>
              <el-table-column
                prop=""
                :label="$t('resources.implementation')"
              ></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane
            :label="$t('resources.detailedInformation')"
            name="second"
          >
            <el-form
              class="form"
              v-if="thisRow"
              label-position="left"
              label-width="160px"
            >
              <el-form-item prop="name" :label="$t('resources.name')">
                <el-input
                  v-model="thisRow.name"
                  disabled
                  class="inputWidth"
                ></el-input>
              </el-form-item>
              <el-form-item prop="phone" :label="$t('resources.phone')">
                <el-input
                  v-model="thisRow.phone"
                  disabled
                  class="inputWidth"
                ></el-input>
              </el-form-item>
              <el-form-item prop="status" :label="$t('resources.status')">
                <el-select
                  v-model="thisRow.activeStatus"
                  disabled
                  :placeholder="$t('placeholder.pleaseChoose')"
                  class="inputWidth"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('resources.license')"
                v-if="licPreList.length != 0"
              >
                <div class="inputWidth">
                  <el-image
                    v-for="(img, index) in licPreList"
                    :key="index"
                    style="width: 100px; height: 100px;margin-right:10px;"
                    :src="img + '?x-oss-process=style/th-90'"
                    :preview-src-list="licPreList"
                  >
                  </el-image>
                </div>
              </el-form-item>
              <el-form-item
                :label="$t('resources.identityCard')"
                v-if="idePreList.length != 0"
              >
                <div class="inputWidth">
                  <el-image
                    v-for="(img, index) in idePreList"
                    :key="index"
                    style="width: 100px; height: 100px;margin-right:10px;"
                    :src="img + '?x-oss-process=style/th-90'"
                    :preview-src-list="idePreList"
                  >
                  </el-image>
                </div>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane
            :label="$t('resources.locationTracking')"
            name="third"
          ></el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-dialog
      :title="$t('resources.driver')"
      :visible.sync="dialogVisible"
      @close="dialogClose"
      width="60%"
      center
    >
      <div>
        <el-form
          ref="detailform"
          :model="detailform"
          :rules="detailRules"
          class="form"
          label-position="left"
          label-width="160px"
        >
          <el-form-item prop="name" :label="$t('resources.name')">
            <el-input v-model="detailform.name" class="inputWidth"></el-input>
          </el-form-item>
          <el-form-item prop="phone" :label="$t('resources.phone')">
            <el-input v-model="detailform.phone" class="inputWidth"></el-input>
          </el-form-item>
          <el-form-item prop="status" :label="$t('resources.status')">
            <el-select
              v-model="detailform.status"
              :placeholder="$t('placeholder.pleaseChoose')"
              class="inputWidth"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('resources.license')" required>
            <div class="inputWidth">
              <el-upload
                class="upload-box"
                ref="licenseIds"
                :action="env + '/api/file/upload'"
                :on-preview="handlePreview"
                multiple
                :file-list="fileList1"
                :headers="headers"
                :limit="5"
                :on-exceed="outLimit"
                accept="image/*"
                list-type="picture-card"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item :label="$t('resources.identityCard')" required>
            <div class="inputWidth">
              <el-upload
                class="upload-box"
                ref="identityIds"
                :action="env + '/api/file/upload'"
                :on-preview="handlePreview"
                multiple
                :file-list="fileList2"
                :headers="headers"
                :limit="5"
                :on-exceed="outLimit"
                accept="image/*"
                list-type="picture-card"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              style="margin-bottom:20px;"
              :loading="loading"
              class="inputWidth"
              @click="toConfirm"
              >{{ $t("resources.confirm") }}</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="previewDialog">
      <img width="100%" :src="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { mapGetters } from "vuex";
import { driverAdd, driverList, driverEdit } from "../../api/resources";
import { getToken } from "@/utils/auth";

let self;

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    return {
      env: process.env.VUE_APP_BASE_API,
      headers: {
        Authorization: getToken()
      },
      dataList: [],
      dialogVisible: false,
      detailform: {
        name: "",
        phone: "",
        status: ""
      },
      options: [
        {
          value: "ACTIVE",
          label: "Actived"
        },
        {
          value: "CLOSED",
          label: "Closed"
        }
      ],
      editType: "",
      detailRules: {
        name: [{ required: true, trigger: "blur" }],
        phone: [{ required: true, trigger: "blur" }],
        status: [{ required: true }]
      },
      loading: false,
      activeTab: "first",
      curEditId: null,
      fileList1: [],
      fileList2: [],
      previewDialog: false,
      previewImg: "",
      licPreList: [],
      idePreList: [],
      thisRow: null
    };
  },
  //监听属性 类似于data概念
  computed: {
    ...mapGetters(["permissions"]),
    licFileList: function() {
      return self.$refs.licenseIds.uploadFiles;
    },
    ideFileList: function() {
      return self.$refs.identityIds.uploadFiles;
    }
  },
  //监控data中的数据变化
  watch: {},
  methods: {
    cell({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 3) {
        return "text-align:center;color:#168BD5;font-size:18px;";
      }
    },
    getDriverList() {
      driverList().then(res => {
        self.dataList = res.data;
      });
    },
    toAdd() {
      self.dialogVisible = true;
      self.editType = "add";
      self.detailform = {
        name: "",
        phone: "",
        status: ""
      };
    },
    toEdit(row) {
      self.editType = "edit";
      self.detailform = {
        name: row.name,
        phone: row.phone,
        status: row.activeStatus
      };
      self.curEditId = row.id;
      let licPreList = [];
      let idePreList = [];
      for (let i of row.licenseResource) {
        licPreList.push({
          url: i.path,
          id: i.id
        });
      }
      for (let i of row.identityResource) {
        idePreList.push({
          url: i.path,
          id: i.id
        });
      }
      self.fileList1 = licPreList;
      self.fileList2 = idePreList;
      self.dialogVisible = true;
    },
    toConfirm() {
      if (!/^(0|66)\d{9}$/.test(self.detailform.phone)) {
        return self.$message.warning(self.$t("login.phoneWrong"));
      }
      this.$refs.detailform.validate(valid => {
        if (valid) {
          self.loading = true;
          let detailform = JSON.parse(JSON.stringify(self.detailform));
          // 整理licenseIds
          let licArr = [];
          for (let i of self.licFileList) {
            if (i.response) {
              licArr.push(i.response.data.id);
            } else {
              licArr.push(i.id);
            }
          }
          // 整理identityIds
          let ideArr = [];
          for (let i of self.ideFileList) {
            if (i.response) {
              ideArr.push(i.response.data.id);
            } else {
              ideArr.push(i.id);
            }
          }
          detailform.licenseIds = licArr.toString();
          detailform.identityIds = ideArr.toString();
          if (self.editType == "add") {
            driverAdd(detailform)
              .then(res => {
                self.$message.success(res.message);
                self.loading = false;
                self.getDriverList();
                self.dialogVisible = false;
              })
              .catch(el => {
                self.loading = false;
              });
          } else if (self.editType == "edit") {
            driverEdit(self.curEditId, detailform)
              .then(res => {
                self.$message.success(res.message);
                self.loading = false;
                self.getDriverList();
                self.dialogVisible = false;
              })
              .catch(el => {
                self.loading = false;
              });
          }
        }
      });
    },
    handleCurrentChange(val) {
      let licPreList = [];
      let idePreList = [];
      if (val == null) {
        return (self.thisRow = null);
      }
      for (let i of val.licenseResource) {
        licPreList.push(i.path);
      }
      for (let i of val.identityResource) {
        idePreList.push(i.path);
      }
      self.licPreList = licPreList;
      self.idePreList = idePreList;
      self.thisRow = val;
    },
    handlePreview(file) {
      this.previewImg = file.url;
      this.previewDialog = true;
    },
    dialogClose() {
      self.fileList1 = [];
      self.fileList2 = [];
    },
    outLimit() {
      self.$message.warning(self.$t("resources.outLimit"));
    }
  },
  created() {
    self = this;
  },
  mounted() {
    this.getDriverList();
  }
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
.manage {
  padding: 20px;
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: -100px;
  }
  .el-tabs__item {
    width: 200px;
    text-align: center;
  }
}
.inputWidth {
  width: 350px;
}

.upload-box {
  width: 100%;
  height: 70px;
  overflow: hidden;
}
</style>

<style lang="scss">
.tabfix .el-tabs__item {
  width: 200px;
  text-align: center;
}

.el-upload {
  width: 60px !important;
  height: 60px !important;
}

.el-upload-list {
  .is-success,
  .is-uploading,
  .is-ready {
    width: 60px !important;
    height: 60px !important;
  }
}

.inputWidth {
  .el-icon-plus {
    transform: translateY(-38px) !important;
  }
}
</style>
