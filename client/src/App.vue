<script lang="ts" setup>
import AppFooter from './components/AppFooter.vue'
import NavBar from './components/NavBar.vue'
import Notifications from './components/Notifications.vue'
</script>

<template>
  <body class="flex flex-col items-center bg-slate-100">
    <main class="flex flex-col justify-center w-full align-middle bg-slate-100">
      <Notifications />

      <NavBar />

      <router-view />
    </main>

    <AppFooter />
  </body>
</template>
