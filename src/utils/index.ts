import { toNumber } from 'lodash-es'

/**
 *
 * @param component 需要注册的组件
 * @param alias 组件别名
 * @returns any
 */
export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any
  comp.install = (app: any) => {
    app.component(comp.name || comp.displayName, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
}

/**
 * @param str 需要转下划线的驼峰字符串
 * @returns 字符串下划线
 */
export const humpToUnderline = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * @param str 需要转驼峰的下划线字符串
 * @returns 字符串驼峰
 */
export const underlineToHump = (str: string): string => {
  if (!str) return ''
  return str.replace(/-(\w)/g, (_, letter: string) => {
    return letter.toUpperCase()
  })
}

/**
 * 驼峰转横杠
 */
export const humpToDash = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

export const setCssVar = (prop: string, val: any, dom = document.documentElement) => {
  dom.style.setProperty(prop, val)
}

/**
 * 查找数组对象的某个下标
 * @param {Array} ary 查找的数组
 * @param {Functon} fn 判断的方法
 */
// eslint-disable-next-line
export const findIndex = <T = Recordable>(ary: Array<T>, fn: Fn): number => {
  if (ary.findIndex) {
    return ary.findIndex(fn)
  }
  let index = -1
  ary.some((item: T, i: number, ary: Array<T>) => {
    const ret: T = fn(item, i, ary)
    if (ret) {
      index = i
      return ret
    }
  })
  return index
}

export const trim = (str: string) => {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * @param {Date | number | string} time 需要转换的时间
 * @param {String} fmt 需要转换的格式 如 yyyy-MM-dd、yyyy-MM-dd HH:mm:ss
 */
export function formatTime(time: Date | number | string, fmt: string) {
  if (!time) return ''
  else {
    const date = new Date(time)
    const o: Recordable<number> = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      S: date.getMilliseconds(),
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length))
    }
    for (const k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k].toString() : `00${o[k]}`.substr(`${o[k]}`.length))
      }
    }
    return fmt
  }
}

/**
 * 生成随机字符串
 */
export function toAnyString() {
  const str: string = 'xxxxx-xxxxx-4xxxx-yxxxx-xxxxx'.replace(/[xy]/g, (c: string) => {
    const r: number = (Math.random() * 16) | 0
    const v: number = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString()
  })
  return str
}

/**
 * 首字母大写
 */
export function firstUpperCase(str: string) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}

export const generateUUID = () => {
  if (typeof crypto === 'object') {
    if (typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
    if (typeof crypto.getRandomValues === 'function' && typeof Uint8Array === 'function') {
      const callback = (c: any) => {
        const num = Number(c)
        return (num ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))).toString(16)
      }
      return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, callback)
    }
  }
  let timestamp = new Date().getTime()
  let performanceNow = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let random = Math.random() * 16
    if (timestamp > 0) {
      random = (timestamp + random) % 16 | 0
      timestamp = Math.floor(timestamp / 16)
    } else {
      random = (performanceNow + random) % 16 | 0
      performanceNow = Math.floor(performanceNow / 16)
    }
    return (c === 'x' ? random : (random & 0x3) | 0x8).toString(16)
  })
}

/**
 * element plus 的文件大小 Formatter 实现
 *
 * @param row 行数据
 * @param column 字段
 * @param cellValue 字段值
 */
// @ts-ignore
export const fileSizeFormatter = (row, column, cellValue) => {
  const fileSize = cellValue
  const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const srcSize = parseFloat(fileSize)
  const index = Math.floor(Math.log(srcSize) / Math.log(1024))
  const size = srcSize / Math.pow(1024, index)
  const sizeStr = size.toFixed(2) //保留的小数位数
  return `${sizeStr} ${unitArr[index]}`
}

/**
 * 将值复制到目标对象，且以目标对象属性为准，例：target: {a:1} source:{a:2,b:3} 结果为：{a:2}
 * @param target 目标对象
 * @param source 源对象
 */
export const copyValueToTarget = (target: Recordable, source: Recordable) => {
  const newObj = Object.assign({}, target, source)
  // 删除多余属性
  Object.keys(newObj).forEach((key) => {
    // 如果不是target中的属性则删除
    if (Object.keys(target).indexOf(key) === -1) {
      delete newObj[key]
    }
  })
  // 更新目标对象值
  Object.assign(target, newObj)
}

/**
 * 将一个整数转换为分数保留两位小数
 * @param num
 */
export const formatToFraction = (num: number | string | undefined): number => {
  if (typeof num === 'undefined') return 0
  const parsedNumber = typeof num === 'string' ? parseFloat(num) : num
  return parseFloat((parsedNumber / 100).toFixed(2))
}

/**
 * 将一个数转换为 1.00 这样
 * 数据呈现的时候使用
 *
 * @param num 整数
 */
export const floatToFixed2 = (num: number | string | undefined): string => {
  let str = '0.00'
  if (typeof num === 'undefined') {
    return str
  }
  const f = formatToFraction(num)
  const decimalPart = f.toString().split('.')[1]
  const len = decimalPart ? decimalPart.length : 0
  switch (len) {
    case 0:
      str = `${f.toString()}.00`
      break
    case 1:
      str = `${f.toString()}0`
      break
    case 2:
      str = f.toString()
      break
  }
  return str
}

/**
 * 将一个分数转换为整数
 * @param num
 */
export const convertToInteger = (num: number | string | undefined): number => {
  if (typeof num === 'undefined') return 0
  const parsedNumber = typeof num === 'string' ? parseFloat(num) : num
  // TODO 分转元后还有小数则四舍五入
  return Math.round(parsedNumber * 100)
}

/**
 * 元转分
 */
export const yuanToFen = (amount: string | number): number => {
  return convertToInteger(amount)
}

/**
 * 分转元
 */
export const fenToYuan = (price: string | number): number => {
  return formatToFraction(price)
}

/**
 * 计算环比
 *
 * @param value 当前数值
 * @param reference 对比数值
 */
export const calculateRelativeRate = (value?: number, reference?: number) => {
  // 防止除0
  if (!reference) return 0

  return ((100 * ((value || 0) - reference)) / reference).toFixed(0)
}

/**
 * 获取链接的参数值
 * @param key 参数键名
 * @param urlStr 链接地址，默认为当前浏览器的地址
 */
export const getUrlValue = (key: string, urlStr: string = location.href): string => {
  if (!urlStr || !key) return ''
  const url = new URL(decodeURIComponent(urlStr))
  return url.searchParams.get(key) ?? ''
}

/**
 * 获取链接的参数值（值类型）
 * @param key 参数键名
 * @param urlStr 链接地址，默认为当前浏览器的地址
 */
export const getUrlNumberValue = (key: string, urlStr: string = location.href): number => {
  return toNumber(getUrlValue(key, urlStr))
}

/**
 * @description 格式化时间
 * @param time
 * @param cFormat
 * @returns {string|null}
 */
export function parseTime(time: any, cFormat: string) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  return format.replace(/{([ymdhisa])+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = `0${value}`
    }
    return value || 0
  })
}

/**
 * @description 格式化时间
 * @param time
 * @param option
 * @returns {string}
 */
export function formatTimeNearDay(time: any, option: any) {
  if (`${time}`.length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d: any = new Date(time)
  const now: number = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    return `${Math.ceil(diff / 60)}分钟前`
  } else if (diff < 3600 * 24) {
    return `${Math.ceil(diff / 3600)}小时前`
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return `${d.getMonth() + 1}月${d.getDate()}日${d.getHours()}时${d.getMinutes()}分`
  }
}

/**
 * @description 将url请求参数转为json格式
 * @param url
 * @returns {{}|any}
 */
export function paramObj(url: string) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(`{"${decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"').replace(/\+/g, ' ')}"}`)
}

/**
 * @description 父子关系的数组转换成树形结构数据
 * @param data
 * @returns {*}
 */
export function translateDataToTree(data: any[]) {
  const parent = data.filter((value) => value.parentId === 'undefined' || value.parentId === null)
  const children = data.filter((value) => value.parentId !== 'undefined' && value.parentId !== null)
  const translator = (parent: any[], children: any[]) => {
    parent.forEach((_parent: any) => {
      children.forEach((current: any, index: number) => {
        if (current.parentId === _parent.id) {
          const temp = JSON.parse(JSON.stringify(children))
          temp.splice(index, 1)
          translator([current], temp)
          typeof _parent.children !== 'undefined' ? _parent.children.push(current) : (_parent.children = [current])
        }
      })
    })
  }
  translator(parent, children)
  return parent
}

/**
 * @description 树形结构数据转换成父子关系的数组
 * @param data
 * @returns {[]}
 */
export function translateTreeToData(data: any) {
  const result: any[] = []
  data.forEach((item: any) => {
    const loop = (data: any) => {
      result.push({
        id: data.id,
        name: data.name,
        parentId: data.parentId,
      })
      const child = data.children
      if (child) {
        for (let i = 0; i < child.length; i++) {
          loop(child[i])
        }
      }
    }
    loop(item)
  })
  return result
}

/**
 * @description 10位时间戳转换
 * @param time
 * @returns {string}
 */
export function tenBitTimestamp(time: number) {
  const date = new Date(time * 1000)
  const y = date.getFullYear()
  let m: string | number = date.getMonth() + 1
  m = m < 10 ? `${m}` : m
  let d: string | number = date.getDate()
  d = d < 10 ? `${d}` : d
  let h: string | number = date.getHours()
  h = h < 10 ? `0${h}` : h
  let minute: string | number = date.getMinutes()
  let second: string | number = date.getSeconds()
  minute = minute < 10 ? `0${minute}` : minute
  second = second < 10 ? `0${second}` : second
  return `${y}年${m}月${d}日 ${h}:${minute}:${second}` //组合
}

/**
 * @description 13位时间戳转换
 * @param time
 * @returns {string}
 */
export function thirteenBitTimestamp(time: number) {
  const date = new Date(time)
  const y = date.getFullYear()
  let m: string | number = date.getMonth() + 1
  m = m < 10 ? `${m}` : m
  let d: string | number = date.getDate()
  d = d < 10 ? `${d}` : d
  let h: string | number = date.getHours()
  h = h < 10 ? `0${h}` : h
  let minute: string | number = date.getMinutes()
  let second: string | number = date.getSeconds()
  minute = minute < 10 ? `0${minute}` : minute
  second = second < 10 ? `0${second}` : second
  return `${y}年${m}月${d}日 ${h}:${minute}:${second}` //组合
}

/**
 * @description 获取随机id
 * @param length
 * @returns {string}
 */
export function uuid(length = 32) {
  const num = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  let str = ''
  for (let i = 0; i < length; i++) {
    str += num.charAt(Math.floor(Math.random() * num.length))
  }
  return str
}

/**
 * @description m到n的随机数
 * @param m
 * @param n
 * @returns {number}
 */
export function random(m: number, n: number) {
  return Math.floor(Math.random() * (m - n) + n)
}

/**
 * @description addEventListener
 * @type {function(...[*]=)}
 */
export const on = (function () {
  return function (element: any, event: any, handler: any, useCapture = false) {
    if (element && event && handler) {
      element.addEventListener(event, handler, useCapture)
    }
  }
})()

/**
 * @description removeEventListener
 * @type {function(...[*]=)}
 */
export const off = (function () {
  return function (element: any, event: any, handler: any, useCapture = false) {
    if (element && event) {
      element.removeEventListener(event, handler, useCapture)
    }
  }
})()

/**
 * @description 数组打乱
 * @param array
 * @returns {*}
 */
export function shuffle(array: any[]) {
  let m = array.length,
    t,
    i
  while (m) {
    i = Math.floor(Math.random() * m--)
    t = array[m]
    array[m] = array[i]
    array[i] = t
  }
  return array
}
