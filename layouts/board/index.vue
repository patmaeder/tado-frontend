<template>
  <NuxtLayout name="board-blank">
    <div :style="`--clr-accent: ${board.accentColor}`" class="min-h-screen bg-slate-100 overflow-y-auto">
      <header class="w-full bg-white">
        <div class="w-full flex justify-end p-6">
          <client-only>
            <div v-if="isAuthenticated" class="flex items center">
              <span>{{ user?.nickname }}</span>
              <button class="ml-3 pl-2 border-l border-gray-300"
                      @click="logoutUser">
                <LogOut height="16"/>
              </button>
            </div>
            <button v-else class="font-medium" @click="loginUser">Einloggen</button>
          </client-only>
        </div>
        <div class="px-12 sm:px-16 md:px-28 xl:px-72 pb-12 sm:pb-16">
          <img :alt="board.title + ' Logo'" :src="board.logo" class="h-16 mb-6">
          <p class="w-full md:w-2/3 leading-relaxed">{{ board.description }}</p>
        </div>
      </header>

      <main class="px-8 pb-16 sm:px-16 md:px-28 xl:px-72">
        <KeepAlive>
          <SuggestionsGridLayout :loginHandler="loginUser"/>
        </KeepAlive>
      </main>

      <client-only>
        <div v-if="isAuthenticated" class="fixed bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2">
          <NuxtLink
              class="flex items-center p-2 bg-[var(--clr-accent)] rounded-full shadow-md hover:brightness-95 cursor-pointer">
            <Plus class="h-12 w-12 p-2 text-white bg-white bg-opacity-20 rounded-full"/>
            <span class="px-6 text-white text-base md:text-lg font-medium whitespace-nowrap">Vorschlag teilen</span>
          </NuxtLink>
        </div>
      </client-only>
      <slot></slot>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import {LogOut, Plus} from "lucide-vue-next";
import SuggestionsGridLayout from "~/components/SuggestionsGridLayout.vue";

const route = useRoute();
const {init, user, isAuthenticated, login, logout} = useAuth0();
const {data: board, error: boardError} = await tado.getBoard(route.params.boardId as String);

if (boardError.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
  })
}

if (process.client) {
  await init({
    domain: "dev-d62xibfl4x3znv4i.us.auth0.com",
    clientId: "vDvSLgMRfXgDUhyPH6KnLIiYnmdNLDYl",
    cacheLocation: "localstorage",
    authorizationParams: {
      audience: "https://www.tado.com"
    }
  })
}

const loginUser = async () => {
  let searchParams = new URLSearchParams(location.search)
  searchParams.append("origin", route.path)

  await login({
    authorizationParams: {
      redirect_uri: location.origin + "/redirect?" + searchParams.toString(),
    }
  });
}

const logoutUser = async () => {
  let searchParams = new URLSearchParams(location.search)
  searchParams.append("origin", route.path)

  await logout(location.origin + "/redirect?" + searchParams.toString());
}
</script>