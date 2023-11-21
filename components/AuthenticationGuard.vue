<template>
  <slot v-if="isAuthenticated"></slot>
  <div v-else class="w-full h-screen bg-secondary"></div>
</template>

<script lang="ts" setup>
const { init, auth0ClientInitialized, isAuthenticated, login } = useAuth0();

onMounted(() => {
  if (!auth0ClientInitialized.value) init();
})

watch(isAuthenticated, () => {
    if (!isAuthenticated.value) login();
})
</script>