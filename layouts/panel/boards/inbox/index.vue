<template>
  <NuxtLayout name="panel-boards">
    <div class="w-full h-full grid grid-cols-12">

      <KeepAlive>
        <div class="col-span-5 grid grid-cols-5 pl-20">

          <!-- Category Filter -->
          <div class="max-h-full col-span-2 overflow-hidden">
            <div class="flex flex-col gap-4 max-h-full py-12 pr-8">
              <div class="flex-1 overflow-auto">
                <fieldset>
                  <legend hidden>Beiträge nach Kategorie filtern</legend>
                  <button
                      id="category_all"
                      :data-active="activeCategory == null ? 'true' : 'false'"
                      class="w-full min-h-[3rem] px-4 py-2 flex items-center rounded text-sm data-[active='true']:font-medium data-[active='true']:bg-gray-200"
                      @click="() => { activeCategory = null }">
                    <span>Alle</span>
                  </button>
                </fieldset>
              </div>
              <button
                  class="flex-shrink-0 h-12 flex gap-2 items-center justify-center rounded text-sm text-white bg-secondary">
                <span>Kategorie hinzufügen</span>
                <Plus width="18"/>
              </button>
            </div>
          </div>

          <!-- Suggestions query and order -->
          <div class="max-h-full col-span-3 border-x border-gray-300 overflow-hidden">
            <div class="h-20 p-4 flex justify-between items-center border-b border-gray-300">
              <label class="flex-1 flex" for="suggestionsQuery">
                <Search height="20"/>
                <input id="suggestionsQuery"
                       v-model="suggestionsQuery"
                       class="w-full pl-2 bg-transparent text-ellipsis focus:outline-none"
                       name="searchQuery"
                       placeholder="Suchen..."
                       type="text"/>
              </label>
              <label class="flex" for="suggestionsOrder">
                <select id="suggestionsOrder" v-model="suggestionsOrder"
                        class="appearance-none mr-2 direction-rtl outline-none bg-transparent"
                        name="suggestionsOrder">
                  <option selected value="UNREAD">Ungelesene</option>
                  <option value="MOST_UPVOTED">Meißt upgevoted</option>
                  <option value="NEWEST">Neueste</option>
                  <option value="OLDEST">Älteste</option>
                </select>
                <SortDesc width="20"/>
              </label>
            </div>

            <!-- Suggestion List -->
            <ul v-if="suggestions.length > 0">
              <li v-for="suggestion in visibleSuggestions" :key="suggestion.id"
                  :data-active="route.params.suggestionId == suggestion.id"
                  class="flex border-b border-gray-300 data-[active=true]:bg-white">
                <NuxtLink :to="`/panel/board/${route.params.boardId}/inbox/${suggestion.id}`" class="flex w-full p-4">
                  <div class="flex-grow flex flex-col gap-2 pr-2 font-medium">
                    <h4 class="line-clamp-2 overflow-ellipsis">{{ suggestion.title }}</h4>
                    <div class="flex gap-2 text-sm font-normal">
                      <span>Author</span>
                      <span>·</span>
                      <span>{{ getElapsedTimeSinceCreationDate(suggestion.createdAt) }}</span>
                    </div>
                  </div>
                  <div class="flex items-center">
                <span
                    class="flex items-center pr-4 pl-2 text-primary bg-primary-200 rounded-full before:w-0 before:h-0 before:border-b-[10px] before:border-b-primary before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:scale-x-50 before:scale-y-75 -translate-x-1">32</span>
                  </div>
                </NuxtLink>
              </li>
            </ul>

            <div v-else class="w-full p-6 flex flex-col items-center text-center">
              <img alt='Illustration von zwei Personen mit Fragezeichen über dem Kopf'
                   src="/questions-amico.svg"
                   width="120"/>
              <p class="mb-8 font-medium">Bisher wurden noch keine Vorschläge geteilt.</p>
              <p class="flex flex-col gap-2 text-gray-600 text-center text-sm">
                <span>Nutzer können über folgenden Link öffentlich Vorschläge teilen:</span>
                <a :href="`http://localhost:3000/${route.params.boardId}`" class="underline">http://localhost:3000/{{
                    route.params.boardId
                  }}</a>
              </p>
            </div>
          </div>

        </div>
      </KeepAlive>

      <!-- Suggestion Viewer -->
      <div class="max-h-full col-span-7 overflow-hidden">
        <slot></slot>
      </div>

    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import {Plus, Search, SortDesc} from "lucide-vue-next";
import {getElapsedTimeSinceCreationDate} from "~/utils/dateUtils";

const route = useRoute();
const activeCategory = useState("inbox:activeCategory", () => null);
const suggestionsQuery = useState("inbox:suggestionsQuery", () => '');
const suggestionsOrder = useState("inbox:suggestionsOrder", () => 'UNREAD');
const {data: suggestions} = await tado.getSuggestions(route.params.boardId);

const visibleSuggestions = computed(() => {
  let temp;

  if (activeCategory.value != null) {
    temp = suggestions.value.filter(suggestion => suggestion.category.id == activeCategory.value)
  } else {
    temp = suggestions.value;
  }

  if (suggestionsQuery.value != '') {
    temp = temp.filter(({title, description}) =>
        title.toLowerCase().includes(suggestionsQuery.value.toLowerCase()) || description.toLowerCase().includes(suggestionsQuery.value.toLowerCase()));
  }

  switch (suggestionsOrder.value) {
    case 'NEWEST':
      temp.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1);
      break;
    case 'OLDEST':
      temp.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);
      break;
    case 'MOST_UPVOTED':
      temp.sort((a, b) => {
        if (a.upvotes == b.upvotes) {
          return a.createdAt > b.createdAt ? 1 : -1;
        } else {
          return a.upvotes ? 1 : -1;
        }
      })
      break;
    default:
      temp.sort((a, b) => {
        if (a.unread == b.unread) {
          return a.createdAt > b.createdAt ? 1 : -1;
        } else {
          return a.unread ? 1 : -1;
        }
      });
  }

  return temp;
})
</script>