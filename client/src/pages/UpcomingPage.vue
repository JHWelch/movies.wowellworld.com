<script lang="ts" setup>
import Calendar from '@components/Calendar.vue'
import RsvpModal from '@components/RsvpModal.vue'
import ThankYou from '@components/ThankYou.vue'
import EventList from '@components/EventList.vue'
import heroImg from '@assets/hero.png'
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <div class="max-w-4xl py-10">
      <div class="flex flex-col items-center px-4 py-5 text-center md:px-8">
        <h1 class="sr-only">
          Wowell World Cinemas Presents Movie Nights
        </h1>

        <img
          :src="heroImg"
          alt=""
        >
      </div>

      <div
        class="flex flex-col items-center justify-center px-4 py-6 space-y-4 text-center md:px-8"
      >
        <a
          href="#now-playing"
          class="flex items-center justify-center w-full text-2xl font-semibold md:w-auto"
        >Jump to the Movies</a>
      </div>

      <section class="px-4 py-8 mt-4 space-y-5 leading-7 min-[896px]:rounded-xl md:px-8 md:mt-8">
        <h2 class="text-2xl font-bold text-purp-dark">
          Don’t you miss movie nights?
        </h2>

        <p>
          Well, we did, and that’s why we decided to start hosting them! Back when we were kids, going to a movie night at a friends’ was the best way to spend an evening. Microwave popcorn, soda, energy drinks, frozen pizzas, too many people piled onto a couch, and the sounds of a DVD from the local rental store playing in the background all meant you were in store for an evening full of laughter, screams, witty comments, and lifetime memories.
        </p>

        <p>
          Even though we’re a bit older now and some of the snacks have changed (we might actually make the pizza instead of just grabbing a frozen one), the fun of a movie night with your pals will never get old. So join us on most Thursday evenings at the Wowell abode in Ravenswood for a themed movie night! We will usually either have some snacks/food or order food together, but feel free to bring a dish to pass or a beverage, grab a seat, and settle in for - Movie Night!
        </p>

        <p class="text-lg font-bold text-purp-dark">
          All are welcome! In order to RSVP, accept the calendar invite or click RSVP and fill out the form.
        </p>

        <p>
          Wowell World Studios (our apartment) is home to a cat and dog. Please alert Rachel or Jordan if you have accessibility needs, parking needs, or dietary restrictions! Some weeks we may take a field trip to a theater, which will be clearly noted on the movie.
        </p>
      </section>
    </div>

    <EventList
      fetch-url="/api/events/"
      :show-event-details="true"
      :section-titles="{
        0: 'Now Playing',
        1: 'Coming Attractions',
      }"
    />

    <RsvpModal />

    <ThankYou />
  </div>

  <div class="mt-10 sm:p-4">
    <Calendar />
  </div>
</template>
