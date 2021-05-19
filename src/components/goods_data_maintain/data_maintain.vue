<template>
  <div>
    <el-card shadow="hover" class="box-card">
      <div slot="header" class="clearfix">
        <el-cascader
          ref="searchUnit"
          :options="data"
          :key="keyValue"
          v-model="val"
          placeholder="请选择商品分类"
          :props="{ expandTrigger: 'hover', checkStrictly: true, value: 'id' }"
          clearable
          filterable
          @change="searchUnit"
        >
          <template slot-scope="{ node, data }">
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </el-cascader>
        <el-input v-model="search.goodsName" placeholder="请输入商品名称" class="input-with-select input-with" clearable>
          <el-select style="width: 130px" v-model="search.goodsState" slot="prepend" placeholder="请选择商品状态">
            <el-option label="请选择" value=""></el-option>
            <el-option label="销售" value="0"></el-option>
            <el-option label="下架" value="1"></el-option>
          </el-select>
          <el-button slot="append" @click="searchData" icon="el-icon-search"></el-button>
        </el-input>
        <el-tooltip class="item" effect="dark" content="录入商品" placement="right">
          <el-button type="success" @click="addFormVisible = true" icon="el-icon-plus" circle></el-button>
        </el-tooltip>
      </div>
      <div>
        <el-table
          :data="tableData"
          max-height="500"
          stripe
          v-loading="loading"
          :default-sort="{prop: 'id', order: 'descending'}"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="商品ID">
                  <span>{{ props.row.id }}</span>
                </el-form-item>
                <el-form-item label="商品名称">
                  <span>{{ props.row.goodsName }}</span>
                </el-form-item>
                <el-form-item label="价格">
                  <span>{{ props.row.goodsPrice }}</span>
                </el-form-item>
                <el-form-item label="单位">
                  <span>{{ props.row.goodsUnit }}</span>
                </el-form-item>
                <el-form-item label="销量">
                  <span>{{ props.row.goodsSales }}</span>
                </el-form-item>
                <el-form-item label="状态">
                  <span>{{ props.row.goodsState | state }}</span>
                </el-form-item>
                <el-form-item label="一级分类">
                  <span>{{ props.row.firstKindName }}</span>
                </el-form-item>
                <el-form-item label="二级分类">
                  <span>{{ props.row.secondKindName }}</span>
                </el-form-item>
                <el-form-item label="三级分类">
                  <span>{{ props.row.thirdKindName }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            prop="id"
            label="商品ID"
            sortable
            width="120">
          </el-table-column>
          <el-table-column
            label="商品图片"
            width="180">
            <template slot-scope="scope">
              <el-image style="width: 120px;height: 60px" :src="scope.row.imageUrl"></el-image>
            </template>
          </el-table-column>
          <el-table-column
            prop="goodsName"
            label="商品名称"
            width="320">
          </el-table-column>
          <el-table-column
            prop="goodsDescribe"
            label="商品简介"
            width="390">
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="120">
            <template slot-scope="scope">
              <el-button type="primary" @click="updateFormDialog(scope.row.id)" icon="el-icon-edit" circle></el-button>
              <el-popconfirm
                title="此操作将永久删除该商品, 是否继续？"
                icon="el-icon-info"
                icon-color="red"
                @confirm="remove(scope.row.id)"
              >
                <el-button slot="reference" type="danger" icon="el-icon-delete" circle></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-divider></el-divider>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog title="录入商品" :visible.sync="addFormVisible" center @close="resetAddForm('addForm')">
      <el-form :model="addForm" :rules="rules" ref="addForm">
        <el-form-item label="商品名称" :label-width="formLabelWidth" prop="goodsName">
          <div class="form-input">
            <el-input v-model="addForm.goodsName" autocomplete="off"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="商品图片" :label-width="formLabelWidth">
          <el-upload
            action="#"
            list-type="picture-card"
            ref="upload"
            accept="image/jpeg,image/gif,image/png,image/jpg"
            :on-change="imageChange"
            :auto-upload="false"
            :file-list="imageList"
            :limit="1"
            :on-exceed="imageExceed"
            style="width: 100%;">
            <i class="el-icon-plus"></i>
          </el-upload>
          <div>
            <el-dialog :visible.sync="dialogVisibleImg">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </div>
        </el-form-item>
        <el-form-item label="商品简介" :label-width="formLabelWidth" prop="goodsDescribe">
          <div class="form-input">
            <el-input
              type="textarea"
              v-model="addForm.goodsDescribe"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
            >
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="商品价格" :label-width="formLabelWidth" prop="goodsPrice">
          <div class="form-input">
            <el-input autocomplete="off" v-model="addForm.goodsPrice"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="商品单位" :label-width="formLabelWidth" prop="goodsUnit">
          <div class="form-input">
            <el-input autocomplete="off" v-model="addForm.goodsUnit"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="商品分类" :label-width="formLabelWidth">
          <el-cascader class="form-input"
                       ref="addUnit"
                       :options="data"
                       :key="keyValue"
                       placeholder="请选择商品分类"
                       :props="{ expandTrigger: 'hover', checkStrictly: true, value: 'id' }"
                       clearable
                       filterable
                       v-model="addVal"
                       @change="addUnit"
          >
            <template slot-scope="{ node, data }">
              <span>{{ data.label }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFormSubmit('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑商品" :visible.sync="updateFormVisible" center @close="resetUpdateForm('updateForm')">
      <el-form :model="updateForm" :rules="rules" ref="updateForm">
        <el-form-item label="商品名称" :label-width="formLabelWidth" prop="goodsName">
          <div class="form-input">
            <el-input v-model="updateForm.goodsName" autocomplete="off"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="商品图片" :label-width="formLabelWidth">
          <div>
            <div v-if="bool" style="float: left; margin-right: 5px">
              <img width="146px" height="146px" :src="updateForm.imageUrl" alt="">
            </div>
            <div style="float: left">
              <el-upload
                action="#"
                list-type="picture-card"
                ref="upload"
                accept="image/jpeg,image/gif,image/png,image/jpg"
                :on-change="updateImgChange"
                :on-remove="updateImgRemove"
                :auto-upload="false"
                :file-list="updateImgList"
                :limit="1"
                :on-exceed="imageExceed"
                style="width: 100%;">
                <i class="el-icon-plus"></i>
              </el-upload>
              <div>
                <el-dialog :visible.sync="updateImg">
                  <img width="100%" :src="updateImageUrl" alt="">
                </el-dialog>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="商品简介" :label-width="formLabelWidth" prop="goodsDescribe">
          <div class="form-input">
            <el-input
              type="textarea"
              v-model="updateForm.goodsDescribe"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
            >
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="商品销量" :label-width="formLabelWidth" prop="goodsSales">
          <div class="form-input">
            <el-input-number v-model="updateForm.goodsSales" :min="1"></el-input-number>
          </div>
        </el-form-item>
        <el-form-item label="商品价格" :label-width="formLabelWidth" prop="goodsPrice">
          <div class="form-input">
            <el-input autocomplete="off" v-model="updateForm.goodsPrice"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="商品单位" :label-width="formLabelWidth" prop="goodsUnit">
          <div class="form-input">
            <el-input autocomplete="off" v-model="updateForm.goodsUnit"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="商品状态" :label-width="formLabelWidth" prop="goodsState">
          <el-select class="form-input" v-model="updateForm.goodsState" placeholder="请选择商品状态">
            <el-option label="销售" value="0"></el-option>
            <el-option label="下架" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品分类" :label-width="formLabelWidth">
          <el-cascader class="form-input"
                       ref="updateUnit"
                       :options="data"
                       :key="keyValue"
                       placeholder="请选择商品分类"
                       :props="{ expandTrigger: 'hover', checkStrictly: true, value: 'id' }"
                       clearable
                       filterable
                       v-model="updateVal"
                       @change="updateUnit"
          >
            <template slot-scope="{ node, data }">
              <span>{{ data.label }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateFormSubmit('updateForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "data_maintain",
  data() {
    return {
      tableData: [],
      data: [],
      loading: false,
      keyValue: 1,
      formLabelWidth: '120px',
      addFormVisible: false,
      dialogImageUrl: '',
      updateImageUrl: '',
      updateFormVisible: false,
      pageSize: 10,
      search: {goodsName: '', goodsState: '', firstKindId: '', secondKindId: '', thirdKindId: ''},
      val: [],
      addVal: [],
      updateVal: [],
      total: 0,
      pageNo: 1,
      bool: true,
      addForm: {
        goodsName: '', goodsDescribe: '', fileObj: '',
        goodsPrice: '', goodsUnit: '',
        goodsState: 0, firstKindId: '', secondKindId: '', thirdKindId: '',
        firstKindName: '', secondKindName: '', thirdKindName: '', supplierId: 0
      },
      updateForm: {},
      imageList: [],
      dialogVisibleImg: false,
      updateImgList: [],
      updateImg: false,
      rules: {
        goodsName: [
          {required: true, message: '请输入商品名称', trigger: 'blur'}
        ],
        goodsDescribe: [
          {required: true, message: '请输入内容', trigger: 'blur'}
        ],
        goodsPrice: [
          {required: true, message: '请输入商品价格', trigger: 'blur'}
        ],
        goodsUnit: [
          {required: true, message: '请输入商品单位', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    getData() {
      this.continuousLoad();
      var _this = this;
      var params = new URLSearchParams();
      params.append("goodsName", this.search.goodsName);
      params.append("goodsState", this.search.goodsState);
      params.append("firstKindId", this.search.firstKindId);
      params.append("secondKindId", this.search.secondKindId);
      params.append("thirdKindId", this.search.thirdKindId);
      params.append("pageSize", this.pageSize);
      params.append("pageNo", this.pageNo);
      this.$axios.post("goodsMain/showGoods", params).then(function (result) {
        _this.tableData = result.data.records.map(item => {
          item.imageUrl = "http://127.0.0.1:8090/code/" + item.imageUrl;
          return item;
        });
        _this.total = result.data.total;
      }).catch();
    },
    getType() {
      var _this = this;
      this.$axios.post("goodsMain/showType").then(function (result) {
        _this.data = result.data;
      }).catch();
    },
    continuousLoad() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
    searchUnit(a) {
      this.search.firstKindId = '';
      this.search.secondKindId = '';
      this.search.thirdKindId = '';
      if (this.$refs.searchUnit) {
        this.$refs.searchUnit.dropDownVisible = false;
        if (this.val[0]) {
          this.search.firstKindId = this.val[0];
        }
        if (this.val[1]) {
          this.search.secondKindId = this.val[1];
        }
        if (this.val[2]) {
          this.search.thirdKindId = this.val[2];
        }
      }
    },
    addUnit(a) {
      this.addForm.firstKindId = '';
      this.addForm.firstKindName = '';
      this.addForm.secondKindId = '';
      this.addForm.secondKindName = '';
      this.addForm.thirdKindId = '';
      this.addForm.thirdKindName = '';
      if (this.$refs.addUnit) {
        this.$refs.addUnit.dropDownVisible = false;
        if (this.$refs.addUnit.getCheckedNodes().length != 0) {
          var labels = this.$refs.addUnit.getCheckedNodes()[0].pathLabels;
          if (this.addVal[0] && labels[0]) {
            this.addForm.firstKindId = this.addVal[0];
            this.addForm.firstKindName = labels[0];
          }
          if (this.addVal[1] && labels[1]) {
            this.addForm.secondKindId = this.addVal[1];
            this.addForm.secondKindName = labels[1];
          }
          if (this.addVal[2] && labels[2]) {
            this.addForm.thirdKindId = this.addVal[2];
            this.addForm.thirdKindName = labels[2];
          }
        }
      }
    },
    updateFormDialog(id) {
      var _this = this;
      var params = new URLSearchParams();
      params.append("id", id);
      this.$axios.post("goodsMain/queryGoodsById", params).then(function (result) {
        if (result.data.imageUrl) {
          result.data.imageUrl = "http://127.0.0.1:8090/code/" + result.data.imageUrl;
        }
        _this.updateForm = result.data;
        if (result.data.firstKindId && result.data.firstKindId != 'null') {
          _this.updateVal = JSON.parse(result.data.firstKindId);
        }
        if (result.data.secondKindId && result.data.secondKindId != 'null') {
          _this.updateVal = JSON.parse(result.data.secondKindId);
        }
        if (result.data.thirdKindId && result.data.thirdKindId != 'null') {
          _this.updateVal = JSON.parse(result.data.thirdKindId);
        }
        _this.updateFormVisible = true;
      }).catch();
    },
    updateUnit(a) {
      this.updateForm.firstKindId = '';
      this.updateForm.firstKindName = '';
      this.updateForm.secondKindId = '';
      this.updateForm.secondKindName = '';
      this.updateForm.thirdKindId = '';
      this.updateForm.thirdKindName = '';
      if (this.$refs.updateUnit) {
        this.$refs.updateUnit.dropDownVisible = false;
        if (this.$refs.updateUnit.getCheckedNodes().length != 0) {
          var labels = this.$refs.updateUnit.getCheckedNodes()[0].pathLabels;
          if (this.updateVal[0] && labels[0]) {
            this.updateForm.firstKindId = this.updateVal[0];
            this.updateForm.firstKindName = labels[0];
          }
          if (this.updateVal[1] && labels[1]) {
            this.updateForm.secondKindId = this.updateVal[1];
            this.updateForm.secondKindName = labels[1];
          }
          if (this.updateVal[2] && labels[2]) {
            this.updateForm.thirdKindId = this.updateVal[2];
            this.updateForm.thirdKindName = labels[2];
          }
        }
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getData();
    },
    searchData() {
      this.getData();
    },
    imageChange(file) {
      this.addForm.fileObj = file.raw;
    },
    updateImgChange(file) {
      this.bool = false;
      this.updateForm.fileObj = file.raw;
    },
    updateImgRemove() {
      setTimeout(() => {
        this.bool = true;
      }, 1000);
    },
    addFormSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.addForm.fileObj) {
            this.$message({
              showClose: true,
              message: '请选择商品图片',
              type: 'warning'
            });
            return false;
          }
          if (this.addVal.length == 0) {
            this.$message({
              showClose: true,
              message: '请选择商品分类',
              type: 'warning'
            });
            return false;
          }
          var _this = this;
          var formData = new FormData();
          Object.keys(this.addForm).forEach((key) => {
            formData.append(key, _this.addForm[key]);
          })
          this.$axios({
            method: 'post',
            url: 'goodsMain/saveGoods',
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(function (result) {
            _this.resetAddForm(formName);
            _this.$message({
              showClose: true,
              message: '录入成功',
              type: 'success'
            });
            _this.getData();
          }).catch();
        } else {
          return false;
        }
      });
    },
    resetAddForm(formName) {
      this.addFormVisible = false;
      this.$refs[formName].resetFields();
      this.imageList = [];
      this.addVal = [];
    },
    imageExceed(file, fileList) {
      this.$message({
        showClose: true,
        message: '商品图片只需上传一张',
        type: 'warning'
      });
    },
    updateFormSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.updateVal.length == 0) {
            this.$message({
              showClose: true,
              message: '请选择商品分类',
              type: 'warning'
            });
            return false;
          }
          var _this = this;
          var imageUrl = '';
          if (this.updateForm.imageUrl) {
            imageUrl = this.updateForm.imageUrl.split("http://127.0.0.1:8090/code/")[1];
          }
          this.updateForm.imageUrl = imageUrl;
          var formData = new FormData();
          Object.keys(this.updateForm).forEach((key) => {
            formData.append(key, _this.updateForm[key]);
          })
          this.$axios({
            method: 'post',
            url: 'goodsMain/updateGoods',
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(function (result) {
            _this.resetUpdateForm(formName);
            _this.$message({
              showClose: true,
              message: '编辑成功',
              type: 'success'
            });
            _this.getData();
          }).catch();
        } else {
          return false;
        }
      });
    },
    resetUpdateForm(formName) {
      this.updateFormVisible = false;
      this.$refs[formName].resetFields();
      this.updateImgList = [];
      this.updateVal = [];
      this.bool = true;
    },
    remove(id) {
      var _this = this;
      var params = new URLSearchParams();
      params.append("id", id);
      this.$axios.post("goodsMain/removeGoods", params).then(function (result) {
        _this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        });
        _this.getData();
      }).catch();
    }
  },
  watch: {
    data(newVal) {
      this.keyValue++;
    }
  },
  created() {
    this.getData();
    this.getType();
  },
  filters: {
    state(val) {
      return val == '0' ? '销售' : '下架';
    }
  }
}
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 100%;
}

.el-select .el-input {
  width: 130px;
}

.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.input-with {
  width: 500px;
}

.form-input {
  width: 300px;
}

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
