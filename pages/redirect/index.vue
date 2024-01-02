<template></template>

<script lang="ts" setup>
const route = useRoute();
const origin = route.query["origin"] as string;
delete route.query["origin"];

let redirect = origin;

let i = 0;
for (let key in route.query) {
  redirect += i == 0 ? "?" : "&"
  redirect += key + "=" + route.query[key];
  i++;
}

navigateTo(redirect);
</script>