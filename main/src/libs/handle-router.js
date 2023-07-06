/**
 * 2.处理路由变化
 *
 * 获取当前的路径
 */

import { getApps } from "./index";
import { importHtml } from "./import-html.js";
import { getNextRouter, getPreRouter } from "./re-router";

export const handlerRouter = async () => {
  const apps = getApps();
  /**
   * 卸载上一个路由
   */
  const preApp = apps.find((item) =>
    getPreRouter().startsWith(item.activeRule)
  );
  console.log(preApp, ">>>>>>");
  if (preApp) {
    await unmount(preApp);
  }
  /**
   * 加载下一个路由
   */
  console.log(window.location.pathname, apps);
  const app = apps.find((item) => getNextRouter().startsWith(item.activeRule));
  console.log(app);
  if (!app) {
    return;
  }
  // //   3 获取子应用的html,js css
  // const html = await fetch(app.entry).then((res) => res.text());
  // console.log(html);
  // const container = document.querySelector(app.container);
  // container.innerHTML = html;

  const { template, execScripts } = await importHtml(app.entry);
  const container = document.querySelector(app.container);
  // //   console.log(template, getExternalScripts, execScripts);
  container.appendChild(template);

  window.__POWERED_BY_QIANKUN__ = true;
  window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = app.entry + "/";

  const appsScript = await execScripts();
  app.bootstrap = appsScript.bootstrap;
  app.mount = appsScript.mount;
  app.unmount = appsScript.unmount;
  await bootstrap(app);
  await mount(app);
};

async function bootstrap(app) {
  app.bootstrap && (await app.bootstrap());
}
async function mount(app) {
  app.mount &&
    (await app.mount({ container: document.querySelector(app.container) }));
}
async function unmount(app) {
  app.unmount &&
    (await app.unmount({ container: document.querySelector(app.container) }));
}
