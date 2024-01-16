<template>
  <NuxtLayout name="panel-board">
    <div class="w-full h-full grid grid-cols-12">

      <KeepAlive>
        <div class="col-span-5 grid grid-cols-5 pl-20 overflow-hidden">

          <!-- Category Filter -->
          <div class="max-h-full col-span-2 overflow-hidden">
            <div class="flex flex-col gap-4 max-h-full py-12 pr-8">
              <div class="flex-1 overflow-auto">
                <div class="flex flex-col">
                  <legend hidden>Beiträge nach Kategorie filtern</legend>
                  <button
                      id="category_all"
                      :data-active="activeCategory == null ? 'true' : 'false'"
                      class="w-full min-h-[3rem] px-4 py-2 flex items-center rounded text-sm data-[active='true']:font-medium data-[active='true']:bg-gray-200"
                      @click="() => { activeCategory = null }">
                    <span class="text-base">Alle</span>
                  </button>
                  <button
                      v-for="category in categories.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1).filter(x => x.title != '_all')"
                      :id="`category_${category.id}`"
                      :key="category.id"
                      :data-active="activeCategory == category.id ? 'true' : 'false'"
                      class="w-full min-h-[3rem] px-4 py-2 flex items-center rounded text-sm data-[active='true']:font-medium data-[active='true']:bg-gray-200"
                      @click="() => { activeCategory = category.id }">
                    <span :style="`border-color: ${category.color}`"
                          class="inline-block flex-shrink-0 w-[10px] h-[10px] border-[3px] box-border rounded-full mr-2"></span>
                    <span class="text-left">{{ category.title }}</span>
                  </button>
                </div>
              </div>
              <NuxtLink :to="`/panel/board/${route.params.boardId}/settings/categories`"
                        class="flex-shrink-0 h-12 flex gap-2 items-center justify-center rounded text-sm text-white
                bg-secondary">
                <span>Kategorie hinzufügen</span>
                <Plus width="18"/>
              </NuxtLink>
            </div>
          </div>

          <!-- Suggestions query and order -->
          <div class="max-h-full col-span-3 flex flex-col border-x border-gray-300 overflow-hidden">
            <div class="flex-shrink-0 h-20 p-4 flex justify-between items-center border-b border-gray-300">
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
            <div class="flex-grow overflow-auto">
              <ul v-if="visibleSuggestions.length > 0">
                <li v-for="suggestion in visibleSuggestions" :key="suggestion.id"
                    :class="`flex border-b border-b-gray-300 ${suggestion.unread ? 'border-l-4 border-l-primary': ''} data-[active=true]:bg-white`"
                    :data-active="route.params.suggestionId == suggestion.id">
                  <NuxtLink :to="`/panel/board/${route.params.boardId}/inbox/${suggestion.id}`" class="flex w-full p-4">
                    <div class="flex-grow w-full flex flex-col gap-2 pr-2 font-medium">
                      <h4 class="line-clamp-2 overflow-ellipsis">{{ suggestion.title }}</h4>
                      <div class="flex gap-2 text-sm font-normal">
                        <span>{{ suggestion.user || 'Anonym' }}</span>
                        <span>·</span>
                        <span>{{ getElapsedTimeSinceCreationDate(suggestion.createdAt) }}</span>
                      </div>
                    </div>
                    <div class="flex items-center">
                <span
                    class="flex items-center pr-4 pl-2 text-primary bg-primary-200 rounded-full before:w-0 before:h-0 before:border-b-[10px] before:border-b-primary before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:scale-x-50 before:scale-y-75 -translate-x-1">{{
                    suggestion.upvoteCount
                  }}</span>
                    </div>
                  </NuxtLink>
                </li>
              </ul>

              <div v-else class="w-full p-6 flex flex-col items-center text-center">
                <img alt='Illustration von zwei Personen mit Fragezeichen über dem Kopf'
                     src="/questions-amico.svg"
                     width="120"/>
                <template v-if="suggestions.length > 0">
                  <p class="mb-8 font-medium">Keine Ergebnisse</p>
                  <p class="flex flex-col gap-2 text-gray-600 text-center text-sm">
                    <span>Suchen Sie nach einem anderen Schlagwort oder ändern Sie die Kategorie links</span>
                  </p>
                </template>
                <template v-else>
                  <p class="mb-8 font-medium">Bisher wurden noch keine Vorschläge geteilt.</p>
                  <p class="flex flex-col gap-2 text-gray-600 text-center text-sm">
                    <span>Nutzer können über folgenden Link öffentlich Vorschläge teilen:</span>
                    <NuxtLink :to="`/board/${route.params.boardId}`" class="underline" target="_blank">
                      http://localhost:3000/board/{{
                        route.params.boardId
                      }}
                    </NuxtLink>
                  </p>
                </template>
              </div>
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

const route = useRoute();
const activeCategory = useState<null | String>("inbox:activeCategory", () => null);
const suggestionsQuery = useState("inbox:suggestionsQuery", () => '');
const suggestionsOrder = useState("inbox:suggestionsOrder", () => 'NEWEST');
const {data: categories, error: categoriesError} = await tado.getCategories(route.params.boardId as String);
const {data: suggestions, error: suggestionsError} = await tado.getSuggestions(route.params.boardId as String);


if (categoriesError.value || suggestionsError.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Board nicht gefunden",
    fatal: true
  })
}

const visibleSuggestions = computed<Suggestion[]>(() => {
  let ordered: Suggestion[] = suggestions.value;

  if (activeCategory.value != null) {
    ordered = ordered.filter(suggestion => suggestion.category != null && suggestion.category.id == activeCategory.value)
  }

  if (suggestionsQuery.value != '') {
    ordered = ordered.filter(({title, description}) =>
        title.toLowerCase().includes(suggestionsQuery.value.toLowerCase()) || description.toLowerCase().includes(suggestionsQuery.value.toLowerCase()));
  }

  switch (suggestionsOrder.value) {
    case 'UNREAD':
      ordered.sort((a, b) => {
        if (a.unread == b.unread) {
          return a.createdAt < b.createdAt ? 1 : -1;
        } else {
          return b.unread ? 1 : -1;
        }
      })
      break;
    case 'MOST_UPVOTED':
      ordered.sort((a, b) => {
        if (a.upvoteCount == b.upvoteCount) {
          return a.createdAt < b.createdAt ? 1 : -1;
        } else {
          return a.upvoteCount < b.upvoteCount ? 1 : -1;
        }
      })
      break;
    case 'OLDEST':
      ordered.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1);
      break;
    default:
      ordered.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);
      break;
  }

  return ordered;
})
</script>