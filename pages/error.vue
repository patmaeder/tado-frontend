<template>
  <div>
    <h2>{{ props.error.statusCode }}</h2>
    <p>{{ props.error.message }}</p>
    <button @click="handleError">Zurück zur Startseite</button>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(["error"])

const handleError = () => clearError({redirect: '/'})
</script>
