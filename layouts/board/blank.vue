<template>
  <div class="w-full h-screen max-h-screen overflow-y-auto">
    <slot></slot>
  </div>
  <div v-if="notifications !== null && notifications.size > 0"
       class="absolute right-0 bottom-0 p-10 z-50 flex flex-col gap-2 overflow-hidden">
    <ToastNotification v-for="[key, notification] in notifications" :id="key" :key="key" :notification="notification"/>
  </div>
</template>

<script lang="ts" setup>
const {notifications} = useToastNotifications();
</script>

