<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-date-picker
          v-model="value"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          @change="valueChange"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-input v-model="search.search_stockNo" placeholder="请输入入库单号" class="input-with-select input-with" clearable>
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
            label="入库单号"
            width="208">
            <template slot-scope="scope">
              {{ scope.row.stockNo }}
            </template>
          </el-table-column>
          <el-table-column
            prop="amount"
            label="入库总数"
            width="190">
          </el-table-column>
          <el-table-column
            prop="price"
            label="货值总价"
            width="190">
          </el-table-column>
          <el-table-column
            prop="roadTime"
            sortable
            label="登记时间"
            width="250">
          </el-table-column>
          <el-table-column
            label="状态"
            width="210">
            <template slot-scope="scope">
              {{ scope.row.registerStats | filter }}
            </template>
          </el-table-column>
          <el-table-column
            label="审核"
            width="190">
            <template slot-scope="scope">
              <el-button @click="applyFor(scope.row.id)" type="primary" icon="el-icon-edit" circle></el-button>
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
    <el-dialog width="62%" title="入库申请" :visible.sync="dialogTableVisible" center @close="dialogClose">
      <el-divider
        content-position="left">
        基本信息
      </el-divider>
      <el-form :model="form">
        <el-form-item label="入库单号" :label-width="formLabelWidth">
          <div class="form-input">
            <el-input v-model="form.stockNo" autocomplete="off" disabled></el-input>
          </div>
        </el-form-item>
        <el-form-item label="入库总数" :label-width="formLabelWidth">
          <div class="form-input">
            <el-input v-model="form.amount" autocomplete="off" disabled></el-input>
          </div>
        </el-form-item>
        <el-form-item label="货值总价" :label-width="formLabelWidth">
          <div class="form-input">
            <el-input v-model="form.price" autocomplete="off" disabled></el-input>
          </div>
        </el-form-item>
        <el-form-item label="登记日期" :label-width="formLabelWidth">
          <div class="form-input">
            <el-input v-model="form.roadTime" autocomplete="off" disabled></el-input>
          </div>
        </el-form-item>
        <el-form-item label="申请方" :label-width="formLabelWidth">
          <div class="form-input">
            <el-input v-model="form.merchantName" autocomplete="off" disabled></el-input>
          </div>
        </el-form-item>
      </el-form>
      <el-divider
        content-position="left">
        详细信息
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
          label="ID"
          sortable
          width="190">
        </el-table-column>
        <el-table-column
          prop="goodsName"
          label="商品名称"
          width="321">
        </el-table-column>
        <el-table-column
          label="入库数量"
          prop="goodsAmount"
          width="190">
        </el-table-column>
        <el-table-column
          prop="goodsUnit"
          label="计量单位"
          width="190">
        </el-table-column>
      </el-table>
      <el-divider
        content-position="left">
        审核人
      </el-divider>
      <div class="form-input">
        <el-input v-model="checker" placeholder="请输入审核人姓名" autocomplete="off" clearable></el-input>
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
  name: "submit_application",
  data() {
    return {
      tableData: [],
      search: {
        search_stockNo: '',
        search_StartingTime: '',
        search_endTime: '',
        search_registerStats: '1',
      },
      pageNo: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      multipleSelection: [],
      value: '',
      formLabelWidth: '120px',
      dialogTableVisible: false,
      form: {},
      detailsData: [],
      checker: ''
    }
  },
  methods: {
    getData() {
      this.continuousLoad();
      var _this = this;
      var params = new URLSearchParams();
      params.append("search_stockNo", this.search.search_stockNo);
      params.append("search_StartingTime", this.search.search_StartingTime);
      params.append("search_endTime", this.search.search_endTime);
      params.append("search_registerStats", this.search.search_registerStats);
      params.append("pageNo", this.pageNo);
      params.append("pageSize", this.pageSize);
      this.$axios.post("stock/page", params).then(function (result) {
        _this.tableData = result.data.records;
        _this.total = result.data.total;
      }).then();
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
    valueChange(val) {
      if (val) {
        this.search.search_StartingTime = this.value[0];
        this.search.search_endTime = this.value[1];
      } else {
        this.search.search_StartingTime = '';
        this.search.search_endTime = '';
      }
    },
    searchData() {
      this.getData();
    },
    applyFor(id) {
      var _this = this;

      function queryStockById() {
        var params = new URLSearchParams();
        params.append("id", id);
        return _this.$axios.post("stock/queryStockById", params);
      }

      function queryDetail() {
        var params = new URLSearchParams();
        params.append("stockId", id);
        return _this.$axios.post("stock/queryDetail", params);
      }

      this.$axios.all([queryStockById(), queryDetail()]).then(this.$axios.spread(function (res1, res2) {
        _this.form = res1.data;
        _this.detailsData = res2.data;
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
      var ids = this.detailsData.map(item => item = item.goodsId);
      var total = 0;
      this.detailsData.forEach(item => {
        total += item.goodsAmount;
      });

      function queryWarehouse() {
        return _this.$axios({
          method: 'post',
          url: 'stock/queryWarehouse',
          data: JSON.stringify(ids),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        });
      }

      function updateGoodsStocks(batch) {
        return _this.$axios({
          method: 'post',
          url: 'stock/updateGoodsStocks',
          data: JSON.stringify(batch),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        });
      }

      function updateStockById() {
        var params = new URLSearchParams();
        params.append("id", _this.form.id);
        params.append("register", _this.checker);
        params.append("registerTime", new Date());
        params.append("registerStats", '2');
        return _this.$axios.post("stock/updateStockById", params);
      }

      queryWarehouse().then(function (result) {
        if (!result.data) {
          _this.$message({
            showClose: true,
            message: '仓库存储空间不足',
            type: 'error'
          });
          return;
        }
        var nary = [];
        var count = 0;
        result.data.forEach(item => {
          count += total + item.currentReserves;
          var capacity = item.warehouseCapacity;
          if (count <= capacity) {
            nary.push(item);
          }
        });
        if (nary.length == 0) {
          _this.$message({
            showClose: true,
            message: '仓库存储空间不足',
            type: 'error'
          });
          return;
        }
        var warehouse = nary[0];
        function updateWarehouse() {
          var params = new URLSearchParams();
          params.append("id", warehouse.id);
          params.append("currentReserves", count);
          return _this.$axios.post("stock/updateWarehouse", params);
        }
        var batch = [];
        _this.detailsData.forEach(item => {
          var json = {};
          json.goodsId = item.goodsId;
          json.warehouseId = warehouse.id;
          json.goodsAmount = item.goodsAmount;
          batch.push(json);
        });
        _this.$axios.all([updateGoodsStocks(batch), updateStockById(), updateWarehouse()]).then(_this.$axios.spread(function (res1, res2, res3) {
            _this.$message({
              showClose: true,
              message: '审核通过',
              type: 'success'
            });
            _this.dialogTableVisible = false;
            _this.getData();
        })).catch();
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

      function updateStockById() {
        var params = new URLSearchParams();
        params.append("id", _this.form.id);
        params.append("register", _this.checker);
        params.append("registerTime", new Date());
        params.append("registerStats", '3');
        return _this.$axios.post("stock/updateStockById", params);
      }

      function saveLog(value) {
        var params = new URLSearchParams();
        params.append("parentID", _this.form.id);
        params.append("logtype", '入库单审核不通过');
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
        this.$axios.all([updateStockById(), saveLog(value)]).then(this.$axios.spread(function (res1, res2) {
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
  },
  filters: {
    filter(val) {
      if (val == '0') {
        return '录入成功'
      } else if (val == '1') {
        return '提交成功'
      } else if (val == '2') {
        return '审核通过'
      } else {
        return '审核不通过'
      }
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
