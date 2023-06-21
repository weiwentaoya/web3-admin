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
                <el-button type="success" @click="handleAdd">
                  新增白名单
                </el-button>
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
          <el-dialog v-model="dialogFormVisible" title="新增白名单">
            <p>支持批量输入白名单地址，不同地址用英文逗号（,）分开</p>
            <el-select
              style="margin-top: 12px"
              v-model="query.whiteListType"
              placeholder="白名单类型"
            >
              <el-option label="免费mint白名单" :value="1" />
              <el-option label="付费mint白名单" :value="0" />
            </el-select>
            <el-input
              style="margin-top: 12px"
              v-model="freeAllowlist"
              :rows="3"
              type="textarea"
            />
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click="handleConfirm">
                  Confirm
                </el-button>
              </span>
            </template>
          </el-dialog>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { whiteList, nftSetList, refresh, nftDetail } from '@/api'
import { h, onMounted, ref } from 'vue'
import { InftSetList, nftSetDetailResponse } from '@/api/type'
import { ElLoading, ElMessageBox } from 'element-plus'
const query = ref({
  nftSetId: 0,
  whiteListType: 1,
  offset: 1,
  limit: 20,
})
const total = ref(0)
const handleSizeChange = (val: number) => {
  query.value.limit = val
  getWhiteList()
}
const handleCurrentChange = (val: number) => {
  query.value.offset = val
  getWhiteList()
}

// 获取白名单列表
const whiteListData = ref<string[]>([])
const getWhiteList = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(255, 255, 255, 0.4)',
  })
  const res = await whiteList({
    ...query.value,
    offset: query.value.offset - 1,
  })
  loading.close()
  whiteListData.value = res.data.whiteList
  total.value = res.data.totalCount
}

// 获取系列列表
const nftList = ref<InftSetList[]>([])
const getNftSetList = async () => {
  const res = await nftSetList({
    offset: 0,
    limit: 20,
  })
  query.value.nftSetId = res?.data?.nftSetList?.[0]?.nftSetId
  nftList.value = res.data.nftSetList
  getNftDetail()
  getWhiteList()
}
const nftDetailData = ref<nftSetDetailResponse>()
const getNftDetail = async () => {
  const res = await nftDetail({
    nftSetId: query.value.nftSetId,
  })
  nftDetailData.value = res.data
  console.log(res)
}

onMounted(() => {
  getNftSetList()
})
// 刷新白名单
const handleRefresh = async () => {
  await refresh({
    nftSetId: query.value.nftSetId,
    whiteListType: query.value.whiteListType,
  })
  getWhiteList()
}

import Mm from './useMm'
// 新增白名单
const dialogFormVisible = ref(false)
const freeAllowlist = ref('')
// const freeAllowlist = ref('0xc6Bd1647e5e1176f911bc738E4318CBA4928E129')
let MM: any
const handleAdd = () => {
  dialogFormVisible.value = true
  MM = Mm.getInstance()
}
const handleConfirm = () => {
  if (!MM.userAdderss || MM.error) return
  const list = freeAllowlist.value.split(',')
  if (!list.length) {
    return
    // message.error('请输入白名单地址')
  }
  MM.freeAllow(
    nftDetailData.value,
    query.value.whiteListType,
    list,
    (hash: string) => {
      dialogFormVisible.value = false
      ElMessageBox({
        title: 'Transaction pending',
        confirmButtonText: 'OK',
        message: h('p', null, [
          h(
            'a',
            {
              href: 'https://goerli.etherscan.io/tx/' + hash,
              target: '_blank',
              style:
                'color: teal;display: block;text-align: center;margin-top: 12px;font-size: 18px;text-decoration: none;',
            },
            'View on Etherscan',
          ),
        ]),
      })
    },
  )
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
