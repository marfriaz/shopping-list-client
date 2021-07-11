import config from "../config";

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
};

export default AuthApiService;
