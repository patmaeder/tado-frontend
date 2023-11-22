<template>
  <span v-html="f.icons[props.icon]
    .toSvg({
      class: props.class,
      color: props.color,
      width: props.width,
      height: props.height,
      'stroke-width': props['stroke-width'] || '1.4',
      'stroke-linecap': props['stroke-linecap'],
      'stroke-linejoin': props['stroke-linejoin']
  })">
  </span>
</template>

<script lang="ts" setup>
import feather from 'feather-icons';

const props = defineProps(['icon', 'class', 'color', 'width', 'height', 'stroke-width', 'stroke-linecap', 'stroke-linejoin']);
const f = ref(feather);
</script>