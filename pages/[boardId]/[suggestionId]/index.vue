<template>
  <NuxtLayout name="board">
    <dialog ref="dialog" class="backdrop rounded-md overflow-hidden">
      <div class="relative flex flex-col  w-full max-w-2xl h-[80vh]">
        <div class="relative h-56 flex items-end p-12 pb-10 bg-white">
          <button class="outline-none" @click="() => {dialog?.close()}">
            <X class="absolute top-8 right-8 " height="28" stroke-width="1.4"/>
          </button>
          <div class="flex gap-6 items-end">
            <h2 class="font-semibold text-2xl leading-relaxed break-words">{{ suggestion.title }}</h2>
            <button :style="`background-color: ${board.accentColor}`"
                    class="group flex justify-between items-center gap-4 px-4 py-3 text-white rounded hover:opacity-90">
            <span
                class="flex items-center before:w-0 before:h-0 before:mr-1 before:border-b-[10px] before:border-b-white before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:scale-x-50 before:scale-y-75 -translate-x-1">Upvote</span>
              <span class="px-4 py-1 bg-white bg-opacity-30 rounded-full">32</span>
            </button>
          </div>
        </div>
        <div class="flex-grow flex flex-col gap-8 p-12 pb-10 bg-slate-100 overflow-hidden">
          <div class="flex-shrink-0">
            <p>{{ suggestion.description }}</p>
            <div class="flex gap-2 mt-2 text-gray-600">
              <span>Author</span>
              <span>·</span>
              <span>{{ getElapsedTimeSinceCreationDate(suggestion.createdAt) }}</span>
            </div>
          </div>
          <div class="flex-grow min-h-0 overflow-y-auto">
            <div v-if="comments.length > 0" class="ml-4 border-l border-gray-300">
              <div v-for="comment in comments" :key="comment.id"
                   class="relative pl-8 py-4 before:absolute before:top-7 before:left-0 before:w-4 before:h-px before:bg-gray-300">
                <p>{{ comment.message }}</p>
                <div class="flex gap-2 mt-2 text-gray-600">
                  <span>{{ comment.user }}</span>
                  <span>·</span>
                  <span>{{ getElapsedTimeSinceCreationDate(suggestion.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex-shrink min-h-[42px] overflow-hidden">
            <div v-if="suggestion.locked || !isAuthenticated" :style="`color: ${board.accentColor}`"
                 class="flex gap-2 items-center font-medium">
              <Info height="20"/>
              <p v-if="suggestion.locked" class="italic">Dieser
                Beitrag wurde für
                Kommentare
                geschlossen</p>
              <p v-else-if="!isAuthenticated">Melden Sie sich an, um Beitrage kommentieren zu können</p>
            </div>
            <form v-else class="flex gap-4 items-end max-h-full" @submit.prevent="comment">
              <div class="flex-grow grid grid-cols-1 grid-rows-1">
                <div class="invisible p-3 row-start-1 row-span-1 col-start-1 col-span-1">{{ commentary }}</div>
                <textarea v-model="commentary" :disabled="suggestion.locked || !isAuthenticated"
                          class="p-3 row-start-1 row-span-1 col-start-1 col-span-1 bg-gray-50 rounded disabled:placeholder-gray-300"
                          placeholder="Kommentieren..."
                          rows="1"></textarea>
              </div>
              <button :disabled="suggestion.locked || !isAuthenticated"
                      :style="`background-color: ${ suggestion.locked || !isAuthenticated ? '' : board.accentColor}`"
                      class="flex items-center justify-center h-12 w-12 rounded p-2 disabled:bg-gray-200 disabled:hover:bg-gray-200">
                <Send class="text-white"/>
              </button>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import {Info, MessageSquare, Send, X, XCircle} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const {showNotification} = useToastNotifications();
const {user, isAuthenticated} = useAuth0();

const {data: board} = await tado.getBoard(route.params.boardId as String);
const {data: suggestion} = await tado.getSuggestion(route.params.suggestionId as String);
const {data: comments, refresh: refreshComments} = await tado.getComments(route.params.suggestionId as String);
const commentary = ref("")
const dialog = ref<HTMLDialogElement>();

onMounted(() => {
  dialog.value?.showModal();

  dialog.value?.addEventListener("close", (event) => {
    event.preventDefault();
    if (router.getRoutes().length > 0) {
      router.back()
    } else {
      navigateTo("/" + route.params.boardId);
    }
  })
})

const comment = async () => {

  console.log("here")

  // TODO: Don't rerender entire comment tree when posting new comment

  if (!(commentary.value.trim().length > 0)) {
    // TODO: Error anzeigen
    return;
  }

  const {error} = await tado.createComment({
    message: commentary.value,
    user: user.value.nickname as string,
    suggestion: {
      id: route.params.suggestionId as String
    },
  })

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
.backdrop::backdrop {
  background-color: rgb(0 0 0 /.8);
}
</style>