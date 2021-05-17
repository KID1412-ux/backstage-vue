<template>
  <div style="height: 100%">
    <div style="height: 5%;">
      <div style="float: left">
        <el-input placeholder="请输入内容" v-model="menuName" style="width: 500px">
          <template slot="prepend">菜单名称:</template>
        </el-input>
        <el-button slot="append" icon="el-icon-search" @click="getdata"></el-button>
      </div>
      <div style="float: right">
        <el-button type="success" style='position: absolute;right:50px;' round @click="addmenus=true">添加新菜单</el-button>
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
        width="150">
      </el-table-column>
      <el-table-column
        prop="menuName"
        label="菜单名称"
        width="300">
      </el-table-column>
      <el-table-column
        prop="menuCode"
        label="菜单代码"
        width="300">
      </el-table-column>
      <el-table-column
        prop="menuUrl"
        label="菜单路径"
        width="300">
      </el-table-column>
      <el-table-column
        label="操作"
        width="300">
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
      :visible="updatemenu"
      width="30%"
      :before-close="handleClose">
      <el-form :model="updatemenus">
        <el-form-item label="菜单ID">
          <el-input v-model="updatemenus.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="菜单名称">
          <el-input v-model="updatemenus.menuName"></el-input>
        </el-form-item>
        <el-form-item label="菜单代码">
          <el-input v-model="updatemenus.menuCode"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input v-model="updatemenus.menuUrl"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="info" @click="update()">确认</el-button>
      <el-button type="warming" @click="handleClose">关闭</el-button>
    </el-dialog>


    <el-dialog
      title="添加新职务"
      :visible="addmenus"
      width="30%"
      :before-close="close">
      <el-form :model="menus">
        <el-form-item label="菜单名称">
          <el-input v-model="menus.menuName"></el-input>
        </el-form-item>
        <el-form-item label="菜单代码">
          <el-input v-model="menus.menuCode"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input v-model="menus.menuUrl"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="info" @click="add()">确认</el-button>
      <el-button type="warming" @click="close">关闭</el-button>
    </el-dialog>



  </div>
</template>

<script>
export default {
  name: "menus",
  data(){
    return{
      tableData:[],
      menuName:"",
      pageNo:1,
      pageSize:5,
      total:0,
      updatemenus:{},
      updatemenu:false,
      addmenus:false,
      menus:{
        menuName:"",
        menuCode:"",
        menuUrl:""
      }
    }
  },methods:{
    getdata(){
      var _this=this;
      var param=new URLSearchParams();
      param.append("pageNo",this.pageNo);
      param.append("pageSize",this.pageSize);
      param.append("menuName",this.menuName);
      this.$axios.post("/menus/selectallmenus",param).then(function (result) {
        _this.total=result.data.total;
        _this.tableData=result.data.records;
      }).catch()
    },
    selectbyid(id){
      var _this=this;
      var param=new URLSearchParams();
      param.append("id",id);
      this.$axios.post("/menus/selectbyid",param).then(function (result) {
        _this.updatemenus=result.data;
        _this.updatemenu=true;
      }).catch()
    },
    update(){
      var _this=this;
      var param=new URLSearchParams();
      for (let key in this.updatemenus){
        param.append(key,this.updatemenus[key])
        console.log()
      }
      this.$axios.post("/menus/updatemenus",param).then(function (result) {
        _this.$message({
          showClose: true,
          message: result.data,
          type: 'success'
        });
        _this.getdata();
        _this.updatemenu=false;
      }).catch()
    },
    add(){
      var _this=this;
      var param=new URLSearchParams();
      for (let key in this.menus){
        param.append(key,this.menus[key])
        console.log()
      }
      this.$axios.post("/menus/insertmenus",param).then(function (result) {
        _this.$message({
          showClose: true,
          message: result.data,
          type: 'success'
        });
        _this.getdata();
        _this.addmenus=false;
      }).catch()
    },
    handleClose(){
      this.updatemenu=false;
      this.$refs.tree.setCheckedKeys([])
    },
    close(){
      this.addmenus=false;
      this.$refs.tree.setCheckedKeys([])
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
  }
}
</script>

<style scoped>

</style>
