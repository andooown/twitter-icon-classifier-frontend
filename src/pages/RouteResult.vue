<template>
  <div>
    <transition name="fade" mode="out-in">
      <b-progress v-if="score == null" id="progress-bar" :max="100" show-progress :animated="!isErrorOccurred">
        <b-progress-bar v-if="!isErrorOccurred" :value="100">診断中</b-progress-bar>
        <b-progress-bar v-else :value="100" variant="danger">エラー</b-progress-bar>
      </b-progress>
      <div v-else>
        <b-row>
          <b-col>
            <h2>陽キャ度: <strong>{{ scoreText }}</strong></h2>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <h3><span v-if="screenName != null && screenName !== ''">@{{ screenName }}さんは</span>{{ descriptionText }}です。</h3>
          </b-col>
        </b-row>
        <b-row class="my-2">
          <b-col>
            <b-button :href="tweetUrl" variant="primary" class="mr-2">結果をつぶやく</b-button>
            <b-button @click="reloadPage" variant="outline-primary" class="ml-2">もう一度診断する</b-button>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-img :src="image" fluid></b-img>
          </b-col>
        </b-row>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

const WebDNN = require("webdnn");

export default {
  data() {
    return {
      score: null,
      isErrorOccurred: false
    };
  },
  async mounted() {
    try {
      const inputArray = await WebDNN.Image.getImageArray(this.image, { dstW: 224, dstH: 224, scale: [255, 255, 255] });
      this.runner.inputs[0].set(inputArray);

      await this.runner.run();

      const scores = this.runner.outputs[0].toActual();
      this.score = scores[0];
    } catch {
      this.isErrorOccurred = true;
    }
  },
  methods: {
    async reloadPage() {
      await this.$store.dispatch("resetClassifyInput");
      this.$router.replace("select");
    }
  },
  computed: {
    ...mapState(["runner", "image", "screenName"]),
    ...mapGetters(["isModelLoaded"]),

    scoreText() {
      if (this.score == null) {
        return "";
      }
      return `${(this.score * 100.0).toFixed(2)}%`;
    },
    descriptionText() {
      if (this.score == null) {
        return "";
      }

      if (this.score < 0.1) {
        return "疑いようのない陰キャ";
      } else if (this.score < 0.2) {
        return "陰キャ";
      } else if (this.score < 0.4) {
        return "やや陰キャ";
      } else if (this.score < 0.6) {
        return "どっちつかずのキャラ";
      } else if (this.score < 0.8) {
        return "ちょい陽キャ";
      } else if (this.score < 0.9) {
        return "陽キャ";
      } else {
        return "めっちゃ陽キャ(ｳｪｲｳｪｲ↑";
      }
    },
    tweetUrl() {
      let text = `${this.descriptionText}です。陽キャ度: ${this.scoreText} | 機械学習でTwitterアイコンを陽キャ・陰キャ診断`;
      if (this.screenName != null && this.screenName !== "") {
        text = `@${this.screenName} さんは${text}`;
      }
      return `https://twitter.com/intent/tweet?text=${encodeURI(text)}&url=https://andooown.com/app/twitter-icon-classifier/&hashtags=陽キャ陰キャ診断`;
    }
  }
};
</script>

<style scoped>
#progress-bar {
  height: 30px;
}
</style>