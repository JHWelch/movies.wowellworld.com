<script lang="ts" setup>
import Calendar from '../components/Calendar.vue'
import RsvpModal from '../components/RsvpModal.vue'
import ThankYou from '../components/ThankYou.vue'
import WeekList from '../components/WeekList.vue'
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <div class="max-w-4xl px-4 py-10 md:px-8">
      <h1 class="flex flex-col items-center text-center">
        <span class="text-xl text-violet-600">
          Wowell World Studios Presents
        </span>

        <span class="mt-1 text-3xl">
          Thursday&nbsp;Night Movie&nbsp;Club
        </span>
      </h1>

      <div
        class="flex flex-col items-center justify-center mt-6 space-y-4 text-center"
      >
        <a
          href="#now-playing"
          class="flex items-center justify-center w-full px-4 py-2 mt-2 space-x-2 text-lg font-semibold text-white rounded-md h-14 md:w-auto bg-violet-600 hover:bg-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500"
        >Jump to the Movies 🍿</a>
      </div>

      <div class="mt-4 space-y-5 leading-7 md:mt-8">
        <h2 class="text-2xl font-semibold text-violet-600">
          Don’t you miss movie nights?
        </h2>

        <p>
          Well, we did, and that’s why we decided to start hosting them! Back when we were kids, going to a movie night at a friends’ was the best way to spend an evening. Microwave popcorn, soda, energy drinks, frozen pizzas, too many people piled onto a couch, and the sounds of a DVD from the local rental store playing in the background all meant you were in store for an evening full of laughter, screams, witty comments, and lifetime memories.
        </p>

        <p>
          Even though we’re a bit older now and some of the snacks have changed (we might actually make the pizza instead of just grabbing a frozen one), the fun of a movie night with your pals will never get old. So join us on most Thursday evenings at the Wowell abode in Ravenswood for a themed movie night! We will usually either have some snacks/food or order food together, but feel free to bring a dish to pass or a beverage, grab a seat, and settle in for - Movie Night!
        </p>

        <p class="text-lg font-semibold text-violet-600">
          All are welcome! In order to RSVP, accept the calendar invite or click RSVP and fill out the form.
        </p>

        <p>
          Wowell World Studios (our apartment) is home to a cat and dog. Please alert Rachel or Jordan if you have accessibility needs, parking needs, or dietary restrictions! Some weeks we may take a field trip to a theater, which will be clearly noted on the movie.
        </p>
      </div>
    </div>

    <WeekList
      fetch-url="/api/weeks/"
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
