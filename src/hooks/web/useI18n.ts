import { translate } from '/@/i18n/index.ts'

export const useI18n = (namespace: string = '') => {
  return {
    t: (message: string = '') => translate(namespace ? `${namespace}.${message}` : message),
  }
}

export const t = translate
