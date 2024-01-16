<template>
  <NuxtLayout name="board-blank">
    <div :class="board.appearance == 'DARK' ? 'dark' : ''">
      <div :style="`--clr-accent: ${board.accentColor}`"
           class="min-h-screen bg-slate-100 dark:bg-neutral-900 dark:text-white overflow-y-auto">
        <header class="w-full bg-white dark:bg-neutral-950">
          <div class="w-full flex justify-end p-6">
            <ClientOnly>
              <div v-if="isAuthenticated" class="flex items center">
                <span>{{ user?.nickname }}</span>
                <button class="ml-3 pl-2 border-l border-gray-300"
                        @click="() => {logout('/board?board=' + route.params.boardId)}">
                  <LogOut height="16"/>
                </button>
              </div>
              <button v-else class="font-medium"
                      @click="() => {login(route.fullPath, '/board?board=' + route.params.boardId)}">Einloggen
              </button>
            </ClientOnly>
          </div>
          <div class="px-12 sm:px-16 md:px-28 xl:px-72 pb-12 sm:pb-16">
            <img :alt="board.title + ' Logo'" :src="board.logo" class="h-16 mb-6">
            <p class="w-full md:w-2/3 leading-relaxed">{{ board.description }}</p>
          </div>
        </header>

        <KeepAlive>
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

            <div v-if="suggestions.length == 0" class="flex flex-col items-center gap-2 opacity-40">
              <p>Bisher wurden noch keine Beiträge geteilt.</p>
              <p v-if="!isAuthenticated">Melden Sie sich an um einen Beitrag zu teilen.</p>
            </div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">

              <NuxtLink v-for="suggestion in orderedSuggestions" :key="suggestion.id"
                        :to="`/board/${route.params.boardId}/suggestion/${suggestion.id}`"
                        class="flex flex-col bg-white text-black rounded-md overflow-hidden">
                <div class="flex-grow p-8 pb-4">
                  <h2 class="mb-2 lg:mb-4 font-medium text-md lg:text-lg line-clamp-2">{{ suggestion.title }}</h2>
                  <p class="font-light text-sm sm:text-base line-clamp-2 leading-relaxed">{{
                      suggestion.description
                    }}</p>
                </div>
                <div class="flex">
                  <div class="px-8 pt-2 pb-6 basis-1/2">
                    <span class="text-sm">{{ suggestion.user || 'Anonym' }}</span>
                  </div>
                  <button
                      :data-upvoted="upvotes != undefined ? upvotes.includes(suggestion.id) : false"
                      :disabled="suggestion.locked"
                      class="group flex justify-between items-center px-4 basis-1/2 text-accent data-[upvoted='true']:text-white disabled:text-gray-600 bg-accent-50 data-[upvoted='true']:bg-accent disabled:bg-gray-200 rounded-tl-md hover:opacity-90"
                      @click.prevent="toggleUpvote(suggestion.id)">
                <span
                    class="flex items-center before:w-0 before:h-0 before:border-l-transparent before:border-r-transparent before:mr-1 before:border-b-[10px] before:border-b-accent group-data-[upvoted='true']:before:border-b-white group-disabled:before:border-b-gray-500 before:border-l-8 before:border-r-8 before:scale-x-50 before:scale-y-75 -translate-x-1">Upvote</span>
                    <span
                        class="px-4 py-1 bg-accent group-data-[upvoted='true']:bg-white group-data-[upvoted='true']:bg-opacity-30 group-disabled:bg-white group-disabled:bg-opacity-50 rounded-full text-white group-disabled:text-gray-500">
                  {{ suggestion.upvoteCount }}
                </span>
                  </button>
                </div>
              </NuxtLink>

            </div>
          </main>
        </KeepAlive>

        <client-only>
          <div v-if="isAuthenticated" class="fixed bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2">
            <NuxtLink :to="`/board/${route.params.boardId}/new`"
                      class="flex items-center p-2 bg-accent rounded-full shadow-md hover:brightness-95 cursor-pointer">
              <Plus class="h-12 w-12 p-2 text-white bg-white bg-opacity-20 rounded-full"/>
              <span class="px-6 text-white text-base md:text-lg font-medium whitespace-nowrap">Vorschlag teilen</span>
            </NuxtLink>
          </div>
        </client-only>
        <slot></slot>
      </div>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import {LogOut, Plus, SortDesc, XCircle} from "lucide-vue-next";

const route = useRoute();
const {user, isAuthenticated, login, logout} = useAuth0();
const {showNotification} = useToastNotifications();
const {data: board, error: boardError} = await tado.getBoard(route.params.boardId as String);
const {data: suggestions, error: suggestionsError} = await tado.getSuggestions(route.params.boardId as String)
const {data: upvotes, refresh: refreshUpvotes} = await tado.getUpvotes();
const suggestionsOrder = ref('MOST_UPVOTED');

if (boardError.value || suggestionsError.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Seite nicht gefunden',
    fatal: true
  })
}

onMounted(async () => {
  if (isAuthenticated.value) await refreshUpvotes();
})

const orderedSuggestions = computed(() => {
  let ordered: Suggestion[] = suggestions.value;
  switch (suggestionsOrder.value) {
    case 'NEWEST':
      ordered.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);
      break;
    case 'OLDEST':
      ordered.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1);
      break;
    default:
      ordered.sort((a, b) => {
        if (a.upvoteCount == b.upvoteCount) {
          return a.createdAt < b.createdAt ? 1 : -1;
        } else {
          return a.upvoteCount < b.upvoteCount ? 1 : -1;
        }
      });
  }

  return ordered;
})

const toggleUpvote = async (suggestionId: String) => {
  if (!isAuthenticated.value) await login(route.fullPath, "/board?board=" + route.params.boardId)
  upvotes.value.includes(suggestionId) ? await unvote(suggestionId) : await upvote(suggestionId);
}

const upvote = async (suggestionId: String) => {
  const {error} = await tado.upvoteSuggestion(suggestionId);

  if (error.value) {
    showNotification({
      icon: XCircle,
      title: error.value.data.error,
      message: error.value.data.message,
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

  if (error.value) {
    showNotification({
      icon: XCircle,
      title: error.value.data.error,
      message: error.value.data.message,
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
</script>