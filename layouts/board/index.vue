<template>
  <div class="min-h-screen bg-slate-100 overflow-y-auto">
    <header class="w-full bg-white">
      <div class="w-full flex justify-end p-6">
        <ClientOnly>
          <div v-if="isAuthenticated" class="flex items center">
            <span>{{ user.email }}</span>
            <button class="ml-3 pl-2 border-l border-gray-300"
                    @click="logoutUser">
              <LogOut height="16"/>
            </button>
          </div>
          <button v-else class="font-medium" @click="loginUser">Einloggen</button>
        </ClientOnly>
      </div>
      <div class="px-72 pb-16">
        <img :alt="board.title + ' Logo'" :src="board.logo" class="h-16 mb-6">
        <p class="w-2/3 text-base leading-relaxed">{{ board?.description }}</p>
      </div>
    </header>

    <main class="px-72">
      <div class="flex justify-end py-6">
        <label class="flex items-center gap-2 mr-4" for="suggestionsOrder">
          <select id="suggestionsOrder" v-model="suggestionsOrder"
                  class="appearance-none direction-rtl outline-none bg-transparent"
                  name="suggestionsOrder">
            <option value="MOST_UPVOTED">Beliebteste</option>
            <option value="NEWEST">Neueste zuerst</option>
            <option value="OLDEST">Älteste zuerst</option>
          </select>
          <SortDesc width="16"/>
        </label>
      </div>
      <div class="grid grid-cols-3 gap-8">

        <NuxtLink v-for="suggestion in suggestions" :key="suggestion.id" :to="`/${board.id}/${suggestion.id}`"
                  class="bg-white rounded-md overflow-hidden">
          <div class="p-8 pb-4">
            <h2 class="mb-4 font-medium text-lg line-clamp-2">{{ suggestion.title }}</h2>
            <p class="font-light line-clamp-2 leading-relaxed">{{ suggestion.description }}</p>
          </div>
          <div class="flex">
            <div class="px-8 pt-2 pb-6 basis-1/2">
              <span class="text-sm">Author</span>
            </div>
            <button
                :style="`background-color: ${board.accentColor}`"
                class="group flex justify-between items-center px-4 basis-1/2 text-white rounded-tl-md hover:opacity-90"
                @click.prevent="upvote('2')">
              <span
                  class="flex items-center before:w-0 before:h-0 before:mr-1 before:border-b-[10px] before:border-b-white before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:scale-x-50 before:scale-y-75 -translate-x-1">Upvote</span>
              <span class="px-4 py-1 bg-white bg-opacity-30 rounded-full">32</span>
            </button>
          </div>
        </NuxtLink>

      </div>
    </main>

    <div class="fixed bottom-10 left-1/2 -translate-x-1/2">
      <NuxtLink :style="`background-color: ${board.accentColor}`"
                class="flex items-center p-2 rounded-full shadow-md hover:brightness-95 cursor-pointer">
        <Plus class="h-12 w-12 p-2 text-white bg-white bg-opacity-20 rounded-full"/>
        <span class="px-6 text-white text-lg font-medium">Vorschlag teilen</span>
      </NuxtLink>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import {LogIn, LogOut, Plus, SortDesc} from "lucide-vue-next";

const route = useRoute();
const {showNotification} = useToastNotifications();
const {init, user, isAuthenticated, login, logout} = useAuth0();
const {data: board, error: boardError} = await tado.getBoard(route.params.boardId as String);
const {data: suggestions, error: suggestionsError} = await tado.getSuggestions(route.params.boardId as String)
const suggestionsOrder = ref('MOST_UPVOTED');

watch(suggestionsOrder, () => {
  switch (suggestionsOrder.value) {
    case 'NEWEST':
      suggestions.value.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1);
      break;
    case 'OLDEST':
      suggestions.value.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);
      break;
    default:
      suggestions.value.sort((a, b) => {
        if (a.upvotes == b.upvotes) {
          return a.createdAt > b.createdAt ? 1 : -1;
        } else {
          return a.upvotes > b.upvotes ? 1 : -1;
        }
      });
  }
})

if (boardError.value != null || suggestionsError.value != null) {
  console.log("Error");
  // TODO: redirect to 404
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
  route.query["origin"] = route.path;

  await login({
    authorizationParams: {
      redirect_uri: "http://localhost:3000/redirect?origin=" + route.path,
    }
  });
}

const logoutUser = async () => {
  route.query["origin"] = route.path;
  await logout('http://localhost:3000/redirect?origin=' + route.path);
}

const upvote = (suggestionId: String) => {
  if (!isAuthenticated.value) {
    showNotification({
      icon: LogIn,
      message: "Login erforderlich zum upvoten von Beiträgen",
      status: "ERROR",
      type: "BANNER",
      duration: 5000,
    })
    return;
  }
}
</script>