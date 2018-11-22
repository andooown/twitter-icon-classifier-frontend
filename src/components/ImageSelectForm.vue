<template>
  <div>
    <b-input-group>
      <b-form-input v-model.trim="name" :value="screenName" :readonly="isLoadingIcon" type="text" placeholder="ID検索"></b-form-input>
      <b-button :disabled="isLoadingIcon || name == null || name === ''" @click="searchButtonClicked" variant="outline-primary">検索</b-button>
    </b-input-group>
    または<br />
    <b-form-file ref="fileInput" @input="selectedFileChanged" placeholder="ファイルを選択"></b-form-file>
  </div>
</template>

<script>
const axios = require("axios");

export default {
  data() {
    return {
      name: "",
      isLoadingIcon: false
    };
  },
  props: { screenName: String },
  methods: {
    async searchButtonClicked() {
      this.$emit("hide-alert");
      this.$emit("show-progress", "アイコン取得中.....");
      this.isLoadingIcon = true;

      const screenName = this.name;
      const url = `https://5v511nmei4.execute-api.us-east-1.amazonaws.com/prd/get_icon_url/${screenName}`;

      try {
        const res = await axios.get(url);
        if (res.status !== 200 || !res.success) {
          this.emitGetIconFailure();
          return;
        }

        const imgRes = await axios.get(res.url, { responseType: "blob" });
        if (imgRes.status !== 200) {
          this.emitGetIconFailure();
          return;
        }

        this.isLoadingIcon = false;
        this.$emit("hide-progress");
        this.$emit("update-image-data", imgRes.data, screenName);
      } catch {
        this.emitGetIconFailure();
      }
    },
    selectedFileChanged(file) {
      if (file.type.indexOf("image") < 0) {
        this.$emit("show-alert", "画像ファイルを選択してください");
        this.$refs.fileInput.reset();
        return;
      }

      this.$emit("update-image-data", file);
    },
    emitGetIconFailure() {
      this.isLoadingIcon = false;
      this.$emit("hide-progress");
      this.$emit("show-alert", "アイコンを取得できませんでした");
    }
  }
};
</script>

<style scoped>
.progress {
  height: 30px;
}
</style>
