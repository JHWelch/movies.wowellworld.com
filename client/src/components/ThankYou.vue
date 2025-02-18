<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { fireConfetti } from '@client/utilities/confetti'

const isOpen = ref(false)

onMounted(() => {
  const params = new URLSearchParams(window.location.search)

  if (params.has('suggest_success')) {
    isOpen.value = true
    fireConfetti()
    setTimeout(() => {
      isOpen.value = false
    }, 2000)
  }
})
</script>

<template>
  <transition
    name="fade"
    @after-leave="isOpen = false"
  >
    <div
      v-if="isOpen"
      class="absolute flex items-center justify-center w-full h-full text-6xl text-brat-950 backdrop-blur-xs"
      @keydown.escape="isOpen = false"
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
