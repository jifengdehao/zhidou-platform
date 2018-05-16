// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
/*import 'iview/dist/styles/iview.css'*/
import iView from 'iview'
import 'common/stylus/index.styl'
import Cookie from 'js-cookie'
import VueClipboard from 'vue-clipboard2'
import 'babel-polyfill'


Vue.use(VueClipboard)
Vue.config.productionTip = false
Vue.use(iView)

router.beforeEach((to, from, next) => {
  let isLogin
  let path = to.path.substr(1)
  if (/www\.zhiliaotv\.com/.test(location.host)) {
    isLogin = Cookie.get('__zlt_js__')
  } else {
    isLogin = Cookie.get('__zdb_dev_js__')
  }
  // isLogin = sessionStorage.getItem('isLogin')
  if (path !== 'login') {
    if (!isLogin) {
      next('/login')
      return false
    }
  } else {
    if (isLogin) {
      next('/')
      return false
    }
  }
  iView.LoadingBar.start()
  next()
})

router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
  iView.LoadingBar.finish()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
