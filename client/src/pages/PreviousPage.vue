<script lang="ts" setup>
import WeekList from '@components/WeekList.vue'
</script>

<template>
  <div class="mt-10">
    <WeekList
      fetch-url="/api/weeks?past=true"
      :show-event-details="false"
      :section-titles="{ 0: 'Past Releases' }"
    />
  </div>
</template>
