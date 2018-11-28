<template>
  <div id="app">
    <b-row id="image-selection-row" align-v="center">
      <b-col>
        <transition name="fade" mode="out-in">
          <b-progress v-if="progressText != null && progressText !== ''" id="progress-bar" :max="100" show-progress animated>
            <b-progress-bar :value="100">{{ progressText }}</b-progress-bar>
          </b-progress>
          <ImageSelectForm v-if="isModelLoaded && !isImageLoading && result == null" :screen-name="screenName" :is-icon-loading="isImageLoading" />
        </transition>
      </b-col>
    </b-row>

    <transition name="fade" appear>
      <b-row v-if="!isImageLoading && image !== '' && result == null" id="execute-button-row" class="my-2" align-v="center">
        <b-col>
          <b-button @click="classify" size="lg" variant="primary">診断する</b-button>
        </b-col>
      </b-row>
    </transition>

    <Result v-if="result != null" />

    <transition name="fade" appear>
      <b-alert v-if="alertText != null && alertText !== ''" variant="danger" class="my-2" show>{{ alertText }}</b-alert>
    </transition>

    <transition name="fade" appear>
      <b-img :src="image" fluid></b-img>
    </transition>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

import ImageSelectForm from "./components/ImageSelectForm.vue";
import Result from "./components/Result.vue";

export default {
  name: "app",
  components: {
    ImageSelectForm,
    Result
  },
  async mounted() {
    await this.$store.dispatch("loadModel");
  },
  methods: {
    ...mapActions(["classify"])
  },
  computed: {
    ...mapState(["screenName", "image", "isImageLoading", "result", "progressText", "alertText"]),
    ...mapGetters(["isModelLoaded"])
  }
};
</script>

<style>
#image-selection-row {
  height: 100px;
}
#execute-button-row {
  height: 50px;
}

#progress-bar {
  height: 30px;
}

.fade-enter-active,
.fade-leave-active {
  transition: 1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave {
  opacity: 1;
}
</style>
