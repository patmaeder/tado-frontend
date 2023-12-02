<template>
  <NuxtLayout name="panel">
  </NuxtLayout>
</template>

<script lang="ts" setup>
const {data: boards, pending} = tado.getBoards();

watch(pending, () => {
  if (!pending.value) navigateTo(`/panel/board/${ boards.value[0].id }/inbox`);
})
</script>