<template>
  <div>
    <el-container class="footer">
      <el-header>
        <div style="height: 5%;">
        <div style="float: left">
        </div>
        <div style="float: right">
          <el-button style='position: absolute;right:50px; margin-top: 10px' round @click="tuichu">退出登录</el-button>
        </div>
      </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu :unique-opened="true" :default-active="this.$route.path" class="el-menu-vertical-demo" @open="handleOpen"
                   @close="handleClose"
                   background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" router>
            <el-submenu v-for="lis in list" class="li" :index="lis.id+''">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ lis.competenceName }}</span>
              </template>
              <el-menu-item-group v-for="menus in lis.menus">
                <el-menu-item :index="menus.menuUrl">{{ menus.menuName }}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
          <el-footer>
            @本系统最终解释权归本小组所有
            @2021-5-18 10:13
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>

export default {
  name: "home",
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    getdate(id) {
      var _this = this;

      var param = new URLSearchParams();
      param.append("id", id)


      this.$axios.post("/com/list", param).then(function (result) {
        _this.list = result.data;
      }).catch()
    },
    tuichu(){
      sessionStorage.clear();
      this.$router.push("/")
    }
  }
  ,
  created() {
    var id = sessionStorage.getItem("id")
    this.getdate(id);
  },
  data() {
    return {
      list: []
    }
  },
  computed: {
    orderList() {
      return this.$store.state.orderList
    }
  }
}
</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
}

.el-aside {
  color: #333;
  text-align: center;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
}

.li {
  width: 100%;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.footer {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
}

.el-menu {
  height: 100%;
  text-align: left;
}
</style>
