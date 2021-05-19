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
          <el-button slot="append" @click="searchData" icon="el-icon-search"></el-button>
        </el-input>
        <el-tooltip class="item" effect="dark" content="加入申请单" placement="right">
          <el-button type="success" @click="purchaseApply" icon="el-icon-plus" circle></el-button>
        </el-tooltip>
      </div>
      <div>
        <el-table
          :data="tableData"
          max-height="500"
          stripe
          ref="multipleTable"
          v-loading="loading"
          :default-sort="{prop: 'id', order: 'descending'}"
          @selection-change="handleSelectionChange"
          :row-key="getRowKey"
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
                <el-form-item label="商城销价">
                  <span>{{ props.row.goodsPrice }}</span>
                </el-form-item>
                <el-form-item label="单位">
                  <span>{{ props.row.goodsUnit }}</span>
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
            type="selection"
            :reserve-selection="true"
            width="55">
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
            prop="goodsPrice"
            label="商城售价"
            width="120">
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
    <el-dialog title="采购申请单" :visible.sync="dialogTableVisible" center @close="dialogClose">
      <el-divider
        content-position="left">
        添加采购数量
      </el-divider>
      <el-table
        :row-key="getRowKey"
        :data="dialogData"
        style="width: 100%"
        border
        stripe
        :default-sort="{prop: 'id', order: 'descending'}"
        max-height="270">
        <el-table-column
          prop="id"
          fixed="left"
          label="商品ID"
          sortable
          width="120">
        </el-table-column>
        <el-table-column
          prop="goodsName"
          label="商品名称"
          width="320">
        </el-table-column>
        <el-table-column
          prop="goodsPrice"
          label="商城售价"
          width="130">
        </el-table-column>
        <el-table-column
          label="采购数量"
          width="270">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.amount" :min="1" :max="200"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          prop="goodsUnit"
          label="计量单位"
          width="120">
        </el-table-column>
      </el-table>
      <el-divider
        content-position="left">
        <el-switch
          v-model="value"
          @change="switchChange"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="确定供应商"
          inactive-text="暂无选择">
        </el-switch>
      </el-divider>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane v-for="(item, index) in tabsData" :name="String(item.id)" @tab-click="handleClick"
                     :label="item.supplierName">
          <el-table
            v-loading="encase"
            :data="activeData"
            style="width: 100%"
            border
            stripe
            :default-sort="{prop: 'id', order: 'descending'}"
            max-height="270">
            <el-table-column
              prop="id"
              label="商品ID"
              sortable
              width="130">
            </el-table-column>
            <el-table-column
              prop="goodsName"
              label="商品名称"
              width="329">
            </el-table-column>
            <el-table-column
              prop="goodsPrice"
              label="店铺售价"
              width="130">
            </el-table-column>
            <el-table-column
              prop="goodsUnit"
              label="计量单位"
              width="130">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-divider
        content-position="left">
        选择采购员
      </el-divider>
      <el-select v-model="employeeId" placeholder="请选择采购员" clearable>
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.employeeName"
          :value="item.id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogTableVisible = false">取 消</el-button>
    <el-button type="primary" @click="purchaseApplySubmit">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "purchase_apply",
  data() {
    return {
      search: {goodsName: '', firstKindId: '', secondKindId: '', thirdKindId: ''},
      pageNo: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      loading: false,
      encase: false,
      keyValue: 1,
      data: [],
      val: [],
      dialogTableVisible: false,
      multipleSelection: [],
      dialogData: [],
      tabsData: [],
      activeName: '',
      activeData: [],
      value: false,
      options: [],
      employeeId: '',
      supplierId: ''
    };
  },
  methods: {
    getData() {
      this.continuousLoad();
      var _this = this;
      var params = new URLSearchParams();
      params.append("goodsName", this.search.goodsName);
      params.append("firstKindId", this.search.firstKindId);
      params.append("secondKindId", this.search.secondKindId);
      params.append("thirdKindId", this.search.thirdKindId);
      params.append("pageSize", this.pageSize);
      params.append("pageNo", this.pageNo);
      this.$axios.post("purchase/showGoods", params).then(function (result) {
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
    continuousEncase() {
      this.encase = true;
      setTimeout(() => {
        this.encase = false;
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getRowKey(row) {
      return row.id;
    },
    getActiveData(supplierId) {
      this.continuousEncase();
      var _this = this;
      var params = new URLSearchParams();
      params.append("supplierId", supplierId);
      this.$axios.post("purchase/queryGoodsBySupplierId", params).then(function (result) {
        _this.activeData = result.data;
      }).catch();
    },
    purchaseApply() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          showClose: true,
          message: '至少选择一个商品',
          type: 'error'
        });
        return;
      }
      var ary = this.multipleSelection.map(item => item = item.firstKindId);
      var nary = Array.from(new Set(ary));
      if (nary.length != 1) {
        this.$message({
          showClose: true,
          message: '请选择同一类型的商品',
          type: 'error'
        });
        return;
      }
      var ids = this.multipleSelection.map(item => item = item.id);
      var _this = this;

      function queryGoodsByIds() {
        return _this.$axios({
          method: 'post',
          url: 'purchase/queryGoodsByIds',
          data: JSON.stringify(ids),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        });
      }

      function queryPurchase() {
        return _this.$axios({
          method: 'post',
          url: 'purchase/queryPurchase',
          data: JSON.stringify(ids),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        });
      }

      function selectBuyer() {
        return _this.$axios.post("purchase/selectBuyer");
      }

      this.$axios.all([queryGoodsByIds(), queryPurchase(), selectBuyer()]).then(this.$axios.spread(function (res1, res2, res3) {
        _this.dialogData = res1.data.map((item, index) => {
          return Object.assign(item, {amount: 1});
        });
        if (res2.data) {
          _this.activeName = String(res2.data[0].id);
          _this.tabsData = res2.data;
          _this.getActiveData(res2.data[0].id);
        }
        _this.options = res3.data;
        _this.employeeId = res3.data[0].id;
        _this.dialogTableVisible = true;
      })).catch();
    },
    handleClick(tab, event) {
      this.getActiveData(this.activeName);
    },
    switchChange(val) {
      if (val) {
        this.supplierId = this.activeName;
      }
    },
    purchaseApplySubmit() {
      if (!this.value) {
        this.$message({
          showClose: true,
          message: '请选择供应商',
          type: 'error'
        });
        return;
      }
      if (this.employeeId == -1) {
        this.$message({
          showClose: true,
          message: '请选择采购员',
          type: 'error'
        });
        return;
      }
      var total = 0;
      var totalPrice = 0;
      this.dialogData.forEach(item => {
        total += item.amount;
      })
      var nary = [];
      this.dialogData.forEach(item => {
        var find = this.activeData.find(obj => {
          if (obj.goodsName == item.goodsName) {
            return Object.assign(obj, {amount: item.amount});
          }
        });
        if (find) {
          nary.push(find);
        }
      });
      if (nary.length != this.dialogData.length) {
        this.$message({
          showClose: true,
          message: '当前供应商暂时无法供应相关商品',
          type: 'error'
        });
        return;
      }
      nary.forEach(item => {
        totalPrice += item.amount * item.goodsPrice;
      })
      var _this = this;

      function savePurchase() {
        var params = new URLSearchParams();
        params.append("purchaseEmployeeId", _this.employeeId);
        params.append("stats", "0");
        params.append("amount", total);
        params.append("price", totalPrice);
        params.append("supplierId", _this.supplierId);
        return _this.$axios.post("purchase/savePurchase", params);
      }

      function saveDetailBatch(detailBatch) {
        return _this.$axios({
          method: 'post',
          url: 'purchase/saveDetailBatch',
          data: JSON.stringify(detailBatch),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        });
      }

      savePurchase().then(function (result) {
        var detailBatch = [];
        _this.dialogData.forEach((item, index) => {
          var json = {};
          json.purchaseId = result.data;
          json.goodsId = nary[index].id;
          json.amount = item.amount;
          detailBatch.push(json);
        });
        saveDetailBatch(detailBatch).then(function (result) {
          _this.dialogClose();
          _this.dialogTableVisible = false;
          _this.$message({
            showClose: true,
            message: '提交成功',
            type: 'success'
          });
        }).catch();
      }).catch();
    },
    dialogClose() {
      this.$refs.multipleTable.clearSelection();
      this.value = false;
      this.tabsData = [];
      this.activeData = [];
      this.employeeId = -1;
    }
  },
  watch: {
    data(newVal) {
      this.keyValue++;
    }
  },
  created() {
    this.getType();
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
