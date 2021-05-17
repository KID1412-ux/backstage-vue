<template>
  <div style="height: 100%">
    <el-table
      border
      :data="tableData"
      style="width: 100%;"
      height="100%">
      <el-table-column
        fixed
        prop="merchantId"
        label="商户ID"
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
        prop="merchantStats"
        label="商户状态"
        width="110">
        <template slot-scope="scope">
          <p v-if="scope.row.merchantStats =='0'">正常</p>
          <p v-else>拉黑</p>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="145">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改商户信息" placement="bottom">
            <el-button @click="select(scope.row.merchantId)" type="success" icon="el-icon-edit-outline" circle></el-button>
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

        <el-form-item label="商户ID">
          <el-input v-model="user.merchantId" disabled></el-input>
        </el-form-item>
        <el-form-item label="商户名称">
          <el-input v-model="user.merchantName" ></el-input>
        </el-form-item>
        <el-form-item label="商户描述">
          <el-input v-model="user.merchantDescribe" ></el-input>
        </el-form-item>
        <el-form-item label="商户电话">
          <el-input v-model="user.merchantPhone"></el-input>
        </el-form-item>
        <el-form-item label="提货地址">
          <el-input v-model="user.deliveryAddress"></el-input>
        </el-form-item>
        <el-form-item label="商户状态">
          <el-select v-model="user.merchantStats" >
            <el-option  value="0" label="正常"></el-option>
            <el-option  value="1" label="拉黑"></el-option>
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
  name: "merchantuphold",
  data() {
    return {
      tableData: [],
      user:{},
      dialogVisible:false,
    }
  },
  methods:{
    getdate(){
      var _this=this;
      this.$axios.post("/user/selectmerchant").then(function (result){
        _this.tableData=result.data;
      }).catch()
    },
    select(id){
      this.dialogVisible=true;
      var _this=this

      var param=new URLSearchParams();
      param.append("id",id);
      this.$axios.post("/user/selectbymerchantId",param).then(function (result){
        _this.user=result.data
        _this.dialogVisible = true
      }).catch()
    },
    onsubmit(){
      var _this=this;

      var param=new URLSearchParams();

      for(let key in this.user){
        param.append(key,this.user[key]);
        console.log(param.get(key));
      }
      console.log(param)
      this.$axios.post("/user/updatemerchant",param).then(function (result){
        _this.$message({
          showClose: true,
          message: result.data,
          type: 'success'
        });
        _this.getdate();
        _this.dialogVisible=false;
      }).catch()

    },
    handleClose() {
          this.dialogVisible=false

    }
    }
 ,created() {
    this.getdate();
  }
}
</script>
