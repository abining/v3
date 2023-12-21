import type { App } from 'vue'
// import Icon  from './Icon/src/Icon.vue'
import { Icon } from './Icon'
export const setupGlobCom = (app: App<Element>): void => {
  app.component('icon', Icon)
}
