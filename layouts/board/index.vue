<template>
  <div class="bg-slate-100 min-h-screen">
    <header class="w-full bg-white">
      <div class="w-full flex justify-end p-6">
        <ClientOnly>
          <div v-if="isAuthenticated" class="flex items center">
            <span>{{ user.email }}</span>
            <button class="ml-3 pl-2 border-l border-gray-300"
                    @click="logoutUser">
              <LogOut height="16"/>
            </button>
          </div>
          <button v-else class="font-medium" @click="loginUser">Einloggen</button>
        </ClientOnly>
      </div>
      <div class="px-72 pb-16">
        <slot name="header"></slot>
      </div>
    </header>

    <main class="px-72">
      <slot></slot>
    </main>
  </div>
</template>

<script lang="ts" setup>
import {LogOut} from "lucide-vue-next";

const {init, user, isAuthenticated, login, logout} = useAuth0();
const route = useRoute();

if (process.client) {
  await init({
    domain: "dev-d62xibfl4x3znv4i.us.auth0.com",
    clientId: "vDvSLgMRfXgDUhyPH6KnLIiYnmdNLDYl",
    cacheLocation: "localstorage",
    authorizationParams: {
      audience: "https://www.tado.com"
    }
  })
}

const loginUser = async () => {
  route.query["origin"] = route.path;

  await login({
    authorizationParams: {
      redirect_uri: "http://localhost:3000/redirect?origin=" + route.path,
    }
  });
}

const logoutUser = async () => {
  route.query["origin"] = route.path;
  await logout('http://localhost:3000/redirect?origin=' + route.path);
}
</script>