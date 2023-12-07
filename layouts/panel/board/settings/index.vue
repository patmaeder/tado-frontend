<template>
  <NuxtLayout name="panel-board">
    <div class="w-full h-full grid grid-cols-10">

      <KeepAlive>
        <div class="col-span-2 pl-20 border-r border-gray-300">
          <div class="max-h-full overflow-hidden">
            <div class="flex flex-col gap-4 max-h-full py-12 pr-8">
              <div class="flex-1 overflow-auto">
                <div class="flex flex-col gap-2">

                  <NuxtLink :data-active="route.path.endsWith('/settings')"
                            :to="`/panel/board/${route.params.boardId}/settings`"
                            class="w-full min-h-[3rem] px-4 py-2 flex items-center gap-2 rounded data-[active='true']:font-medium data-[active='true']:bg-gray-200">
                    <Settings height="18"/>
                    <span>Allgemein</span>
                  </NuxtLink>
                  <NuxtLink :data-active="route.path.endsWith('/settings/branding')"
                            :to="`/panel/board/${route.params.boardId}/settings/branding`"
                            class="w-full min-h-[3rem] px-4 py-2 flex items-center gap-2 rounded data-[active='true']:font-medium data-[active='true']:bg-gray-200">
                    <Pencil height="18"/>
                    <span>Branding</span>
                  </NuxtLink>
                  <NuxtLink :data-active="route.path.endsWith('/settings/categories')"
                            :to="`/panel/board/${route.params.boardId}/settings/categories`"
                            class="w-full min-h-[3rem] px-4 py-2 flex items-center gap-2 rounded data-[active='true']:font-medium data-[active='true']:bg-gray-200">
                    <LayoutGrid height="18"/>
                    <span>Kategorien</span>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </KeepAlive>

      <slot></slot>

    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import {LayoutGrid, Pencil, Settings} from 'lucide-vue-next';

const route = useRoute();
</script>