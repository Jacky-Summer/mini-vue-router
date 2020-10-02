let Vue = null

class HistoryRoute {
  constructor() {
    this.current = null
  }
}

class VueRouter {
  constructor(options) {
    this.mode = options.mode || 'hash'
    this.routes = options.routes || []
    this.routesMap = this.createMap(this.routes)
    this.history = new HistoryRoute() // 当前路由
    // 初始化路由函数
    this.initRoute()
  }

  createMap(routes) {
    return routes.reduce((pre, current) => {
      pre[current.path] = current.component
      return pre
    }, {})
  }

  initRoute() {
    if (this.mode === 'hash') {
      // 先判断用户打开时有没有hash值，没有的话跳转到 #/
      location.hash ? '' : (location.hash = '/')
      window.addEventListener('load', () => {
        this.history.current = location.hash.slice(1)
      })
      window.addEventListener('hashchange', () => {
        this.history.current = location.hash.slice(1)
      })
    } else {
      // history模式
      location.pathname ? '' : (location.pathname = '/')
      window.addEventListener('load', () => {
        this.history.current = location.pathname
      })
      window.addEventListener('popstate', () => {
        this.history.current = location.pathname
      })
    }
  }
}

VueRouter.install = function(_Vue) {
  Vue = _Vue

  Vue.mixin({
    beforeCreate() {
      // 根组件
      if (this.$options && this.$options.router) {
        this._root = this // 把当前vue实例保存到_root上
        this._router = this.$options.router // 把router的实例挂载在_router上
        Vue.util.defineReactive(this, '_route', this._router.history) // 监听history路径变化
      } else if (this.$parent && this.$parent._root) {
        // 子组件的话就去继承父组件的实例，让所有组件共享一个router实例
        this._root = this.$parent && this.$parent._root
      }
      // 当访问this.$router时即返回router实例
      Object.defineProperty(this, '$router', {
        get() {
          return this._root._router
        },
      })
      // 当访问this.$route时即返回当前页面路由信息
      Object.defineProperty(this, '$route', {
        get() {
          return this._root._router.history.current
        },
      })
    },
  })

  Vue.component('router-link', {
    props: {
      to: {
        type: [String, Object],
        required: true,
      },
      tag: {
        type: String,
        default: 'a',
      },
    },
    methods: {
      handleClick(event) {
        // 阻止a标签默认跳转
        event && event.preventDefault && event.preventDefault() // 阻止a标签默认跳转
        let mode = this._self._root._router.mode
        let path = this.to
        this._self._root._router.history.current = path
        if (mode === 'hash') {
          window.history.pushState(null, '', '#/' + path.slice(1))
        } else {
          window.history.pushState(null, '', path.slice(0))
        }
      },
    },
    render(h) {
      let mode = this._self._root._router.mode
      let tag = this.tag || 'a'
      let to = mode === 'hash' ? '#' + this.to : this.to
      return (
        <tag on-click={this.handleClick} href={to}>
          {this.$slots.default}
        </tag>
      )
      // return h(tag, { attrs: { href: to }, on: { click: this.handleClick } }, this.$slots.default)
    },
  })

  Vue.component('router-view', {
    render(h) {
      let current = this._self._root._router.history.current // current已经是动态
      let routesMap = this._self._root._router.routesMap
      return h(routesMap[current]) // 动态渲染对应组件
    },
  })
}

export default VueRouter
