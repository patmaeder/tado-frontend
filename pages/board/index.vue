<template>
  <div></div>
</template>

<script lang="ts" setup>
const route = useRoute();

onMounted(() => {
  if (route.query.board) {
    navigateTo("/board/" + route.query.board)
  } else {
    navigateTo("/")
  }
})
</script>