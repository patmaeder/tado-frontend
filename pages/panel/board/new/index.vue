<template>
  <NuxtLayout name="panel-blank">
    <div class="flex flex-col items-center h-full bg-secondary">
      <div v-if="router.getRoutes().length > 0" class="absolute left-0 m-6">
        <button class="flex gap-2 items-center text-white hover:text-gray-300" @click="() => { router.back() }">
          <ArrowLeft height="16"/>
          <span>Zurück</span>
        </button>
      </div>
      <div class="flex-grow flex items-center justify-center w-full ">
        <div class="flex flex-col w-[30rem] p-10 bg-white rounded-md shadow">
          <h1 class="mb-8 text-xl font-medium text-center">Neues Board erstellen</h1>
          <form id="createNewBoardForm" ref="form" class="flex flex-col gap-4" @submit.prevent="createBoard">
            <div>
              <label class="relative flex flex-col" for="createNewBoardForm__title">
                <input id="createNewBoardForm__title"
                       v-model="title"
                       :class="`peer p-4 focus:outline-2 focus:outline-secondary border border-gray-300 ${titleError != '' ? 'border-red-600' : ''} rounded placeholder-transparent`"
                       name="title"
                       placeholder="Titel"
                       required
                       tabindex="1" type="text">
                <span class="
                    absolute top-0 left-2 -translate-y-1/2 px-2 text-gray-600 bg-white text-sm transition-all
                    peer-focus:top-0 peer-focus:text-secondary peer-focus:text-sm peer-focus:bg-white
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent">Titel</span>
              </label>
              <span v-if="titleError != ''" class="mt-2 text-red-600 text-sm">{{ titleError }}</span>
            </div>
            <div>
              <label class="relative flex flex-col min-h-[49px] p-4 border border-gray-300 rounded"
                     for="createNewBoardForm__logo">
                <input id="createNewBoardForm__logo"
                       accept="image/jpeg, image/png, image/gif, image/avif"
                       class="peer w-0 h-0 opacity-0"
                       name="logo"
                       required
                       tabindex="2"
                       type="file"
                       @change="convertFile">
                <span class="
                      absolute top-0 left-2 -translate-y-1/2 px-2 text-gray-600 bg-white text-sm transition-all
                      peer-invalid:top-1/2 peer-invalid:text-base peer-invalid:bg-transparent">Logo</span>
                <span class="pr-10">{{ logoFilename }}</span>
                <Upload class="absolute top-1/2 -translate-y-1/2 right-4 text-gray-600" height="18"/>
              </label>
              <span v-if="logoError != ''" class="mt-2 text-red-600 text-sm">{{ logoError }}</span>
            </div>
            <div>
              <label class="relative flex flex-col" for="createNewBoardForm__description">
              <textarea id="createNewBoardForm__description" v-model="description"
                        :class="`peer h-40 p-4 focus:outline-2 focus:outline-secondary border border-gray-300 ${descriptionError != '' ? 'border-red-600' : ''} rounded placeholder-transparent`"
                        name="description" placeholder="Beschreibung" tabindex="3"></textarea>
                <span class="
                    absolute top-0 left-2 -translate-y-1/2 px-2 text-gray-600 bg-white text-sm transition-all
                    peer-focus:top-0 peer-focus:text-secondary peer-focus:text-sm peer-focus:bg-white
                    peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent">Beschreibung</span>
              </label>
              <span v-if="descriptionError != ''" class="mt-2 text-red-600 text-sm">{{ descriptionError }}</span>
            </div>
            <div id="createNewBoardForm__appearance" class="flex border border-gray-300 rounded">
              <label :data-selected="appearance == 'LIGHT'"
                     class="basis-1/2 flex justify-center items-center p-3 data-[selected=true]:bg-primary-100 data-[selected=true]:text-primary cursor-pointer"
                     for="createNewBoardForm__appearance_LIGHT">
                <input id="createNewBoardForm__appearance_LIGHT" v-model="appearance" class="appearance-none"
                       tabindex="4" type="radio" value="LIGHT">
                <span>Helles Layout</span>
              </label>
              <label :data-selected="appearance == 'DARK'"
                     class="basis-1/2 flex justify-center items-center p-3 data-[selected=true]:bg-primary-100 data-[selected=true]:text-primary cursor-pointer"
                     for="createNewBoardForm__appearance_DARK">
                <input id="createNewBoardForm__appearance_DARK" v-model="appearance" class="appearance-none"
                       tabindex="5" type="radio" value="DARK">
                <span>Dunkles Layout</span>
              </label>
            </div>
            <label class="flex items-center border border-gray-300 rounded h-12" for="createNewBoardForm__accentColor">
              <input id="createNewBoardForm__accentColor"
                     class="h-full aspect-1/1 ml-1 bg-transparent"
                     name="accentColor" tabindex="5"
                     type="color"
                     value="#FF843D"
                     @input="(event) => { accentColor = event.target.value }">
              <span class="ml-2  group:focus:text-primary">
                <span class="font-medium">Akzentfarbe: </span>
                <span class="text-gray-600">{{ accentColor }}</span>
              </span>
            </label>
            <button class="py-4 bg-primary text-white text-lg font-semibold rounded" type="submit">
              Erstellen
            </button>
          </form>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import {ArrowLeft, Upload, XCircle} from 'lucide-vue-next';

const router = useRouter();
const {showNotification} = useToastNotifications();
const form = ref<HTMLFormElement>();
const title = ref('');
const titleError = ref('');
const logo = ref();
const logoError = ref('');
const logoFilename = ref();
const description = ref('');
const descriptionError = ref('');
const appearance = ref("LIGHT")
const accentColor = ref("#FF843D");

const blobToBase64 = async (blob: Blob) => {
  return await fileToBase64(blob);
}

const createBoard = async () => {
  titleError.value = "";
  logoError.value = "";
  descriptionError.value = "";

  if (title.value.trim().length < 1) {
    titleError.value = "Muss mindestens 1 Zeichen lang sein"
    return;
  }

  if (description.value.trim().length < 1 || description.value.trim().length > 300) {
    descriptionError.value = "Muss zwischen 1 und 300 Zeichen lang sein"
    return;
  }

  if (logo.value == undefined) {
    logoError.value = "Logo erforderlich"
    return;
  }

  const {data: board, error} = await tado.createBoard({
    title: title.value,
    description: description.value,
    logo: logo.value,
    logoFilename: logoFilename.value,
    appearance: appearance.value as "LIGHT" | "DARK",
    accentColor: accentColor.value,
  })

  if (error.value) {
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

  navigateTo(`/panel/board/${ board.value.id }/inbox`)
}

const convertFile = async (event) => {
  logo.value = await fileToBase64(event.target.files[0]);
  logoFilename.value = event.target.files[0].name;
}
</script>