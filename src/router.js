import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import RouteLoadModel from "./pages/RouteLoadModel.vue";
import RouteSelectImage from "./pages/RouteSelectImage.vue";
import RouteResult from "./pages/RouteResult.vue";

export default new VueRouter({
  routes: [
    { path: "/", component: RouteLoadModel },
    { path: "/select", component: RouteSelectImage },
    { path: "/result", component: RouteResult }
  ]
});
