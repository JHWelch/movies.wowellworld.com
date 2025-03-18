<template>
  <div class="flex flex-col items-center w-full h-48 mt-10 mb-5">
    <span class="text-6xl">:(</span>

    <div class="mt-6 text-lg">
      Sorry, something went wrong. Please

      <button
        type="button"
        @click="$emit('reload')"
      >
        refresh the page
      </button>

      or try again later.
    </div>
  </div>
</template>
