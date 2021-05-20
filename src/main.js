import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from "./App";
//引用router.js
import router from './router'
//导入axios
import Axios from "axios";

Vue.config.productionTip = false
import * as echarts from 'echarts'
//然后将echart添加到vue的原型上，这样就可以全局使用了
Vue.prototype.$echarts = echarts;

Vue.use(ElementUI)

//配置异步将要访问的路径
Axios.defaults.baseURL = "http://127.0.0.1:8090/code"

//将baseURL绑定到全局
Vue.prototype.$axios = Axios


new Vue({
  el: '#app',
  render: h => h(App),
  router
})
