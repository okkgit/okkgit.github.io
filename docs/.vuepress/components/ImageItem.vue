<template>
  <div :style="{ width: width + 'px', height: height + 'px' }" class="image-item">
    <img :src="url" :alt="`Image ${url}`" :width="width" :height="height" />
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped>
.image-item {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
}
</style>
