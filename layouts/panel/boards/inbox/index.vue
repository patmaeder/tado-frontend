<template>
  <NuxtLayout name="panel-boards">
    <div class="w-full h-full grid grid-cols-12">

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
            <FeatherIcon icon="plus" width="18"/>
          </button>
        </div>
      </div>

      <!-- Suggestion List -->
      <div class="max-h-full col-span-3 border-x border-gray-300 overflow-hidden">
        <div class="h-20 p-4 flex justify-between items-center border-b border-gray-300">
          <label class="flex-1 flex" for="filterQuery">
            <FeatherIcon height="20" icon="search"/>
            <input id="filterQuery"
                   v-model="filterQuery"
                   class="w-full pl-2 bg-transparent text-ellipsis focus:outline-none"
                   name="searchQuery"
                   placeholder="Suchen..."
                   type="text"/>
          </label>
          <label class="flex" for="suggestionsOrder">
            <select id="suggestionsOrder" v-model="suggestionsOrder"
                    class="appearance-none mr-2 direction-rtl outline-none bg-transparent"
                    name="suggestionsOrder">
              <option value="UNREAD">Ungelesene</option>
              <option value="NEWEST">Neueste zuerst</option>
              <option value="OLDEST">Älteste zuerst</option>
            </select>
            <FeatherIcon icon="sliders" width="20"/>
          </label>
        </div>
        <ul>
          <li :data-active="route.params.suggestionId == 1"
              class="flex border-b border-gray-300 data-[active=true]:bg-white">
            <NuxtLink :to="`/panel/board/${route.params.boardId}/inbox/1`" class="flex p-4">
              <div class="flex-grow flex flex-col gap-2 font-medium">
                <h4 class="line-clamp-2 overflow-ellipsis">Improve the accuracy for the subject/background selection
                  tools</h4>
                <div class="flex gap-2 text-sm font-normal">
                  <span>User123</span>
                  <span>·</span>
                  <span>Vor 24 Stunden</span>
                </div>
              </div>
              <div class="flex items-center">
                <span
                    class="flex items-center pr-4 pl-2 text-primary bg-primary-200 rounded-full before:w-0 before:h-0 before:border-b-[10px] before:border-b-primary before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:scale-x-50 before:scale-y-75 -translate-x-1">32</span>
              </div>
            </NuxtLink>
          </li>

          <li v-for="suggestion in visibleSuggestions" :key="suggestion.id" class="flex">
            <NuxtLink :to="`/panel/board/${route.params.boardId}/inbox/${suggestion.id}`">
              <div class="flex-grow">
                <h4>{ suggestion.title }</h4>
                <p></p>
              </div>
              <div>

              </div>
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Suggestion Viewer -->
      <div class="max-h-full col-span-7 overflow-hidden">
        <slot></slot>
      </div>

    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const route = useRoute();
const activeCategory = ref(null);
const filterQuery = ref('');
const suggestionsOrder = ref('UNREAD');
const suggestions = []; // TODO: Fetch suggestions

const visibleSuggestions = computed(() => {
  let temp = suggestions;

  if (activeCategory.value != null) {
    temp = temp.filter(suggestion => suggestion.category.id == activeCategory.value)
  }

  if (filterQuery.value != '') {
    temp = temp.filter(({title, description}) => title.includes(filterQuery.value) || description.includes(filterQuery.value));
  }

  switch (suggestionsOrder.value) {
    case 'NEWEST':
      temp.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1);
      break;
    case 'OLDEST':
      temp.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);
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