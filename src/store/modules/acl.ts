export const useAclStore = defineStore('acl', {
  state: (): AclModuleType => ({
    admin: false,
    role: [],
    permission: [],
  }),
  getters: {
    getAdmin: (state) => state.admin,
    getRole: (state) => state.role,
    getPermission: (state) => state.permission,
  },
  actions: {
    setFull(admin: boolean) {
      this.admin = admin
    },
    setRole(role: string[]) {
      this.role = role
      this.admin = role.indexOf('super_admin') >= 0
    },
    setPermission(permission: string[]) {
      this.permission = permission
    },
  },
})
