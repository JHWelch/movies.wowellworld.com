<script lang="ts" setup>
const props = defineProps<{
  sectionTitle: string
}>()

const id = props.sectionTitle.replace(/\s+/g, '-').toLowerCase()
</script>

<template>
  <div>
    <div v-if="sectionTitle" class="flex w-full justify-center">
      <h2
        :id="id"
        class="relative flex w-full max-w-5xl items-center justify-between text-center text-2xl italic"
      >
        <span class="ml-4 mr-12 flex-1 border-2 border-b border-violet-300" />

        <span v-text="sectionTitle" />

        <span class="ml-12 mr-4 flex-1 border-2 border-b border-violet-300" />
      </h2>
    </div>

    <div v-else class="flex w-full justify-center">
      <span
        class="relative mx-4 w-full max-w-5xl border-2 border-b border-violet-300 text-center text-2xl"
      />
    </div>
  </div>
</template>
