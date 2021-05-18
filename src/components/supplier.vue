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
        width="100">
      </el-table-column>
      <el-table-column
        prop="supplierName"
        label="供应商名称"
        width="100">
      </el-table-column>
      <el-table-column
        prop="merchantPermitImage"
        label="供应商营业执照"
        width="180">
        <template scope="scope">
          <img :src="scope.row.supplierPermitImage" width="40" height="40">
        </template>
      </el-table-column>
      <el-table-column
        prop="merchantShopImage"
        label="供应商图"
        width="100">
        <template scope="scope">
          <img :src="scope.row.supplierShopImage" width="40" height="40">
        </template>
      </el-table-column>
      <el-table-column
        prop="supplierPhone"
        label="供应商电话"
        width="200">
      </el-table-column>
      <el-table-column
        prop="supplierAddress"
        label="供应商地址"
        width="200">
      </el-table-column>
      <el-table-column
        prop="supplierAuditStatus"
        label="供应商审核状态"
        width="230">
        <template slot-scope="scope">
          <p v-if="scope.row.supplierAuditStatus == '0'">已提交</p>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="205">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="通过" placement="bottom">
            <el-button @click="pass(scope.row.id)" type="success" icon="el-icon-check" circle></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="不通过" placement="bottom">
            <el-button @click="fail(scope.row.id)" type="info" icon="el-icon-close" circle></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="不予通过"
      :visible="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="feedback">

        <el-form-item label="当前用户ID:">
          <el-input v-model="feedback.parentID" disabled></el-input>
        </el-form-item>
        <el-form-item label="反馈信息类型:">
          <el-input v-model="feedback.logtype"></el-input>
        </el-form-item>
        <el-form-item label="原因:">
          <el-input v-model="feedback.logdetail" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="info" @click="onsubmit()">确认</el-button>
      <el-button type="warming" @click="dialogVisible=false">关闭</el-button>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: "supplier",
  data() {
    return {
      tableData: [],
      dialogVisible:false,
      feedback:{
        parentID:"",
        logtype:"供应商审核不通过",
        logdetail:""
      }
    }
  },
  methods:{
    getdate(){
      var _this=this;

      this.$axios.post("/user/selectallsupplier").then(function (result){
        _this.tableData=result.data.map(function (item) {
          item.supplierPermitImage="http://127.0.0.1:8090/code/"+item.supplierPermitImage;
          item.supplierShopImage="http://127.0.0.1:8090/code/"+item.supplierShopImage;
          return item;
        });
      }).catch()
    },
    pass(id){
      var _this=this;

      var param=new URLSearchParams();
      param.append("id",id);
      this.$axios.post("/user/passsupplier",param).then(function (result){
        _this.getdate();
      }).catch()
    },
    fail(id){
      var _this=this;

      _this.feedback.parentID=id;

      var param=new URLSearchParams();
      param.append("id",id);
      this.$axios.post("/user/failsupplier",param).then(function (result){
        _this.dialogVisible=true;
      }).catch()
    },
    handleClose() {
      this.dialogVisible=false
},
  onsubmit(){
  var _this=this;
  var param=new URLSearchParams();
  for (let key in this.feedback){
    param.append(key,this.feedback[key])
  }
  this.$axios.post("/user/failsupplier",param).then(function (result){
    _this.dialogVisible=false;
    _this.getdate();
  }).catch()
}
  },
  created() {
    this.getdate();
  }
}
</script>
