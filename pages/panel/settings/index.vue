<template>
  <NuxtLayout name="panel-settings">
    <p class="mb-2 font-semibold">Access-Token für die API:</p>
    <p class="break-all">{{ accessToken }}</p>
    <button class="flex gap-2 items-center mt-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 border border-gray-300 rounded"
            @click="copyAccessToken">
      <Clipboard width="16"/>
      <span>Kopieren</span>
    </button>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import {Clipboard} from 'lucide-vue-next';

const {showNotification} = useToastNotifications();
const {accessToken} = useAuth0();

const copyAccessToken = () => {
  navigator.clipboard.writeText(accessToken.value as string);
  showNotification({
    icon: Clipboard,
    message: "Access Token wurde in die Zwischenablage kopiert",
    type: "BANNER",
    duration: 5000,
    status: "SUCCESS",
  })
}
</script>