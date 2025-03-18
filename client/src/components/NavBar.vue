<script lang="ts" setup>
import ReminderSubscribe from '@components/ReminderSubscribe.vue'
import NavButton from '@components/navbar/NavButton.vue'
</script>

<template>
  <nav class="flex justify-center h-12">
    <div class="relative flex items-center justify-between w-full h-full max-w-screen">
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
