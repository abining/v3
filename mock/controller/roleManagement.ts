import { MockMethod } from 'vite-plugin-mock'

const List = [
  {
    id: '@id',
    role: 'admin',
    btnRolesCheckedList: ['read:system', 'write:system', 'delete:system'],
  },
  {
    id: '@id',
    role: 'editor',
    btnRolesCheckedList: ['read:system', 'write:system'],
  },
]

export default [
  {
    url: '/roleManagement/getList',
    method: 'get',
    response({ query }: any) {
      const { role, pageNo = 1, pageSize = 20 } = query
      const mockList = List.filter((item: any) => !(role && item.role.indexOf(role) < 0))
      const list = mockList.filter((item: any, index: any) => index < pageSize * pageNo && index >= pageSize * (pageNo - 1))
      return {
        code: 200,
        msg: 'success',
        data: { list, ...{ total: mockList.length } },
      }
    },
  },
  {
    url: '/roleManagement/doEdit',
    method: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟保存成功',
      }
    },
  },
  {
    url: '/roleManagement/doDelete',
    method: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟删除成功',
      }
    },
  },
] as MockMethod[]
