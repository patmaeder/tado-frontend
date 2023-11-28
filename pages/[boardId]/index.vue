<template>
  <div class="bg-slate-100 min-h-screen">
    <header class="w-full bg-white">
      <div class="w-full flex justify-end p-6">
        <div v-if="isAuthenticated" class="flex items center">
          <span>{{ user?.email }}</span>
          <button class="ml-3 pl-2 border-l border-gray-300"
                  @click="() => { logout('http://localhost:3000/redirect?boardId=' + route.params.boardId)}">
            <LogOut height="16"/>
          </button>
        </div>
        <button v-else class="font-medium" @click="login">Einloggen</button>
      </div>
      <div class="px-72 pb-16">
        <p>Logo</p>
        <p>Description</p>
      </div>
    </header>
    <main class="px-72">
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
            <button class="flex justify-between items-center px-4 bg-primary basis-1/2 text-white rounded-tl-md"
                    @click="upvote(2)">
              <span
                  class="flex items-center before:w-0 before:h-0 before:mr-1 before:border-b-[10px] before:border-b-white before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:scale-x-50 before:scale-y-75 -translate-x-1">Upvote</span>
              <span class="px-4 py-1 bg-primary-300 rounded-full">32</span>
            </button>
          </div>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import {LogOut, SortDesc} from "lucide-vue-next";

const route = useRoute();
const {init, isAuthenticated, user, login, logout} = useAuth0();
const suggestions: Board[] = []; // TODO: Fetch suggestions
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

const upvote = (id: String) => {
  // TODO: upvote suggestion
}

onMounted(async () => {
  console.log("here");
  await init({
    domain: "dev-d62xibfl4x3znv4i.us.auth0.com",
    clientId: "vDvSLgMRfXgDUhyPH6KnLIiYnmdNLDYl",
    authorizationParams: {
      redirect_uri: "http://localhost:3000/redirect?boardId=" + route.params.boardId,
      audience: "https://www.tado.com"
    }
  })

  if (location.search.includes("boardId=")) {
    window.history.replaceState({}, document.title, window.location.href.split('?')[0]);
  }
})
</script>