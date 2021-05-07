import Vue from "vue"
import Router from "vue-router"

import Home from "../components/home"
import Denglu from "../components/denglu"
import Merchant from "../components/merchant"
import Merchantuphold from "../components/merchantuphold"

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
