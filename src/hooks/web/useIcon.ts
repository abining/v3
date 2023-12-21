import type { VNode } from 'vue'
import { h } from 'vue'
import { IconTypes } from '/@/components/Icon'
import { Icon } from '/@/types/icon'

export const useIcon = (props: IconTypes): VNode => {
  return h(Icon, props)
}
