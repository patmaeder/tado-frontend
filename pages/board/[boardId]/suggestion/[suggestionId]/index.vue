<template>
  <NuxtLayout name="board">
    <dialog ref="dialog"
            class="backdrop w-full flex justify-center px-4 bg-transparent overflow-hidden">
      <div
          class="flex flex-col w-full max-w-2xl h-[90vh] sm:h-[70vh] bg-slate-100 dark:bg-neutral-900 dark:text-white rounded-md overflow-hidden">
        <div class="relative h-48 sm:h-56 flex items-end p-6 sm:p-12 sm:pb-10 bg-white dark:bg-neutral-950">
          <button class="outline-none" @click="() => {dialog?.close()}">
            <X class="absolute top-8 right-8 " height="28" stroke-width="1.4"/>
          </button>
          <div class="w-full flex justify-between gap-2 sm:gap-6 items-end">
            <h2 class="font-semibold text-lg sm:text-2xl leading-relaxed break-words">{{ suggestion.title }}</h2>
            <button :data-upvoted="upvotes != undefined ? upvotes.includes(suggestion.id) : false"
                    :disabled="suggestion.locked"
                    class="group flex justify-between items-center gap-2 sm:gap-4 px-2 sm:px-4 py-2 sm:py-3 text-accent data-[upvoted='true']:text-white disabled:text-gray-600 bg-accent-50 data-[upvoted='true']:bg-accent disabled:bg-gray-200 rounded hover:opacity-90"
                    @click.prevent="toggleUpvote(suggestion.id)">
              <span
                  class="flex items-center before:hidden sm:before:block before:w-0 before:h-0 before:border-l-transparent before:border-r-transparent before:mr-1 before:border-b-[10px] before:border-b-accent group-data-[upvoted='true']:before:border-b-white group-disabled:before:border-b-gray-500 before:border-l-8 before:border-r-8 before:scale-x-50 before:scale-y-75 sm:-translate-x-1">Upvote</span>
              <span
                  class="px-4 py-1 bg-accent group-data-[upvoted='true']:bg-white group-data-[upvoted='true']:bg-opacity-30 group-disabled:bg-white group-disabled:bg-opacity-50 rounded-full text-sm sm:text-base text-white group-disabled:text-gray-500">
                  {{ suggestion.upvoteCount }}
                </span>
            </button>
          </div>
        </div>
        <div class="flex-grow flex flex-col gap-8 p-6 sm:p-12 sm:pb-10 overflow-hidden">
          <div class="flex-shrink-0">
            <p>{{ suggestion.description }}</p>
            <div class="flex gap-2 mt-2 text-sm sm:text-base text-gray-600">
              <span>{{ suggestion.user || 'Anonym' }}</span>
              <span>·</span>
              <span>{{ getElapsedTimeSinceCreationDate(suggestion.createdAt) }}</span>
            </div>
          </div>
          <div class="flex-grow min-h-0 overflow-y-auto">
            <div v-if="comments.length > 0" class="ml-2 sm:ml-4 border-l border-gray-300 dark:border-gray-700">
              <div v-for="comment in comments" :key="comment.id"
                   class="relative pl-8 py-4 before:absolute before:top-7 before:left-0 before:w-4 before:h-px before:bg-gray-300 dark:before:bg-gray-700">
                <p>{{ comment.message }}</p>
                <div class="flex items-center gap-2 mt-2 text-sm sm:text-base text-gray-600">
                  <span
                      :class="comment.userId == board.tenant ? ' text-accent bg-accent-20 px-2 py-1 text-sm rounded-full' : ''">{{
                      comment.user || 'Anonym'
                    }}</span>
                  <span>·</span>
                  <span>{{ getElapsedTimeSinceCreationDate(comment.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
          <client-only>
            <div class="flex-shrink min-h-[42px] overflow-hidden">
              <div v-if="suggestion.locked || !isAuthenticated" :style="`color: ${board.accentColor}`"
                   class="flex gap-3 items-center text-sm sm:text-base font-normal sm:font-medium leading-tight">
                <Info height="20"/>
                <p v-if="suggestion.locked" class="italic">Dieser Beitrag wurde für Kommentare geschlossen</p>
                <p v-else-if="!isAuthenticated">Melden Sie sich an, um Beiträge kommentieren zu können</p>
              </div>
              <form v-else class="flex gap-4 items-end max-h-full" @submit.prevent="comment">
                <div class="flex-grow grid grid-cols-1 grid-rows-1">
                  <div class="invisible p-3 row-start-1 row-span-1 col-start-1 col-span-1">{{ commentary }}</div>
                  <textarea v-model="commentary" :class="`p-3 row-start-1 row-span-1 col-start-1 col-span-1 bg-gray-50 dark:bg-neutral-800 ${commentaryError ? 'border border-red-600' : ''} rounded disabled:placeholder-gray-300 outline-none`"
                            :disabled="suggestion.locked || !isAuthenticated"
                            placeholder="Kommentieren..."
                            rows="1"></textarea>
                </div>
                <button :disabled="suggestion.locked || !isAuthenticated"
                        :style="`background-color: ${ suggestion.locked || !isAuthenticated ? '' : board.accentColor}`"
                        class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded p-2 disabled:bg-gray-200 disabled:hover:bg-gray-200">
                  <Send class="text-white"/>
                </button>
              </form>
            </div>
          </client-only>
        </div>
      </div>
    </dialog>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import {Info, MessageSquare, Send, X, XCircle} from 'lucide-vue-next'

const route = useRoute();
const {showNotification} = useToastNotifications();
const {user, isAuthenticated, login} = useAuth0();

const {data: board} = await tado.getBoard(route.params.boardId as String);
const {refresh: refreshSuggestions} = await tado.getSuggestions(route.params.boardId as String);
const {data: suggestion} = await tado.getSuggestion(route.params.suggestionId as String);
const {data: comments, refresh: refreshComments} = await tado.getComments(route.params.suggestionId as String);
const {data: upvotes, refresh: refreshUpvotes} = await tado.getUpvotes();
const commentary = ref("");
const commentaryError = ref(false);
const dialog = ref<HTMLDialogElement>();

onMounted(async () => {
  dialog.value?.showModal();

  dialog.value?.addEventListener("close", (event) => {
    event.preventDefault();
    navigateTo("/board/" + route.params.boardId);
  })

  if (isAuthenticated.value) await refreshUpvotes();
})

const toggleUpvote = async (suggestionId: String) => {
  upvotes.value.includes(suggestionId) ? await unvote(suggestionId) : await upvote(suggestionId);
  if (!isAuthenticated.value) await login(route.fullPath, "/board?board=" + route.params.boardId)
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
  suggestion.value.upvoteCount++;
  refreshSuggestions();
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
  suggestion.value.upvoteCount--;
  refreshSuggestions();
}

const comment = async () => {
  if (commentary.value.trim().length < 1 || commentary.value.trim().length > 600) {
    commentaryError.value = true;
    return;
  }

  const {error} = await tado.createComment({
    message: commentary.value,
    user: user.value.nickname as string,
    suggestion: {
      id: route.params.suggestionId as String
    },
  })

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

  commentary.value = "";
  await refreshComments();
  showNotification({
    icon: MessageSquare,
    message: "Kommentar erfolgreich geteilt.",
    type: "BANNER",
    status: "SUCCESS",
    duration: 5000
  })
}
</script>

<style scoped>
dialog:not([open]) {
  display: none;
}

.backdrop::backdrop {
  background-color: rgb(0 0 0 /.8);
}

.dark .backdrop::backdrop {
  background-color: rgb(0 0 0 /.9);
}
</style>