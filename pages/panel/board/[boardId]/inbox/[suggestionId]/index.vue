<template>
  <NuxtLayout name="panel-board-inbox">
    <div class="flex flex-col h-full">

      <div class="flex-shrink-0 flex items-center h-20 pl-4 pr-20 border-b border-gray-300">
        <button class="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-200" @click="deleteSuggestion">
          <Trash2 width="20"/>
          <span>Löschen</span>
        </button>
        <button v-if="suggestion.locked" class="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-200"
                @click="unlockSuggestion">
          <Unlock width="20"/>
          <span>Öffnen</span>
        </button>
        <button v-else
                class="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-200"
                @click="lockSuggestion">
          <Lock width="20"/>
          <span>Schließen</span>
        </button>
        <button class="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-200"
                @click="() => {chooseCategoryDialog?.showModal()}">
          <Bookmark width="20"/>
          <span>Kategorie auswählen</span>
        </button>
      </div>

      <div v-if="suggestion.locked" class="w-full p-2 bg-primary-100 text-primary text-sm">
        <p>Dieser Beitrag wurde geschlossen und kann nicht mehr kommentiert werden.</p>
      </div>

      <div class="flex-grow relative flex flex-col h-full p-10 pr-[7.5rem] bg-white overflow-hidden">
        <div class="flex-shrink-0">
          <div class="flex justify-between items-center">
            <h1 class="text-xl font-medium">{{ suggestion.title }}</h1>
            <span
                class="flex items-center px-4 text-primary bg-primary-100 rounded-full before:w-0 before:h-0 before:border-b-[10px] before:border-b-primary before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:scale-x-75 before:-translate-x-1">{{
                suggestion.upvoteCount
              }}</span>
          </div>
          <div class="flex items-center gap-2 mt-2">
            <span>{{ suggestion.user || 'Anonym' }}</span>
            <span>·</span>
            <span>{{ getElapsedTimeSinceCreationDate(suggestion.createdAt) }}</span>
            <template v-if="suggestion.category.title != '_all'">
              <span>·</span>
              <span :style="`background-color: ${suggestion.category.color}`"
                    class="flex items-center px-2 text-white text-sm rounded">{{ suggestion.category.title }}</span>
            </template>
          </div>
          <p class="max-w-[84%] mt-8 leading-relaxed">{{ suggestion.description }}</p>
        </div>

        <div class="relative flex-grow overflow-hidden isolate
                    before:absolute data-[before=hidden]:before:hidden before:top-0 before:left-0 before:w-full before:h-20 before:bg-gradient-to-b before:from-white before:to-transparent before:z-10
                    after:absolute data-[after=hidden]:after:hidden after:bottom-0 after:left-0 after:w-full after:h-20 after:bg-gradient-to-t after:from-white after:to-transparent after:z-10"
             data-after="true" data-before="hidden">

          <div class="h-full overflow-y-auto" @scroll="handleCommentSectionScroll">
            <div class="relative ml-6 mt-6 pl-6 border-l border-gray-300">
              <div v-for="comment in comments.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1)"
                   class="py-6 before:absolute before:left-0 before:translate-y-3 before:h-px before:w-4 before:bg-gray-300">
                <p class="leading-relaxed max-w-[84%]">{{ comment.message }}</p>
                <div class="flex items-center gap-2 mt-3 text-gray-600">
                  <span
                      :class="comment.userId == board.tenant ? 'bg-primary-100 rounded-full text-primary text-sm px-2 py-1' : ''">{{
                      comment.user || 'Anonym'
                    }}</span>
                  <span>·</span>
                  <span>{{ getElapsedTimeSinceCreationDate(comment.createdAt) }}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="flex-shrink-0 mt-8">
          <form class="flex items-end gap-4" @submit.prevent="comment">
            <div class="flex-grow grid grid-cols-1 grid-rows-1">
              <div class="invisible p-3 row-start-1 row-span-1 col-start-1 col-span-1">{{ commentary }}</div>
              <textarea v-model="commentary"
                        :class="`p-3 row-start-1 row-span-1 col-start-1 col-span-1 bg-gray-100 dark:bg-neutral-800 ${commentaryError ? 'border border-red-600' : ''} rounded disabled:placeholder-gray-300 outline-none`"
                        :disabled="suggestion.locked"
                        placeholder="Kommentieren..."
                        rows="1"></textarea>
            </div>
            <button
                :disabled="suggestion?.locked"
                class="flex-shrink-0 flex justify-center items-center h-12 w-12 rounded bg-primary hover:bg-primary-400 disabled:bg-primary-200 disabled:hover:bg-primary-200"
                type="submit">
              <Send class="stroke-white" width="20"/>
            </button>
          </form>
        </div>
      </div>
    </div>
    <dialog ref="chooseCategoryDialog" class="w-96 p-8 rounded-md bg-white">
      <fieldset>
        <div class="max-h-96 w-full flex flex-col gap-4 overflow-y-scroll">
          <label class="flex items-center gap-4 pb-4 border-b border-gray-200" for="chooseCategoryDialog_null">
            <input id="chooseCategoryDialog_null"
                   v-model="selectedCategory"
                   :value="categories.find(x => x.title == '_all').id"
                   class="peer appearance-none" name="chooseCategoryDialog" type="radio">
            <span
                class="inline-block w-[10px] h-[10px] border-2 border-white peer-checked:bg-gray-600 rounded-full outline outline-2 outline-gray-600"></span>
            <span>Keine Kategorie</span>
          </label>
          <label v-for="category of categories.filter(x => x.title != '_all')" :key="category.id"
                 :for="`chooseCategoryDialog_${category.id}`"
                 class="flex items-center gap-4">
            <input :id="`chooseCategoryDialog_${category.id}`" :checked="selectedCategory == category.id"
                   class="peer appearance-none"
                   name="chooseCategoryDialog" type="radio" @click="() => {selectedCategory = category.id}">
            <span
                class="inline-block w-[10px] h-[10px] border-2 border-white peer-checked:bg-gray-600 rounded-full outline outline-2 outline-gray-600"></span>
            <span>{{ category.title }}</span>
          </label>
        </div>
        <div class="flex gap-4 mt-6">
          <button
              class="basis-1/2 flex items-center justify-center py-2 bg-primary-100 disabled:bg-gray-200 text-primary disabled:text-gray-600 rounded"
              @click="chooseCategory">
            <Save height="16"/>
            <span>Speichern</span>
          </button>
          <button class="basis-1/2 flex items-center justify-center py-2 bg-gray-100 text-gray-600 rounded"
                  @click="chooseCategoryDialog?.close()">
            <XCircle height="16"/>
            <span>Abbrechen</span>
          </button>
        </div>
      </fieldset>
    </dialog>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import {Bookmark, CheckCircle, Lock, MessageSquare, Save, Send, Trash2, Unlock, XCircle} from "lucide-vue-next";

const route = useRoute();
const {user} = useAuth0();
const {showNotification} = useToastNotifications();
const {data: board} = await tado.getBoard(route.params.boardId as string);
const {refresh: refreshSuggestions} = await tado.getSuggestions(route.params.boardId as string);
const {data: suggestion, refresh: refreshSuggestion} = await tado.getSuggestion(route.params.suggestionId as string);
const {data: comments, refresh: refreshComments} = await tado.getComments(route.params.suggestionId as string);
const {data: categories} = await tado.getCategories(route.params.boardId as string);
const commentary = ref();
const commentaryError = ref(false);
const selectedCategory = ref<String>(suggestion.value.category.id);
const chooseCategoryDialog = ref<HTMLDialogElement>();

onMounted(async () => {
  if (suggestion.value.unread)
    await tado.updateSuggestion(route.params.suggestionId as string, {unread: false});
})

const handleCommentSectionScroll = (event) => {
  const parentNode = event.target.parentNode;
  const scrollTop = event.target.scrollTop;
  const scrollHeight = event.target.scrollHeight;
  const clientHeight = event.target.getBoundingClientRect().height;

  parentNode.setAttribute("data-before", scrollTop < 10 ? "hidden" : "visible");
  parentNode.setAttribute("data-after", scrollHeight - clientHeight - scrollTop < 10 ? "hidden" : "visible");
}

const deleteSuggestion = async () => {
  const {error} = await tado.deleteSuggestion(route.params.suggestionId as string);

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

  await refreshSuggestions();
  navigateTo(`/panel/board/${ route.params.boardId }/inbox`);

  showNotification({
    icon: Trash2,
    message: "Beitrag wurde erfolgreich gelöschen.",
    type: "BANNER",
    status: "SUCCESS",
    duration: 5000
  })
}

const lockSuggestion = async () => {
  const {error} = await tado.updateSuggestion(route.params.suggestionId as string, {locked: true});

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

  await refreshSuggestion();
  showNotification({
    icon: Lock,
    message: "Beitrag wurde erfolgreich geschlossen.",
    type: "BANNER",
    status: "SUCCESS",
    duration: 5000
  })
}

const unlockSuggestion = async () => {
  const {error} = await tado.updateSuggestion(route.params.suggestionId as string, {locked: false});

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

  await refreshSuggestion();
  showNotification({
    icon: Unlock,
    message: "Beitrag wurde erfolgreich geöffnet.",
    type: "BANNER",
    status: "SUCCESS",
    duration: 5000
  })
}

const chooseCategory = async () => {
  const {error} = await tado.updateSuggestion(route.params.suggestionId as string, {
    category: {
      id: selectedCategory.value
    }
  });

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

  chooseCategoryDialog.value?.close();
  const {refresh: refreshSuggestions} = await tado.getSuggestions(route.params.boardId as String);
  await refreshSuggestion();
  await refreshSuggestions();

  showNotification({
    icon: CheckCircle,
    message: "Kategorie wurde erfolgreich geändert.",
    type: "BANNER",
    status: "SUCCESS",
    duration: 5000
  })
}

const comment = async () => {

  if (!(commentary.value.trim().length < 1 || commentary.value.trim().length > 600)) {
    commentaryError.value = true;
    return;
  }

  const {error} = await tado.createComment({
    message: commentary.value,
    suggestion: {
      id: route.params.suggestionId as String
    },
    user: board.value.title,
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
dialog::backdrop {
  background-color: rgb(0 0 0 / .8);
}
</style>