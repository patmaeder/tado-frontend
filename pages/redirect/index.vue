<script lang="ts" setup>
const route = useRoute();
const origin = route.query["origin"];
delete route.query["origin"];

navigateTo(origin + "?" + LocationQueryToString(route.query));
</script>