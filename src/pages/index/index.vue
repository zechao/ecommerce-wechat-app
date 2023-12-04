<script setup lang="ts">
import type { HotItem, BannerItem, CategoryItem } from '@/types/home'
import type { XtxGuessInstance } from '@/components/components'

import { getHomeBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '@/services/home'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

import CustomNavbar from './components/CustomNavbar.vue'
import CategoryPanel from './components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'
import PageSkeleton from './components/PageSkeleton.vue'

const categories = ref<CategoryItem[]>([])
const banners = ref<BannerItem[]>([])
const hots = ref<HotItem[]>([])

const isLoading = ref(false)

const getCategories = async () => {
  const res = await getHomeCategoryAPI()
  categories.value = res.result
}

const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI()
  banners.value = res.result
}

const getHomeHotsData = async () => {
  const res = await getHomeHotAPI()
  hots.value = res.result
}

onLoad(async () => {
  isLoading.value = true
  await Promise.all([getHomeBannerData(), getCategories(), getHomeHotsData()])
  isLoading.value = false
})

const guessRef = ref<XtxGuessInstance>()
const onScrollToLower = () => {
  guessRef.value?.getMore()
}

const isTrigged = ref(false)
const onRefresherrefresh = async () => {
  isLoading.value = true
  isTrigged.value = true
  guessRef.value?.resetData()
  await Promise.all([
    getHomeBannerData(),
    getCategories(),
    getHomeHotsData(),
    guessRef.value?.getMore(),
  ])

  isTrigged.value = false
  isLoading.value = false
}
</script>

<template>
  <CustomNavbar />
  <scroll-view
    refresher-enabled
    @refresherrefresh="onRefresherrefresh"
    :refresher-triggered="isTrigged"
    refres
    class="scroll-view"
    scroll-y
    @scrolltolower="onScrollToLower"
  >
    <PageSkeleton v-if="isLoading" />
    <template v-else>
      <XtxSwiper :banners="banners" />
      <CategoryPanel :categories="categories" />
      <HotPanel :hots="hots" />
      <XtxGuess ref="guessRef" />
    </template>
  </scroll-view>
</template>

<style lang="scss">
page {
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.scroll-view {
  flex: 1;
}
</style>
