<template>
  <div style="height: 100%">
    <div style="height: 5%;">
      <div style="float: left">
        <el-input placeholder="请输入内容" v-model="postName" style="width: 500px">
          <template slot="prepend">职务名称:</template>
        </el-input>
        <el-button slot="append" icon="el-icon-search" @click="getdata"></el-button>
      </div>
      <div style="float: right">
        <el-button type="success" style='position: absolute;right:50px;' round @click="addpost=true">添加新职务</el-button>
      </div>
    </div>

    <el-table
      border
      :data="tableData"
      style="width: 100%;"
      height="90%">
      <el-table-column
        fixed
        prop="id"
        label="职务ID"
        width="300">
      </el-table-column>
      <el-table-column
        prop="postName"
        label="职务名称"
        width="300">
      </el-table-column>
      <el-table-column
        prop="postDescribe"
        label="职务描述"
        width="300">
      </el-table-column>
      <el-table-column
        label="操作"
        width="335">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改职务信息" placement="bottom">
            <el-button @click="selectbyid(scope.row.id)" type="primary" icon="el-icon-edit" circle></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-sizes="[5, 10, 15]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog
      title="修改权限信息"
      :visible="updatepost"
      width="30%"
      :before-close="handleClose">
      <el-form :model="posts">
        <el-form-item label="职务ID">
          <el-input v-model="posts.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="职务名称">
          <el-input v-model="posts.postName"></el-input>
        </el-form-item>
        <el-form-item label="职务描述">
          <el-input v-model="posts.competenceDescribe"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="info" @click="update()">确认</el-button>
      <el-button type="warming" @click="handleClose">关闭</el-button>
    </el-dialog>


    <el-dialog
      title="添加新职务"
      :visible="addpost"
      width="30%"
      :before-close="close">
      <el-form :model="post">
        <el-form-item label="权限名称">
          <el-input v-model="post.postName"></el-input>
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="post.postDescribe"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="info" @click="add()">确认</el-button>
      <el-button type="warming" @click="close">关闭</el-button>
    </el-dialog>



  </div>
</template>

<script>
export default {
  name: "post",
  data(){
    return{
      tableData:[],
      postName:"",
      pageNo:1,
      pageSize:5,
      total:0,
      updatepost:false,
      addpost:false,
      post:{
        postName:"",
        postDescribe:""
      },
      posts:{},
    }
  },
  methods:{
    getdata(){
      var _this=this;
      var param=new URLSearchParams();
      param.append("pageNo",this.pageNo);
      param.append("pageSize",this.pageSize);
      param.append("postName",this.postName);
      this.$axios.post("/post/selectallpost",param).then(function (result) {
        _this.total=result.data.total;
        _this.tableData=result.data.records;
      }).catch()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize=val;
      this.getdata();
    },
    handleCurrentChange(val) {
      this.pageNo=val;
      console.log(`当前页: ${val}`);
      this.getdata();
    },
    selectbyid(id){
      var _this=this;
      var param=new URLSearchParams();
      param.append("id",id);
      this.$axios.post("/post/selectbyid",param).then(function (result) {
        _this.posts=result.data;
        _this.updatepost=true;
      }).catch()
    },
    update(){
      var _this=this;
      var param=new URLSearchParams();
      for (let key in this.posts){
        param.append(key,this.posts[key])
        console.log()
      }
      this.$axios.post("/post/updatepost",param).then(function (result) {
        _this.$message({
          showClose: true,
          message: result.data,
          type: 'success'
        });
        _this.getdata();
        _this.updatepost=false;
      }).catch()
    },
    add(){
      var _this=this;
      var param=new URLSearchParams();
      for (let key in this.post){
        param.append(key,this.post[key])
        console.log()
      }
      this.$axios.post("/post/insertpost",param).then(function (result) {
        _this.$message({
          showClose: true,
          message: result.data,
          type: 'success'
        });
        _this.getdata();
        _this.addpost=false;
      }).catch()
    },
    handleClose(){
      this.updatepost=false;
      this.$refs.tree.setCheckedKeys([])
    },
    close(){
      this.addpost=false;
      this.$refs.tree.setCheckedKeys([])
    }
  },
  created() {
    this.getdata();
  }
}
</script>

<style scoped>

</style>
