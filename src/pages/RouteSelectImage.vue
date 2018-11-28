<template>
  <div>
    <b-row id="image-selection-row" align-v="center">
      <b-col>
        <transition name="fade" mode="out-in">
          <div v-if="!isImageLoading">
            <b-input-group>
              <b-form-input v-model.trim="screenName" :readonly="isImageLoading" type="text" placeholder="ID検索"></b-form-input>
              <b-button :disabled="isImageLoading || !isValidScreenName" @click="searchIcon" variant="outline-primary">検索</b-button>
            </b-input-group>
            または<br />
            <b-form-file @input="loadLocalImage" placeholder="ファイルを選択"></b-form-file>
          </div>
          <b-progress v-else id="progress-bar" :max="100" show-progress animated>
            <b-progress-bar :value="100">アイコン取得中</b-progress-bar>
          </b-progress>
        </transition>
      </b-col>
    </b-row>

    <transition name="fade" appear>
      <b-row v-if="!isImageLoading && image !== ''">
        <b-col>
          <b-button @click="classify" size="lg" variant="primary" class="my-2">診断する</b-button>
        </b-col>
      </b-row>
    </transition>

    <transition name="fade" appear>
      <b-row v-if="alertText != null && alertText !== ''">
        <b-col>
          <b-alert variant="danger" class="my-2" show>{{ alertText }}</b-alert>
        </b-col>
      </b-row>
    </transition>

    <b-row>
      <b-col>
        <b-img :src="image" fluid></b-img>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import axios from "axios";

export default {
  data() {
    return {
      screenName: "",
      image: "",
      isImageLoading: false,
      alertText: ""
    };
  },
  computed: {
    ...mapGetters(["isModelLoaded"]),

    isValidScreenName() {
      return this.screenName !== "";
    }
  },
  methods: {
    loadImageData(imageData) {
      const reader = new FileReader();
      reader.onload = () => {
        this.image = reader.result;
      };
      reader.readAsDataURL(imageData);
    },
    async searchIcon() {
      this.alertText = "";
      this.isImageLoading = true;

      const url = `https://5v511nmei4.execute-api.us-east-1.amazonaws.com/prd/get_icon_url/${this.screenName}`;
      try {
        const res = await axios.get(url);
        if (res.status !== 200 || !res.data.success) {
          this.isImageLoading = false;
          this.alertText = "アイコンが取得できませんでした";
          return;
        }

        const imgRes = await axios.get(res.data.url, { responseType: "blob" });
        if (res.status !== 200) {
          this.isImageLoading = false;
          this.alertText = "アイコンが取得できませんでした";
          return;
        }
        this.isImageLoading = false;
        this.loadImageData(imgRes.data);
      } catch {
        this.isImageLoading = false;
        this.alertText = "アイコンが取得できませんでした";
      }
    },
    loadLocalImage(file) {
      if (file.type.indexOf("image") < 0) {
        this.alertText = "画像ファイルを選択してください";
        return;
      }
      this.loadImageData(file);
    },
    async classify() {
      await this.$store.dispatch("updateClassifyInput", { image: this.image, screenName: this.screenName });
      this.$router.replace("result");
    }
  }
};
</script>

<style scoped>
#progress-bar {
  height: 30px;
}
</style>