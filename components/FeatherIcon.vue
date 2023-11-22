<template>
  <i v-if="f.icons[props.icon]" v-html="f.icons[props.icon].toSvg(attrs)">
  </i>
</template>

<script lang="ts" setup>
import feather from 'feather-icons';

const props = defineProps(['icon', 'class', 'color', 'width', 'height', 'stroke-width', 'stroke-linecap', 'stroke-linejoin']);
const f = ref(feather);
const attrs: { [key: string]: string } = {
  class: props.class,
  color: props.color,
  width: props.width,
  height: props.height,
  'stroke-width': props['stroke-width'] || '1.5',
  'stroke-linecap': props['stroke-linecap'],
  'stroke-linejoin': props['stroke-linejoin']
};

Object.keys(attrs).forEach(key => attrs[key] === undefined && delete attrs[key])
</script>