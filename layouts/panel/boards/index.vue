<template>
  <NuxtLayout name="panel">
    <div id="panel" class="h-screen max-h-screen w-full flex flex-col overflow-hidden">

      <PanelHeader>
        <NuxtLink
            :data-active="route.path.includes('/inbox') ? 'true' : 'false'"
            :to="`/panel/board/${route.params.boardId}/inbox`"
            class="group/inbox flex items-center gap-3 my-3 px-6 rounded data-[active='true']:bg-primary-50"
        >
          <Inbox
              class="group-data-[active='true']/inbox:stroke-primary group-data-[active='true']/inbox:stroke-[2.4px]"
              height="20"/>
          <span
              class="group-data-[active='true']/inbox:font-semibold group-data-[active='true']/inbox:text-primary">Inbox</span>
        </NuxtLink>
        <NuxtLink
            :data-active="route.path.includes('/settings') ? 'true' : 'false'"
            :to="`/panel/board/${route.params.boardId}/settings`"
            class="group/inbox flex items-center gap-3 my-3 px-6 rounded data-[active='true']:bg-primary-50"
        >
          <Settings
              class="group-data-[active='true']/inbox:stroke-primary group-data-[active='true']/inbox:stroke-[2.4px]"
              height="20"/>
          <span
              class="group-data-[active='true']/inbox:font-semibold group-data-[active='true']/inbox:text-primary">Einstellungen</span>
        </NuxtLink>
      </PanelHeader>

      <main class="wrapper flex-grow bg-gray-100 overflow-hidden">
        <slot></slot>
      </main>

    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import {Inbox, Settings} from "lucide-vue-next";

const route = useRoute();
</script>