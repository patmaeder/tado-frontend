<template>
  <NuxtLayout name="board">
    <template #header>
      <p>Logo</p>
      <p>Description</p>
    </template>

    <div class="flex justify-end py-6">
      <label class="flex items-center gap-2" for="suggestionsOrder">
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
      <NuxtLink class="bg-white rounded-md overflow-hidden" to="/10">
        <div class="p-8 pb-4">
          <h2 class="mb-2 font-semibold text-lg line-clamp-1">Provide Social Login with Google</h2>
          <p class="font-light line-clamp-3 leading-relaxed">Allow users to create an account or sing in into their
            account using
            their existing
            Google Account.</p>
        </div>
        <div class="flex">
          <div class="px-8 pt-2 pb-6 basis-1/2">
            <span class="text-sm">Author</span>
          </div>
          <button
              class="group flex justify-between items-center px-4 bg-primary hover:bg-primary-400 basis-1/2 text-white rounded-tl-md"
              @click.prevent="upvote('2')">
              <span
                  class="flex items-center before:w-0 before:h-0 before:mr-1 before:border-b-[10px] before:border-b-white before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:scale-x-50 before:scale-y-75 -translate-x-1">Upvote</span>
            <span class="px-4 py-1 bg-primary-400 group-hover:bg-primary-300 rounded-full">32</span>
          </button>
        </div>
      </NuxtLink>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import {SortDesc} from "lucide-vue-next";

const route = useRoute();
const {data: board}: Board = tado.getBoard(route.params.boardId);
const suggestionsOrder = ref('MOST_UPVOTED');

watch(suggestionsOrder, () => {
  switch (suggestionsOrder.value) {
    case 'NEWEST':
      suggestions.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1);
      break;
    case 'OLDEST':
      suggestions.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);
      break;
    default:
      suggestions.sort((a, b) => {
        if (a.upvotes == b.upvotes) {
          return a.createdAt > b.createdAt ? 1 : -1;
        } else {
          return a.upvotes > b.upvotes ? 1 : -1;
        }
      });
  }
})

const upvote = (suggestionId: String) => {
  tado.upvoteSuggestion(route.params.suggestionId as String);
}
</script>