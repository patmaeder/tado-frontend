<template>
  <NuxtLayout name="panel-board-settings">
    <div class="col-span-8 flex flex-col gap-12 p-16 overflow-auto">
      <div class=" p-4 bg-primary-100 text-primary border border-primary-200 rounded">
        <p class="mb-2">Dieses Board ist öffentlich unter folgendem Link zu erreichen:</p>
        <NuxtLink :to="`http://localhost:3000/${ board.id }`" class="underline" target="_blank">http://localhost:3000/{{
            board.id
          }}
        </NuxtLink>
      </div>
      <fieldset class="inline-flex flex-col items-start gap-4">
        <label class="text-xl font-semibold">Board-Id</label>
        <input ref="titleInput" :value="board.id"
               class="min-w-[24rem] py-2 px-4 bg-gray-200 outline-none rounded" readonly type="text">
      </fieldset>
      <fieldset class="inline-flex flex-col items-start gap-4">
        <label class="text-xl font-semibold">Board-Name</label>
        <input ref="titleInput" v-model="title"
               class="min-w-[24rem] py-2 px-4 bg-gray-200 outline-none rounded" type="text">
        <div class="flex gap-1">
          <button :disabled="title.trim() == board.title"
                  class="bg-secondary py-2 px-4 text-white font-light rounded disabled:bg-gray-500"
                  @click="updateTitle">
            Speichern
          </button>
          <button v-if="title.trim() != board.title"
                  class="flex items-center p-2 text-sm font-light hover:text-gray-600" @click="title = board.title">
            <X height="12"/>
            <span>Zurücksetzen</span>
          </button>
        </div>
      </fieldset>
      <fieldset
          class="inline-flex flex-col items-start gap-4 p-4 bg-red-200 text-red-600 border border-red-400 rounded">
        <label class="flex gap-2 items-center text-xl font-semibold">
          <AlertTriangle height="20"/>
          <span>Board löschen</span>
        </label>
        <span>Ein gelöschtes Board kann nicht wieder hergestellt werden. <br/> Alle auf dem Board geteilten Vorschläge und Kommentare werden ebenfalls gelöscht und sind nicht mehr aufrufbar.</span>
        <button class="text-white bg-red-600 py-2 px-4 rounded" @click="deleteBoard">
          Löschen
        </button>
      </fieldset>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import {AlertTriangle, Info, Trash2, X, XCircle} from 'lucide-vue-next'

const route = useRoute();
const {showNotification} = useToastNotifications();
const {data: board, refresh} = await tado.getBoard(route.params.boardId as string);
const title = ref(board.value.title);

const updateTitle = async () => {
  const {error} = await tado.updateBoard(route.params.boardId as string, {title: title.value.trim()});

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

  await refresh();
  showNotification({
    icon: Info,
    message: "Board wurde erfolgreich umbenannt",
    type: "BANNER",
    status: "SUCCESS",
    duration: 5000
  })
}

const deleteBoard = async () => {
  const {error} = await tado.deleteBoard(route.params.boardId as string);

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

  navigateTo("/panel")
  showNotification({
    icon: Trash2,
    message: "Board wurde erfolgreich gelöscht.",
    type: "BANNER",
    status: "SUCCESS",
    duration: 5000
  })
}
</script>