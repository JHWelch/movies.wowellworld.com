<script lang="ts" setup>
const props = defineProps<{
  sectionTitle: string
}>()

const id = props.sectionTitle
  .replace(/\s+/g, '-')
  .toLowerCase()
</script>

<template>
  <div>
    <div
      v-if="sectionTitle"
      class="flex justify-center w-full"
    >
      <h2
        :id="id"
        class="relative flex items-center justify-between w-full max-w-5xl text-2xl italic text-center"
      >
        <span class="flex-1 ml-4 mr-12 border-2 border-b border-purp-dark" />

        <span
          class="text-purp-dark"
          v-text="sectionTitle"
        />

        <span class="flex-1 ml-12 mr-4 border-2 border-b border-purp-dark" />
      </h2>
    </div>

    <div
      v-else
      class="flex justify-center w-full"
    >
      <span class="relative w-full max-w-5xl mx-4 text-2xl text-center border-2 border-b border-purp-dark" />
    </div>
  </div>
</template>
