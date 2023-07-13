import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { registerMicroApps, start } from "qiankun";

Vue.config.productionTip = false;

registerMicroApps([
  {
    name: "app1", // app name registered
    entry: "//localhost:8082",
    container: "#sub-app",
    activeRule: "/subapp/app1",
  }, 
  {
    name: "app2", // app name registered
    entry: "http://localhost:8000",
    container: "#sub-app",
    activeRule: "/subapp/app2",
  }, 
]);

start();
window.router = router

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
