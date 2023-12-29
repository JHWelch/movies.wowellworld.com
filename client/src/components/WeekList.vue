<script lang="ts" setup>
import { ref } from 'vue'
import LoadingAnimation from './LoadingAnimation.vue'
import SectionTitle from './SectionTitle.vue'
import WeekItem from './WeekItem.vue'
import Error from './Error.vue'
import { WeekDto } from '../../../shared/dtos'

const props = defineProps<{
  sectionTitles: {[key: number]: string}
  fetchUrl: string
  showEventDetails: boolean
}>()

const weeks = ref<WeekDto[]>([])
const loading = ref<boolean>(true)
const error = ref<boolean>(false)

const rsvpWeek = () => {
  return new URLSearchParams(window.location.search).get('rsvp')
}

const reload =  () => {
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
      const week = weeks.value.find(week => week.weekId === week)
      if (!week) { return }

      // $dispatch('open-modal', { week });
    })
}

reload()
</script>

<template>
  <!--
    Tailwind CSS Safelist for movieSizeClass
    sm:w-1/2
    lg:w-1/3
    lg:w-1/2
  -->
  <div>
    <LoadingAnimation v-if="loading" />

    <Error
      v-if="error"
      @reload="reload"
    />

    <div
      v-for="[index, week] in Object.entries(weeks)"
      :key="index"
    >
      <div>
        <SectionTitle
          v-if="sectionTitles[index]"
          :section-title="sectionTitles[index]"
        />

        <WeekItem
          :week="week"
          :show-event-details="showEventDetails"
        />
      </div>
    </div>
  </div>
</template>