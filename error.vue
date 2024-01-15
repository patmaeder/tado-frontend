<template>
  <div class="w-full h-screen flex flex-col overflow-hidden bg-white">
    <div class="h-10 p-8 box-content">
      <img alt="Tado Logo" class="h-full" src="/tado_logo.svg">
    </div>
    <template v-if="props.error.statusCode == 404">
      <div class="h-0 flex-grow flex justify-center">
        <img alt="404 Illustration" class="h-full" src="/404_Error-cuate.svg"/>
      </div>
      <div class="mb-[12vh] flex justify-center">
        <NuxtLink class="py-2 px-4 text-white bg-secondary rounded-md" to="/">Zurück zur Startseite</NuxtLink>
      </div>
    </template>
    <template v-else>
      <div class="h-0 flex-grow flex flex-col items-center">
        <h1 class="relative mt-36 text-9xl text-primary-950 font-bold isolate">
          <span>{{ props.error.statusCode }}</span>
          <div class="absolute top-0 bg-primary w-full h-full blur-3xl z-[-1]"></div>
        </h1>
      </div>
      <div class="flex flex-col items-center mb-[12vh]">
        <p>{{ props.error.message }}</p>
        <button class="py-2 px-4 mt-8 text-white bg-secondary rounded-md" @click="handleError">Zurück zur Startseite
        </button>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
const {logout} = useAuth0();
const props = defineProps(["error"])

const handleError = async () => {
  clearError();
  await logout("/");
}
</script>
