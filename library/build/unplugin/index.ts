/* import { ElementPlusResolver } from 'unplugin-vue-components/resolvers' */
import { unplugin } from 'vite-plugin-unplugin'

export const createUnPlugin = (env: Record<string, string>) => {
  return unplugin({
    env,
    imports: [
      'vue',
      'pinia',
      'vue-router',
      '@vueuse/core',
      {
        axios: [['default', 'axios']],
      },
      {
        '/@/hooks/web/useI18n': ['useI18n'],
        '/@/hooks/web/useMessage': ['useMessage'],
        '/@/hooks/web/useTable': ['useTable'],
        '/@/hooks/web/useCrudSchemas': ['useCrudSchemas'],
        '/@/utils/formRules': ['required'],
        '/@/utils/dict': ['DICT_TYPE'],
      },
    ],
    resolvers: [
      /* ElementPlusResolver() */
    ],
    dirs: ['src/components', '!src/components/DiyEditor/components/mobile'],
  })
}
