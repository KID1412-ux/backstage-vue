import Vue from "vue"
import Router from "vue-router"

import Home from "../components/home"
import Denglu from "../components/denglu"
import Merchant from "../components/merchant"
import Merchantuphold from "../components/merchantuphold"
import Supplier from "../components/supplier";
import Supplieruphold from "../components/supplieruphold";
import Employee from "../components/employee";
import Roles from "../components/roles";
import Competence from "../components/competence";
import Post from "../components/post";
import Menus from "../components/menus";
import TypeMaintain from "../components/goods_data_maintain/type_maintain";
import DataMaintain from "../components/goods_data_maintain/data_maintain";


Vue.use(Router)

export default new Router({
    routes: [
      {
        path: "/Home",
        name: "Home",
        component: Home,
        children: [{
          path: "/Merchant",
          name: "Merchant",
          component: Merchant
        }, {
          path: "/Merchantuphold",
          name: "Merchantuphold",
          component: Merchantuphold
        }, {
          path: "/Supplier",
          name: "Supplier",
          component: Supplier
        }, {
          path: "/Supplieruphold",
          name: "Supplieruphold",
          component: Supplieruphold
        },{
          path: "/Employee",
          name: "Employee",
          component: Employee
        },{
          path: "/Roles",
          name: "Roles",
          component: Roles
        },{
          path: "/Competence",
          name: "Competence",
          component: Competence
        },{
          path: "/Post",
          name: "Post",
          component: Post
        },{
          path: "/Menus",
          name: "Menus",
          component: Menus
        }, {
          path: "/TypeMaintain",
          name: "TypeMaintain",
          component: TypeMaintain
        }, {
          path: "/DataMaintain",
          name: "DataMaintain",
          component: DataMaintain
        }]
      },
      {
        path: "/",
        name: "Denglu",
        component: Denglu,
      }
    ],
    mode: "history"
  }
)
