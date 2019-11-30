import { login, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import router, { resetRouter } from "@/router";
import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const state = {
  token: getToken(),
  userInfo: {},
  curRole: [],
  roles: {
    Demand: false,
    Supply: false,
    Platform: false
  },
  permissions:{}
};

const mutations = {
  SET_TOKEN: (state, token) => {
    // state.token = token;
    Vue.set(state, "token", token);
  },
  SET_INTRODUCTION: (state, introduction) => {
    // state.introduction = introduction;
    Vue.set(state, "introduction", introduction);
  },
  SET_USERINFO: (state, userInfo) => {
    // state.userInfo = userInfo;
    Vue.set(state, "userInfo", userInfo);
  },
  SET_CURROLE: (state, curRole) => {
    // state.curRole = curRole;
    Vue.set(state, "curRole", curRole);
  },
  SET_ROLES: (state, roles) => {
    // state.roles = roles;
    Vue.set(state, "roles", roles);
  },
  SET_PERMISSIONS: (state, permissions) => {
    // state.permissions = permissions;
    Vue.set(state, "permissions", permissions);
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ name: username.trim(), password: password })
        .then(response => {
          const { data } = response;
          commit("SET_TOKEN", data);
          setToken(data);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then(response => {
          console.log(1);
          const { data } = response;
          if (!data) {
            reject("Verification failed, please Login again.");
          }
          let roles = {
            Demand: false,
            Supply: false,
            Platform: false
          };
          for (let i of data.roles) {
            roles[i.name] = true;
          }
          let permissions = new Object();
          for (let i of data.permissions) {
            permissions[i] = true;
          }
          commit("SET_USERINFO", data);
          commit("SET_ROLES", roles);
          commit("SET_PERMISSIONS", permissions);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit("SET_TOKEN", "");
      removeToken();
      resetRouter();
      resolve();
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      removeToken();
      resolve();
    });
  },

  chooseRole({ commit }, role) {
    return new Promise(resolve => {
      commit("SET_CURROLE", [role]);
      localStorage.setItem("curRole", role);
      resolve();
    });
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + "-token";

      commit("SET_TOKEN", token);
      setToken(token);

      const { roles } = await dispatch("getInfo");

      resetRouter();

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch("permission/generateRoutes", roles, {
        root: true
      });

      // dynamically add accessible routes
      router.addRoutes(accessRoutes);

      // reset visited views and cached views
      dispatch("tagsView/delAllViews", null, { root: true });

      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
