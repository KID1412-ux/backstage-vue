<template>
  <div style="height: 100%">
    <div style="height: 5%;">
      <el-button type="success" style='position: absolute;right:50px;' round @click="add()">添加新员工</el-button>
    </div>

    <el-table
      border
      :data="tableData"
      style="width: 100%;"
      height="95%">
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
            <el-button type="success" icon="el-icon-circle-plus" circle></el-button>
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
            <el-option value="0" label="男"></el-option>
            <el-option value="1" label="女"></el-option>
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
            <el-option value="0" label="男"></el-option>
            <el-option value="1" label="女"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="info" @click="addemp()">确认</el-button>
      <el-button type="warming" @click="employees=false">关闭</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "employee",
  data() {
    return {
      tableData: [],
      emp: {},
      employee: false,
      employees: false,
      emplo: {
        employeeName: '',
        employeeNo: '',
        password: '',
        phone: '',
        sex: '',
        stats: '0'
      },
    }
  },
  methods: {
    getdata() {
      var _this = this;
      this.$axios.post("/emp/selectallemployee").then(function (result) {
        _this.tableData = result.data;
      }).catch()
    },
    handleClose() {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.employee = false;
        })
        .catch(_ => {
        });
    },
    update(id) {
      var _this = this
      var param = new URLSearchParams();
      param.append("id", id);
      this.$axios.post("/emp/selectemployeebyid", param).then(function (result) {
        _this.emp = result.data;
        _this.employee = true;
      }).catch()
    },
    onsubmit() {
      var _this = this;
      var param = new URLSearchParams();
      for (let key in _this.emp) {
        param.append(key, _this.emp[key])
      }
      this.$axios.post("/emp/updateemployee", param).then(function (result) {
        _this.getdata();
        _this.$message({
          showClose: true,
          message: result.data,
          type: 'success'
        });
        _this.employee = false;
      }).catch()
    },
    add() {
      this.employees = true;
    },
    close() {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.employees = false;
        })
        .catch(_ => {
        });
    },
    addemp() {
      var _this = this
      var param = new URLSearchParams();
      for (let key in _this.emplo) {
        param.append(key, _this.emplo[key])
        console.log(_this.emplo[key])
      }
      this.$axios.post("/emp/addemployee", param).then(function (result) {
        _this.getdata();
        _this.$message({
          showClose: true,
          message: result.data,
          type: 'success'
        });
        _this.employees = false;
        _this.emplo = "";
      })
    }
  },
  created() {
    this.getdata();
  }
}
</script>

<style scoped>

</style>
