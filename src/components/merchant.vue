<template>
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
      prop="merchantName"
      label="商户名称"
      width="150">
    </el-table-column>
    <el-table-column
      prop="merchantDescribe"
      label="商户描述"
      width="250">
    </el-table-column>
    <el-table-column
      prop="merchantPhone"
      label="商户电话"
      width="150">
    </el-table-column>
    <el-table-column
      prop="deliveryAddress"
      label="提货地址"
      width="280">
    </el-table-column>
    <el-table-column
      prop="merchantAuditStatus"
      label="商户审核状态"
      width="110">
    </el-table-column>
    <el-table-column
      label="操作"
      width="110">
      <template slot-scope="scope">
        <el-button @click="pass(scope.row.id)" type="text" size="small">通过</el-button>
        <el-button @click="fail(scope.row.id)" type="text" size="small">不通过</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "merchant",
  data() {
    return {
      tableData: []
    }
  },
  methods:{
    getdate(){
      var _this=this;

      this.$axios.post("/user/selectallmerchant").then(function (result){
        _this.tableData=result.data;
        console.log(_this.tableData)
      }).catch()
    },
    pass(id){
     var _this=this;

      var param=new URLSearchParams();
      param.append("id",id);
      this.$axios.post("/user/pass",param).then(function (result){
          _this.getdate();
      }).catch()
    },
    fail(id){
      var _this=this;

      var param=new URLSearchParams();
      param.append("id",id);
      this.$axios.post("/user/fail",param).then(function (result){
        _this.getdate();
      }).catch()
    }
  },
  created() {
    this.getdate();
  }
}
</script>
