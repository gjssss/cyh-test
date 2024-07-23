<script setup lang="ts">
const data = ref(['中建七局土木工程公司安全知识题库（5月发布）.xlsx'])
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
