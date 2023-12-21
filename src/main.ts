import VueDOMPurifyHTML from 'vue-dompurify-html' // 解决v-html 的安全隐患
import { setupVab } from '~/library'
import App from './App.vue'
import { setupGlobCom } from './components'
import { setupAuth } from './directives'
import { setupI18n } from './i18n'
import { setupFormCreate } from './plugins/formCreate'
import { router, setupRouter } from './router'
import { setupStore } from './store'
import '/@/permission'
import '/@/plugins/unocss'

const app = createApp(App)

setupVab(app)
setupI18n(app)
setupStore(app)
setupRouter(app)
setupGlobCom(app)
setupFormCreate(app)
setupAuth(app)
router.isReady().then(() => {
  app.use(VueDOMPurifyHTML)

  app.mount('#app')
})
