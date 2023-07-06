import { handlerRouter } from "./handle-router";

let preRouter = "";
let nextRouter = window.location.pathname;

export const getPreRouter = () => preRouter;
export const getNextRouter = () => nextRouter;

export const reWriteRouter = function () {
  window.addEventListener("popstate", () => {
    preRouter = nextRouter;
    console.log("popstate");
    nextRouter = window.location.pathname;
    handlerRouter();
  });

  /**
   * 重写pushstate
   */
  const rowPushState = window.history.pushState;
  window.history.pushState = function (...args) {
    preRouter = window.location.pathname;
    rowPushState.apply(window.history, args);
    nextRouter = window.location.pathname;
    console.log("路由变化了", preRouter + "->" + nextRouter);
    handlerRouter();
  };

  /**
   * 重写replacestate
   */

  const rowReplaceState = window.history.replaceState;
  window.history.replaceState = function (...args) {
    preRouter = window.location.pathname;
    rowReplaceState.apply(window.history, args);
    nextRouter = window.location.pathname;
    console.log("路由变化了", preRouter + "->" + nextRouter);
    handlerRouter();
  };
};
