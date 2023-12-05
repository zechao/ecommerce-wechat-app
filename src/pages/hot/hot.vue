<script setup lang="ts">
import { getHotRecommendAPI } from '@/services/hot'
import type { HotResult, SubTypeItem } from '@/types/hot'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

// 热门推荐页 标题和url
const urlMap = [
  { type: '1', title: '特惠推荐', url: '/hot/preference' },
  { type: '2', title: '爆款推荐', url: '/hot/inVogue' },
  { type: '3', title: '一站买全', url: '/hot/oneStop' },
  { type: '4', title: '新鲜好物', url: '/hot/new' },
]
const query = defineProps<{
  type: string
}>()

const currUrlMap = urlMap.find((o) => o.type === query?.type)
uni.setNavigationBarTitle({ title: currUrlMap!.title })

// import { onLoad } from '@dcloudio/uni-app'
// onLoad((query) => {
//   const currUrlMap = urlMap.find((o) => o.type === query!.type)
//   uni.setNavigationBarTitle({ title: currUrlMap!.title })
// })

const subTypes = ref<(SubTypeItem & { finished?: boolean })[]>([])

const hotRes = ref<HotResult>()
const getHotRecommendData = async () => {
  const res = await getHotRecommendAPI(currUrlMap!.url, {
    page: import.meta.env.DEV ? 30 : 1,
    pageSize: 10,
  })
  hotRes.value = res.result
  subTypes.value = res.result.subTypes
}
const activeIdx = ref(0)

onLoad(async () => {
  await getHotRecommendData()
})

// scroll reach the end
const onScrollToLower = async () => {
  // get cuurrent subtyps instance
  const currSubTypes = subTypes.value[activeIdx.value]
  // pagination logic
  if (currSubTypes.goodsItems.page < currSubTypes.goodsItems.pages) {
    currSubTypes.goodsItems.page++
  } else {
    currSubTypes.finished = true
    return uni.showToast({
      icon: 'none',
      title: '没有更多数据了...',
    })
  }
  const res = await getHotRecommendAPI(currUrlMap!.url, {
    subType: currSubTypes.id,
    page: currSubTypes.goodsItems.page,
    pageSize: currSubTypes.goodsItems.pageSize,
  })
  const newSubTypes = res.result.subTypes[activeIdx.value]
  currSubTypes.goodsItems.items.push(...newSubTypes.goodsItems.items)
}
</script>

<template>
  <view class="viewport">
    <!-- 推荐封面图 -->
    <view class="cover">
      <image :src="hotRes?.bannerPicture"></image>
    </view>
    <!-- 推荐选项 -->
    <view class="tabs">
      <text
        v-for="(item, idx) in subTypes"
        :key="item.id"
        class="text"
        :class="{ active: idx === activeIdx }"
        @tap="activeIdx = idx"
        >{{ item.title }}</text
      >
    </view>
    <!-- 推荐列表 -->
    <scroll-view
      v-for="(item, idx) in subTypes"
      v-show="activeIdx === idx"
      :key="item.id"
      scroll-y
      class="scroll-view"
      @scrolltolower="onScrollToLower"
    >
      <view class="goods">
        <navigator
          hover-class="none"
          class="navigator"
          v-for="goods in item.goodsItems.items"
          :key="goods.id"
          :url="`/pages/goods/goods?id=${goods.id}`"
        >
          <image class="thumb" :src="goods.picture"></image>
          <view class="name ellipsis">{{ goods.name }}</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">{{ goods.price }}</text>
          </view>
        </navigator>
      </view>
      <view class="loading-text">{{ item.finished ? '没有更多数据了...' : '正在加载...' }}</view>
    </scroll-view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  background-color: #f4f4f4;
}
.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 180rpx 0 0;
  position: relative;
}
.cover {
  width: 750rpx;
  height: 225rpx;
  border-radius: 0 0 40rpx 40rpx;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
}
.scroll-view {
  flex: 1;
}
.tabs {
  display: flex;
  justify-content: space-evenly;
  height: 100rpx;
  line-height: 90rpx;
  margin: 0 20rpx;
  font-size: 28rpx;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 5rpx rgba(200, 200, 200, 0.3);
  color: #333;
  background-color: #fff;
  position: relative;
  z-index: 9;
  .text {
    margin: 0 20rpx;
    position: relative;
  }
  .active {
    &::after {
      content: '';
      width: 40rpx;
      height: 4rpx;
      transform: translate(-50%);
      background-color: #27ba9b;
      position: absolute;
      left: 50%;
      bottom: 24rpx;
    }
  }
}
.goods {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx 20rpx;
  .navigator {
    width: 345rpx;
    padding: 20rpx;
    margin-top: 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }
  .thumb {
    width: 305rpx;
    height: 305rpx;
  }
  .name {
    height: 88rpx;
    font-size: 26rpx;
  }
  .price {
    line-height: 1;
    color: #cf4444;
    font-size: 30rpx;
  }
  .symbol {
    font-size: 70%;
  }
  .decimal {
    font-size: 70%;
  }
}

.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0 50rpx;
}
</style>
