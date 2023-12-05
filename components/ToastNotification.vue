<template>
  <div class="w-[32rem] flex flex-col bg-white border border-b-0 border-gray-200 rounded shadow">
    <div class="flex items-center gap-4 p-4 ">
      <div class="flex-grow flex items-center gap-2">
        <Component :is="notification.icon" :class="`text-${color}`" height="20"/>
        <div>
          <p class="font-medium">{{ notification.title }}</p>
          <p>{{ notification.message }}</p>
          <!-- Only needed to include all the required tailwind classes as dynamic clases arent compiled -->
          <p class="hidden text-primary text-green-600 text-yellow-500 text-red-600 bg-primary bg-green-600 bg-yellow-500 bg-red-600"></p>
        </div>
      </div>
      <div v-if="notification.type == 'ALERT'" class="flex-shrink-0 flex items-center">
        <button @click="() => {removeNotification(id as String)}">
          <X class="text-gray-600 hover:text-gray-500"/>
        </button>
      </div>
    </div>
    <div v-if="notification.type == 'BANNER'"
         :class="`self-center h-[2px] bg-${color} animate-drain`"
         :style="`animation-duration: ${notification.duration}ms`"></div>
  </div>
</template>

<script lang="ts" setup>
import {X} from "lucide-vue-next";

const {notification, id} = defineProps(['notification', 'id']);
const {removeNotification} = useToastNotifications();

let color;

switch (notification.status) {
  case "INFO":
    color = "primary"
    break;
  case "SUCCESS":
    color = "green-600"
    break;
  case "WARNING":
    color = "yellow-500"
    break;
  case "ERROR":
    color = "red-600"
    break
}
</script>