<template>
  <div class="video-card">
    <div class="video-wrapper" :style="{ width: videoWidth, height: videoHeight }">
      <iframe :src="videoSrc" frameborder="0" allowfullscreen></iframe>
    </div>
    <div class="video-info">
      <div>
        <h2>{{ videoName }}</h2>
        <p>{{ videoDescription }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    videoSrc: {
      type: String,
      required: true
    },
    videoName: {
      type: String,
      required: true
    },
    videoDescription: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: "100%" // 默认宽度为100%
    },
    height: {
      type: String,
      default: "400px" // 默认高度为400px
    }
  },
  computed: {
    videoWidth() {
      return this.width;
    },
    videoHeight() {
      return this.height;
    }
  }
};
</script>

<style scoped>
.video-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  margin: 10px;
  display: flex;
}

.video-wrapper {
  flex: 1;
  overflow: hidden;
  position: relative;
}

iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.video-info {
  flex: 1;
  padding: 16px;
}

h2 {
  margin-bottom: 8px;
}
</style>
