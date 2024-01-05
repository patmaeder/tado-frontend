<template>
  <NuxtLayout name="panel-board-settings">
    <div class="col-span-8 grid grid-cols-3 gap-12 p-16 overflow-hidden">

      <!-- Settings Sidebar -->
      <div class="col-span-1 flex flex-col gap-4 overflow-hidden">
        <div class="flex-grow overflow-y-scroll max-w-full">
          <fieldset class="max-w-full inline-flex flex-col gap-8 items-start">
            <label class="w-full flex flex-col">
              <span class="mb-4 text-xl font-semibold">Logo</span>
              <input class="appearance-none w-0 h-0 overflow-hidden"
                     type="file" @change="convertFile">
              <div class="w-full flex items-center gap-4 py-2 px-4 bg-gray-200 outline-none rounded">
                <span class="flex-grow break-all">{{ logoFilename }}</span>
                <Upload class="flex-shrink-0" height="16"/>
              </div>
            </label>
            <label class="w-full flex flex-col gap-4">
              <span class="text-xl font-semibold">Beschreibung</span>
              <textarea v-model="description"
                        class="appearance-none w-full h-36 py-2 px-4 bg-gray-200 outline-none rounded"></textarea>
            </label>
            <div id="createNewBoardForm__appearance" class="w-full">
              <span class="inline-block mb-4 text-xl font-semibold">Erscheinungsbild</span>
              <div class="w-full flex bg-gray-200 rounded overflow-hidden">
                <label :data-selected="appearance == 'LIGHT'"
                       class="basis-1/2 flex justify-center items-center p-3 data-[selected=true]:bg-primary data-[selected=true]:text-white cursor-pointer"
                       for="createNewBoardForm__appearance_LIGHT">
                  <input id="createNewBoardForm__appearance_LIGHT" v-model="appearance" class="appearance-none"
                         tabindex="4" type="radio" value="LIGHT">
                  <span>Helles Layout</span>
                </label>
                <label :data-selected="appearance == 'DARK'"
                       class="basis-1/2 flex justify-center items-center p-3 data-[selected=true]:bg-primary data-[selected=true]:text-white cursor-pointer"
                       for="createNewBoardForm__appearance_DARK">
                  <input id="createNewBoardForm__appearance_DARK" v-model="appearance" class="appearance-none"
                         tabindex="5" type="radio" value="DARK">
                  <span>Dunkles Layout</span>
                </label>
              </div>
            </div>
            <label class="class flex flex-col gap-2"
                   for="createNewBoardForm__accentColor">
              <span class="text-xl font-semibold">Akzentfarbe</span>
              <span class="inline-flex items-center gap-2">
                <input id="createNewBoardForm__accentColor"
                       :value="accentColor" class="h-10 aspect-1/1 bg-transparent"
                       name="accentColor" tabindex="5"
                       type="color"
                       @change="(event) => { accentColor = event.target.value }">
                <span class="text-gray-600">{{ accentColor }}</span>
              </span>
            </label>

          </fieldset>
        </div>

        <div class="flex-shrink-0 flex items-center">
          <button class="py-2 px-4 text-white font-light rounded bg-secondary hover:bg-secondary-800" @click="save">
            Änderungen speichern
          </button>
          <button
              class="flex items-center p-2 text-sm font-light hover:text-gray-600" @click="reset">
            <X height="12"/>
            <span>Zurücksetzen</span>
          </button>
        </div>
      </div>


      <!-- Preview -->
      <div class="col-span-2 flex items-center">
        <div class="h-3/4 aspect-video border border-gray-200 rounded shadow-md">
          <BoardPreview :accentColor="accentColor" :appearance="appearance" :description="description" :logo="logo"/>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import {Info, Upload, X, XCircle} from 'lucide-vue-next';

const route = useRoute();
const {showNotification} = useToastNotifications();
const {data: board} = await tado.getBoard(route.params.boardId as string);
const logo = ref(board.value.logo);
const logoFilename = ref(board.value.logo.split("/").pop())
const description = ref(board.value.description);
const appearance = ref(board.value.appearance);
const accentColor = ref(board.value.accentColor);

const save = async () => {

  let logoProps;
  if (logo.value.includes("data")) {
    logoProps = {
      logo: logo.value,
      logoFilename: logoFilename.value
    }
  }

  const {data, error} = await tado.updateBoard(route.params.boardId as string, {
    ...logoProps,
    description: description.value,
    appearance: appearance.value,
    accentColor: accentColor.value
  });

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

  board.value = data.value;
  showNotification({
    icon: Info,
    message: "Änderungen wurden erfolgreich gespeichert",
    type: "BANNER",
    status: "SUCCESS",
    duration: 5000
  })
}

const convertFile = async (event) => {
  logo.value = await fileToBase64(event.target.files[0]);
  logoFilename.value = event.target.files[0].name;
}

const reset = () => {
  logo.value = board.value.logo;
  logoFilename.value = board.value.logo.split("/").pop()
  description.value = board.value.description;
  appearance.value = board.value.appearance;
  accentColor.value = board.value.accentColor;
}
</script>