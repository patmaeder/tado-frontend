<template>
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

    <NuxtLink v-for="suggestion in orderedSuggestions" :key="suggestion.id"
              :to="`/${route.params.boardId}/${suggestion.id}`"
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
</template>

<script lang="ts" setup>
import {SortDesc, XCircle} from "lucide-vue-next";
import type {AsyncDataExecuteOptions} from "#app/composables/asyncData";

const {loginHandler} = defineProps(["loginHandler"])
const route = useRoute();
const {isAuthenticated} = useAuth0();
const {showNotification} = useToastNotifications();
const {data: suggestions, error: suggestionsError} = await tado.getSuggestions(route.params.boardId as String)
let upvotes: Ref<String[]>, refreshUpvotes: (opts?: (AsyncDataExecuteOptions | undefined)) => Promise<String[]>;
const suggestionsOrder = ref('MOST_UPVOTED');

if (isAuthenticated.value) {
  ({data: upvotes, refresh: refreshUpvotes} = await tado.getUpvotes());
}

if (suggestionsError.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
  })
}

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
  if (!isAuthenticated.value) {
    await loginHandler();
  }
  upvotes.value.includes(suggestionId) ? await unvote(suggestionId) : await upvote(suggestionId);
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
</script>