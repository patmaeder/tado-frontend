<template>
  <AuthenticationGuard>
    <div id="panel" class="h-screen max-h-screen w-full flex flex-col overflow-hidden">
      <header class="wrapper grid grid-cols-12 grid-rows-1 items-center h-20 flex-shrink-0 border-b border-gray-300">
        <div class="col-span-3">
          <img alt="Tado Logo" class="h-10" height="40" src="/tado_logo.svg"/>
        </div>

        <div class="col-span-6 h-full flex justify-center text-black">
          <slot name="header"></slot>
        </div>

        <div class="col-span-3 h-full relative inline-flex items-center justify-end text-black">
          <button class="flex gap-4 items-center" @click="toggleHeaderDropdown">
            <span>Menü</span>
            <FeatherIcon height="20" icon="chevron-down"/>
          </button>
          <dialog ref="headerDropdown"
                  class="absolute top-0 translate-y-20 w-80 mt-4 mr-0 ml-auto rounded-md border border-gray-300 drop-shadow-md overflow-hidden z-10">
            <div class="p-6">
              <button class="flex items-center gap-4 hover:text-gray-700" @click="logout">
                <FeatherIcon icon="log-out"/>
                <span>Ausloggen</span>
              </button>
            </div>
            <NuxtLink
                class="flex items-center justify-between gap-4 p-6 text-primary bg-primary-50 hover:bg-primary-100"
                to="/panel/settings">
              <div class="flex-grow flex flex-col">
                <span>Account-Einstellungen</span>
                <span class="text-sm font-light">{{ tenant?.email }}</span>
              </div>
              <div class="flex items-center justify-center h-8 aspect-square rounded-full border border-primary">
                <FeatherIcon class="stroke-primary" height="16" icon="user"/>
              </div>
            </NuxtLink>
          </dialog>
        </div>
      </header>

      <main class="wrapper flex-grow bg-gray-100 overflow-hidden">
        <slot></slot>
      </main>

    </div>
  </AuthenticationGuard>
</template>

<script lang="ts" setup>
const {tenant, logout} = useAuth0();
const headerDropdown = ref<HTMLDialogElement>();

const toggleHeaderDropdown = () => {
  if (headerDropdown.value?.open) {
    headerDropdown.value?.close();
  } else {
    headerDropdown.value?.show();
  }
}
</script>