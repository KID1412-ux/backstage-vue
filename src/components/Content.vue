<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="4">
        <el-input
          placeholder="请输入车辆名称"
          v-model="cname"
          clearable>


        </el-input>
      </el-col>
      <el-col :span="3" >
        <el-select v-model="cstats" placeholder="车辆状态" clearable>

          <el-option key="空闲" value="1" label="空闲"></el-option>
          <el-option key="使用中" value="0" label="使用中"></el-option>
        </el-select>
      </el-col>
      <el-col :span="1">
        <el-button icon="el-icon-search" circle @click="searchcar"></el-button>
      </el-col>
      <el-col :span="12" >
        <el-button type="info" icon="el-icon-plus" circle @click="addwinshow=true"></el-button>
      </el-col>
    </el-row>
    <br>
    <el-table
      :data="tableData"
      height="350"
      border>
      <el-table-column
        prop="id"
        label="车辆编号"
        width="90">
      </el-table-column>
      <el-table-column
        prop="carName"
        label="车辆名称"
        width="180">
      </el-table-column>

      <el-table-column
        prop="carNo"
        label="车牌号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="可运载商品(kg)"
        width="180">
      </el-table-column>
      <el-table-column
        prop="stats"
        label="车辆状态"
        width="90">
      </el-table-column>
      <el-table-column
        label="车辆图片">
        <template slot-scope="scope">
          <img style="width: 80px;height: 60px" :src="scope.row.image">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="openeditwin(scope.row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="opendeletewin(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="sizechange"
      @current-change="currentchange"
      :current-page="pageno"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagsize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <el-dialog :visible.sync="addwinshow">

      <el-form :model="addform">
        <el-form-item label="车辆名称">
          <el-input v-model="addform.carName"></el-input>
        </el-form-item>

        <el-form-item label="车牌号">
          <el-input v-model="addform.carNo"></el-input>
        </el-form-item>

        <el-form-item label="车辆图片">
          <input type="file" @change="getFile($event)">
        </el-form-item>

        <el-form-item label="可运载商(kg)">
          <el-input v-model="addform.amount"></el-input>
        </el-form-item>

        <el-form-item label="车辆状态">
          <el-radio v-model="addform.stats" label="1">空闲</el-radio>
          <el-radio v-model="addform.stats" label="0">使用中</el-radio>
        </el-form-item>

        <el-button type="info" @click="addgoods">新增</el-button>
        <el-button type="warming" @click="addwinshow=false">关闭</el-button>


      </el-form>

    </el-dialog>

    <!-- 编辑模态框-->
    <el-dialog :visible.sync="isshow">

      <el-form :model="editform">

        <el-form-item label="车辆编号">
          <el-input v-model="editform.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="车辆名称">
          <el-input v-model="editform.carName" ></el-input>
        </el-form-item>

        <el-form-item label="车牌号">
          <el-input v-model="editform.carNo" ></el-input>

        </el-form-item>
        <el-form-item label="可运载商(kg)">
          <el-input v-model="editform.amount" ></el-input>
        </el-form-item>
        <el-form-item label="车辆状态">
          <el-radio v-model="editform.stats" label="1">空闲</el-radio>
          <el-radio v-model="editform.stats" label="0">使用中</el-radio>
        </el-form-item>
        <el-form-item label="车辆图片">
          <img style="width: 80px;height: 60px" :src="'http://localhost:8090/code/'+editform.image">
          <input type="file" @change="getupdateFile($event)">
        </el-form-item>
      </el-form>

      <el-button type="info" @click="updategoods">保存</el-button>
      <el-button type="warming" @click="isshow=false">关闭</el-button>
    </el-dialog>

    <el-dialog
      title="提示"
      width="30%"
      :visible.sync="scisshow">
      <span>是否删除该车辆</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="deleteGood">确 定</el-button>
       <el-button  type="warming" @click="scisshow = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        cname:"",
        cstats:"",
        tableData: [],
        total:0,
        pageno:1,
        pagsize:10,
        isshow:false,
        scisshow:false,
        addwinshow:false,
        editform:{},
        editimg2:"",
        addform:{
          goodsName:"",
          goodsDescribe:"",
          img2:""   //二进制文件流
        },
        scid:""
      }
    },
    methods:{
      getdata(){
        var _this =this;
        //加参数
        var params = new URLSearchParams();

        params.append("pageNo",this.pageno); //分页
        params.append("pageSize",this.pagsize);

        params.append("carName",this.cname);
        params.append("stats",this.cstats);

        this.$axios.post("car/queryAllcar.action",params).then(function (response) {
          console.log(response)
          _this.tableData=response.data.records.map(function(item){
            item.image = "http://localhost:8090/code/"+item.image;
            if(item.stats==0){
              item.stats="使用中"
            }else {
              item.stats="空闲"
            }
            return item;
          })
          _this.total = response.data.total;
        }).catch();
      },
      openeditwin(id){

        var _this =this;
        //根据id查询数据 ，绑定在编辑页面
        var params = new URLSearchParams();
        params.append("id",id);

        this.$axios.post("car/queryById.action",params).then(function (response) {
          _this.editform = response.data;
          _this.isshow=true;
        }).catch( function (error) {
          _this.$message({
            message: '服务端异常',
            type: 'error'
          });
        })
      },
      opendeletewin(id){
        this.scid=id;
        this.scisshow=true;
      },
      deleteGood(){
        var _this =this;
        this.scisshow=false;
        //根据id查询数据 ，绑定在编辑页面
        var params = new URLSearchParams();
        params.append("id",this.scid);
        this.scid="";
        this.$axios.post("car/deleteById.action",params).then(function (response) {
          if(response.data){
            _this.getdata();
            _this.$message({
              message: '删除成功！',
              type: 'success'
            });
          }
        }).catch( function (error) {
          _this.$message({
            message: '服务端异常',
            type: 'error'
          });
        })
      },
      searchcar(){
        //执行geetdata方法
        this.getdata();
      },
      currentchange(val){
        console.log(val)
        //调用getdata
        this.pageno =val;
        this.getdata();
      },
      sizechange(val){
        console.log(val)
        this.pagsize=val;
        this.getdata();
      },
      //选择文件时，获取文件数据
      getFile(e){
        console.log(e.target.files[0])
        this.addform.img2= e.target.files[0];  //获取选中的文件二进制流
      },
      getupdateFile(e){
        console.log(e.target.files[0])
        this.editimg2= e.target.files[0];  //获取选中的文件二进制流
      },
      isVehicleNumber(vehicleNumber) {
        var xreg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
        var creg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
       if(vehicleNumber.length == 7){

           return creg.test(vehicleNumber);

         } else if(vehicleNumber.length == 8){

           return xreg.test(vehicleNumber);

         } else{
           return false;
        }

     },
      //添加数据
      addgoods(){

        //文件上传   post提交  enctype=“mu....”
        var _this =this;
        //h5提供的类型  FormData
        var formData = new FormData();
        //formData.append("name",this.addform.name);
        //Object.keys(this.addform)  得到一个数组 元素： 对象中的属性名
        Object.keys(this.addform).forEach( (key) =>{
          formData.append(key,_this.addform[key]);
        })

        this.$axios({
          method: 'post',
          url: 'car/addcar.action',
          data:formData,
          headers: {
            'Content-Type':'multipart/form-data'
          }
        }).then(function (response) {
          if(response.data){
            _this.getdata();

            _this.addwinshow=false;

            _this.$message({
              message: '新增成功！',
              type: 'success'
            });
          }

        }).catch();
      },
      updategoods(){
        var _this =this;
        //h5提供的类型  FormData
        var formData = new FormData();
        //formData.append("name",this.addform.name);
        //Object.keys(this.addform)  得到一个数组 元素： 对象中的属性名
        Object.keys(this.editform).forEach( (key) =>{
          formData.append(key,_this.editform[key]);
        })
        formData.append("img2",_this.editimg2);
        this.$axios({
          method: 'post',
          url: 'car/updatecar.action',
          data:formData,
          headers: {
            'Content-Type':'multipart/form-data'
          }
        }).then(function (response) {
          if(response.data){
            _this.getdata();

            _this.isshow=false;

            _this.$message({
              message: '修改成功！',
              type: 'success'
            });
          }

        }).catch();
      }
    },
    created() {
      this.getdata();
    }
  }
</script>

<style>
  .el-table{
    width: 100%;
  }
  .el-table td, .el-table th{
    text-align: center;
  }
</style>

