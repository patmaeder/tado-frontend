<template></template>

<script lang="ts" setup>
const route = useRoute();
navigateTo(route.query.origin + route.fullPath.substring(route.fullPath.indexOf("?")))
</script>