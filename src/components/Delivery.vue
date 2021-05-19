<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="4">
        <el-input
          placeholder="请输入司机姓名"
          v-model="ename"
          clearable>
        </el-input>
      </el-col>
      <el-col :span="3" >
        <el-input
          placeholder="车辆名称"
          v-model="carName"
          clearable>
        </el-input>
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
        prop="id"
        label="配送编号"
        width="90">
      </el-table-column>
      <el-table-column
        prop="carName"
        label="车辆名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="employeeName"
        label="司机姓名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="beginTime"
        label="开始时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="货物总数(kg)"
        width="180">
      </el-table-column>
      <el-table-column
        prop="deliveryStats"
        label="配送状态"
        width="165">
      </el-table-column>

      <el-table-column
        width="210"
        label="操作">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-more" circle @click="openeDetail(scope.row.id)"></el-button>
          <el-button type="primary" icon="el-icon-edit" circle @click="openeditwin(scope.row.id)"></el-button>
          <el-button v-if="scope.row.deliveryStats != '配送中'" type="danger" icon="el-icon-delete" circle @click="opendeletewin(scope.row.id)"></el-button>

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

    <el-dialog width="70%" title="配送详情" :visible.sync="Detailshow">
      <el-table  :data="DetailData">
        <el-table-column label="商户订单号" width="150">
          <template slot-scope="scope">
            <el-popover
              placement="right"
              width="770"
              trigger="click">
              <el-table :data="merchantData">
                <el-table-column width="170" property="goodsName" label="商品名称"></el-table-column>
                <el-table-column width="100" label="商品图片">
                  <template slot-scope="scope">
                    <img style="width: 80px;height: 60px" :src="scope.row.imageUrl">
                  </template>
                </el-table-column>
                <el-table-column width="300" property="goodsDescribe" label="商品详情"></el-table-column>
                <el-table-column width="100" property="goodsPrice" label="商品价格"></el-table-column>
                <el-table-column width="100" property="goodsAmount" label="商品数量"></el-table-column>
              </el-table>
            <el-link type="primary" @click="openMerchant(scope.row.id)" slot="reference" :underline="false">{{scope.row.orderNumber}}</el-link>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column property="userNickname" label="收货人" width="200"></el-table-column>
        <el-table-column property="deliveryAddress" label="收货地址"></el-table-column>
        <el-table-column property="amount" label="货物总数"></el-table-column>
        <el-table-column property="stats" label="配送状态"></el-table-column>
        <el-table-column property="createTime" label="下单时间" width="200"></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      @close="cl"
      :visible.sync="addwinshow">

      <el-form :model="addform" label-width="100px">
        <el-form-item label="请选择车辆">
          <el-col :span="17">
          <el-select v-model="addform.carId" clearable>
            <el-option v-for="Car in CarData" :key="Car.id" :value="Car.id" :label="Car.carName"></el-option>
          </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="请选择司机">
          <el-col :span="17">
          <el-select v-model="addform.driverId" clearable>
            <el-option v-for="Driver in DriverData" :key="Driver.id" :value="Driver.id" :label="Driver.name"></el-option>
          </el-select>
          </el-col>
        </el-form-item>

        <el-divider content-position="left">请选择订单</el-divider>
              <el-table
                height="350"
                ref="multipleTable"
                :data="WDetailData"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column property="userNickname" label="收货人" width="100"></el-table-column>
                <el-table-column property="deliveryAddress" label="收货地址"></el-table-column>
                <el-table-column property="amount" label="货物总数"></el-table-column>
                <el-table-column property="stats" label="配送状态"></el-table-column>
                <el-table-column property="createTime" label="下单时间" width="200"></el-table-column>
              </el-table>


        <el-button type="info" @click="addDelivery">新增</el-button>
        <el-button type="warming" @click="addwinshow=false">关闭</el-button>


      </el-form>

    </el-dialog>

    <!-- 编辑模态框-->
    <el-dialog :visible.sync="isshow">

      <el-form :model="editform">

        <el-form-item label="商品编号">
          <el-input v-model="editform.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="editform.goodsName" ></el-input>
        </el-form-item>
        <el-form-item label="商品图片">
          <img style="width: 80px;height: 60px" :src="'http://localhost:8090/code/'+editform.imageUrl">
          <input type="file" @change="getupdateFile($event)">
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="editform.goodsPrice" ></el-input>
        </el-form-item>
        <el-form-item label="商品销量">
          <el-input v-model="editform.goodsSales" ></el-input>
        </el-form-item>
      </el-form>

      <el-button type="info" @click="updateDelivery">保存</el-button>
      <el-button type="warming" @click="isshow=false">关闭</el-button>
    </el-dialog>

    <el-dialog
      title="提示"
      width="30%"
      :visible.sync="scisshow">
      <span>是否删除该配送单</span>
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
        ename:"",
        carName:"",
        tableData: [],
        DetailData:[],
        WDetailData:[],
        merchantData:[],
        DriverData:[],
        CarData:[],
        multipleSelection:[],
        total:0,
        pageno:1,
        pagsize:10,
        isshow:false,
        scisshow:false,
        addwinshow:false,
        Detailshow:false,
        editform:{},
        editimg2:"",
        addform:{
          carId:"",
          driverId:""
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
      getCar(){
        var _this =this;
        this.$axios.post("car/queryCar.action").then(function (response) {
          _this.CarData = response.data;
        });
      },
      getDriver(){
        var _this =this;
        this.$axios.post("Delivery/queryDriver.action").then(function (response) {
            _this.DriverData = response.data;
        });
      },
      getdata(){
        var _this =this;
        //加参数
        var params = new URLSearchParams();

        params.append("pageNo",this.pageno); //分页
        params.append("pageSize",this.pagsize);

        params.append("employeeName",this.ename);
        params.append("carName",this.carName);

        this.$axios.post("Delivery/queryAllDelivery.action",params).then(function (response) {
          _this.total = response.data.total;
          _this.tableData=response.data.list.map(function (item) {
            if(item.deliveryStats==0){
              item.deliveryStats="配送中"
            }
            else{
              item.deliveryStats="已配送"
            }
            return item;
          });
          }).catch();
      },
      openeditwin(id){

        var _this =this;
        //根据id查询数据 ，绑定在编辑页面
        var params = new URLSearchParams();
        params.append("id",id);

        this.$axios.post("Goods/queryById.action",params).then(function (response) {
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

        this.$axios.post("DeliveryDetail/queryDeliveryDetail.action",params).then(function (response) {
          _this.DetailData = response.data.map(function (item) {
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
        this.$axios.post("Delivery/deleteDelivery.action",params).then(function (response) {
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
      //选择文件时，获取文件数据
      getFile(e){
        console.log(e.target.files[0])
        this.addform.img2= e.target.files[0];  //获取选中的文件二进制流
      },
      getupdateFile(e){
        console.log(e.target.files[0])
        this.editimg2= e.target.files[0];  //获取选中的文件二进制流
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
        var sum=0;
        this.multipleSelection=this.multipleSelection.map(function (item) {
              sum+=item.amount;
              item=item.id;
              return item;
        })
        formData.append("amount",sum);
        formData.append("ids",this.multipleSelection);
        this.$axios({
          method: 'post',
          url: 'Delivery/addDelivery.action',
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
      updateDelivery(){
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
          url: 'Goods/updategoods.action',
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

