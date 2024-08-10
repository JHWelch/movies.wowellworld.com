<script lang="ts" setup>
import ReminderSubscribe from './ReminderSubscribe.vue'
import NavButton from './navbar/NavButton.vue'
</script>

<template>
  <nav class="flex justify-center h-12 bg-purp-light">
    <div class="relative flex items-center justify-between w-full h-full max-w-4xl">
      <div class="flex items-center h-full">
        <NavButton
          text="Upcoming"
          route="/"
        />

        <NavButton
          text="Previous"
          route="/previous"
        />

        <NavButton
          text="Suggest Theme"
          route="/suggestions/create"
        />
      </div>

      <ReminderSubscribe />
    </div>
  </nav>
</template>
