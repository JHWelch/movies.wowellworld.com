<script lang="ts" setup>
import EventList from '@components/EventList.vue'
</script>

<template>
  <div class="mt-10">
    <EventList
      fetch-url="/api/events?past=true"
      :show-event-details="false"
      :section-titles="{ 0: 'Past Releases' }"
    />
  </div>
</template>
