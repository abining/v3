import { MockMethod } from 'vite-plugin-mock'
import { Random } from '~/mock/utils'

export default [
  {
    url: '/expireToken',
    method: 'get',
    response(request) {
      const authorization = request.headers.authorization || request.headers.Authorization
      const arr = authorization.split('-')
      const tokenTime = parseInt(arr[arr.length - 1])

      if (new Date().getTime() - tokenTime > 5000)
        return {
          code: 402,
          msg: '令牌已过期',
        }
      else
        return {
          code: 200,
          msg: '令牌未过期',
        }
    },
  },
  {
    url: '/refreshToken',
    method: 'get',
    response(request) {
      const authorization = request.headers.authorization || request.headers.Authorization
      let token = ''
      if (authorization.includes('admin-token')) token = `admin-token-${Random.guid()}-${new Date().getTime()}`
      if (authorization.includes('editor-token')) token = `editor-token-${Random.guid()}-${new Date().getTime()}`
      if (authorization.includes('test-token')) token = `test-token-${Random.guid()}-${new Date().getTime()}`

      return {
        code: 200,
        msg: '刷新Token成功',
        data: { token },
      }
    },
  },
] as MockMethod[]
