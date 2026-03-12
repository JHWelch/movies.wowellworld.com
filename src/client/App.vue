<script lang="ts" setup>
import AppFooter from '@components/AppFooter.vue'
import NavBar from '@components/NavBar.vue'
import Notifications from '@components/Notifications.vue'
</script>

<template>
  <body class="flex flex-col items-center min-h-screen bg-dark text-light font-noto">
    <main class="flex flex-col justify-center w-full align-middle">
      <Notifications />

      <NavBar />

      <router-view />
    </main>

    <AppFooter />
  </body>
</template>
