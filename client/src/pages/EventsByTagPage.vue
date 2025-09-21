<script lang="ts" setup>
import EventList from '@components/EventList.vue'
import { useRouter } from 'vue-router'

defineProps<{
  tag: string
}>()
const router = useRouter()
</script>

<template>
  <div class="mt-10">
    <EventList
      :fetch-url="`/api/events?tag=${tag}`"
      :show-event-details="false"
      :section-titles="{ 0: 'Past Releases' }"
      :on-empty="() => router.replace('/404')"
    />
  </div>
</template>
