import MomentumScroll from "./index.vue";

// 定义我们的插件
const myPlugin = {
  // eslint-disable-next-line
  version:__VERSION__,
  // 该插件有一个install方法
  // 方法的第一个参数是传入的Vue，第二个参数可以插件的自定义参数
  // eslint-disable-next-line
  install(Vue, options) {
    Vue.component("v-momentum-scroll", MomentumScroll);
  }
};
// 新增
if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(myPlugin);
}

// 最后将插件导出，并在main.js中通过Vue.use()即可使用插件
export default myPlugin;
