<template></template>

<script lang="ts" setup>
const route = useRoute();

if (route.query.boardId)
  navigateTo("/" + route.query.boardId + route.fullPath.substring(route.fullPath.indexOf("?")))
</script>