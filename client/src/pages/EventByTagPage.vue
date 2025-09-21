<script lang="ts" setup>
import EventList from '@components/EventList.vue'

defineProps<{
  tag: string
}>()
</script>

<template>
  <div class="mt-10">
    <EventList
      :fetch-url="`/api/events?tag=${tag}`"
      :show-event-details="false"
      :section-titles="{ 0: 'Past Releases' }"
    />
  </div>
</template>
