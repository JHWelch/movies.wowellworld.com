<script lang="ts" setup>
import NavButton from './navbar/NavButton.vue'
</script>

<template>
  <nav class="flex h-12 justify-center bg-violet-200">
    <div class="flex h-full w-full max-w-4xl items-center">
      <NavButton text="Upcoming" route="/" />

      <NavButton text="Previous" route="/previous" />

      <NavButton text="Suggest a Theme" route="/suggestions/create" />
    </div>
  </nav>
</template>
