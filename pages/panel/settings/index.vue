<template>
  <NuxtLayout name="panel">
    <div class="px-20"></div>
    <p>Das hier ist die Ansicht für die globalen Einstellungen</p>
    <NuxtLink class="underline text-primary" to="/panel/board">Zur Board-Ansicht</NuxtLink>
    <p class="mt-16 mb-2 font-semibold">Access-Token für die API:</p>
    <p class="break-all">{{ accessToken }}</p>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const {accessToken} = useAuth0();
</script>