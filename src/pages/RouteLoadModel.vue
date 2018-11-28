<template>
  <b-progress id="progress-bar" :max="100" show-progress animated>
    <b-progress-bar v-if="!isErrorOccurred" :value="100">モデル読み込み中</b-progress-bar>
    <b-progress-bar v-else :value="100" variant="danger">エラー</b-progress-bar>
  </b-progress>
</template>

<script>
const WebDNN = require("webdnn");

export default {
  data() {
    return {
      isErrorOccurred: false
    };
  },
  async mounted() {
    try {
      const runner = await WebDNN.load("model", {
        backendOrder: ["webgpu", "webassembly"]
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