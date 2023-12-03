<template>
  <NuxtLayout name="panel-boards-inbox">
    <div class="flex flex-col h-full">

      <div class="flex-shrink-0 flex items-center h-20 pl-4 pr-20 border-b border-gray-300">
        <button class="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-200" @click="deleteSuggestion">
          <Trash2 width="20"/>
          <span>Löschen</span>
        </button>
        <button v-if="!suggestionPending && !suggestion.locked"
                class="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-200"
                @click="lockSuggestion">
          <Lock width="20"/>
          <span>Schließen</span>
        </button>
        <button v-else class="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-200" @click="unlockSuggestion">
          <Unlock width="20"/>
          <span>Öffnen</span>
        </button>
        <button class="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-200" @click="chooseCategory">
          <Bookmark width="20"/>
          <span>Kategorie auswählen</span>
        </button>
      </div>

      <div v-if="!suggestionPending && suggestion.locked" class="w-full p-2 bg-primary-100 text-primary text-sm">
        <p>Dieser Beitrag wurde geschlossen und kann nicht mehr kommentiert werden.</p>
      </div>

      <div v-if="!suggestionPending"
           class="flex-grow relative flex flex-col h-full p-10 pr-[7.5rem] bg-white overflow-hidden">
        <div class="flex-shrink-0">
          <div class="flex justify-between">
            <h1 class="text-xl font-medium">{{ suggestion.title }}</h1>
            <span
                class="flex items-center px-4 text-primary bg-primary-100 rounded-full before:w-0 before:h-0 before:border-b-[10px] before:border-b-primary before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:scale-x-75 before:-translate-x-1">32</span>
          </div>
          <div class="flex gap-2 mt-2">
            <span>Author</span>
            <span>·</span>
            <span>{{ getElapsedTimeSinceCreationDate(suggestion.createdAt) }}</span>
            <span v-if="suggestion.category != null">·</span>
            <span v-if="suggestion.category != null">{{ suggestion.category }}</span>
          </div>
          <p class="max-w-[84%] mt-8 leading-relaxed">{{ suggestion.description }}</p>
        </div>

        <div class="relative flex-grow overflow-hidden isolate
                    before:absolute data-[before=hidden]:before:hidden before:top-0 before:left-0 before:w-full before:h-20 before:bg-gradient-to-b before:from-white before:to-transparent before:z-10
                    after:absolute data-[after=hidden]:after:hidden after:bottom-0 after:left-0 after:w-full after:h-20 after:bg-gradient-to-t after:from-white after:to-transparent after:z-10"
             data-after="true" data-before="hidden">

          <div class="ml-6 mt-6 border-l border-gray-300">
            <div v-if="!commentsPending" class="relative h-full pl-6 overflow-scroll"
                 @scroll="handleCommentSectionScroll">
              <div v-for="comment in comments"
                   class="py-6 before:absolute before:left-0 before:translate-y-3 before:h-px before:w-4 before:bg-gray-300">
                <p class="leading-relaxed max-w-[84%]">{{ comment.message }}</p>
                <div class="flex gap-2 mt-3 text-gray-600">
                  <span>Author</span>
                  <span>·</span>
                  <span>{{ getElapsedTimeSinceCreationDate(comment.createdAt) }}</span>
                  <span>·</span>
                  <span
                      class="text-primary before:w-0 before:h-0 before:inline-block before:border-b-[10px] before:border-b-primary before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:scale-x-50 before:scale-y-75 -translate-x-1">32</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="flex-shrink-0 mt-8">
          <form class="flex items-end gap-4" @submit.prevent="() => {}">
            <!-- TODO: Resize textarea to auto fit content -->
            <textarea
                v-model="comment"
                :disabled="suggestion?.locked"
                class="flex-grow h-12 pl-6 py-2.5 rounded bg-gray-100 outline-none placeholder-gray-500 disabled:placeholder-gray-300"
                placeholder="Kommentieren..."></textarea>
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
  </NuxtLayout>
</template>

<script lang="ts" setup>
import {Bookmark, Lock, Send, Trash2, Unlock} from "lucide-vue-next";

const route = useRoute();
const {data: suggestion, pending: suggestionPending} = await tado.getSuggestion(route.params.suggestionId);
const {data: comments, pending: commentsPending} = await tado.getComments(route.params.suggestionId);
const comment = ref();

const handleCommentSectionScroll = (event) => {
  const parentNode = event.target.parentNode;
  const scrollTop = event.target.scrollTop;
  const scrollHeight = event.target.scrollHeight;
  const clientHeight = event.target.getBoundingClientRect().height;

  parentNode.setAttribute("data-before", scrollTop < 10 ? "hidden" : "visible");
  parentNode.setAttribute("data-after", scrollHeight - clientHeight - scrollTop < 10 ? "hidden" : "visible");
}

const deleteSuggestion = () => {
  tado.deleteSuggestion(route.params.suggestionId);
}

const lockSuggestion = () => {
  tado.updateSuggestion(route.params.suggestionId, {
    locked: true
  });
}

const unlockSuggestion = () => {
  tado.updateSuggestion(route.params.suggestionId, {
    locked: false
  });
}

const chooseCategory = () => {
  console.log("Choose Category");
  // TODO: Dialog zur Kategorieauswahl einblenden
}
</script>