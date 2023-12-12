<template>
  <NuxtLayout name="board">
    <dialog ref="dialog" class="relative backdrop w-full max-w-2xl max-h-[80vh] rounded-md">
      <div class="relative flex items-end h-56 p-12 pb-10 bg-white">
        <button class="outline-none" @click="() => {dialog?.close()}">
          <X class="absolute top-8 right-8 " height="28" stroke-width="1.4"/>
        </button>
        <div class="flex gap-4 items-end">
          <h2 class="font-semibold text-2xl leading-relaxed">{{ suggestion.title }}</h2>
          <button :style="`background-color: ${board.accentColor}`"
                  class="group flex justify-between items-center gap-4 px-4 py-3 text-white rounded hover:opacity-90">
            <span
                class="flex items-center before:w-0 before:h-0 before:mr-1 before:border-b-[10px] before:border-b-white before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:scale-x-50 before:scale-y-75 -translate-x-1">Upvote</span>
            <span class="px-4 py-1 bg-white bg-opacity-30 rounded-full">32</span>
          </button>
        </div>
      </div>
      <div class="p-12 pb-10 bg-slate-100">
        <div>
          <p>{{ suggestion.description }}</p>
          <div class="flex gap-2 mt-2 text-gray-600">
            <span>Author</span>
            <span>·</span>
            <span>{{ getElapsedTimeSinceCreationDate(suggestion.createdAt) }}</span>
          </div>
        </div>
        <div v-if="comments.length > 0" class="mt-8 ml-4 border-l border-gray-300">
          <div v-for="comment in comments" :key="comment.id"
               class="relative pl-8 py-4 before:absolute before:top-7 before:left-0 before:w-4 before:h-px before:bg-gray-300">
            <p>{{ comment.message }}</p>
            <div class="flex gap-2 mt-2 text-gray-600">
              <span>Author</span>
              <span>·</span>
              <span>{{ getElapsedTimeSinceCreationDate(suggestion.createdAt) }}</span>
            </div>
          </div>
        </div>
        <div class="absolute bottom-0 flex gap-4 items-end">
          <textarea class="flex-grow rounded"></textarea>
          <div :style="`background-color: ${board.accentColor}`"
               class="flex items-center justify-center h-12 w-12 rounded p-2">
            <Send class="text-white"/>
          </div>
        </div>
      </div>
    </dialog>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import {Send, X} from 'lucide-vue-next'

const route = useRoute();
const {data: board} = await tado.getBoard(route.params.boardId as String);
const {data: suggestion} = await tado.getSuggestion(route.params.suggestionId as String);
const {data: comments} = await tado.getComments(route.params.suggestionId as String);
const dialog = ref<HTMLDialogElement>();

onMounted(() => {
  dialog.value?.showModal();

  dialog.value?.addEventListener("close", () => {
    navigateTo("/" + route.params.boardId);
  })
})
</script>

<style scoped>
.backdrop::backdrop {
  background-color: rgb(0 0 0 /.8);
}
</style>