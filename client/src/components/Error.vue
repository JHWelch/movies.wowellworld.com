<template>
  <div class="mb-5 mt-10 flex h-48 w-full flex-col items-center">
    <span class="text-6xl">😞</span>

    <div class="mt-2 text-lg">
      Sorry, something went wrong. Please

      <button
        class="text-violet-600 underline hover:text-violet-800"
        type="button"
        @click="$emit('reload')"
      >
        refresh the page
      </button>

      or try again later.
    </div>
  </div>
</template>
