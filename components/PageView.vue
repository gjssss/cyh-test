<script setup lang="ts">
const { data } = useFetch('/api/getList')
</script>

<template>
  <div text-gray:80>
    <ul>
      <li v-for="item in data" :key="item" @click="navigateTo(`/file/${item}`)">
        {{ item }}
      </li>
    </ul>
  </div>
</template>
