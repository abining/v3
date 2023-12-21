import { createHead } from '@vueuse/head'
import ElementPlus from 'element-plus'
import 'virtual:svg-icons-register'
import { VabIcon } from 'vsv-icon'
import type { App } from 'vue'
import VXETable from 'vxe-table'
import './styles/vab.scss'

export const setupVab = (app: App<Element>) => {
  app.use(ElementPlus)
  app.use(createHead())
  app.use(VXETable)
  app.component('VabIcon', VabIcon)
  const Plugins = import.meta.glob('./plugins/*.ts', { eager: true })
  Object.getOwnPropertyNames(Plugins).forEach((key) => {
    const plugin: any = Plugins[key]
    app.use(plugin.default)
  })
}
