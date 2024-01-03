<script lang="ts" setup>
import { ref } from 'vue'
import LoadingAnimation from './LoadingAnimation.vue'
import SectionTitle from './SectionTitle.vue'
import WeekItem from './WeekItem.vue'
import Error from './Error.vue'
import { WeekDto } from '../../../shared/dtos'
import { rsvpModal } from '../state/modalState'

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
    .then((response) => {
      if (!response.ok) {
        console.error(
          'Error fetching week data: ',
          response.status,
          response.statusText,
        )
        error.value = true

        return Promise.resolve([])
      }

      return response.json()
    })
    .then((data) => {
      weeks.value = data
      loading.value = false

      const rsvp_week = rsvpWeek()
      if (!rsvp_week) {
        return
      }

      const week = weeks.value.find((week) => week.weekId === rsvp_week)
      if (!week) {
        return
      }

      rsvpModal.open(week)
    })
}

reload()
</script>

<template>
  <div>
    <LoadingAnimation v-if="loading" />

    <Error v-if="error" @reload="reload" />

    <div v-for="[index, week] in Object.entries(weeks)" :key="index">
      <div>
        <SectionTitle
          v-if="sectionTitles[Number(index)]"
          :section-title="sectionTitles[Number(index)]"
        />

        <WeekItem :week="week" :show-event-details="showEventDetails" />
      </div>
    </div>
  </div>
</template>
