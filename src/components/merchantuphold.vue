<template>
  <div>
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
      </el-table-column>
      <el-table-column
        label="操作"
        width="145">
        <template slot-scope="scope">
          <el-button @click="select(scope.row.merchantId)" type="text" size="small">修改商户信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="提示"
      :visible="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: "merchantuphold",
  data() {
    return {
      tableData: [],
      user:"",
      dialogVisible:false
    }
  },
  methods:{
    getdate(){
      var _this=this;
      this.$axios.post("/user/selectmerchant").then(function (result){
        _this.tableData=result.data;
        console.log(_this.tableData)
      }).catch()
    },
    select(id){
      this.dialogVisible=true;
      var _this=this

      var param=new URLSearchParams();
      param.append("id",id);
      this.$axios.post("/user/selectbymerchantId",param).then(function (result){
        _this.user=result.data
        console.log(_this.user)
        _this.dialogVisible = true
      }).catch()
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.dialogVisible=false;
        })
        .catch(_ => {});
    }
  }
 ,created() {
    this.getdate();
  }}
</script>
