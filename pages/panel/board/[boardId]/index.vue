<template>
  <NuxtLayout name="panel-boards-inbox">
  </NuxtLayout>
</template>

<script lang="ts" setup>
const route = useRoute()
navigateTo(route.fullPath + "/inbox");
</script>

