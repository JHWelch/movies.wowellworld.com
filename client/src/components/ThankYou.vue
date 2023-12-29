<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const open = ref(false)

onMounted(() => {
  const params = new URLSearchParams(window.location.search)

  if (params.has('suggest_success')) {
    open.value = true
    setTimeout(() => {
      open.value = false
    }, 2000)
  }
})
</script>

<template>
  <transition
    name="fade"
    @after-leave="open = false"
  >
    <div
      v-if="open"
      class="absolute flex items-center justify-center w-full h-full text-6xl text-violet-950 backdrop-blur-sm"
      @keydown.escape="open = false"
    >
      thank you
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
