<script setup lang="js">
import * as XLSX from 'xlsx'

definePageMeta({
  layout: 'home',
})
const route = useRoute()
const filename = route.params.name

const List = ref([])
const index = useLocalStorage(filename, 0)
const showAns = ref(false)
const search = ref()
const item = computed(() => {
  if (index.value <= List.value.length)
    return List.value[index.value]
  else
    return {}
})

const response = await fetch(`/data/${filename}`)
const blob = await response.blob()
// 创建一个FileReader来读取blob
const reader = new FileReader()
reader.onload = (e) => {
  const data = new Uint8Array(e.target.result)
  const workbook = XLSX.read(data, { type: 'array' })

  const danxuan = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 })
  const duoxuan = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[1]], { header: 1 })

  List.value.push(...danxuan.slice(2).map(row => ({
    type: row[0],
    question: row[1],
    A: row[2],
    B: row[3],
    C: row[4],
    D: row[5],
    answer: row[6],
    explain: row[7],
  })))
  List.value.push(...duoxuan.slice(2).map(row => ({
    type: row[0],
    question: row[1],
    A: row[2],
    B: row[3],
    C: row[4],
    D: row[5],
    answer: row[6],
    explain: row[7],
  })))
}

reader.readAsArrayBuffer(blob)

function reset() {
  showAns.value = false
}

function next() {
  index.value++
  reset()
}
function prev() {
  index.value--
  reset()
}
function jump() {
  index.value = Number.parseInt(search.value)
  search.value = undefined
}
</script>

<template>
  <div class="flex flex-col gap-4 text-left">
    <div class="text-center">
      跳转到
      <input v-model="search" class="mx-4 w-100px b b-black rounded-1 b-solid text-center dark:b-white dark:text-black" type="text">
      <button @click="jump">
        跳转
      </button>
    </div>
    <div class="text-center">
      {{ item?.type }}
    </div>
    <div class="text-1.1rem">
      {{ item?.question }}
    </div>
    <div>
      {{ item?.A }}
    </div>
    <div>
      {{ item?.B }}
    </div>
    <div>
      {{ item?.C }}
    </div>
    <div>
      {{ item?.D }}
    </div>
    <div v-if="showAns">
      <div>
        <span class="font-700">答案：</span>
        {{ item?.answer }}
      </div>
      <div>
        <span class="text-1.1rem font-700">解释：</span>
        {{ item?.explain }}
      </div>
    </div>
    <div class="flex justify-center gap-4 text-center">
      <button v-if="index !== 0" @click="prev">
        上一道
      </button>
      <button @click="showAns = !showAns">
        开关答案
      </button>
      <button v-if="index !== List.length" @click="next">
        下一道
      </button>
    </div>
    <div class="text-center c-#888">
      {{ index + 1 }}/{{ List.length }}
    </div>
  </div>
</template>

<style>

</style>
