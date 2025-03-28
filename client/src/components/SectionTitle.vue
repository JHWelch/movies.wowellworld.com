<script lang="ts" setup>
const props = defineProps<{
  sectionTitle: string
}>()

const id = props.sectionTitle
  .replace(/\s+/g, '-')
  .toLowerCase()
</script>

<template>
  <div>
    <div
      v-if="sectionTitle"
      class="flex justify-center w-full scroll-container"
    >
      <h2
        :id="id"
        class="relative flex items-center w-screen space-x-16 text-4xl text-center uppercase marquee"
      >
        <ul class="marquee__content">
          <li
            v-for="(x) in Array.from(Array(8).keys())"
            :key="x"
            class="text-web-pink whitespace-nowrap"
            v-text="sectionTitle"
          />
        </ul>

        <ul
          class="marquee__content"
          aria-hidden="true"
        >
          <li
            v-for="(x) in Array.from(Array(8).keys())"
            :key="x"
            class="text-web-pink whitespace-nowrap"
            v-text="sectionTitle"
          />
        </ul>
      </h2>
    </div>

    <div
      v-else
      class="flex justify-center w-full"
    >
      <span class="relative w-full max-w-5xl mx-4 text-2xl text-center border-2 border-b border-web-pink" />
    </div>
  </div>
</template>

<style scoped>
/* Marquee styles */
.marquee {
  --gap: 1rem;
  position: relative;
  display: flex;
  overflow: hidden;
  user-select: none;
  gap: var(--gap);
}

.marquee__content {
  flex-shrink: 0;
  display: flex;
  justify-content: space-around;
  gap: var(--gap);
  min-width: 100%;
  animation: scroll 15s linear infinite;
}

@keyframes scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-100% - var(--gap)));
  }
}

/* Pause animation when reduced-motion is set */
@media (prefers-reduced-motion: reduce) {
  .marquee__content {
    animation-play-state: paused !important;
  }
}

/* Attempt to size parent based on content. Keep in mind that the parent width is equal to both content containers that stretch to fill the parent. */
.marquee--fit-content {
  max-width: fit-content;
}

/* A fit-content sizing fix: Absolute position the duplicate container. This will set the size of the parent wrapper to a single child container. Shout out to Olavi's article that had this solution 👏 @link: https://olavihaapala.fi/2021/02/23/modern-marquee.html  */
.marquee--pos-absolute .marquee__content:last-child {
  position: absolute;
  top: 0;
  left: 0;
}

/* Enable position absolute animation on the duplicate content (last-child) */
.enable-animation .marquee--pos-absolute .marquee__content:last-child {
  animation-name: scroll-abs;
}

@keyframes scroll-abs {
  from {
    transform: translateX(calc(100% + var(--gap)));
  }
  to {
    transform: translateX(0);
  }
}
</style>
