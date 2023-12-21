import { usePermissionStoreWithOut } from './permission'

const permissionStore = usePermissionStoreWithOut()

export const useRoutesStore = defineStore('routes', {
  state: (): RoutesModuleType => ({
    tab: {
      data: undefined,
    },
    tabMenu: undefined,
    activeMenu: {
      data: undefined,
    },
    routes: permissionStore.getRouters,
    allRoutes: permissionStore.getAddRouters,
  }),
  getters: {
    getTab: (state) => state.tab,
    getTabMenu: (state) => (state.tab.data ? state.routes.find((route) => route.name === state.tab.data) : { meta: { title: '' } }),
    getActiveMenu: (state) => state.activeMenu,
    getRoutes: (state) => {
      const visiableRoutes = state.routes.filter((_route) => _route.meta && _route.meta.hidden !== true)
      return visiableRoutes
    },
    getAllRoutes: (state) => state.allRoutes.filter((_route) => _route.meta && _route.meta.hidden !== true),
    getPartialRoutes: (state) => {
      if (!state.tab.data) {
        return []
      }
      const activeRoute = state.routes.find(
        (route) => (route.meta?.alwaysShow || (route?.children?.length && route?.children?.length > 1)) && route.name === state.tab.data
      )
      if (!activeRoute || !activeRoute.children) {
        return []
      }
      return activeRoute.children
    },
  },
  actions: {
    /**
     * @description 修改 activeName
     * @param activeMenu 当前激活菜单
     */
    changeActiveMenu(activeMenu: string) {
      this.activeMenu.data = activeMenu
    },
  },
})
