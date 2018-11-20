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

        <b-progress id="progress-bar" :max="100" show-progress animated>
          <b-progress-bar :value="100">モデル読み込み中.....</b-progress-bar>
        </b-progress>

        <b-input-group>
          <b-form-input v-model="screenName" type="text" placeholder="ID検索"></b-form-input>
          <b-button variant="outline-primary">検索</b-button>
        </b-input-group>
        または<br />
        <b-button variant="outline-primary">画像アップロード</b-button>

        <b-button size="lg" variant="primary">診断する</b-button>

        <h2>陽キャ度: <strong>{{ result.score | fixedText(2) }}</strong></h2>
        <div class="h3">{{ result.description }}</div>
        <b-button variant="primary">結果をつぶやく</b-button>
        <b-button variant="outline-primary">もう一度診断する</b-button>

        <b-alert variant="danger" show fade>テスト</b-alert>

        <b-img src="https://placehold.jp/500x500.png?text=%E7%94%BB%E5%83%8F" fluid></b-img>
      </div>
    </b-container>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
  name: "app",
  components: {
    Navbar
  },
  filters: {
    fixedText(val, num) {
      return (val * 100.0).toFixed(num) + "%";
    }
  },
  data() {
    return {
      screenName: "",
      result: {
        score: 0,
        description: ""
      }
    };
  }
};
</script>

<style>
#progress-bar {
  height: 30px;
}
</style>
