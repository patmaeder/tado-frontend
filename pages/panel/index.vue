<template>
  <NuxtLayout name="panel">
  </NuxtLayout>
</template>

<script lang="ts" setup>
const { auth0ClientInitialized } = useAuth0();

watch(auth0ClientInitialized, () => {
  navigateTo("/panel/board");
})
</script>