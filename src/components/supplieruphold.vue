<template>
  <div style="height: 100%">
    <el-table
      border
      :data="tableData"
      style="width: 100%;"
      height="100%">
      <el-table-column
        fixed
        prop="id"
        label="用户ID"
        width="150">
      </el-table-column>
      <el-table-column
        prop="supplierName"
        label="供应商名称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="supplierPhone"
        label="供应商电话"
        width="250">
      </el-table-column>
      <el-table-column
        prop="supplierAddress"
        label="供应商地址"
        width="250">
      </el-table-column>
      <el-table-column
        prop="supplierStats"
        label="供应商状态"
        width="230">
        <template slot-scope="scope">
          <p v-if="scope.row.supplierStats == '0'">正常</p>
          <p v-else>拉黑</p>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="205">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改供应商信息" placement="bottom">
            <el-button @click="select(scope.row.id)" type="success" icon="el-icon-edit-outline" circle></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="修改商家信息"
      :visible="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="user">

        <el-form-item label="供应商ID">
          <el-input v-model="user.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="供应商名称">
          <el-input v-model="user.supplierName"></el-input>
        </el-form-item>
        <el-form-item label="供应商电话">
          <el-input v-model="user.supplierPhone"></el-input>
        </el-form-item>
        <el-form-item label="供应商地址">
          <el-input v-model="user.supplierAddress"></el-input>
        </el-form-item>
        <el-form-item label="供应商状态">
          <el-select v-model="user.supplierStats">
            <el-option value="0" label="正常"></el-option>
            <el-option value="1" label="拉黑"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <el-button type="info" @click="onsubmit()">保存</el-button>
      <el-button type="warming" @click="dialogVisible=false">关闭</el-button>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: "supplieruphold",
  data() {
    return {
      tableData: [],
      user: {},
      dialogVisible: false
    }
  },
  methods: {
    getdate() {
      var _this = this;
      this.$axios.post("/user/selectsupplier").then(function (result) {
        _this.tableData = result.data;
      }).catch()
    },
    select(id) {
      this.dialogVisible = true;
      var _this = this

      var param = new URLSearchParams();
      param.append("id", id);
      this.$axios.post("/user/selectsupplierbyid", param).then(function (result) {
        _this.user = result.data
        _this.dialogVisible = true
      }).catch()
    },
    onsubmit() {
      var _this = this;

      var param = new URLSearchParams();

      for (let key in this.user) {
        param.append(key, this.user[key]);
      }
      console.log(param)
      this.$axios.post("/user/updatesupplier", param).then(function (result) {
        _this.$message({
          showClose: true,
          message: result.data,
          type: 'success'
        });
        _this.getdate();
        _this.dialogVisible = false;
      }).catch()

    },
    handleClose() {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.dialogVisible = false
        })
        .catch(_ => {
        });
    }
  }
  , created() {
    this.getdate();
  }
}
</script>

