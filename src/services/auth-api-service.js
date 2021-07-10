import config from "../config";
const axios = require("axios");
axios.defaults.withCredentials = true;
const AuthApiService = {
  postLogin(tokenId) {
    return fetch(`${config.API_ENDPOINT}/auth/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(tokenId),
    }).then((res) =>
      !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
    );
  },
  // postLogin(token) {
  //   return axios.post(`${config.API_ENDPOINT}/auth/login`, {
  //     method: "POST",

  //     headers: {
  //       "content-type": "application/json",
  //     },
  //     body: { token },
  //   });
  //   // .then((res) =>
  //   //   !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
  //   // );
  // },
  postUser(user) {
    return fetch(`${config.API_ENDPOINT}/users`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    }).then((res) =>
      !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
    );
  },
};

export default AuthApiService;
