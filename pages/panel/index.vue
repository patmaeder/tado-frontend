<template>
  <NuxtLayout name="panel">
  </NuxtLayout>
</template>

<script lang="ts" setup>
const {data: boards} = await tado.getBoards();
navigateTo(`/panel/board/${ boards.value[0].id }/inbox`);
</script>