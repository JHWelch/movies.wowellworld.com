<script lang="ts" setup>
import { EventDto } from '@shared/dtos'

defineProps<{
  event: EventDto
}>()

</script>

<template>
  <span
    v-if="event.styledTheme.length > 0"
    class="text-3xl font-semibold"
    data-testid="theme"
  >
    <span
      v-for="(theme, index) in event.styledTheme"
      :key="index"
      :class="{
        'font-bold': theme.annotations.bold,
        'italic': theme.annotations.italic,
        'underline': theme.annotations.underline,
        'line-through': theme.annotations.strikethrough,
      }"
    >
      {{ theme.text.content }}
    </span>
  </span>

  <span
    v-else
    class="text-3xl font-semibold"
    data-testid="theme"
  >
    {{ event.isSkipped ? 'No movies this week!' : event.theme }}
  </span>
</template>
