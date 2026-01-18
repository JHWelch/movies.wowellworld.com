<script lang="ts" setup>
import EventList from '@components/EventList.vue'
import { useRouter } from 'vue-router'
import { tags } from '@client/data/tags'
import SectionTitle from '@client/components/SectionTitle.vue'

const props = defineProps<{
  tag: string
}>()
const router = useRouter()
const {
  query,
  display,
  description,
} = tags?.[props.tag.toLowerCase()] || {
  query: props.tag,
  display: props.tag,
}
</script>

<template>
  <div class="flex flex-col items-center w-full pt-20">
    <SectionTitle :section-title="display" />
    <div class="max-w-4xl">
      <section
        v-if="description"
        class="px-4 py-8 mt-4 space-y-5 leading-7 min-[896px]:rounded-xl md:px-8 md:mt-8"
      >
        <p>{{ description }}</p>
      </section>
    </div>
  </div>

  <EventList
    :fetch-url="`/api/events?tag=${query}`"
    :show-event-details="true"
    :on-empty="() => router.replace('/404')"
  />
</template>
