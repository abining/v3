<template>
  <div class="change-log-container no-background-container auto-height-container">
    <el-row :gutter="20">
      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <vab-card class="auto-height-card has-header" skeleton :skeleton-rows="16">
          <template #header>
            <vab-icon icon="file-word-line" />
            更新日志
          </template>
          <vab-alert title="温馨提示：请手动按下键盘Ctrl（Command） + Shift + R 刷新页面，以保证您第一时间获得网站的更新内容" type="info" />
          <el-scrollbar style="height: calc(100% - 60px)">
            <el-timeline>
              <el-timeline-item v-for="(item, index) in activities" :key="index" :color="item.color" :timestamp="item.timestamp">
                <template v-if="item.waver" #dot>
                  <span
                    class="vab-dot"
                    :class="{
                      ['vab-dot-' + item.waver]: true,
                    }"
                  >
                    <span></span>
                  </span>
                </template>
                <vab-card v-if="item.card">
                  <div class="change-log-item" v-html="item.content"></div>
                </vab-card>
                <template v-else>
                  <div class="change-log-item" v-html="item.content"></div>
                </template>
              </el-timeline-item>
            </el-timeline>
          </el-scrollbar>
        </vab-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { getList } from '/@/api/changeLog'
import { useRoutesStore } from '/@/store/modules/routes'

defineOptions({
  name: 'ChangeLog',
})

const routesStore = useRoutesStore()
const { changeMenuMeta } = routesStore

const lastTime = dayjs().format('YYYY-MM-DD')
const commonUrl = `https://vue-admin-beautiful.com`
const activities = ref<any[]>([])
const $baseMessage = inject<any>('$baseMessage')

interface Log {
  timestamp: string
  content: string
}

const sortLogs = (logs: Log[]): Log[] => {
  return logs.sort((a, b) => {
    const d1 = new Date(a.timestamp)
    const d2 = new Date(b.timestamp)

    if (d1 < d2) {
      return 1
    } else if (d1 > d2) {
      return -1
    } else {
      return 0
    }
  })
}

onBeforeMount(async () => {
  const { data } = await getList()
  // const _data = data.map((obj: any) => {
  //   return { ...obj, color: 'var(--el-timeline-node-color)' }
  // })

  const _data: any = sortLogs(data)
  _data[0].timestamp = lastTime
  _data.unshift({
    timestamp: lastTime,
    content: `
    小版本更新日志及bug修复日志演示地址不做展示，具体更新内容请购买后前往绑定仓库查看，
    <a href='${commonUrl}/authorization/shop-vite.html' target='_blank'>点我购买</a>
    `,
    waver: 'success',
  })
  activities.value = _data
  changeMenuMeta({
    name: 'ChangeLog',
    meta: { badge: _data.length },
  })
})

// 正式项目如果要用到更新日志模板，请删除以下代码
onMounted(() => {
  if (
    location.hostname !== 'localhost' &&
    !location.hostname.includes('127') &&
    !location.hostname.includes('192') &&
    location.hostname !== 'vue-admin-beautiful.com' &&
    location.hostname !== 'chu1204505056.gitee.io'
  ) {
    $baseMessage('检测到当前演示地址非官方演示地址，即将为您跳转，请稍后', 'warning', 'hey', () => {
      location.href = 'https://vue-admin-beautiful.com/shop-vite/#/changeLog'
    })
  }
})
</script>

<style lang="scss" scoped>
.change-log-container {
  .change-log-item {
    line-height: 24px;
  }

  :deep() {
    .el-timeline {
      padding: 10px;

      &-item__dot {
        .vab-dot {
          left: -1px;
          width: 12px;
          height: 12px;
          margin: auto !important;
        }
      }
    }
  }
}
</style>
