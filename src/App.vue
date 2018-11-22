<template>
  <div id="app">
    <Navbar />

    <b-container>
      <div class="mt-5 text-center">
        <h1 class="display-4">陽キャ・陰キャ診断</h1>
        <p>
          機械学習を使ってTwitterアイコンなどの画像をもとに陽キャ・陰キャ診断ができます。<br>
          (正方形の画像のほうが正しく診断できます)
        </p>

        <b-progress v-if="progressText != null && progressText !== ''" id="progress-bar" :max="100" show-progress animated>
          <b-progress-bar :value="100">{{ progressText }}</b-progress-bar>
        </b-progress>

        <b-alert v-if="alertText != null && alertText !== ''" variant="danger" show>{{ alertText }}</b-alert>

        <ImageSelectForm v-if="!isImageLoaded" :screen-name="screenName" @update-image-data="updateImageData" @show-progress="showProgress" @hide-progress="hideProgress" @show-alert="showAlert" @hide-alert="hideAlert" />

        <b-button v-if="isImageLoaded" size="lg" variant="primary">診断する</b-button>

        <h2>陽キャ度: <strong>{{ result.score | fixedText(2) }}</strong></h2>
        <div class="h3">{{ result.description }}</div>
        <b-button variant="primary">結果をつぶやく</b-button>
        <b-button variant="outline-primary">もう一度診断する</b-button>

        <b-img :src="image" fluid></b-img>
      </div>
    </b-container>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import ImageSelectForm from "./components/ImageSelectForm";

export default {
  name: "app",
  components: {
    Navbar,
    ImageSelectForm
  },
  data() {
    return {
      screenName: "",
      image: "https://placehold.jp/500x500.png?text=%E7%94%BB%E5%83%8F",
      isImageLoaded: false,

      result: {
        score: 0,
        description: ""
      },

      progressText: "",
      alertText: ""
    };
  },
  mounted() {
    this.progressText = "モデル読み込み中.....";
  },
  methods: {
    updateImageData(imageData, screenName = "") {
      const reader = new FileReader();
      reader.onload = () => {
        this.image = reader.result;
        this.isImageLoaded = true;
        this.screenName = screenName;

        this.hideAlert();
      };
      reader.readAsDataURL(imageData);
    },

    showProgress(text) {
      this.progressText = text;
    },
    hideProgress() {
      this.progressText = "";
    },

    showAlert(text) {
      this.alertText = text;
    },
    hideAlert() {
      this.alertText = "";
    }
  },
  filters: {
    fixedText(val, num) {
      return (val * 100.0).toFixed(num) + "%";
    }
  }
};
</script>

<style>
#progress-bar {
  height: 30px;
}
</style>
