<script lang="ts" setup>
import AppFooter from './components/AppFooter.vue'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <body class="flex flex-col items-center bg-slate-100">
    <main class="flex w-full flex-col justify-center bg-slate-100 align-middle">
      <NavBar />

      <router-view />
    </main>

    <AppFooter />
  </body>
</template>
