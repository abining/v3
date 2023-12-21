<template>
  <vab-card class="version-information">
    <template #header>
      <vab-icon icon="information-line" />
      信息

      <el-tag class="card-header-tag hidden-xs-only">当前版本：V{{ version }} &nbsp; 部署时间:{{ updateTime }}</el-tag>
    </template>
    <el-scrollbar>
      <table class="table">
        <tr>
          <td>vite</td>
          <td>
            <span>{{ devDependencies['vite'] }}</span>
          </td>
          <td>typescript</td>
          <td>
            <span>{{ devDependencies['typescript'] }}</span>
          </td>
          <td>vue</td>
          <td>
            <span>{{ dependencies['vue'] }}</span>
          </td>
          <td>pinia</td>
          <td>
            <span>{{ dependencies['pinia'] }}</span>
          </td>
        </tr>
        <tr>
          <td>vue-router</td>
          <td>
            <span>{{ dependencies['vue-router'] }}</span>
          </td>
          <td>element-plus</td>
          <td>
            <span>{{ dependencies['element-plus'] }}</span>
          </td>
          <td>vueuse</td>
          <td>
            <span>{{ dependencies['@vueuse/core'] }}</span>
          </td>
          <td>axios</td>
          <td>
            <span>{{ dependencies['axios'] }}</span>
          </td>
        </tr>
      </table>
      <div class="version-information-rely">
        <el-button
          href=""
          rel="noopener noreferrer"
          tag="a"
          target="_blank"
          type="primary"
        >
          <vab-icon icon="vip-diamond-line" />
          <span>虎鲸智造 V3.0</span>
        </el-button>
        <el-button href="" tag="a" target="_blank" type="warning">
          <vab-icon icon="vip-diamond-line" />
          <span>惠智造 V1.0</span>
        </el-button>
      </div>
    </el-scrollbar>
  </vab-card>
</template>

<script lang="ts" setup>
import pkg from '~/package.json'

const updateTime = import.meta.env.VITE_APP_UPDATE_TIME
const { dependencies, devDependencies, version } = pkg
</script>

<style lang="scss" scoped>
.version-information {
  &-rely {
    min-width: 500px;
    height: 50px;
    margin-top: 10px;
    line-height: 50px;
    text-align: left;
    border-radius: var(--el-border-radius-base);
  }

  .table {
    width: 100%;
    color: var(--el-color-black);
    border-collapse: collapse;
    background-color: var(--el-color-white);

    td {
      position: relative;
      padding: 11px 15px !important;
      overflow: hidden;
      font-size: var(--el-font-size-default);
      text-overflow: ellipsis;
      white-space: nowrap;
      border: 1px solid var(--el-border-color);

      &:nth-child(odd) {
        width: 10%;
        font-weight: bold;
        color: var(--el-color-grey);
        text-align: right;
        background-color: var(--el-color-white);

        span {
          margin-left: 10px;
          font-weight: normal;
        }
      }
    }
  }
}
</style>
