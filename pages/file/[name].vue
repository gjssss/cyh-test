<script setup lang="js">
import * as XLSX from 'xlsx'

definePageMeta({
  layout: 'home',
})
const route = useRoute()
const filename = route.params.name

useHead({
  title: filename,
})

const redo = ref()

const List = useLocalStorage(`${filename}-data`, [])
const index = useLocalStorage(filename, 0)
const showAns = ref(false)
const search = ref()
const select = ref(List.value[index.value]?.select)
const item = computed(() => {
  if (index.value <= List.value.length)
    return List.value[index.value]
  else
    return {}
})
const selectString = computed(() => {
  if (Array.isArray(select.value))
    return select.value.toSorted((a, b) => a.charCodeAt(0) - b.charCodeAt(0)).join('')
  else
    return select.value
})

if (List.value.length === 0) {
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
      E: row[6],
      answer: row[7],
      explain: row[8],
    })))
  }

  reader.readAsArrayBuffer(blob)
}

function reset() {
  showAns.value = false
  select.value = List.value[index.value].select
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
function selectAns(option) {
  if (List.value[index.value].select)
    return
  if (item.value.type === '单选题') {
    select.value = option
  }
  else {
    if (Array.isArray(select.value)) {
      const index = select.value.findIndex(item => item === option)
      if (index >= 0)
        select.value.splice(index, 1)
      else
        select.value.push(option)
    }
    else {
      select.value = [option]
    }
  }
}
function isSelected(option) {
  if (!item.value?.type)
    return false
  if (item.value.type === '单选题')
    return select.value === option
  else
    return Array.isArray(select.value) && select.value.includes(option)
}
function submit() {
  if (List.value[index.value].select)
    return
  if (selectString.value) {
    List.value[index.value].select = select.value
    List.value[index.value].isCorrect = selectString.value === item.value.answer
  }
}
function deleteData() {
  localStorage.removeItem(filename)
  localStorage.removeItem(`${filename}-data`)
  navigateTo('/')
}

onLongPress(redo, deleteData, {
  delay: 5000,
})
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
    <div
      :class="[
        isSelected('A') ? 'font-700 dark:c-white c-black' : 'dark:c-#ccc c-#333',
      ]"
      @click="selectAns('A')"
    >
      {{ item.A }}
    </div>
    <div
      :class="[
        isSelected('B') ? 'font-700 dark:c-white c-black' : 'dark:c-#ccc c-#333',
      ]"
      @click="selectAns('B')"
    >
      {{ item.B }}
    </div>
    <div
      :class="[
        isSelected('C') ? 'font-700 dark:c-white c-black' : 'dark:c-#ccc c-#333',
      ]"
      @click="selectAns('C')"
    >
      {{ item.C }}
    </div>
    <div
      :class="[
        isSelected('D') ? 'font-700 dark:c-white c-black' : 'dark:c-#ccc c-#333',
      ]"
      @click="selectAns('D')"
    >
      {{ item.D }}
    </div>
    <div
      :class="[
        isSelected('E') ? 'font-700 dark:c-white c-black' : 'dark:c-#ccc c-#333',
      ]"
      @click="selectAns('E')"
    >
      {{ item.E }}
    </div>
    <div v-if="item.select">
      <div>
        <span class="font-700">答案：</span>
        <span :class="item.isCorrect ? 'c-green' : 'c-red'">{{ item?.answer }}</span>
      </div>
      <div>
        <span class="text-1.1rem font-700">解释：</span>
        {{ item?.explain }}
      </div>
    </div>
    <div class="flex justify-center gap-4 text-center">
      <button ref="redo">
        重做
      </button>
      <button v-if="index !== 0" @click="prev">
        上一道
      </button>
      <button :class="selectString ? '' : 'c-#888'" @click="submit">
        确定
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
