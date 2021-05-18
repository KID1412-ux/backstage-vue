<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-select v-model="search.purchaseEmployeeId" placeholder="请选择采购员" clearable>
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.employeeName"
            :value="item.id">
          </el-option>
        </el-select>
        <el-input v-model="search.purchaseNo" placeholder="请输入采购单号" class="input-with-select input-with" clearable>
          <el-button slot="append" @click="searchData" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <div>
        <el-table
          :data="tableData"
          max-height="500"
          stripe
          ref="multipleTable"
          v-loading="loading"
          :default-sort="{prop: 'roadTime', order: 'descending'}"
          @selection-change="handleSelectionChange"
          :row-key="getRowKey"
          style="width: 100%">
          <el-table-column
            label="采购单号"
            width="200">
            <template slot-scope="scope">
              {{ scope.row.purchaseNo }}
            </template>
          </el-table-column>
          <el-table-column
            label="采购员姓名"
            prop="employeeName"
            width="160">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="采购总数量"
            width="160">
          </el-table-column>
          <el-table-column
            prop="price"
            label="采购总价"
            width="160">
          </el-table-column>
          <el-table-column
            prop="roadTime"
            sortable
            label="登记日期"
            width="189">
          </el-table-column>
          <el-table-column
            prop="supplierName"
            label="供应商店铺名"
            width="210">
          </el-table-column>
          <el-table-column
            label="审核"
            width="160">
            <template slot-scope="scope">
              <el-button type="primary" @click="review(scope.row.id)" icon="el-icon-edit" circle></el-button>
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
    <el-dialog width="62%" title="采购单审核" :visible.sync="dialogTableVisible" center @close="dialogClose">
      <el-divider
        content-position="left">
        采购单信息
      </el-divider>
      <el-form :model="form">
        <el-form-item label="采购单号" :label-width="formLabelWidth">
          <div class="form-input">
            <el-input v-model="form.purchaseNo" autocomplete="off" disabled></el-input>
          </div>
        </el-form-item>
        <el-form-item label="采购员姓名" :label-width="formLabelWidth">
          <div class="form-input">
            <el-input v-model="form.employeeName" autocomplete="off" disabled></el-input>
          </div>
        </el-form-item>
        <el-form-item label="采购总数量" :label-width="formLabelWidth">
          <div class="form-input">
            <el-input v-model="form.amount" autocomplete="off" disabled></el-input>
          </div>
        </el-form-item>
        <el-form-item label="采购总价" :label-width="formLabelWidth">
          <div class="form-input">
            <el-input v-model="form.price" autocomplete="off" disabled></el-input>
          </div>
        </el-form-item>
        <el-form-item label="登记日期" :label-width="formLabelWidth">
          <div class="form-input">
            <el-input v-model="form.roadTime" autocomplete="off" disabled></el-input>
          </div>
        </el-form-item>
        <el-form-item label="供应商店铺名" :label-width="formLabelWidth">
          <div class="form-input">
            <el-input v-model="form.supplierName" autocomplete="off" disabled></el-input>
          </div>
        </el-form-item>
      </el-form>
      <el-divider
        content-position="left">
        采购单详情
      </el-divider>
      <el-table
        :row-key="getRowKey"
        :data="detailsData"
        style="width: 100%"
        border
        stripe
        :default-sort="{prop: 'id', order: 'descending'}"
        max-height="270">
        <el-table-column
          prop="id"
          label="商品ID"
          sortable
          width="121">
        </el-table-column>
        <el-table-column
          prop="goodsName"
          label="商品名称"
          width="320">
        </el-table-column>
        <el-table-column
          prop="goodsPrice"
          label="供应商售价"
          width="150">
        </el-table-column>
        <el-table-column
          label="采购数量"
          prop="amount"
          width="150">
        </el-table-column>
        <el-table-column
          prop="goodsUnit"
          label="计量单位"
          width="150">
        </el-table-column>
      </el-table>
      <el-divider
        content-position="left">
        审核人
      </el-divider>
      <div class="form-input">
        <el-input v-model="checker" placeholder="请输入审核人姓名" autocomplete="off"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="fail">不通过</el-button>
        <el-button type="primary" @click="passed">通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "data_review",
  data() {
    return {
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      multipleSelection: [],
      search: {purchaseEmployeeId: '', purchaseNo: ''},
      options: [],
      detailsData: [],
      dialogTableVisible: false,
      form: {},
      formLabelWidth: '120px',
      checker: ''
    };
  },
  methods: {
    getData() {
      this.continuousLoad();
      var _this = this;
      var params = new URLSearchParams();
      params.append("purchaseEmployeeId", this.search.purchaseEmployeeId);
      params.append("purchaseNo", this.search.purchaseNo);
      params.append("stats", "0");
      params.append("pageSize", this.pageSize);
      params.append("pageNo", this.pageNo);
      this.$axios.post("purchase/queryByPage", params).then(function (result) {
        _this.tableData = result.data.list;
        _this.total = result.data.total;
      }).catch();
    },
    selectBuyer() {
      var _this = this;
      this.$axios.post("purchase/selectBuyer").then(function (result) {
        _this.options = result.data;
      }).catch();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getRowKey(row) {
      return row.id;
    },
    continuousLoad() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 1000);
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
    review(id) {
      var _this = this;

      function queryDetailByPurchaseId() {
        var params = new URLSearchParams();
        params.append("purchaseId", id);
        return _this.$axios.post("purchase/queryDetailByPurchaseId", params);
      }

      function queryPurchaseById() {
        var params = new URLSearchParams();
        params.append("id", id);
        return _this.$axios.post("purchase/queryPurchaseById", params);
      }

      this.$axios.all([queryDetailByPurchaseId(), queryPurchaseById()]).then(this.$axios.spread(function (res1, res2) {
        _this.form = res2.data;
        _this.detailsData = res1.data;
        _this.dialogTableVisible = true;
      })).catch();
    },
    passed() {
      if (!this.checker) {
        this.$message({
          showClose: true,
          message: '请输入审核人姓名',
          type: 'error'
        });
        return;
      }
      var _this = this;
      var params = new URLSearchParams();
      params.append("id", this.form.id);
      params.append("checker", this.checker);
      params.append("stats", '1');
      this.$axios.post("purchase/updatePurchase", params).then(function (result) {
        _this.$message({
          showClose: true,
          message: '审核通过',
          type: 'success'
        });
        _this.dialogTableVisible = false;
        _this.getData();
      }).catch();
    },
    fail() {
      if (!this.checker) {
        this.$message({
          showClose: true,
          message: '请输入审核人姓名',
          type: 'error'
        });
        return;
      }
      var _this = this;

      function updatePurchase() {
        var params = new URLSearchParams();
        params.append("id", _this.form.id);
        params.append("checker", _this.checker);
        params.append("stats", '2');
        return _this.$axios.post("purchase/updatePurchase", params);
      }

      function saveLog(value) {
        var params = new URLSearchParams();
        params.append("parentID", _this.form.id);
        params.append("logtype", '采购单审核不通过');
        params.append("logdetail", value);
        return _this.$axios.post("purchase/saveLog", params);
      }

      this.$prompt('请输入审核不通过的详细理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '返回',
        inputPattern: /^[\s\S]{1,25}$/,
        inputErrorMessage: '字段不宜过长或过短',
        inputType: 'textarea',
        center: 'true'
      }).then(({value}) => {
        this.$axios.all([updatePurchase(), saveLog(value)]).then(this.$axios.spread(function (res1, res2) {
          _this.$message({
            showClose: true,
            message: '审核不通过',
            type: 'error'
          });
          _this.dialogTableVisible = false;
          _this.getData();
        })).catch();
      }).catch(() => {
      });
    },
    dialogClose() {
      this.checker = '';
    }
  },
  created() {
    this.getData();
    this.selectBuyer();
  },
  filters: {}
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
