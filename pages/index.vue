<template>
  <div class="w-full h-screen flex flex-col items-center justify-around">
    <div class="flex gap-4 items-center justify-center">
      <h1 class="text-2xl font-semibold">Willkommen bei</h1>
      <img alt="Tado Logo" class="h-8" src="/tado_logo.svg">
    </div>
    <div class="flex flex-col items-center">
      <NuxtLink class="py-2 px-4 bg-secondary text-lg text-white rounded shadow" to="/panel">Zum Panel</NuxtLink>
      <div class="flex flex-col items-center mt-6">
        <p class="font-semibold text-lg">Login-Daten Test-Zugang:</p>
        <p class="flex flex-col items-center mt-4">E-Mail: <i>email@example.test</i></p>
        <p class="flex flex-col items-center mt-4">Passwort: <i>$Password</i></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>