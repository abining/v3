<template>
  <div class="application-container">
    <div v-if="!development && protocol">
      <vab-alert
        title="点击安装前需手动按下键盘Ctrl（Command） + Shift + R 强制刷新当前页面，如果无法安装，PC端请点击浏览器地址栏右侧安装按钮进行安装，手机端请点击添加到主屏幕进行安装，仅支持Edge、Chrome、Safari"
      />
      <el-button type="primary" @click="handleInstall">点击安装</el-button>
    </div>
    <vab-alert v-else title="开发环境或非https协议下暂不支持安装PWA应用" type="warning" />
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Application',
})

const $baseAlert = inject<any>('$baseAlert')
const development = import.meta.env.DEV
const protocol = window.location.protocol === 'https:'
let deferredPrompt: any

const beforeInstallPrompt = () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
  })
}

onBeforeMount(() => {
  if (!development && protocol) beforeInstallPrompt()
})

const handleInstall = () => {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then(() => {
      deferredPrompt = null
      beforeInstallPrompt()
    })
  } else {
    $baseAlert('未获取到安装指令，请按下键盘Ctrl（Command） + Shift + R 强制刷新当前页面后重试', () => {
      location.reload()
    })
  }
}
</script>
