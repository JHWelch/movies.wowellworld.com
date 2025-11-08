<script lang="ts" setup>
import ReminderSubscribe from '@components/ReminderSubscribe.vue'
import NavButton from '@components/navbar/NavButton.vue'
</script>

<template>
  <nav class="flex justify-center h-12 max-w-screen">
    <div class="relative flex flex-col w-full h-full">
      <div class="flex items-center justify-between h-full">
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
    </div>
  </nav>
</template>
