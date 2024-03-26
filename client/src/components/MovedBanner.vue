<script lang="ts" setup>
import { MapIcon } from '@heroicons/vue/24/outline'

</script>

<template>
  <div class="relative">
    <div class="fixed top-0 left-0 w-screen h-12 bg-fuchsia-200 z-50 flex justify-center">
      <div class="w-full max-w-4xl h-full flex items-center relative md:text-lg justify-between pr-4 pl-4 lg:pl-0">
        <div class="flex space-x-2 sm:space-x-4">
          <span class="font-semibold">
            🚚 We moved!
          </span>

          <span class="self-center">
            <span class="hidden md:inline-block">Come find us at </span>

            2111 W Argyle St Apt 1
          </span>
        </div>

        <a
          class="text-fuchsia-500 hover:text-fuchsia-600 cursor-pointer"
          href="https://maps.app.goo.gl/p5hLpkzkBDETJjm7A"
        >
          <MapIcon class="h-7 w-7" />
        </a>
      </div>
    </div>

    <div class="h-12">
      <!--Keeps the spacing right for the normal menu -->
    </div>
  </div>
</template>
