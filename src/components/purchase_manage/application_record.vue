<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <div>
        <el-table
          :data="tableData"
          max-height="500"
          stripe
          ref="multipleTable"
          v-loading="loading"
          :default-sort="{prop: 'purchaseNo', order: 'descending'}"
          @selection-change="handleSelectionChange"
          :row-key="getRowKey"
          style="width: 100%">
          <el-table-column
            prop="purchaseNo"
            label="采购单号"
            sortable
            width="180">
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
            prop="goodsPrice"
            label="商城售价"
            width="120">
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "application_record",
  data() {
    return {
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      multipleSelection: []
    };
  },
  methods: {
    getData() {
      this.continuousLoad();
      var _this = this;
      var params = new URLSearchParams();
      params.append("stats", "0");
      params.append("pageSize", this.pageSize);
      params.append("pageNo", this.pageNo);
      this.$axios.post("purchase/queryPurchaseByStats", params).then(function (result) {
        _this.tableData = result.data.records;
        _this.total = result.data.total;
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
  },
  created() {
    this.getData();
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
