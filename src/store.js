import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    runner: null,
    image: "",
    screenName: ""
  },
  getters: {
    isModelLoaded: state => state.runner != null
  },
  mutations: {
    updateRunner: (state, payload) => (state.runner = payload.runner),
    updateImage: (state, payload) => (state.image = payload.image),
    updateScreenName: (state, payload) => (state.screenName = payload.screenName)
  },
  actions: {
    updateRunner: ({ commit }, runner) => commit("updateRunner", { runner }),
    updateClassifyInput: ({ commit }, payload) => {
      commit("updateImage", { image: payload.image });
      commit("updateScreenName", { screenName: payload.screenName });
    },
    resetClassifyInput: ({ commit }) => {
      commit("updateImage", { image: "" });
      commit("updateScreenName", { screenName: "" });
    }
  }
});
