<template>
  <div class="home-page__wrap">
    <el-container>
      <el-aside width="200px">
        <h2>Joker 管理后台</h2>
        <el-menu default-active="1" class="el-menu-vertical-demo">
          <el-menu-item index="1">
            <el-icon><icon-menu /></el-icon>
            <span>FreeMint白名单</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>FreeMint 白名单</el-header>
        <el-main>
          <div>
            <el-form :inline="true">
              <el-form-item label="NFT系列">
                <el-select v-model="query.nftSetId" placeholder="NFT系列">
                  <el-option
                    v-for="item in nftList"
                    :key="item.nftSetId"
                    :label="item.nftSetName"
                    :value="item.nftSetId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="类型">
                <el-select
                  v-model="query.whiteListType"
                  placeholder="白名单类型"
                >
                  <el-option label="免费mint白名单" :value="1" />
                  <el-option label="付费mint白名单" :value="0" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getWhiteList">搜索</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="success">新增白名单</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="warning" @click="handleRefresh">
                  刷新白名单
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-card style="margin-top: 12px">
            <template #header>
              <div class="card-header">
                <span>白名单地址</span>
              </div>
            </template>
            <div class="white-list">
              <p v-for="item in whiteListData" :key="item">{{ item }}</p>
            </div>
            <el-pagination
              v-model:current-page="query.offset"
              :page-size="query.limit"
              layout="total, prev, pager, next"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { whiteList, nftSetList, refresh } from '@/api'
import { onMounted, ref } from 'vue'
import { InftSetList } from '@/api/type'
const whiteListData = ref<string[]>([])
const query = ref({
  nftSetId: 0,
  whiteListType: 1,
  offset: 1,
  limit: 20,
})
const total = ref(0)
const nftList = ref<InftSetList[]>([])
const getWhiteList = async () => {
  const res = await whiteList({
    ...query.value,
    offset: query.value.offset - 1,
  })
  whiteListData.value = res.data.whiteList
  total.value = res.data.totalCount
  console.log('res', res)
}
const handleSizeChange = (val: number) => {
  query.value.limit = val
  getWhiteList()
}
const handleCurrentChange = (val: number) => {
  query.value.offset = val
  getWhiteList()
}
const getNftSetList = async () => {
  const res = await nftSetList({
    offset: 0,
    limit: 20,
  })
  query.value.nftSetId = res?.data?.nftSetList?.[0]?.nftSetId
  nftList.value = res.data.nftSetList
  getWhiteList()
}

onMounted(() => {
  getNftSetList()
})
const handleRefresh = async () => {
  await refresh({
    nftSetId: query.value.nftSetId,
    whiteListType: query.value.whiteListType,
  })
  getWhiteList()
}
</script>

<style lang="scss">
.home-page__wrap {
  .el-container {
    height: 100vh;
    overflow-y: auto;
    background: #ecf5ff;
    .el-aside {
      background-color: #d9ecff;
      h2 {
        font-size: 20px;
        font-weight: 600;
        padding: 24px 0;
        text-align: center;
      }
    }
    .el-header {
      background-color: #c6e2ff;
      display: flex;
      align-items: center;
      padding: 0 24px;
    }
    .el-main {
      padding: 12px;
      .white-list {
        p {
          font-size: 14px;
          color: #666;
          height: 50px;
          line-height: 50px;
          background: #ecf5ff;
          margin: 10px;
          padding: 0 12px;
        }
      }
    }
  }
}
</style>
