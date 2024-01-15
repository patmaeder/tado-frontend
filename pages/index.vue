<template>
  <div class="relative w-full h-screen flex flex-col items-center justify-around">
    <div class="flex gap-4 items-center justify-center">
      <h1 class="text-2xl font-semibold">Willkommen bei</h1>
      <img alt="Tado Logo" class="h-8" src="/tado_logo.svg">
    </div>
    <div class="flex flex-col items-center">
      <NuxtLink class="py-2 px-4 bg-secondary text-lg text-white rounded shadow" to="/panel">Zum Panel</NuxtLink>
      <div class="flex flex-col items-center mt-6">
        <p class="font-semibold text-lg">Login-Daten Test-Zugang:</p>
        <p class="flex flex-col items-center mt-4">E-Mail: <i>email@example.test</i></p>
        <p class="flex flex-col items-center mt-4">Passwort: <i>$Password</i></p>
      </div>
    </div>
  </div>
  <div v-if="notifications !== null && notifications.size > 0"
       class="absolute right-0 bottom-0 p-10 z-50 flex flex-col gap-2 overflow-hidden">
    <ToastNotification v-for="[key, notification] in notifications" :id="key" :key="key" :notification="notification"/>
  </div>
</template>

<script lang="ts" setup>
import {Info} from 'lucide-vue-next'

const {notifications, showNotification} = useToastNotifications();
const route = useRoute();

onMounted(() => {
  if (route.query["notification"] != null) {
    showNotification({
      icon: Info,
      message: route.query.notification as string,
      status: "ERROR",
      type: "ALERT",
    })
  }
})

</script>