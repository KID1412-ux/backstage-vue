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
        prop="merchantName"
        label="商户名称"
        width="100">
      </el-table-column>
      <el-table-column
        prop="merchantPermitImage"
        label="商户营业执照"
        width="180">
        <template scope="scope">
          <img :src="scope.row.merchantPermitImage" width="40" height="40">
        </template>
      </el-table-column>
      <el-table-column
        prop="merchantShopImage"
        label="商户店铺图"
        width="100">
        <template scope="scope">
          <img :src="scope.row.merchantShopImage" width="40" height="40">
        </template>
      </el-table-column>
      <el-table-column
        prop="merchantDescribe"
        label="商户描述"
        width="200">
      </el-table-column>
      <el-table-column
        prop="merchantPhone"
        label="商户电话"
        width="100">
      </el-table-column>
      <el-table-column
        prop="deliveryAddress"
        label="提货地址"
        width="200">
      </el-table-column>
      <el-table-column
        prop="merchantAuditStatus"
        label="商户审核状态"
        width="110">
        <template slot-scope="scope">
          <p v-if="scope.row.merchantAuditStatus == '0'">已提交</p>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="145">
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
  name: "merchant",
  data() {
    return {
      tableData: [],
      dialogVisible:false,
      feedback:{
        parentID:"",
        logtype:"商户审核不通过",
        logdetail:""
      }
    }
  },
  methods:{
    getdate(){
      var _this=this;

      this.$axios.post("/user/selectallmerchant").then(function (result){
        _this.tableData=result.data.map(function (item) {
          item.merchantPermitImage="http://127.0.0.1:8090/code/"+item.merchantPermitImage;
          item.merchantShopImage="http://127.0.0.1:8090/code/"+item.merchantShopImage;
          return item;
        })
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

      _this.feedback.parentID=id;

      var param=new URLSearchParams();
      param.append("id",id);
      this.$axios.post("/user/fail",param).then(function (result){
        _this.dialogVisible=true;
      }).catch()
    }, handleClose() {
          this.dialogVisible=false
    },
    onsubmit(){
      var _this=this;
      var param=new URLSearchParams();
      for (let key in this.feedback){
        param.append(key,this.feedback[key])
      }
      this.$axios.post("/user/fail",param).then(function (result){
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
