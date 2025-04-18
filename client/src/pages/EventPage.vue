<script lang="ts" setup>
import ErrorBanner from '@client/components/ErrorBanner.vue'
import EventItem from '@client/components/EventItem.vue'
import LoadingAnimation from '@client/components/LoadingAnimation.vue'
import { EventDto } from '@shared/dtos'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps<{
  id: string
}>()
const curEvent = ref<EventDto | null>(null)
const loading = ref<boolean>(true)
const error = ref<boolean>(false)
const reload = () => {
  loading.value = true
  error.value = false
  fetch(`/api/events/${props.id}`)
    .then(response => {
      if (response.status === 404) {
        router.push('/404')

        return Promise.resolve(null)
      }

      if (!response.ok) {
        console.error('Error fetching event data: ', response.status, response.statusText)
        error.value = true

        return Promise.resolve(null)
      }

      return response.json()
    })
    .then(data => {
      curEvent.value = data
    })
    .catch(() => {
      console.error('Error fetching event data')
      error.value = true
    })
    .finally(() => {
      loading.value = false
    })
}
reload()
</script>
<template>
  <LoadingAnimation v-if="loading" />

  <ErrorBanner
    v-if="error"
    @reload="reload"
  />

  <EventItem
    v-if="curEvent"
    :event="curEvent"
    :show-event-details="true"
  />
</template>
