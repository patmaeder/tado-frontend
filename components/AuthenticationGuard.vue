<template>
  <slot v-if="isAuthenticated"></slot>
  <div v-else class="w-full h-screen flex items-center justify-center bg-secondary">
    <div id="authenticationGuard__loader"><div></div><div></div><div></div><div></div></div>
  </div>
</template>

<script lang="ts" setup>
const { isAuthenticated } = useAuth0();
</script>