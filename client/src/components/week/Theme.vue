<script lang="ts" setup>
import { WeekDto } from '@shared/dtos'

defineProps<{
  week: WeekDto
}>()

</script>

<template>
  <span
    v-if="week.styledTheme.length > 0"
    class="text-3xl font-semibold"
    data-testid="theme"
  >
    <span
      v-for="(theme, index) in week.styledTheme"
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
    {{ week.theme }}
  </span>
</template>
