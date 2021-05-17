import Vue from "vue"
import Router from "vue-router"

import Home from "../components/home"
import Denglu from "../components/denglu"
import Merchant from "../components/merchant"
import Merchantuphold from "../components/merchantuphold"
import Supplier from "../components/supplier";
import Supplieruphold from "../components/supplieruphold";
import Employee from "../components/employee";
import TypeMaintain from "../components/goods_data_maintain/type_maintain";
import DataMaintain from "../components/goods_data_maintain/data_maintain";
import PurchaseApply from "../components/purchase_manage/purchase_apply";
import ApplicationRecord from "../components/purchase_manage/application_record";

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
        }, {
          path: "/Employee",
          name: "Employee",
          component: Employee
        }, {
          path: "/TypeMaintain",
          name: "TypeMaintain",
          component: TypeMaintain
        }, {
          path: "/DataMaintain",
          name: "DataMaintain",
          component: DataMaintain
        }, {
          path: "/PurchaseApply",
          name: "PurchaseApply",
          component: PurchaseApply
        }, {
          path: "/ApplicationRecord",
          name: "ApplicationRecord",
          component: ApplicationRecord
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
