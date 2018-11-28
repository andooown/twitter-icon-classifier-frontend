<template>
  <div>
    <b-input-group>
      <b-form-input @input="updateScreenName" :value="screenName" :readonly="isImageLoading" type="text" placeholder="ID検索"></b-form-input>
      <b-button :disabled="isImageLoading || !isValidScreenName" @click="searchIcon" variant="outline-primary">検索</b-button>
    </b-input-group>
    または<br />
    <b-form-file @input="loadLocalImage" placeholder="ファイルを選択"></b-form-file>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState(["screenName", "isImageLoading"]),

    isValidScreenName() {
      return this.screenName !== "";
    }
  },
  methods: {
    ...mapActions(["updateScreenName", "searchIcon", "loadLocalImage"])
  }
};
</script>

<style scoped>
.progress {
  height: 30px;
}
</style>
