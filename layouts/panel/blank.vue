<template>
  <div v-if="viewportToSmall"
       class="w-full h-screen flex flex-col items-center justify-center text-white bg-secondary z-50">
    <div class="max-w-3xl">
      <p class="mb-8 text-center leading-relaxed text-lg">Die Ansicht des Panels ist nicht für mobile Endgeräte bzw. für
        einen zu kleinen Bildausschnitt optimiert. Daher
        ist das Panel nur in Desktopauflösung verfügbar.</p>
      <p class="text-secondary-200 text-center">Wechseln Sie ihr Endgerät oder vergrößeren Sie ihr Browserfenster.</p>
    </div>
  </div>
  <div v-else id="panel" class=" relative h-screen max-h-screen w-full flex flex-col bg-gray-100 overflow-hidden">
    <slot></slot>
  </div>
  <div v-if="notifications !== null && notifications.size > 0"
       class="absolute right-0 bottom-0 p-10 z-50 flex flex-col gap-2 overflow-hidden">
    <ToastNotification v-for="[key, notification] in notifications" :id="key" :key="key" :notification="notification"/>
  </div>
</template>

<script lang="ts" setup>
const viewportToSmall = ref(false);
const {notifications} = useToastNotifications();

if (process.client) {
  addEventListener("resize", () => {
    viewportToSmall.value = window.innerWidth < 1280 || window.innerHeight < 640;
  })
}
</script>