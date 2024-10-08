<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'
import LoadingAnimation from '@components/LoadingAnimation.vue'
import SectionTitle from '@components/SectionTitle.vue'
import WeekItem from '@components/WeekItem.vue'
import ErrorBanner from '@components/ErrorBanner.vue'
import { WeekDto } from '@shared/dtos'
import { rsvpModal } from '@client/state/modalState'

const props = defineProps<{
  sectionTitles: { [key: number]: string }
  fetchUrl: string
  showEventDetails: boolean
}>()

const weeks = ref<WeekDto[]>([])
const loading = ref<boolean>(true)
const error = ref<boolean>(false)

const rsvpWeek = () => new URLSearchParams(window.location.search).get('rsvp')

const reload = () => {
  loading.value = true
  error.value = false
  fetch(props.fetchUrl)
    .then(response => {
      if (!response.ok) {
        console.error('Error fetching week data: ', response.status, response.statusText)
        error.value = true

        return Promise.resolve([])
      }

      return response.json()
    })
    .then(data => {
      weeks.value = data
      loading.value = false

      const rsvp_week = rsvpWeek()
      if (!rsvp_week) { return }

      const week = weeks.value.find(week => week.weekId === rsvp_week)
      if (!week) { return }

      rsvpModal.open(week)
    })
}

watch(weeks, () => nextTick(() => setTimeout(() => {
  const anchor = window.location.hash.substring(1)
  if (!anchor) { return }

  const element = document.getElementById(anchor)
  if (!element) { return }

  element.scrollIntoView()
}, 100)))

reload()
</script>

<template>
  <div>
    <LoadingAnimation v-if="loading" />

    <ErrorBanner
      v-if="error"
      @reload="reload"
    />

    <div
      v-for="[index, week] in Object.entries(weeks)"
      :key="index"
    >
      <div>
        <SectionTitle
          v-if="sectionTitles[Number(index)]"
          :section-title="sectionTitles[Number(index)]"
        />

        <WeekItem
          :week="week"
          :show-event-details="showEventDetails"
        />
      </div>
    </div>
  </div>
</template>
