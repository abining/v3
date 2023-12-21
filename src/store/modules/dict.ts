import { defineStore } from 'pinia'
import store from '../index'
// @ts-ignore
import { DictDataVO } from '/@/api/system/dict.data'
import { getSimpleDictDataList } from '/@/api/system/dict/dict.data'
import { CACHE_KEY, useCache } from '/@/hooks/web/useCache'
const { wsCache } = useCache('sessionStorage')

export interface DictValueType {
  value: any
  label: string
  clorType?: string
  cssClass?: string
}
export interface DictTypeType {
  dictType: string
  dictValue: DictValueType[]
}
export interface DictState {
  dictMap: Record<string, any[]>
  isSetDict: boolean
}

export const useDictStore = defineStore('dict', {
  state: (): DictState => ({
    dictMap: new Object() as Record<string, any[]>,
    isSetDict: false,
  }),
  getters: {
    getDictMap(): Recordable {
      const dictMap = wsCache.get(CACHE_KEY.DICT_CACHE)
      if (dictMap) {
        this.dictMap = dictMap
      }
      return this.dictMap
    },
    getIsSetDict(): boolean {
      return this.isSetDict
    },
  },
  actions: {
    async setDictMap() {
      const dictMap = wsCache.get(CACHE_KEY.DICT_CACHE)
      if (dictMap) {
        this.dictMap = dictMap as Record<string, any[]>
        this.isSetDict = true
      } else {
        const res = await getSimpleDictDataList()
        // 设置数据
        const dictDataMap = {} as Record<string, any[]>
        res.forEach((dictData: DictDataVO) => {
          // 获得 dictType 层级
          let enumValueObj: Nullable<any[]> = dictDataMap[dictData?.dictType] as Nullable<any[]>
          if (!enumValueObj) {
            enumValueObj = []
            dictDataMap[dictData.dictType] = enumValueObj
          }
          // 处理 dictValue 层级
          enumValueObj.push({
            value: dictData.value,
            label: dictData.label,
            colorType: dictData.colorType,
            cssClass: dictData.cssClass,
          })
          dictDataMap[dictData.dictType] = enumValueObj
        })
        this.dictMap = dictDataMap
        this.isSetDict = true
        wsCache.set(CACHE_KEY.DICT_CACHE, dictDataMap, { exp: 60 }) // 60 秒 过期
      }
    },
    getDictByType(type: string) {
      if (!this.isSetDict) {
        this.setDictMap()
      }
      return this.dictMap[type]
    },
    async resetDict() {
      wsCache.delete(CACHE_KEY.DICT_CACHE)
      const res = await getSimpleDictDataList()
      // 设置数据
      const dictDataMap: Record<string, any[]> = {}
      res.forEach((dictData: DictDataVO) => {
        // 获得 dictType 层级
        let enumValueObj: Nullable<any[]> = dictDataMap[dictData?.dictType] as Nullable<any[]>
        if (!enumValueObj) {
          enumValueObj = []
          dictDataMap[dictData.dictType] = enumValueObj
        }
        // 处理 dictValue 层级
        enumValueObj.push({
          value: dictData.value,
          label: dictData.label,
          colorType: dictData.colorType,
          cssClass: dictData.cssClass,
        })
        dictDataMap[dictData.dictType] = enumValueObj
      })
      this.dictMap = dictDataMap
      this.isSetDict = true
      wsCache.set(CACHE_KEY.DICT_CACHE, dictDataMap, { exp: 60 }) // 60 秒 过期
    },
  },
})

export const useDictStoreWithOut = () => {
  return useDictStore(store)
}
