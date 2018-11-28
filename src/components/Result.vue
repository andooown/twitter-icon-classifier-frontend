<template>
  <div>
    <h2>陽キャ度: <strong>{{ result.score | fixedText(2) }}</strong></h2>
    <div class="h3">
      <span v-if="screenName != null && screenName !== ''">@{{ screenName }}さんは</span>{{ result.score | descriptionText }}です。
    </div>
    <b-button variant="primary">結果をつぶやく</b-button>
    <b-button variant="outline-primary">もう一度診断する</b-button>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["screenName", "result"])
  },
  filters: {
    fixedText(val, num) {
      return (val * 100.0).toFixed(num) + "%";
    },
    descriptionText(score) {
      if (score < 0.1) {
        return "疑いようのない陰キャ";
      } else if (score < 0.2) {
        return "陰キャ";
      } else if (score < 0.4) {
        return "やや陰キャ";
      } else if (score < 0.6) {
        return "どっちつかずのキャラ";
      } else if (score < 0.8) {
        return "ちょい陽キャ";
      } else if (score < 0.9) {
        return "陽キャ";
      } else {
        return "めっちゃ陽キャ(ｳｪｲｳｪｲ↑";
      }
    }
  }
};
</script>

<style scoped>
</style>
