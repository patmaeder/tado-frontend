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
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">

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
                  :data-upvoted="upvotes != undefined ? upvotes.includes(suggestion.id) ? 'true' : 'false' : 'false'"
                  :disabled="suggestion.locked"
                  class="group flex justify-between items-center px-4 basis-1/2 text-[var(--clr-accent)] data-[upvoted='true']:text-white disabled:text-gray-600 bg-accent-50 data-[upvoted='true']:bg-[var(--clr-accent)] disabled:bg-gray-200 rounded-tl-md hover:opacity-90"
                  @click.prevent="toggleUpvote(suggestion.id)">
                <span
                    class="flex items-center before:w-0 before:h-0 before:border-transparent before:mr-1 before:border-b-[10px] before:border-b-[var(--clr-accent)] group-data-[upvoted='true']:before:border-b-white group-disabled:before:border-b-gray-500 before:border-l-8 before:border-r-8 before:scale-x-50 before:scale-y-75 -translate-x-1">Upvote</span>
                <span
                    class="px-4 py-1 bg-[var(--clr-accent)] group-data-[upvoted='true']:bg-white group-data-[upvoted='true']:bg-opacity-30 group-disabled:bg-white group-disabled:bg-opacity-50 rounded-full text-white group-disabled:text-gray-500">
                  {{ suggestion.upvoteCount }}
                </span>
              </button>
            </div>
          </NuxtLink>

        </div>
      </main>

      <div class="fixed bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2">
        <NuxtLink
            class="flex items-center p-2 bg-[var(--clr-accent)] rounded-full shadow-md hover:brightness-95 cursor-pointer">
          <Plus class="h-12 w-12 p-2 text-white bg-white bg-opacity-20 rounded-full"/>
          <span class="px-6 text-white text-base md:text-lg font-medium whitespace-nowrap">Vorschlag teilen</span>
        </NuxtLink>
      </div>
      <slot></slot>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import {LogOut, Plus, SortDesc, XCircle} from "lucide-vue-next";
import type {Ref} from "vue";
import {FetchError} from "ofetch";
import type {AsyncDataExecuteOptions} from "#app/composables/asyncData";

const route = useRoute();
const {showNotification} = useToastNotifications();
const {init, user, isAuthenticated, login, logout} = useAuth0();
const {data: board, error: boardError} = await tado.getBoard(route.params.boardId as String);
const {data: suggestions, error: suggestionsError} = await tado.getSuggestions(route.params.boardId as String)
let upvotes: Ref<String[]>, upvotesError: Ref<FetchError<any> | null>,
    refreshUpvotes: (opts?: (AsyncDataExecuteOptions | undefined)) => Promise<String[]>;
const suggestionsOrder = ref('MOST_UPVOTED');


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
  if (isAuthenticated.value) {
    ({data: upvotes, error: upvotesError, refresh: refreshUpvotes} = await tado.getUpvotes());
  }
}

const orderSuggestions = () => {
  switch (suggestionsOrder.value) {
    case 'NEWEST':
      suggestions.value.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);
      break;
    case 'OLDEST':
      suggestions.value.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1);
      break;
    default:
      suggestions.value.sort((a, b) => {
        if (a.upvoteCount == b.upvoteCount) {
          return a.createdAt < b.createdAt ? 1 : -1;
        } else {
          return a.upvoteCount < b.upvoteCount ? 1 : -1;
        }
      });
  }
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

const toggleUpvote = async (suggestionId: String) => {
  if (!isAuthenticated.value) {
    await loginUser();
  }
  upvotes.value.includes(suggestionId) ? unvote(suggestionId) : upvote(suggestionId);
}

const upvote = async (suggestionId: String) => {
  const {error} = await tado.upvoteSuggestion(suggestionId);

  if (error.value != null) {
    showNotification({
      icon: XCircle,
      title: error.value.name,
      message: error.value.message,
      type: "BANNER",
      status: "ERROR",
      duration: 5000
    })
    return;
  }

  await refreshUpvotes();
  const suggestion = suggestions.value.find(suggestion => suggestion.id == suggestionId);
  if (suggestion != undefined) {
    suggestion.upvoteCount++;
    return;
  }

  showNotification({
    icon: XCircle,
    message: "Upvote konnte aufgrund eines unbekannten Fehlers nicht verarbeitet werden",
    type: "BANNER",
    status: "ERROR",
    duration: 5000
  })
}

const unvote = async (suggestionId: String) => {
  const {error} = await tado.unvoteSuggestion(suggestionId);

  if (error.value != null) {
    showNotification({
      icon: XCircle,
      title: error.value.name,
      message: error.value.message,
      type: "BANNER",
      status: "ERROR",
      duration: 5000
    })
    return;
  }

  await refreshUpvotes();
  const suggestion = suggestions.value.find(suggestion => suggestion.id == suggestionId);
  if (suggestion != undefined) {
    suggestion.upvoteCount--;
    return;
  }

  showNotification({
    icon: XCircle,
    message: "Upvote konnte aufgrund eines unbekannten Fehlers nicht verarbeitet werden",
    type: "BANNER",
    status: "ERROR",
    duration: 5000
  })
}

orderSuggestions();
watch(suggestionsOrder, orderSuggestions)
</script>