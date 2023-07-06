/**
 *
 * 实现import-html-entry
 * https://github.com/kuitos/import-html-entry
 * 这里只实现 getExternalScripts  execScripts
 *  从模版中获取script  以及执行js
 */

import { fetchResource } from "./fetch-resource";
// export const fetchResource = async (url) =>
//   await fetch(url).then((res) =>{
//     return res.text()
//   });

export const importHtml = async (url) => {
  const html = await fetchResource(url);
  console.log(html)
  const template = document.createElement("div");
  template.innerHTML = html;

  const scripts = template.querySelectorAll("script");

  //获取所有的script
  async function getExternalScripts() {
    console.log(scripts);
    return Promise.all(
      Array.from(scripts).map((script) => {
        const src = script.getAttribute("src");
        if (!src) {
          return Promise.resolve(script.innerHTML);
        } else {
          console.log(src, url);
          return fetchResource(src.startsWith("http") ? src : `${url}${src}`);
        }
      })
    );
  }

  //执行所有的script
  async function execScripts() {
    const scripts = await getExternalScripts();
    const module = { exports: {} };
    // no-unused-vars
    const exports = {};
    scripts.forEach((res) => {
      eval(res);
    });
    console.log(exports)
    return module.exports;
  }

  return {
    template,
    getExternalScripts,
    execScripts,
  };
};
