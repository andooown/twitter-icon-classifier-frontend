<template>
  <b-progress id="progress-bar" :max="100" show-progress :animated="!isErrorOccurred && loadedPercentage < 100">
    <b-progress-bar v-if="!isErrorOccurred" :value="loadedPercentage">モデル読み込み中: {{ percentageText }}</b-progress-bar>
    <b-progress-bar v-else :value="100" variant="danger">エラー</b-progress-bar>
  </b-progress>
</template>

<script>
const WebDNN = require("webdnn");

export default {
  data() {
    return {
      loadedPercentage: 0,
      isErrorOccurred: false
    };
  },
  computed: {
    percentageText() {
      return `${this.loadedPercentage.toFixed(1)}%`;
    }
  },
  async mounted() {
    try {
      const runner = await WebDNN.load("model", {
        backendOrder: ["webgpu", "webassembly"],
        progressCallback: (loaded, total) => (this.loadedPercentage = (loaded / total) * 100)
      });
      await this.$store.dispatch("updateRunner", runner);
      this.$router.replace("/select");
    } catch {
      this.isErrorOccurred = true;
    }
  }
};
</script>

<style scoped>
#progress-bar {
  height: 30px;
}
</style>