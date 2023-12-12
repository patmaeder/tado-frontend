<template>
  <NuxtLayout name="panel">
  </NuxtLayout>
</template>

<script lang="ts" setup>
const {data: boards} = await tado.getBoards();
if (boards.value.length > 0) {
  navigateTo(`/panel/board/${ boards.value[0].id }/inbox`);
} else {
  navigateTo('/panel/board/new')
}
</script>