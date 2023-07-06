import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./public-path";
Vue.config.productionTip = false;
let vm;
function render(props = {}) {
  const { container } = props;
  vm = new Vue({
    router,
    props,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector("#app") : "#app");
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
export async function bootstrap() {}

export async function mount(props) {
  render(props);
}

export async function unmount() {
  // 子系统卸载，取消所有的请求
  vm.$destroy();
  vm.$el.innerHTML = "";
  vm = null;
}
