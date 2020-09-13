import Vue from 'vue'
import App from './App'
import store from './store/store.js'
import myRequest from './common/js/api.js' //封装请求接口
import btnSelf from './components/btnSelf.vue' //按钮样式


Vue.config.productionTip = false

Vue.prototype.$myRequest = myRequest//全局
Vue.component('btnSelf',btnSelf)//按鈕

App.mpType = 'app'

const app = new Vue({
  ...App,
	store
})
app.$mount()
