<template>
  <NuxtLayout name="panel-board-settings">
    <div class="col-span-8 p-16 overflow-hidden">

      <div class=" h-full flex flex-col gap-12">
        <div class="col-span-3 h-auto p-4 bg-primary-100 text-primary border border-primary-200 rounded">
          <p class="leading-relaxed">Die Kategorien können direkt in der Tabelle unten bearbeitet werden. <br/>
            Beachten Sie, dass sämtliche
            Änderungen
            direkt gespeichert werden!</p>
        </div>

        <div class="grid grid-cols-3 gap-12 ">

          <div class="col-span-2 flex flex-col gap-4 overflow-hidden">
            <table>
              <thead>
              <tr class="font-semibold">
                <td class="p-4 w-[60%]">Label</td>
                <td class="p-4 w-[35%]">Farbe</td>
                <td class="p-4 w-[5%]"></td>
              </tr>
              </thead>
              <tbody>
              <tr v-for="category in categories.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1).filter(category => category.title != '_all')"
                  class="group border-b border-gray-200">
                <td class="px-4 align-middle">
                  <div class="peer inline-grid max-w-[95%] mr-2">
                    <input :value="category.title"
                           class=" inline-block p-0 mr-3 my-3 bg-transparent col-start-1 row-start-1 w-full min-w-0"
                           contenteditable="true"
                           size="1"
                           type="text" @change="updateTitle(category.id)"
                           @input="(event) => {event.target.nextElementSibling.innerText = event.target.value}"/>
                    <span class="col-start-1 row-start-1 pr-1 invisible line-clamp-1">{{
                        category.title
                      }}</span>
                  </div>
                  <Pencil class="inline invisible peer-hover:visible text-gray-400" width="14"/>
                </td>
                <td class="px-4 align-middle">
                  <div class="inline-flex items-center gap-2 mr-3 my-3">
                    <input :id="`color_category_${category.id}`" :value="category.color" class="bg-transparent"
                           type="color" @change="updateColor(category.id)"/>
                    <label :for="`color_category_${category.id}`">{{ category.color }}</label>
                  </div>
                </td>
                <td class="align-middle">
                  <button class="invisible group-hover:visible flex items-center" @click="deleteCategory(category.id)">
                    <Trash class="text-gray-500" width="16"/>
                  </button>
                </td>
              </tr>
              <tr :class="showNewCategoryForm ? 'table-row' : 'hidden'">
                <td class="px-4 align-middle">
                  <div class="peer inline-grid mr-2 max-w-[95%]">
                    <input ref="newCategoryTitle"
                           class=" inline-block p-0 mr-3 my-3 bg-transparent col-start-1 row-start-1 w-full min-w-0"
                           contenteditable="true"
                           size="1"
                           type="text"
                           value="Neue Kategorie" @change="createNewCategory()"
                           @input="(event) => {event.target.nextElementSibling.innerText = event.target.value}"/>
                    <span class="col-start-1 row-start-1 pr-1 invisible line-clamp-1">Neue Kategorie</span>
                  </div>
                  <Pencil class="inline invisible peer-hover:visible text-gray-400" width="14"/>
                </td>
                <td class="px-4 align-middle">
                  <div class="inline-flex items-center gap-2 mr-3 my-3">
                    <input :id="`color_category`" ref="newCategoryColor" class="bg-transparent" type="color"
                           value="#FF6005" @change="createNewCategory()"/>
                    <label :for="`color_category_`">#FF6005</label>
                  </div>
                </td>
              </tr>
              <tr :class="!showNewCategoryForm ? 'table-row' : 'hidden'">
                <td class="text-center" colspan="2">
                  <button class="inline-flex items-center gap-2 my-auto mt-4 text-gray-500 hover:text-gray-700"
                          @click="showNewCategoryForm = true">
                    <PlusCircle height="16"/>
                    <span>Neue Kategorie hinzufügen</span>
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import {Info, Pencil, PlusCircle, Trash, XCircle} from 'lucide-vue-next'

const route = useRoute();
const {showNotification} = useToastNotifications();
const {data: categories, refresh: refreshCategories} = await tado.getCategories(route.params.boardId as String)
const showNewCategoryForm = ref(false);
const newCategoryTitle = ref<HTMLInputElement>();
const newCategoryColor = ref<HTMLInputElement>();

/*onMounted(() => {
  window.addEventListener('keydown', () => {
    isTyping.value = true;
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      isTyping.value = false;
    }, 800);
  });
})*/

const updateTitle = async (categoryId: String) => {
  console.log("triggered")

  const {error} = await tado.updateCategory(categoryId, {
    //@ts-ignore
    title: event.target.value,
  })

  if (error.value) {
    showNotification({
      icon: XCircle,
      title: error.value.data.error,
      message: error.value.data.message,
      type: "BANNER",
      status: "ERROR",
      duration: 5000
    })
    return;
  }

  await refreshCategories();
  showNotification({
    icon: Info,
    message: "Label wurde erfolgreich geändert",
    type: "BANNER",
    status: "SUCCESS",
    duration: 5000
  })
}

const updateColor = async (categoryId: String) => {
  const {error} = await tado.updateCategory(categoryId, {
    //@ts-ignore
    color: event?.target?.value,
  })

  if (error.value) {
    showNotification({
      icon: XCircle,
      title: error.value.data.error,
      message: error.value.data.message,
      type: "BANNER",
      status: "ERROR",
      duration: 5000
    })
    return;
  }

  await refreshCategories();
  showNotification({
    icon: Info,
    message: "Farbe wurde erfolgreich geändert",
    type: "BANNER",
    status: "SUCCESS",
    duration: 5000
  })
}

const createNewCategory = async () => {
  const {error} = await tado.createCategory({
    //@ts-ignore
    title: newCategoryTitle.value?.value,
    color: newCategoryColor.value?.value,
    board: {
      id: route.params.boardId as String,
    }
  })

  if (error.value) {
    showNotification({
      icon: XCircle,
      title: error.value.data.error,
      message: error.value.data.message,
      type: "BANNER",
      status: "ERROR",
      duration: 5000
    })
    return;
  }

  await refreshCategories();
  showNewCategoryForm.value = false;

  showNotification({
    icon: Info,
    message: "Farbe wurde erfolgreich geändert",
    type: "BANNER",
    status: "SUCCESS",
    duration: 5000
  })
}

const deleteCategory = async (categoryId: String) => {
  const {error} = await tado.deleteCategory(categoryId);

  if (error.value) {
    showNotification({
      icon: XCircle,
      title: error.value.data.error,
      message: error.value.data.message,
      type: "BANNER",
      status: "ERROR",
      duration: 5000
    })
    return;
  }

  await refreshCategories();
  showNotification({
    icon: Info,
    message: "Kategorie wurde erfolgreich gelöscht",
    type: "BANNER",
    status: "SUCCESS",
    duration: 5000
  })
}
</script>