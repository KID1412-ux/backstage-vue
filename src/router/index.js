import Vue from "vue"
import Router from "vue-router"

import Home from "../components/home"
import Denglu from "../components/denglu"
import Merchant from "../components/merchant"
import Merchantuphold from "../components/merchantuphold"
import Supplier from "../components/supplier";
import Supplieruphold from "../components/supplieruphold";
import Employee from "../components/employee";

Vue.use(Router)

export default new Router({
  routes:[
      {
      path:"/Home",
      name:"Home",
      component:Home,
        children:[{
        path:"/Merchant",
          name:"Merchant",
          component:Merchant
        }, {
        path: "/Merchantuphold",
          name: "Merchantuphold",
          component: Merchantuphold
        },{
          path: "/Supplier",
          name: "Supplier",
          component: Supplier
        },{
          path: "/Supplieruphold",
          name:"Supplieruphold",
          component: Supplieruphold
        },{
          path: "/Employee",
          name: "Employee",
          component: Employee
        }]
    },
      {
        path:"/",
        name:"Denglu",
        component:Denglu,
      }
    ],
    mode:"history"
  }
)
