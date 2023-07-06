import { reWriteRouter } from "./re-router.js";

let _apps = [];

export const getApps = () => _apps;

/**
 * 暴露两个函数  registerMicroApps 和 start
 *
 */

/**
 *
 * 微前端的运行原理
 * 1.监视路由变化
 *   hash  window.onhashchange  这个比较简单
 *   history
 *      history.go  history.back  history.forward    使用 window.onpopstate
 *      pushstate replacestate   需要重写
 *   这部分放到了re-router.js
 *
 * 2 匹配子应用
 *
 * 3 加载子应用
 *
 * 4 渲染子应用
 */

export const registerMicroApps = (apps) => {
  _apps = apps;
};

export const start = () => {
  // 1.监视路由变化
  reWriteRouter();
};
