<template>
  <NuxtLayout name="panel">

    <template #header>
      <NuxtLink
          :data-active="route.path.includes('/inbox') ? 'true' : 'false'"
          :to="`/panel/board/${route.params.boardId}/inbox`"
          class="group/inbox flex items-center gap-3 my-3 px-6 rounded data-[active='true']:bg-primary-50"
      >
        <FeatherIcon
            class="group-data-[active='true']/inbox:stroke-primary group-data-[active='true']/inbox:stroke-[2.4px]"
            height="20"
            icon="inbox"/>
        <span
            class="group-data-[active='true']/inbox:font-semibold group-data-[active='true']/inbox:text-primary">Inbox</span>
      </NuxtLink>
      <NuxtLink
          :data-active="route.path.includes('/settings') ? 'true' : 'false'"
          :to="`/panel/board/${route.params.boardId}/settings`"
          class="group/inbox flex items-center gap-3 my-3 px-6 rounded data-[active='true']:bg-primary-50"
      >
        <FeatherIcon
            class="group-data-[active='true']/inbox:stroke-primary group-data-[active='true']/inbox:stroke-[2.4px]"
            height="20"
            icon="settings"/>
        <span
            class="group-data-[active='true']/inbox:font-semibold group-data-[active='true']/inbox:text-primary">Einstellungen</span>
      </NuxtLink>
    </template>

    <slot></slot>

  </NuxtLayout>
</template>
<script lang="ts" setup>
const route = useRoute();
</script>