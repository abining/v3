import { CACHE_KEY, useCache } from '/@/hooks/web/useCache'
import { useAclStore } from '/@/store/modules/acl'

const { t } = useI18n() // 国际化

/**
 * 字符权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkPermi(value: string[]) {
  if (value && value instanceof Array && value.length > 0) {
    const { wsCache } = useCache()
    const permissionDatas = value
    const all_permission = '*:*:*'
    const permissions = wsCache.get(CACHE_KEY.USER).permissions
    const hasPermission = permissions.some((permission: string) => {
      return all_permission === permission || permissionDatas.includes(permission)
    })
    return !!hasPermission
  } else {
    console.error(t('permission.hasPermission'))
    return false
  }
}

/**
 * 角色权限校验
 * @param {string[]} value 校验值
 * @returns {Boolean}
 */
export function checkRole(value: string[]) {
  if (value && value instanceof Array && value.length > 0) {
    const { wsCache } = useCache()
    const permissionRoles = value
    const super_admin = 'admin'
    const roles = wsCache.get(CACHE_KEY.USER).roles
    const hasRole = roles.some((role: string) => {
      return super_admin === role || permissionRoles.includes(role)
    })
    return !!hasRole
  } else {
    console.error(t('permission.hasRole'))
    return false
  }
}

/**
 * 是否可以访问目标权限元素
 * @param targetRoleOrPermission 目标(路由|按钮)要求权限
 * @returns {boolean} 满足访问条件
 */
export function hasPermission(targetRoleOrPermission: string[] | GuardType) {
  const { getAdmin, getRole, getPermission } = useAclStore()
  if (getAdmin) return true
  if (getPermission.includes('*')) return true
  if (Array.isArray(targetRoleOrPermission)) {
    return can([...getRole, ...getPermission], {
      permission: targetRoleOrPermission,
      mode: 'oneOf',
    })
  } else {
    const { role = [], permission = [], mode = 'oneOf' } = targetRoleOrPermission
    return can([mode !== 'except'], {
      permission: [
        can(getRole, {
          permission: role,
          mode,
        }),
        can(getPermission, {
          permission,
          mode,
        }),
      ],
      mode,
    })
  }
}

/**
 * 检查是否满足权限
 * @param roleOrPermission 当前用户权限
 * @param target 目标(路由|按钮)要求权限
 * @returns {boolean} 满足访问条件
 */
function can(roleOrPermission: (string | boolean)[], target: CanType): boolean {
  let hasRole = false
  const { permission = [], mode = 'oneOf' } = target
  if (mode === 'allOf') hasRole = permission.every((item: string | boolean) => roleOrPermission.includes(item))
  if (mode === 'oneOf') hasRole = permission.some((item: string | boolean) => roleOrPermission.includes(item))
  if (mode === 'except') hasRole = !permission.every((item: string | boolean) => roleOrPermission.includes(item))
  return hasRole
}
