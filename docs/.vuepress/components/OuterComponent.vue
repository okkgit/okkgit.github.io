<template>
  <div class="image-grid">
    <ImageItem
      v-for="(image, index) in images"
      :key="index"
      :url="image.url"
      :width="image.width"
      :height="image.height"
    />
  </div>
</template>

<script>
import ImageItem from './ImageItem.vue';

export default {
  components: {
    ImageItem,
  },
  data() {
    return {
      images: [
        { url: 'image1.jpg', width: 100, height: 100 },
        { url: 'image2.jpg', width: 120, height: 120 },
        // Add more images as needed
      ],
    };
  },
};
</script>

<style scoped>
.image-grid {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 10px;
}
</style>
