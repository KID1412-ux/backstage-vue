<template>
  <div style="height: 100%">
    <el-table border :data="tableData" style="width: 100%;" height="100%">
      <el-table-column fixed prop="id" label="用户ID" width="150">
      </el-table-column>
      <el-table-column prop="userNickname" label="用户昵称" width="150">
      </el-table-column>
      <el-table-column  prop="phone"  label="用户电话" width="250">
      </el-table-column>
      <el-table-column prop="birthday" label="用户生日" width="250">
      </el-table-column>
      <el-table-column prop="userStats" label="用户状态" width="230">
        <template slot-scope="scope">
          <p v-if="scope.row.userStats == '0'">正常</p>
          <p v-else>拉黑</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="205">
        <template slot-scope="scope">
          <el-button @click="goblacklist(scope.row)" type="danger" v-if="scope.row.userStats == '0'" size="small">拉黑</el-button>
          <el-button @click="restore(scope.row)" type="success" v-if="scope.row.userStats == '1'" size="small">恢复</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
export default {
  name: "supplieruphold",
  data() {
    return {
      tableData: [],
      user:{},
    }
  },
  methods:{
    selectAllUsers(){
      var _this=this;
      this.$axios.post("/user/selectAllUsers").then(function (result){
        _this.tableData=result.data;
      }).catch()
    },
    //拉黑
    goblacklist(row) {
      var _this = this;
      this.$confirm('确认拉黑该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.blacklist(row);
      });
    },
    blacklist(row){
      var _this=this;
      var param=new URLSearchParams();
      param.append("id",row.id);
      param.append("userStats","1")
      console.log(param)
      this.$axios.post("/user/operate",param).then(function (result){
        _this.$message({
          type: 'success',
          message: '操作完成!'
        });
        _this.selectAllUsers();
      }).catch()
    },
    restore(row){
      var _this=this;
      var param=new URLSearchParams();
      param.append("id",row.id);
      param.append("userStats","0")
      console.log(param)
      this.$axios.post("/user/operate",param).then(function (result){
        _this.$message({
          type: 'success',
          message: '操作完成!'
        });
        _this.selectAllUsers();
      }).catch()
    },
  },
  created() {
    this.selectAllUsers();
  }
}
</script>

