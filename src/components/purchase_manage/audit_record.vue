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
          :default-sort="{prop: 'checkTime', order: 'descending'}"
          @selection-change="handleSelectionChange"
          :row-key="getRowKey"
          style="width: 100%">
          <el-table-column
            label="采购单号"
            fixed="left"
            width="169">
            <template slot-scope="scope">
              <el-popover
                placement="right"
                width="900"
                trigger="click">
                <el-table :row-key="getRowKey" max-height="300"
                          stripe
                          :default-sort="{prop: 'id', order: 'descending'}"
                          :data="detailsData">
                  <el-table-column sortable width="150" property="id" label="ID"></el-table-column>
                  <el-table-column width="320" property="goodsName" label="商品名称"></el-table-column>
                  <el-table-column width="150" property="goodsPrice" label="供应商售价"></el-table-column>
                  <el-table-column width="150" property="amount" label="采购数量"></el-table-column>
                  <el-table-column width="130" property="goodsUnit" label="计量单位"></el-table-column>
                </el-table>
                <el-link type="primary" slot="reference" @click="recordDetails(scope.row.id)" :underline="false">
                  {{ scope.row.purchaseNo }}
                </el-link>
              </el-popover>
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
            prop="supplierName"
            label="供应商店铺名"
            width="210">
          </el-table-column>
          <el-table-column
            label="审核状态"
            width="160">
            <template slot-scope="scope">
              <div v-if="scope.row.stats == '2'">
                <el-popover
                  placement="right"
                  width="290"
                  trigger="click">
                  <el-table :row-key="getRowKey" max-height="300"
                            stripe
                            :default-sort="{prop: 'id', order: 'descending'}"
                            :data="logData">
                    <el-table-column width="280" property="logdetail" label="说明信息"></el-table-column>
                  </el-table>
                  <el-link :underline="false" slot="reference" @click="description(scope.row.id)" type="warning">
                    {{ scope.row.stats | filter }}
                  </el-link>
                </el-popover>
              </div>
              <div v-else>
                {{ scope.row.stats | filter }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="checker"
            label="审核人"
            width="160">
          </el-table-column>
          <el-table-column
            prop="checkTime"
            sortable
            label="审核时间"
            width="189">
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
  </div>
</template>

<script>
export default {
  name: "audit_record",
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
      logData: [],
    };
  },
  methods: {
    getData() {
      this.continuousLoad();
      var _this = this;
      var params = new URLSearchParams();
      params.append("purchaseEmployeeId", this.search.purchaseEmployeeId);
      params.append("purchaseNo", this.search.purchaseNo);
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
    recordDetails(id) {
      var _this = this;
      var params = new URLSearchParams();
      params.append("purchaseId", id);
      this.$axios.post("purchase/queryDetailByPurchaseId", params).then(function (result) {
        _this.detailsData = result.data;
      }).catch();
    },
    description(id) {
      var _this = this;
      var params = new URLSearchParams();
      params.append("parentID", id);
      this.$axios.post("purchase/queryLogByParentID", params).then(function (result) {
        _this.logData = [];
        if (result.data) {
          _this.logData.push(result.data);
        }
      }).catch();
    }
  },
  created() {
    this.getData();
    this.selectBuyer();
  },
  filters: {
    filter(val) {
      if (val == '0') {
        return '已提交'
      } else if (val == '1') {
        return '审核通过'
      } else if (val == '2') {
        return '审核不通过'
      } else {
        return '已受理'
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
