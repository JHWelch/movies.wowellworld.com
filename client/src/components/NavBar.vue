<script lang="ts" setup>
import ReminderSubscribe from './ReminderSubscribe.vue'
import NavButton from './navbar/NavButton.vue'
</script>

<template>
  <nav class="flex justify-center h-12 bg-violet-200">
    <div class="w-full h-full max-w-4xl flex justify-between items-center">
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
