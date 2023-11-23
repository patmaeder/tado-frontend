<template>
  <NuxtLayout name="panel">
  </NuxtLayout>
</template>

<script lang="ts" setup>
const {getBoards} = useTado();
const boards = await getBoards();

if (boards.value.length > 0) {
  navigateTo(`/panel/board/${ boards.value[0].id }/inbox`);
} else {
  navigateTo("/");
}
</script>