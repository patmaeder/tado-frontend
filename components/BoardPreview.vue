<template>
  <div :data-appearance="appearance"
       class="@container group w-full h-full flex-col bg-slate-100 data-[appearance='DARK']:bg-gray-300 overflow-hidden">
    <div
        class="flex flex-col bg-white group-data-[appearance='DARK']:bg-gray-900 group-data-[appearance='DARK']:text-white">
      <p class="self-end @xs:p-[2cqh] @xs:text-[1cqh]">Einloggen</p>
      <div class="flex flex-col items-start @xs:gap-[2cqh] @xs:px-[20cqw] @xs:pb-[3cqw]">
        <img :src="logo" class="@xs:h-[4cqw]">
        <p class="@xs:text-[1.2cqh]">{{ props.description }}</p>
      </div>
    </div>
    <div class="grid grid-cols-3 @xs:px-[20cqw] @xs:pt-[3cqw]">
      <div class="h-20 bg-white group-data-[appearance='DARK']:bg-gray-900">
        <div :style="`background-color: ${accentColor}`" class="h-4 w-8">

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(["logo", "description", "appearance", "accentColor"])
</script>