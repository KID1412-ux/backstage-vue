<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="4">
        <el-input
          placeholder="请输入仓库名称"
          v-model="wname"
          clearable>
        </el-input>
      </el-col>
      <el-col :span="3" >
        <el-select v-model="wtype" clearable>
          <el-option v-for="Wtype in typeData" :key="Wtype.id" :value="Wtype.id" :label="Wtype.goodsTypeName"></el-option>
        </el-select>
      </el-col>
      <el-col :span="1">
        <el-button icon="el-icon-search" circle @click="searchDelivery"></el-button>
      </el-col>
      <el-col :span="12" >
        <el-button type="info" icon="el-icon-plus" circle @click="add()"></el-button>
      </el-col>
    </el-row>
    <br>
    <el-table
      :data="tableData"
      height="350"
      border>
      <el-table-column
        prop="warehouseNo"
        label="仓库编号"
        width="90">
      </el-table-column>
      <el-table-column
        prop="warehouseName"
        label="仓库名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="仓库电话"
        width="120">
      </el-table-column>
      <el-table-column
        prop="warehouseCapacity"
        label="当前储量"
        width="180">
      </el-table-column>
      <el-table-column
        prop="goodsType"
        label="可存储类型"
        width="180">
      </el-table-column>
      <el-table-column
        prop="warehouseEmployeeId"
        label="仓库负责人"
        width="165">
      </el-table-column>

      <el-table-column
        width="210"
        label="操作">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-more" circle @click="openeDetail(scope.row.id)"></el-button>
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

    <el-dialog width="70%" title="仓库详情" :visible.sync="Detailshow">
      <el-table
        height="350"
        :data="DetailData">
        <el-table-column property="id" label="仓库编号" width="150">
        </el-table-column>
        <el-table-column property="goodsName" label="商品名称" width="200"></el-table-column>
        <el-table-column property="warehouseName" label="仓库名称"></el-table-column>
        <el-table-column property="goodsAmount" label="库存数量"></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      @close="cl"
      :visible.sync="addwinshow">

      <el-form :model="addform" label-width="100px">
        <el-form-item label="仓库名称">
          <el-col :span="17">
             <el-input v-model="addform.warehouseName" ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="仓库电话">
          <el-col :span="17">
            <el-input v-model="addform.phone" ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="仓库储量">
          <el-col :span="17">
            <el-input v-model="addform.warehouseCapacity" ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="仓库存储类型">
          <el-col :span="17">
            <el-select v-model="addform.goodsType" clearable>
              <el-option v-for="Wtype in typeData" :key="Wtype.id" :value="Wtype.id" :label="Wtype.goodsTypeName"></el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="仓库管理员">
          <el-col :span="17">
            <el-select v-model="addform.warehouseEmployeeId" clearable>
              <el-option v-for="Wtype in DriverData" :key="Wtype.id" :value="Wtype.id" :label="Wtype.employeeName"></el-option>
            </el-select>
          </el-col>
        </el-form-item>


        <el-button type="info" @click="addDelivery">新增</el-button>
        <el-button type="warming" @click="addwinshow=false">关闭</el-button>


      </el-form>

    </el-dialog>

    <!-- 编辑模态框-->
    <el-dialog :visible.sync="isshow">

      <el-form :model="editform">

        <<el-form-item label="仓库名称">
        <el-col :span="17">
          <el-input v-model="editform.warehouseName" ></el-input>
        </el-col>
      </el-form-item>

        <el-form-item label="仓库电话">
          <el-col :span="17">
            <el-input v-model="editform.phone" ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="仓库储量">
          <el-col :span="17">
            <el-input v-model="editform.warehouseCapacity" ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="仓库存储类型">
          <el-col :span="17">
            <el-select v-model="editform.goodsType" disabled clearable>
              <el-option v-for="Wtype in typeData" :key="Wtype.id" :value="Wtype.id" :label="Wtype.goodsTypeName"></el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="仓库管理员">
          <el-col :span="17">
            <el-select v-model="editform.warehouseEmployeeId" clearable>
              <el-option v-for="Wtype in DriverData" :key="Wtype.id" :value="Wtype.id" :label="Wtype.employeeName"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
      </el-form>

      <el-button type="info" @click="updateDelivery">保存</el-button>
      <el-button type="warming" @click="isshow=false">关闭</el-button>
    </el-dialog>

    <el-dialog
      title="提示"
      width="30%"
      :visible.sync="scisshow">
      <span>是否删除该仓库</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="deleteDelivery">确 定</el-button>
       <el-button type="warming" @click="scisshow = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        wname:"",
        wtype:"",
        tableData: [],
        DetailData:[],
        WDetailData:[],
        merchantData:[],
        DriverData:[],
        typeData:[],
        multipleSelection:[],
        total:0,
        pageno:1,
        pagsize:10,
        isshow:false,
        scisshow:false,
        addwinshow:false,
        Detailshow:false,
        editform:{},
        addform:{
          warehouseName:"",
          phone:"",
          warehouseCapacity:"",
          currentReserves:"",
          goodsType:"",
          warehouseEmployeeId:""
        },
        scid:""
      }
    },
    methods:{
      cl(){
        this.$refs.multipleTable.clearSelection();
      },
      add(){
        this.addwinshow=true;
        this.getDriver();
        this.getCar();
        this.getWDetailData();
      },
      getWDetailData(){
        var _this =this;
        this.$axios.post("DeliveryDetail/queryMerchantW.action").then(function (response) {
          _this.WDetailData = response.data.map(function (item) {
            if(item.stats==0){
              item.stats="已下单"
            }
            else if(item.stats==1){
              item.stats="已发货"
            }
            else if(item.stats==1){
              item.stats="待提货"
            }
            else{
              item.stats="已提货"
            }
            return item;
          })
        });
      },
      getWtype(){
        var _this =this;
        this.$axios.post("Warehouse/queryWtype.action").then(function (response) {
          _this.typeData = response.data;
        });
      },
      getDriver(){
        var _this =this;
        this.$axios.post("Warehouse/querywarehouseEmployee.action").then(function (response) {
          _this.DriverData = response.data;
        });
      },
      getdata(){
        var _this =this;
        //加参数
        var params = new URLSearchParams();

        params.append("pageNo",this.pageno); //分页
        params.append("pageSize",this.pagsize);

        params.append("warehouseName",this.wname);
        params.append("goodsType",this.wtype);

        this.$axios.post("Warehouse/queryAllWarehouse.action",params).then(function (response) {
          _this.total = response.data.total;
          _this.tableData=response.data.records.map(function (item) {
            _this.typeData.forEach(function (z) {
                  if(z.id==item.goodsType){
                    item.goodsType=z.goodsTypeName;
                  }
            })
            _this.DriverData.forEach(function (y) {
              if(y.id==item.warehouseEmployeeId){
                item.warehouseEmployeeId=y.employeeName;
              }
            })
            return item;
          });
        }).catch();
      },
      openeditwin(id){

        var _this =this;
        //根据id查询数据 ，绑定在编辑页面
        var params = new URLSearchParams();
        params.append("id",id);

        this.$axios.post("Warehouse/queryWarehouseById.action",params).then(function (response) {
          _this.editform = response.data;
          _this.isshow=true;
        }).catch( function (error) {
          _this.$message({
            message: '服务端异常',
            type: 'error'
          });
        })
      },
      openeDetail(id){
        var _this =this;
        //根据id查询数据 ，绑定在编辑页面
        var params = new URLSearchParams();
        params.append("id",id);

        this.$axios.post("Warehouse/queryGoodsWarehouseById.action",params).then(function (response) {
          _this.DetailData = response.data
          _this.Detailshow=true;
        }).catch( function (error) {
          _this.$message({
            message: '服务端异常',
            type: 'error'
          });
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      openMerchant(id){
        var _this =this;
        //根据id查询数据 ，绑定在编辑页面
        var params = new URLSearchParams();
        params.append("id",id);

        this.$axios.post("DeliveryDetail/queryMerchantDetail.action",params).then(function (response) {
          _this.merchantData = response.data.map(function(item){
            item.imageUrl = "http://localhost:8090/code/"+item.imageUrl;
            return item;
          })
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
      deleteDelivery(){
        var _this =this;
        this.scisshow=false;
        //根据id查询数据 ，绑定在编辑页面
        var params = new URLSearchParams();
        params.append("id",this.scid);
        this.scid="";
        this.$axios.post("Warehouse/deleteWarehouseById.action",params).then(function (response) {
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
      searchDelivery(){
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
      //添加数据
      addDelivery(){

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
          url: 'Warehouse/addWarehouse.action',
          data:formData,
          headers: {
            'Content-Type':'multipart/form-data'
          }
        }).then(function (response) {
          if(response.data){
            _this.getdata();
            _this.addwinshow=false;
            _this.addform=[];
            _this.$message({
              message: '新增成功！',
              type: 'success'
            });
          }

        }).catch();
      },
      updateDelivery(){
        var _this =this;
        //h5提供的类型  FormData
        var formData = new FormData();
        //formData.append("name",this.addform.name);
        //Object.keys(this.addform)  得到一个数组 元素： 对象中的属性名
        Object.keys(this.editform).forEach( (key) =>{
          formData.append(key,_this.editform[key]);
        })
        this.$axios({
          method: 'post',
          url: 'Warehouse/updateWarehouseById.action',
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
      this.getWtype();
      this.getDriver();
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


