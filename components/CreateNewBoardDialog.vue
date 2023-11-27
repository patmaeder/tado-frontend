<template>
  <dialog ref="createNewBoardDialog"
          class="open:top-0 open:w-full open:h-screen open:flex items-center justify-center open:bg-secondary open:bg-opacity-90 z-50">
    <div class="w-[32rem] rounded-md shadow-2xl bg-white">
      <form id="createNewBoardDialogForm" ref="createNewBoardDialogForm"
            class="flex flex-col justify-stretch items-center gap-8 p-6" @submit.prevent="validateAndSubmit">
        <div class="w-full flex flex-col gap-8">
          <label class="flex flex-col gap-2" for="createNewBoardDialogForm__title">
            <span class="font-medium">Boardname</span>
            <input id="createNewBoardDialogForm__title" v-model="title" class="h-12 px-2 bg-gray-100 rounded outline-0"
                   name="title"
                   required
                   type="text">
          </label>
          <label class="flex flex-col gap-2" for="createNewBoardDialogForm__logo">
            <span class="font-medium">Logo</span>
            <input id="createNewBoardDialogForm__logo" class="p-2.5 h-12 bg-gray-100 rounded" name="logo"
                   required
                   type="file"
                   @change="handleFileUpload">
            <span
                class="text-sm text-gray-600">Aktuell werden nur Rasterformat unterstützt.<br/>(JPG, PNG und GIF)</span>
          </label>
          <label class="flex flex-col gap-2" for="createNewBoardDialogForm__description">
            <span class="font-medium">Beschreibung</span>
            <textarea id="createNewBoardDialogForm__description" v-model="description"
                      class="h-24 p-2 bg-gray-100 rounded outline-0"
                      name="description"
                      required
                      type="text"></textarea>
          </label>
        </div>
        <div class="w-full flex items-center gap-4">
          <button
              class="flex-grow py-2 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 font-medium rounded"
              @click="() => { createNewBoardDialog?.close() }">
            <XCircle height="20" stroke-width="2"/>
            <span>Abbrechen</span>
          </button>
          <button
              class="flex-grow py-2 flex items-center justify-center gap-2 bg-primary-100 hover:bg-primary-200 text-primary font-medium rounded"
              type="submit">
            <CheckCircle height="16" stroke-width="2"/>
            <span>Erstellen</span>
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script lang="ts" setup>
import {CheckCircle, XCircle} from "lucide-vue-next";

const createNewBoardDialog = ref<HTMLDialogElement>();
const createNewBoardDialogForm = ref();
const {createBoard} = useTado();
const title = ref('');
const logo = ref();
const description = ref('')

const handleFileUpload = (event) => {
  logo.value = event.target.files[0];
}

const validateAndSubmit = () => {
  // TODO: validate form input

  let logoBase64;
  const reader = new FileReader();
  reader.onloadend = async () => {
    logoBase64 = reader.result;

    const response = await createBoard({
      title: title.value,
      description: description.value,
      logo: logoBase64
    })

    navigateTo("/panel/board/" + response.value.id + "/inbox");
  };

  reader.readAsDataURL(logo.value);
}

defineExpose({
  dialog: createNewBoardDialog
})
</script>