<template>
  <div style="height: 100%">
    <div style="height: 5%;">
      <div style="float: left">
        <el-input placeholder="请输入内容" v-model="competenceName" style="width: 500px">
          <template slot="prepend">权限名称:</template>
        </el-input>
        <el-button slot="append" icon="el-icon-search" @click="getdata"></el-button>
      </div>
      <div style="float: right">
       <el-button type="success" style='position: absolute;right:50px;' round @click="addcom=true">添加新权限</el-button>
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
        label="权限ID"
        width="300">
      </el-table-column>
      <el-table-column
        prop="competenceName"
        label="权限名称"
        width="300">
      </el-table-column>
      <el-table-column
        prop="competenceDescribe"
        label="权限描述"
        width="300">
      </el-table-column>
      <el-table-column
        label="操作"
        width="335">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改权限信息" placement="bottom">
            <el-button @click="selectbyid(scope.row.id)" type="primary" icon="el-icon-edit" circle></el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="赋予新菜单" placement="bottom">
            <el-button type="success" @click="tianjia(scope.row.id)" icon="el-icon-circle-plus" circle></el-button>
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
      :visible="competence"
      width="30%"
      :before-close="handleClose">
      <el-form :model="updatecompetence">
        <el-form-item label="权限ID">
          <el-input v-model="updatecompetence.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="权限名称">
          <el-input v-model="updatecompetence.competenceName"></el-input>
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="updatecompetence.competenceDescribe"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="info" @click="update()">确认</el-button>
      <el-button type="warming" @click="handleClose">关闭</el-button>
    </el-dialog>


    <el-dialog
      title="添加新权限"
      :visible="addcom"
      width="30%"
      :before-close="close">
      <el-form :model="addcompetence">
        <el-form-item label="权限名称">
          <el-input v-model="addcompetence.competenceName"></el-input>
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="addcompetence.competenceDescribe"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="info" @click="add()">确认</el-button>
      <el-button type="warming" @click="close">关闭</el-button>
    </el-dialog>

    <el-dialog
      title="赋予新菜单"
      :visible="addnewmenus"
      width="30%"
      :before-close="clse">
      <el-tree
        ref="tree"
        :data="menus"
        show-checkbox
        node-key="id"
        :default-checked-keys="menusid"
        :props="defaultProps">
      </el-tree>
      <el-button type="info" @click="getCheckedKeys()">确认</el-button>
      <el-button type="warming" @click="clse">关闭</el-button>
    </el-dialog>


  </div>
</template>

<script>
export default {
  name: "competence",
  data(){
    return{
      tableData:[],
      competenceName:"",
      pageNo:1,
      pageSize:5,
      total:0,
      competence:false,
      updatecompetence:{},
      updatescompetence:{
        id:"",
        competenceName:"",
        competenceDescribe:""
      },
      addcom:false,
      addcompetence:{
        competenceName:'',
        competenceDescribe:'',
      },
      addnewmenus:false,
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },
      menusid:[],
      menus:[],
      id:''

    }
  },
  methods: {
    getdata(){
      var _this=this;
      var param=new URLSearchParams();
      param.append("pageNo",this.pageNo);
      param.append("pageSize",this.pageSize);
      param.append("competenceName",this.competenceName);
      this.$axios.post("/com/selectallcompetence",param).then(function (result) {
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
        this.$axios.post("/com/selectbycomid",param).then(function (result) {
          _this.updatecompetence=result.data;
          _this.competence=true;
        }).catch()
    },
    update(){
      var _this=this;
      var param=new URLSearchParams();
      for (let key in this.updatecompetence){
        if(key =='menus'){
          continue;
        }
        param.append(key,this.updatecompetence[key])
        console.log()
      }
      this.$axios.post("/com/updatecompetence",param).then(function (result) {
        _this.$message({
          showClose: true,
          message: result.data,
          type: 'success'
        });
        _this.getdata();
        _this.competence=false;
      }).catch()
    },
    handleClose() {
      this.competence=false;
    },
    close(){
      this.addcom=false;
    },
    add(){
      var _this=this;
      var param=new URLSearchParams();
      for (let key in this.addcompetence){
        param.append(key,this.addcompetence[key])
        console.log()
      }
      this.$axios.post("/com/insertcompetence",param).then(function (result) {
        _this.$message({
          showClose: true,
          message: result.data,
          type: 'success'
        });
        _this.getdata();
        _this.addcom=false;
      }).catch()
    },
    clse(){
      this.addnewmenus=false;
      this.$refs.tree.setCheckedKeys([])
    },
    menu(){
      var _this=this;
      this.$axios.post("/menus/selectall").then(function (result) {
        _this.menus=result.data;
      }).catch()
    },
    tianjia(id){
      var _this=this;
      var param=new URLSearchParams();
      _this.id=id;
      param.append("id",id);
      this.$axios.post("/com/selectmenubycomid",param).then(function (result) {
        _this.menusid=result.data;
        _this.addnewmenus=true;
      }).catch()
    },
    getCheckedKeys() {
      var sz=this.$refs.tree.getCheckedKeys();

      var _this=this;

      var param=new URLSearchParams();
      param.append("comid",_this.id);
      param.append("menuid",sz)
      this.$axios.post("/cme/add",param).then(function (result){
        _this.clse();
        _this.$message({
          showClose: true,
          message: result.data,
          type: 'success'
        });
      }).catch()
    }
  },
  created() {
    this.getdata()
    this.menu();
  }
}
</script>

<style scoped>

</style>
