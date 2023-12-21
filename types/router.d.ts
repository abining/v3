import { defineComponent } from 'vue'
import type { _RouteLocationBase, RouteRecordRaw } from 'vue-router'
import { RouteRecordNormalized } from 'vue-router'

/**
 * 路由记录
 */
declare interface VabRouteRecord extends Omit<RouteRecordRaw, 'name' | 'meta' | 'children'> {
  name: string
  meta: VabRouteMeta
  children?: VabRouteRecord[]
  childrenPathList?: string[]
  parentIcon?: string
  redirect?: string
}

declare interface VabRouteRecordRaw extends Omit<RouteRecordNormalized, 'meta' | 'name'> {
  name?: string
  meta: VabRouteMeta
}

/**
 * useRoute()
 */
declare interface VabRoute extends Omit<_RouteLocationBase, 'meta'> {
  meta: VabRouteMeta
  matched: VabRouteRecordRaw[]
  parentIcon?: string
}

declare interface VabRouteMeta {
  // 高亮指定菜单
  activeMenu?: string
  // badge小标签(只支持子级)
  badge?: string
  // 是否隐藏面包屑
  breadcrumbHidden?: boolean
  // 是否显示小圆点
  dot?: boolean
  // 动态传参路由是否新开标签页
  dynamicNewTab?: boolean
  // 权限
  guard?: string[] | GuardType
  // 是否显示在菜单中显示隐藏路由(默认值：false)
  hidden?: boolean
  // 图标
  icon?: string
  // 是否是自定义svg图标(默认值：false)
  // 如果设置true，那么需要把您的svg拷贝到icon下，然后icon字段配置上您的图标名
  isCustomSvg?: boolean
  // 是否显示在菜单中显示隐藏一级路由(默认值：true)
  levelHidden?: boolean
  // 当前路由是否可关闭多标签页，同上
  noClosable?: boolean
  // 是否隐藏侧边栏
  noColumn?: boolean
  // 当前路由是否不缓存(默认值：false)
  noKeepAlive?: boolean
  // 当前路由是否不显示多标签页
  tabHidden?: boolean
  // 在新窗口中打开
  target?: '_blank' | false
  // 菜单、面包屑、多标签页显示的名称
  title?: string
}

/**
* redirect: noredirect        当设置 noredirect 的时候该路由在面包屑导航中不可被点击
* name:'router-name'          设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
* meta : {
    hidden: true              当设置 true 的时候该路由不会再侧边栏出现 如404，login等页面(默认 false)

    alwaysShow: true          当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式，
                              只有一个时，会将那个子路由当做根路由显示在侧边栏，
                              若你想不管路由下面的 children 声明的个数都显示你的根路由，
                              你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，
                              一直显示根路由(默认 false)

    title: 'title'            设置该路由在侧边栏和面包屑中展示的名字

    icon: 'svg-name'          设置该路由的图标

    noCache: true             如果设置为true，则不会被 <keep-alive> 缓存(默认 false)

    breadcrumb: false         如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)

    affix: true               如果设置为true，则会一直固定在tag项中(默认 false)

    noTagsView: true          如果设置为true，则不会出现在tag中(默认 false)

    activeMenu: '/home'  显示高亮的路由路径

    followAuth: '/home'  跟随哪个路由进行权限过滤

    canTo: true               设置为true即使hidden为true，也依然可以进行路由跳转(默认 false)
  }
**/
declare module 'vue-router' {
  interface RouteMeta extends Record<string | number | symbol, unknown> {
    hidden?: boolean
    alwaysShow?: boolean
    title?: string
    icon?: string
    noCache?: boolean
    breadcrumb?: boolean
    affix?: boolean
    activeMenu?: string
    noTagsView?: boolean
    followAuth?: string
    canTo?: boolean
  }
}

type Component<T = any> = ReturnType<typeof defineComponent> | (() => Promise<typeof import('*.vue')>) | (() => Promise<T>)

declare global {
  interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
    name: string
    meta: RouteMeta
    component?: Component | string
    children?: AppRouteRecordRaw[]
    props?: Recordable
    fullPath?: string
    keepAlive?: boolean
    value?: string | number
  }

  interface AppCustomRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
    icon: any
    name: string
    meta: RouteMeta
    component: string
    componentName?: string
    path: string
    redirect: string
    children?: AppCustomRouteRecordRaw[]
    keepAlive?: boolean
    visible?: boolean
    parentId?: number
    alwaysShow?: boolean
  }
}
