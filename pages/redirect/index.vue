<template></template>

<script lang="ts" setup>
const route = useRoute();
const origin = route.query["origin"];
delete route.query["origin"];

navigateTo(origin + "?" + locationQueryToString(route.query));
</script>