import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import axios from "axios";
const WebDNN = require("webdnn");

export default new Vuex.Store({
  state: {
    runner: null,

    screenName: "",
    image: "",
    isImageLoading: false,

    result: null,

    progressText: "",
    alertText: ""
  },
  getters: {
    isModelLoaded: state => state.runner != null
  },
  mutations: {
    updateRunner: (state, payload) => (state.runner = payload.runner),
    updateScreenName: (state, payload) => (state.screenName = payload.screenName.trim()),
    updateImageData: (state, payload) => {
      const reader = new FileReader();
      reader.onload = () => {
        state.image = reader.result;
      };
      reader.readAsDataURL(payload.imageData);
    },
    updateIsImageLoading: (state, payload) => (state.isImageLoading = payload.isImageLoading),
    hideImage: (state) => (state.image = ""),
    updateResult: (state, payload) => (state.result = payload.result),

    showProgress: (state, payload) => (state.progressText = payload.text),
    hideProgress: (state) => (state.progressText = ""),
    showAlert: (state, payload) => (state.alertText = payload.text),
    hideAlert: (state) => (state.alertText = "")
  },
  actions: {
    updateScreenName: ({ commit }, screenName) => commit("updateScreenName", { screenName }),
    async loadModel({ commit }) {
      commit("showProgress", { text: "モデル読み込み中....." });
      try {
        const runner = await WebDNN.load("model", {
          backendOrder: ["webgpu", "webassembly"],
          progressCallback: (loaded, total) => {
            commit("showProgress", {
              text: `モデル読み込み中.....${((loaded / total) * 100).toFixed(1)}%`
            });
          }
        });
        commit("updateRunner", { runner });
        commit("hideProgress");
      } catch {
        commit("hideProgress");
        commit("showAlert", { text: "モデルが読み込めませんでした" });
      }
    },
    async searchIcon({ commit, state }) {
      commit("hideAlert");
      commit("updateIsImageLoading", { isImageLoading: true });
      commit("showProgress", { text: "アイコン取得中....." });

      const commitResult = (success, imageData = null) => {
        if (success) {
          commit("updateImageData", { imageData });
        } else {
          commit("showAlert", { text: "アイコンが取得できませんでした" });
          commit("hideImage");
        }
        commit("hideProgress");
        commit("updateIsImageLoading", { isImageLoading: false });
      };

      const url = `https://5v511nmei4.execute-api.us-east-1.amazonaws.com/prd/get_icon_url/${state.screenName}`;
      try {
        const res = await axios.get(url);
        if (res.status !== 200 || !res.data.success) {
          commitResult(false);
          return;
        }

        const imgRes = await axios.get(res.data.url, { responseType: "blob" });
        if (res.status !== 200) {
          commitResult(false);
          return;
        }
        commitResult(true, imgRes.data);
      } catch {
        commitResult();
      }
    },
    loadLocalImage({ commit }, payload) {
      if (payload.type.indexOf("image") < 0) {
        commit("showAlert", { text: "画像ファイルを選択してください" });
        return;
      }

      commit("updateImageData", { imageData: payload });
    },
    async classify({ commit, state }) {
      commit("hideAlert");
      commit("updateResult", { result: null });
      commit("showProgress", { text: "診断中....." });

      const commitResult = (result = null) => {
        console.log(result);
        if (result == null) {
          commit("showAlert", { text: "診断できませんでした" });
        }
        commit("hideProgress");
        commit("updateResult", { result });
      };

      try {
        const inputArray = await WebDNN.Image.getImageArray(state.image, { dstW: 224, dstH: 224 });
        state.runner.inputs[0].set(inputArray);

        await state.runner.run();

        const scores = state.runner.outputs[0].toActual();
        commitResult({ score: scores[0] });
      } catch {
        commitResult();
      }
    }
  }
});
