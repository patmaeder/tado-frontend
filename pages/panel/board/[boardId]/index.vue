<template>
  <NuxtLayout name="panel">
  </NuxtLayout>
</template>

<script lang="ts" setup>
const route = useRoute()
navigateTo(route.fullPath + "/inbox");
</script>

