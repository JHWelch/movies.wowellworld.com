<script lang="ts" setup>
import EventList from '@components/EventList.vue'
import { useRouter } from 'vue-router'
import { tags } from '@client/data/tags'

const props = defineProps<{
  tag: string
}>()
const router = useRouter()
const {
  query,
  display,
} = tags?.[props.tag] || {
  query: props.tag,
  display: props.tag,
}
</script>

<template>
  <div class="mt-10">
    <EventList
      :fetch-url="`/api/events?tag=${query}`"
      :show-event-details="false"
      :section-titles="{ 0: display }"
      :on-empty="() => router.replace('/404')"
    />
  </div>
</template>
