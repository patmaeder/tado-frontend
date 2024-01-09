<template>
  <NuxtLayout name="panel-blank">

    <!-- Panel Header -->
    <div>
      <header
          class="grid grid-cols-12 grid-rows-1 items-center h-20 px-20 flex-shrink-0 bg-white border-b border-gray-300">
        <div class="col-span-3">
          <img alt="Tado Logo" class="h-10" height="40" src="/tado_logo.svg"/>
        </div>

        <div class="col-span-6 h-full flex justify-center text-black">
          <slot name="header"></slot>
        </div>

        <div class="col-span-3 h-full relative inline-flex items-center justify-end text-black">
          <button class="flex gap-4 items-center" @click="toggleDropdownMenu">
            <div v-if="route.path.includes('/board/')"
                 :class="`h-14 p-2 ${board?.appearance == 'DARK' ? 'bg-neutral-900' : 'bg-gray-50'} border border-gray-200 rounded`">
              <img :src="board?.logo" class="h-full">
            </div>
            <span v-else>Menü</span>
            <ChevronDown height="20"/>
          </button>
          <dialog ref="dropdownMenu"
                  class="absolute top-0 translate-y-20 w-80 mt-4 mr-0 ml-auto bg-transparent z-10">
            <div class="mb-2 p-6 bg-white rounded-md border border-gray-300 drop-shadow-md overflow-hidden">
              <ul class="w-full flex flex-col gap-4">
                <li v-for="board in boards" :key="board.id"
                    :class="`h-14 w-full p-2 ${board.appearance == 'DARK' ? 'bg-neutral-900' : ''} border border-gray-200 rounded-md`">
                  <NuxtLink :to="`/panel/board/${board.id}/inbox`"
                            class="outline-none">
                    <img :src="board.logo" class="h-full w-full object-contain object-left">
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                      class="w-full h-14 flex gap-2 items-center justify-center text-white bg-secondary hover:bg-secondary-800 rounded-md"
                      to="/panel/board/new">
                    <span>Board erstellen</span>
                    <Plus height="16"/>
                  </NuxtLink>
                </li>
              </ul>
            </div>
            <div class="rounded-md bg-white border border-gray-300 drop-shadow-md overflow-hidden">
              <div class="p-6">
                <button class="flex items-center gap-4 hover:text-gray-700"
                        @click="() => {logout('/')}">
                  <LogOut/>
                  <span>Ausloggen</span>
                </button>
              </div>
              <NuxtLink
                  class="flex items-center justify-between gap-4 p-6 text-primary bg-primary-50 hover:bg-primary-100"
                  to="/panel/settings">
                <div class="flex-grow flex flex-col">
                  <span>Account-Einstellungen</span>
                  <span class="text-sm font-light">{{ user.email }}</span>
                </div>
                <div class="flex items-center justify-center h-8 aspect-square rounded-full border border-primary">
                  <User class="stroke-primary" height="16"/>
                </div>
              </NuxtLink>
            </div>
          </dialog>
        </div>
      </header>
    </div>

    <slot></slot>

  </NuxtLayout>
</template>

<script lang="ts" setup>
import {ChevronDown, LogOut, Plus, User} from "lucide-vue-next";

const route = useRoute();
const {user, logout} = useAuth0();
const {data: boards, error: boardsError} = await tado.getBoards();
const {data: board} = await tado.getBoard(route.params.boardId as String);
const dropdownMenu = ref<HTMLDialogElement>();

if (boardsError.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Board nicht gefunden",
  })
}

const toggleDropdownMenu = () => {
  dropdownMenu.value?.open ? dropdownMenu.value?.close() : dropdownMenu.value?.show();
}
</script>