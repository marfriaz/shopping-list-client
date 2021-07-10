import config from "../config";

const TokenService = {
  saveAuthToken(token) {
    window.localStorage.setItem("authToken", token);
  },
  getAuthToken() {
    return window.localStorage.getItem("authToken");
  },
  clearAuthToken() {
    window.localStorage.removeItem("authToken");
  },
  hasAuthToken() {
    return !!TokenService.getAuthToken();
  },
};

export default TokenService;
