<template>
  <NuxtLayout name="board">
    <dialog ref="dialog"
            class="backdrop w-full flex justify-center px-4 bg-transparent overflow-hidden">
      <div
          class="flex flex-col w-full max-w-2xl h-[90vh] sm:h-[70vh] bg-slate-100 dark:bg-neutral-900 dark:text-white rounded-md overflow-hidden">
        <div class="relative h-44 flex items-end p-6 sm:p-12 sm:pb-10 bg-white dark:bg-neutral-950">
          <button class="outline-none" @click="() => {dialog?.close()}">
            <X class="absolute top-8 right-8 " height="28" stroke-width="1.4"/>
          </button>
          <div>
            <h2 class="font-semibold text-lg sm:text-2xl leading-relaxed break-words">Neuen Vorschlag teilen</h2>
          </div>
        </div>
        <div class="flex-grow flex flex-col gap-8 p-6 sm:p-12 sm:pb-10 overflow-hidden">
          <form class="h-full flex flex-col gap-4" @submit.prevent="submitNewSuggestion">
            <div>
              <label class="w-full" for="suggestions_title">
              <span class="flex justify-between mb-2">
                <span>Titel</span>
                <span :class="`text-sm ${title.length > 120 ? 'text-red-600' : 'text-gray-600'}`">{{
                    title.length
                  }}/120</span>
              </span>
                <input id="suggestions_title" v-model="title"
                       :class="`w-full h-12 px-4 dark:bg-neutral-800 rounded-md outline-none ${titleError != '' ? 'border border-red-600' : ''}`"
                       type="text"/>
              </label>
              <span v-if="titleError != ''" class="mt-2 text-red-600 text-sm">{{ titleError }}</span>
            </div>
            <div class="flex-grow flex flex-col">
              <label class="w-full flex-grow flex flex-col">
                <span class="inline-block mb-2">Beschreibung</span>
                <textarea v-model="description"
                          :class="`flex-grow w-full p-4 dark:bg-neutral-800 rounded-md outline-none ${descriptionError != '' ? 'border border-red-600' : ''}`"></textarea>
              </label>
              <span v-if="descriptionError != ''" class="mt-2 text-red-600 text-sm">{{ descriptionError }}</span>
            </div>
            <button class="w-full mt-2 py-3 bg-accent text-white font-semibold rounded-md" type="submit">
              Erstellen
            </button>
          </form>
        </div>
      </div>
    </dialog>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import {X, XCircle} from 'lucide-vue-next'

const route = useRoute();
const router = useRouter();
const {showNotification} = useToastNotifications();
const {isAuthenticated, user} = useAuth0();

const {data: board} = await tado.getBoard(route.params.boardId as String);
const dialog = ref<HTMLDialogElement>();
const title = ref("");
const titleError = ref("");
const description = ref("");
const descriptionError = ref("");

if (!isAuthenticated.value) {
  navigateTo("/" + board.value.id)
}

onMounted(async () => {
  dialog.value?.showModal();

  dialog.value?.addEventListener("close", (event) => {
    event.preventDefault();
    navigateTo("/board/" + route.params.boardId);
  })
})

const submitNewSuggestion = async () => {
  if (title.value.trim().length < 1 || title.value.trim().length >= 120) {
    titleError.value = "Titel muss zwischen 1 und 120 Zeichen lang sein.";
    return;
  }

  if (description.value.trim().length < 1 || description.value.trim().length >= 600) {
    descriptionError.value = "Beschreibung muss zwischen 1 und 600 Zeichen lang sein.";
    return;
  }

  const {data, error} = await tado.createSuggestion({
    title: title.value,
    description: description.value,
    user: user.value.nickname || user.value.email,
    board: {
      id: board.value.id
    }
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

  navigateTo(`/board/${ board.value.id }/suggestion/${ data.value.id }`);
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