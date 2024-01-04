<template>
  <div :class="`h-full w-full ${appearance == 'DARK' ? 'dark': ''}`" :style="`--clr-preview-accent: ${accentColor}`">
    <div
        class="@container group w-full h-full flex-col bg-slate-100 dark:bg-neutral-900 overflow-hidden">
      <div
          class="flex flex-col bg-white dark:bg-neutral-950 dark:text-white">
        <p class="self-end @xs:p-[2cqh] @xs:text-[1cqh]">Einloggen</p>
        <div class="flex flex-col items-start @xs:gap-[2cqh] @xs:px-[18cqw] @xs:pb-[3cqw]">
          <img :src="logo" class="@xs:h-[4cqw]">
          <p class="@xs:text-[1.2cqh]">{{ props.description }}</p>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-4 @xs:px-[18cqw] @xs:pt-[4cqw]">
        <div v-for="item in 8" class="col-span-1 flex flex-col rounded bg-white overflow-hidden">
          <div class="@xs:p-[1.6cqh] flex flex-col gap-2">
            <p class="@xs:text-[1.2cqh] font-semibold line-clamp-2">Lorem ipsum dolor sit amet, consetetur sadipscing
              elitr</p>
            <p class="@xs:text-[1cqh] line-clamp-2">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
              accusam et justo duo dolores et ea rebum.</p>
          </div>
          <div class="flex items-center">
            <span class="@xs:px-[1.6cqh] @xs:mb-[.6cqh] @xs:text-[.8cqh] basis-1/2">Anonym</span>
            <div
                class="basis-1/2 flex justify-between items-center @xs:px-[1cqh] @xs:py-[.8cqh] @xs:text-[1cqh] text-preview-accent bg-preview-accent-50 rounded-tl">
              <span>Upvote</span>
              <span
                  class="@xs:px-[1cqw] @xs:py-[.2cqw] @xs:text-[1cqh] rounded-full bg-preview-accent text-white">12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(["logo", "description", "appearance", "accentColor"])
</script>

<style scoped>
.text-preview-accent {
  color: var(--clr-preview-accent);
}

.bg-preview-accent {
  background-color: var(--clr-preview-accent);
}

.bg-preview-accent-50 {
  background-color: color-mix(in srgb, var(--clr-preview-accent) 50%, transparent);
}
</style>