<script lang="ts" setup>
import NavButton from './navbar/NavButton.vue'
</script>

<template>
  <nav class="flex justify-center h-12 bg-violet-200">
    <div class="flex items-center w-full h-full max-w-4xl">
      <NavButton text="Upcoming" route="/" />

      <NavButton text="Previous" route="/previous" />

      <NavButton text="Suggest a Theme" route="/suggestions/create" />
    </div>
  </nav>
</template>
