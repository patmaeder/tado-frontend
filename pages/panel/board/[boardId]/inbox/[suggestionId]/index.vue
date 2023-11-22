<template>
  <NuxtLayout name="panel-boards-inbox">
    <div class="flex flex-col h-full">

      <div class="flex-shrink-0 flex items-center h-20 pl-4 border-b border-gray-300">
        <button class="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-200">
          <FeatherIcon icon="trash-2" width="20"/>
          <span>Löschen</span>
        </button>
        <button class="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-200">
          <FeatherIcon icon="lock" width="20"/>
          <span>Schließen</span>
        </button>
        <button class="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-200">
          <FeatherIcon icon="bookmark" width="20"/>
          <span>Kategorie auswählen</span>
        </button>
      </div>

      <div class="flex-grow relative flex flex-col h-full p-10 bg-white overflow-hidden">
        <div class="flex-shrink-0">
          <div class="flex justify-between">
            <h1 class="text-xl font-medium">Improve the accuracy for the subject/background selection
              tools</h1>
            <span
                class="flex items-center px-4 text-primary bg-primary-100 rounded-full before:w-0 before:h-0 before:border-b-[10px] before:border-b-primary before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:scale-x-75 before:-translate-x-1">32</span>
          </div>
          <div class="flex gap-2 mt-2">
            <span>User123</span>
            <span>·</span>
            <span>Vor 24 Stunden</span>
            <span>·</span>
            <span>Tools</span>
          </div>
          <p class="max-w-[84%] mt-8 leading-relaxed">
            The subject/background selection tools in Photoshop are a powerful way to isolate and extract
            subjects from their backgrounds. However, they can sometimes be inaccurate, especially when
            dealing with complex images or subjects with fine details.
            This feature request is to improve the accuracy of the subject/background selection tools in
            Photoshop. This could be done by using machine learning to better understand the image and
            identify the subject and background. It could also be done by improving the algorithms used to
            make the selection.
            Improving the accuracy of the subject/background selection tools would make it easier and faster
            for users to create professional-looking images. It would also allow users to create more
            creative and innovative images.
          </p>
        </div>

        <div class="relative flex-grow ml-6 mt-6 border-l border-gray-300 overflow-hidden
                    before:absolute data-[before=hidden]:before:hidden before:top-0 before:left-0 before:w-full before:h-20 before:bg-gradient-to-b before:from-white before:to-transparent before:z-10
                    after:absolute data-[after=hidden]:after:hidden after:bottom-0 after:left-0 after:w-full after:h-20 after:bg-gradient-to-t after:from-white after:to-transparent after:z-10"
             data-after="true" data-before="hidden">

          <div class="relative h-full pl-6 overflow-scroll" @scroll="handleCommentSectionScroll">
            <div
                class="py-6 before:absolute before:left-0 before:translate-y-3 before:h-px before:w-4 before:bg-gray-300">
              <p class="leading-relaxed max-w-[84%]">This would be a huge improvement to Photoshop.
                The current selection tools are often inaccurate, especially with complex images or
                subjects with fine details.</p>
              <div class="flex gap-2 mt-3 text-gray-600">
                <span>User123</span>
                <span>·</span>
                <span>Vor 24 Stunden</span>
                <span>·</span>
                <span
                    class="text-primary before:w-0 before:h-0 before:inline-block before:border-b-[10px] before:border-b-primary before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:scale-x-50 before:scale-y-75 -translate-x-1">32</span>
              </div>
            </div>
            <div
                class="py-6 before:absolute before:left-0 before:translate-y-3 before:h-px before:w-4 before:bg-gray-300">
              <p class="leading-relaxed max-w-[84%]">This would be a huge improvement to Photoshop.
                The current selection tools are often inaccurate, especially with complex images or
                subjects with fine details.</p>
              <div class="flex gap-2 mt-3 text-gray-600">
                <span>User123</span>
                <span>·</span>
                <span>Vor 24 Stunden</span>
                <span>·</span>
                <span
                    class="text-primary before:w-0 before:h-0 before:inline-block before:border-b-[10px] before:border-b-primary before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:scale-x-50 before:scale-y-75 -translate-x-1">32</span>
              </div>
            </div>
            <div
                class="py-6 before:absolute before:left-0 before:translate-y-3 before:h-px before:w-4 before:bg-gray-300">
              <p class="leading-relaxed max-w-[84%]">This would be a huge improvement to Photoshop.
                The current selection tools are often inaccurate, especially with complex images or
                subjects with fine details.</p>
              <div class="flex gap-2 mt-3 text-gray-600">
                <span>User123</span>
                <span>·</span>
                <span>Vor 24 Stunden</span>
                <span>·</span>
                <span
                    class="text-primary before:w-0 before:h-0 before:inline-block before:border-b-[10px] before:border-b-primary before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:scale-x-50 before:scale-y-75 -translate-x-1">32</span>
              </div>
            </div>
            <div
                class="py-6 before:absolute before:left-0 before:translate-y-3 before:h-px before:w-4 before:bg-gray-300">
              <p class="leading-relaxed max-w-[84%]">This would be a huge improvement to Photoshop.
                The current selection tools are often inaccurate, especially with complex images or
                subjects with fine details.</p>
              <div class="flex gap-2 mt-3 text-gray-600">
                <span>User123</span>
                <span>·</span>
                <span>Vor 24 Stunden</span>
                <span>·</span>
                <span
                    class="text-primary before:w-0 before:h-0 before:inline-block before:border-b-[10px] before:border-b-primary before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:scale-x-50 before:scale-y-75 -translate-x-1">32</span>
              </div>
            </div>
            <div
                class="py-6 before:absolute before:left-0 before:translate-y-3 before:h-px before:w-4 before:bg-gray-300">
              <p class="leading-relaxed max-w-[84%]">This would be a huge improvement to Photoshop.
                The current selection tools are often inaccurate, especially with complex images or
                subjects with fine details.</p>
              <div class="flex gap-2 mt-3 text-gray-600">
                <span>User123</span>
                <span>·</span>
                <span>Vor 24 Stunden</span>
                <span>·</span>
                <span
                    class="text-primary before:w-0 before:h-0 before:inline-block before:border-b-[10px] before:border-b-primary before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:scale-x-50 before:scale-y-75 -translate-x-1">32</span>
              </div>
            </div>
            <div
                class="py-6 before:absolute before:left-0 before:translate-y-3 before:h-px before:w-4 before:bg-gray-300">
              <p class="leading-relaxed max-w-[84%]">This would be a huge improvement to Photoshop.
                The current selection tools are often inaccurate, especially with complex images or
                subjects with fine details.</p>
              <div class="flex gap-2 mt-3 text-gray-600">
                <span>User123</span>
                <span>·</span>
                <span>Vor 24 Stunden</span>
                <span>·</span>
                <span
                    class="text-primary before:w-0 before:h-0 before:inline-block before:border-b-[10px] before:border-b-primary before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:scale-x-50 before:scale-y-75 -translate-x-1">32</span>
              </div>
            </div>
            <div
                class="py-6 before:absolute before:left-0 before:translate-y-3 before:h-px before:w-4 before:bg-gray-300">
              <p class="leading-relaxed max-w-[84%]">This would be a huge improvement to Photoshop.
                The current selection tools are often inaccurate, especially with complex images or
                subjects with fine details.</p>
              <div class="flex gap-2 mt-3 text-gray-600">
                <span>User123</span>
                <span>·</span>
                <span>Vor 24 Stunden</span>
                <span>·</span>
                <span
                    class="text-primary before:w-0 before:h-0 before:inline-block before:border-b-[10px] before:border-b-primary before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:scale-x-50 before:scale-y-75 -translate-x-1">32</span>
              </div>
            </div>
            <div
                class="py-6 before:absolute before:left-0 before:translate-y-3 before:h-px before:w-4 before:bg-gray-300">
              <p class="leading-relaxed max-w-[84%]">Last one: This would be a huge improvement to
                Photoshop. The current selection tools are often inaccurate, especially with complex
                images or subjects with fine details.</p>
              <div class="flex gap-2 mt-3 text-gray-600">
                <span>User123</span>
                <span>·</span>
                <span>Vor 24 Stunden</span>
                <span>·</span>
                <span
                    class="text-primary before:w-0 before:h-0 before:inline-block before:border-b-[10px] before:border-b-primary before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:scale-x-50 before:scale-y-75 -translate-x-1">32</span>
              </div>
            </div>
          </div>

        </div>

        <div class="flex-shrink-0 mt-8">
          <form class="flex items-end gap-4" @submit.prevent="() => {}">
            <!-- TODO: Resize textarea to auto fit content -->
            <textarea
                v-model="comment"
                class="flex-grow h-12 pl-6 py-2.5 rounded bg-gray-100 outline-none placeholder-gray-500"
                placeholder="Kommentieren..."></textarea>
            <button
                class="flex-shrink-0 flex justify-center items-center h-12 w-12 rounded bg-primary hover:bg-primary-400"
                type="submit">
              <FeatherIcon class="stroke-white" icon="send" width="20"/>
            </button>
          </form>
        </div>

      </div>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const comment = ref();
const handleCommentSectionScroll = (event) => {
  const parentNode = event.target.parentNode;
  const scrollTop = event.target.scrollTop;
  const scrollHeight = event.target.scrollHeight;
  const clientHeight = event.target.getBoundingClientRect().height;

  parentNode.setAttribute("data-before", scrollTop < 10 ? "hidden" : "visible");
  parentNode.setAttribute("data-after", scrollHeight - clientHeight - scrollTop < 10 ? "hidden" : "visible");
}
</script>