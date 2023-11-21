<template>
  <AuthenticationGuard>
    <div class="h-screen max-h-screen w-full flex flex-col overflow-hidden" id="panel">
      <header class="wrapper grid grid-cols-12 grid-rows-1 items-center h-20 flex-shrink-0 border-b border-gray-300">
        <div class="col-span-3">
          <img src="/tado_logo.svg" alt="Tado Logo" height="40" class="h-10"/>
        </div>

        <div class="col-span-6 h-full flex justify-center text-black">
          <slot name="header"></slot>
        </div>

        <div class="col-span-3 text-black">
          <p>{{ tenant?.email }}</p>
          <button @click="login">Login</button>
          <button @click="logout">Logout</button>
        </div>
      </header>

      <main class="flex gap-4 flex-col w-full h-screen items-center justify-center">
        <slot></slot>
      </main>
    </div>
  </AuthenticationGuard>
</template>

<script lang="ts" setup>
const { tenant, login, logout, isAuthenticated } = useAuth0();
</script>