<template>
  <div class="w-full h-screen flex flex-col items-center justify-around">
    <div class="flex gap-4 items-center justify-center">
      <h1 class="text-2xl font-semibold">Willkommen bei</h1>
      <img src="/tado_logo.svg" alt="Tado Logo" class="h-8">
    </div>
    <div>
      <NuxtLink to="/panel" class="py-2 px-4 bg-secondary text-lg text-white rounded shadow">Zum Panel</NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>