<template>
  <div style="height: 100%">
    <div style="height: 5%;">
      <div style="float: left">
        <el-input placeholder="请输入内容" v-model="employeeName" style="width: 500px">
          <template slot="prepend">员工名称:</template>
        </el-input>
        <el-button slot="append" icon="el-icon-search" @click="getdata"></el-button>
      </div>
      <div style="float: right">
        <el-button type="success" style='position: absolute;right:50px;' round @click="add()">添加新员工</el-button>
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
        label="员工ID"
        width="150">
      </el-table-column>
      <el-table-column
        prop="employeeName"
        label="员工姓名"
        width="150">
      </el-table-column>
      <el-table-column
        prop="employeeNo"
        label="员工账号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="password"
        label="员工密码"
        width="150">
      </el-table-column>
      <el-table-column
        prop="sex"
        label="性别"
        width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.sex =='0'">男</span>
          <span v-else>女</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="联系电话"
        width="150">
      </el-table-column>
      <el-table-column
        prop="stats"
        label="当前状态"
        width="150">
        <template slot-scope="scope">
          <p v-if="scope.row.stats == '0'">空闲</p>
          <p v-else>忙碌</p>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="185">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改员工信息" placement="bottom">
            <el-button @click="update(scope.row.id)" type="primary" icon="el-icon-edit" circle></el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="赋予新角色" placement="bottom">
            <el-button type="success" @click="tianjia(scope.row.id)"  icon="el-icon-circle-plus" circle></el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="赋予职务" placement="bottom">
            <el-button @click="selectbyid(scope.row.id)" type="primary" icon="el-icon-s-help" circle></el-button>
          </el-tooltip>

        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="修改员工信息"
      :visible="employee"
      width="30%"
      :before-close="handleClose">
      <el-form :model="emp">
        <el-form-item label="当前员工ID">
          <el-input v-model="emp.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="员工名称">
          <el-input v-model="emp.employeeName"></el-input>
        </el-form-item>
        <el-form-item label="员工账号">
          <el-input v-model="emp.employeeNo"></el-input>
        </el-form-item>
        <el-form-item label="员工密码">
          <el-input v-model="emp.password"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="emp.phone"></el-input>
        </el-form-item>
        <el-form-item label="员工性别">
        <el-select v-model="emp.sex">
          <el-option  value="0" label="男"></el-option>
          <el-option  value="1" label="女"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="员工状态">
          <el-select v-model="emp.stats">
            <el-option value="0" label="空闲"></el-option>
            <el-option value="1" label="忙碌"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="info" @click="onsubmit()">确认</el-button>
      <el-button type="warming" @click="employee=false">关闭</el-button>
    </el-dialog>

    <el-dialog
      title="添加新员工"
      :visible="employees"
      width="30%"
      :before-close="close">
      <el-form :model="emplo">
        <el-form-item label="员工名称">
          <el-input v-model="emplo.employeeName"></el-input>
        </el-form-item>
        <el-form-item label="员工账号">
          <el-input v-model="emplo.employeeNo"></el-input>
        </el-form-item>
        <el-form-item label="员工密码">
          <el-input v-model="emplo.password"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="emplo.phone"></el-input>
        </el-form-item>
        <el-form-item label="员工性别">
          <el-select v-model="emplo.sex">
            <el-option  value="0" label="男"></el-option>
            <el-option  value="1" label="女"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="info" @click="addemp()">确认</el-button>
      <el-button type="warming" @click="employees=false">关闭</el-button>
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
      title="赋予新角色"
      :visible="addnewrole"
      width="30%"
      :before-close="closes">
      <el-tree ref="tree"
        :data="roles"
        show-checkbox
        node-key="id"
        :default-checked-keys="roleid"
        :props="defaultProps">
      </el-tree>
      <el-button type="info" @click="getCheckedKeys">确认</el-button>
      <el-button type="warming" @click="closes">关闭</el-button>
    </el-dialog>

    <el-dialog
      title="赋予职务"
      :visible="addnewpost"
      width="30%"
      :before-close="guan">
      <el-tree ref="trees"
               :data="post"
               show-checkbox
               node-key="id"
               :default-checked-keys="postid"
               :props="defaultProp">
      </el-tree>
      <el-button type="info" @click="getCheckedKey">确认</el-button>
      <el-button type="warming" @click="guan">关闭</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "employee",
  data(){
    return {
      employeeName:"",
      pageNo:1,
      pageSize:5,
      total:0,
      tableData:[],
      emp:{},
      employee:false,
      employees:false,
      emplo:{
        employeeName:'',
        employeeNo:'',
        password:'',
        phone:'',
        sex:'',
        stats:'0'
      },
      addnewrole:false,
      defaultProps: {
        children: 'children',
        label: 'roleName'
      },
      roles:[],
      roleid:[],
      id:'',
      post:[],
      postid:[],
      defaultProp:{
        children: 'children',
        label: 'postName'
      },
      addnewpost:false
    }
  },
  methods:{
    allrole(){
      var _this=this;

      this.$axios.post("/role/selectallroles").then(function (result){
        _this.roles=result.data;
      }).catch()
    },
    closes(){
          this.addnewrole=false;
      this.$refs.tree.setCheckedKeys([])
    },
    tianjia(id){
      var _this=this;

      _this.id=id;

      var param=new URLSearchParams();

      param.append("id",id);
      this.$axios.post("/emp/selectbyempid",param).then(function (result){
        _this.roleid=result.data;
        console.log(_this.roleid)
        _this.addnewrole=true;
      })
    },
    getdata(){
      var _this=this;
      var param=new URLSearchParams();
      param.append("pageNo",this.pageNo);
      param.append("pageSize",this.pageSize);
      param.append("employeeName",this.employeeName);
      this.$axios.post("/emp/selectallemployees",param).then(function (result) {
        _this.total=result.data.total;
        _this.tableData=result.data.records;
      }).catch()
    },
    handleClose() {
          this.employee=false;

    },
    update(id){
      var _this=this
      var param=new URLSearchParams();
      param.append("id",id);
      this.$axios.post("/emp/selectemployeebyid",param).then(function (result){
        _this.emp=result.data;
        _this.employee=true;
      }).catch()
    },
    onsubmit(){
      var _this=this;
      var param=new URLSearchParams();
      for (let key in _this.emp){
        param.append(key,_this.emp[key])
      }
      this.$axios.post("/emp/updateemployee",param).then(function (result){
            _this.getdata();
            _this.$message({
          showClose: true,
          message: result.data,
          type: 'success'
        });
            _this.employee=false;
      }).catch()
    },
    add(){
      this.employees=true;
    },
    close(){
          this.employees=false;
    },
    addemp(){
      var _this=this
      var param =new URLSearchParams();
      for (let key in _this.emplo){
        param.append(key,_this.emplo[key])
        console.log(_this.emplo[key])
      }
      this.$axios.post("/emp/addemployee",param).then(function (result){
        _this.getdata();
        _this.$message({
          showClose: true,
          message: result.data,
          type: 'success'
        });
        _this.employees=false;
        _this.emplo="";
      })
    },
    getCheckedKeys() {
      var sz=this.$refs.tree.getCheckedKeys();

      console.log(sz)

      var _this=this;

      var param=new URLSearchParams();
      param.append("empid",_this.id);
      param.append("roleid",sz)
      this.$axios.post("/manager/add",param).then(function (result){
        _this.closes();
         _this.$message({
         showClose: true,
          message: result.data,
          type: 'success'
        });
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
    guan(){
      this.addnewpost=false;
      this.$refs.trees.setCheckedKeys([])
    },
    getCheckedKey(){
      var sz=this.$refs.trees.getCheckedKeys();

      var _this=this;

      var param=new URLSearchParams();
      param.append("empid",_this.id);
      param.append("postid",sz)
      this.$axios.post("/emppost/add",param).then(function (result){
        _this.guan();
        _this.$message({
          showClose: true,
          message: result.data,
          type: 'success'
        });
      }).catch()
    },
    selectbyid(id){
      var _this=this;

      _this.id=id;
      console.log(id)
      var param=new URLSearchParams();
      param.append("id",id);

      this.$axios.post("/emp/selectpostbyid",param).then(function (result){
        _this.postid=result.data;
        _this.addnewpost=true;
      }).catch()
    },
    posts(){
      var _this=this;

      this.$axios.post("/post/selectall").then(function (result){
        _this.post=result.data;
      }).catch()
    }
  },
  created() {
    this.getdata();
    this.allrole();
    this.posts();
  }
}
</script>

<style scoped>

</style>
