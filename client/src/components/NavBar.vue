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

        <router-link
          to="/october"
          class="flex-col items-center justify-center hidden h-full p-2 text-sm font-bold leading-5 text-center text-orange-600 bg-black md:text-xl grow sm:grow-0 sm:flex"
        >
          Horror October
        </router-link>

        <ReminderSubscribe />
      </div>

      <router-link
        to="/october"
        class="flex flex-col items-center justify-center h-full p-2 text-sm font-bold leading-5 text-center text-orange-600 bg-black grow sm:hidden"
      >
        Horror October
      </router-link>
    </div>
  </nav>
</template>
