<script setup lang="ts">
definePageMeta({
  layout: 'home',
})

const online = useOnline()
</script>

<template>
  <div>
    <Suspense>
      <PageView v-if="online" />
      <div v-else text-gray:80>
        You're offline
      </div>
      <template #fallback>
        <div italic op50>
          <span animate-pulse>Loading...</span>
        </div>
      </template>
    </Suspense>
  </div>
</template>
