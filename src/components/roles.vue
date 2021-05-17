<template>
  <div style="height: 100%">
    <div style="height: 5%;">
      <div style="float: left">
        <el-input placeholder="请输入内容" v-model="roleName" style="width: 500px">
          <template slot="prepend">角色名称:</template>
        </el-input>
        <el-button slot="append" icon="el-icon-search" @click="getdata"></el-button>
      </div>
      <div style="float: right">
        <el-button type="success" style='position: absolute;right:50px;' round @click="addroles=true">添加新角色</el-button>
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
        label="角色ID"
        width="300">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="300">
      </el-table-column>
      <el-table-column
        prop="roleDescribe"
        label="角色描述"
        width="300">
      </el-table-column>
      <el-table-column
        label="操作"
        width="335">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改角色信息" placement="bottom">
            <el-button @click="update(scope.row.id)" type="primary" icon="el-icon-edit" circle></el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="赋予新权限" placement="bottom">
            <el-button type="success" @click="tianjia(scope.row.id)" icon="el-icon-circle-plus" circle></el-button>
          </el-tooltip>

        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="修改角色信息"
      :visible="roles"
      width="30%"
      :before-close="handleClose">
      <el-form :model="updaterole">
        <el-form-item label="角色ID">
          <el-input v-model="updaterole.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="updaterole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="updaterole.roleDescribe"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="info" @click="onsubmit()">确认</el-button>
      <el-button type="warming" @click="roles=false">关闭</el-button>
    </el-dialog>

    <el-dialog
      title="添加新角色"
      :visible="addroles"
      width="30%"
      :before-close="close">
      <el-form :model="role">
        <el-form-item label="角色名称">
          <el-input v-model="role.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="role.roleDescribe"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="info" @click="addrole()">确认</el-button>
      <el-button type="warming" @click="addroles=false">关闭</el-button>
    </el-dialog>

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
      title="赋予新权限"
      :visible="addnewcompetence"
      width="30%"
      :before-close="closes">
      <el-tree
        ref="tree"
        :data="competence"
        show-checkbox
        node-key="id"
        :default-checked-keys="competenceid"
        :props="defaultProps">
      </el-tree>
      <el-button type="info" @click="getCheckedKeys()">确认</el-button>
      <el-button type="warming" @click="closes">关闭</el-button>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "roles",
  data(){
    return{
      roleName:"",
      pageNo:1,
      pageSize:5,
      total:0,
      tableData:[],
      addroles:false,
      role:{
        roleName:'',
        roleDescribe:''
      },
      roles:false,
      updaterole:{},
      addnewcompetence:false,
      defaultProps: {
        children: 'children',
        label: 'competenceName'
      },
      competence:[],
      competenceid:[],
      id:""
    }
  },
  methods:{
    getCheckedKeys() {
      var sz=this.$refs.tree.getCheckedKeys();

      var _this=this;

      var param=new URLSearchParams();
      param.append("roleid",_this.id);
      param.append("comid",sz)
      this.$axios.post("/rocm/add",param).then(function (result){
        _this.closes();
        _this.$message({
          showClose: true,
          message: result.data,
          type: 'success'
        });
      }).catch()
    },
    competences(){
      var _this=this;
      this.$axios.post("/com/selectallcompetence").then(function (result) {
        _this.competence=result.data.records;
      }).catch()
    },
    tianjia(id){
          var _this=this;

          _this.id=id;
          var param=new URLSearchParams();
          param.append("id",id);
          this.$axios.post("/role/selectbycomid",param).then(function (result) {
            _this.competenceid=result.data;
            _this.addnewcompetence=true;
          }).catch()
    },
    getdata(){
      var _this=this;
      var param=new URLSearchParams();
      param.append("pageNo",this.pageNo);
      param.append("pageSize",this.pageSize);
      param.append("roleName",this.roleName);
      this.$axios.post("/role/selectall",param).then(function (result) {
        _this.total=result.data.total;
        _this.tableData=result.data.records;
      }).catch()
    },
    addrole(){
        var _this=this

        var param=new URLSearchParams();
        for (let key in _this.role){
          param.append(key,_this.role[key])
        }
        this.$axios.post("/role/addnewrole",param).then(function (result){
          _this.$message({
            showClose: true,
            message: result.data,
            type: 'success'
          });
          _this.addroles=false;
          _this.getdata();
        }).catch()
    },
    close(){
          this.addroles=false;
    },
    update(id){
      var _this=this;

      var param=new URLSearchParams();
      param.append("id",id);
      this.$axios.post("/role/selectbyid",param).then(function (result){
        _this.updaterole=result.data;
        _this.roles=true;
      })

    },
    handleClose() {

        this.roles=false;
  },
    closes(){
          this.addnewcompetence=false;
        this.$refs.tree.setCheckedKeys([])
    },
    onsubmit(){
      var _this=this;

      var param=new URLSearchParams();
      for (let key in _this.updaterole){
        param.append(key,_this.updaterole[key])
      }
      this.$axios.post("/role/updaterole",param).then(function (result){
        _this.$message({
          showClose: true,
          message: result.data,
          type: 'success'
        });
        _this.roles=false;
        _this.getdata();
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
    }
  },
  created() {
    this.getdata();
    this.competences();
  }
}
</script>

<style scoped>

</style>
