import TokenService from "./token-service";
import config from "../config";

const ItemApiService = {
  getItems() {
    return fetch(`${config.API_ENDPOINT}/items`, {
      headers: { authorization: `${TokenService.getAuthToken()}` },
    }).then((res) =>
      !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
    );
  },

  deleteAllItems() {
    return fetch(`${config.API_ENDPOINT}/items`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        authorization: `${TokenService.getAuthToken()}`,
      },
    }).then((res) =>
      !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
    );
  },

  postItem(item) {
    return fetch(`${config.API_ENDPOINT}/items`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `${TokenService.getAuthToken()}`,
      },
      body: JSON.stringify({
        item,
      }),
    }).then((res) =>
      !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
    );
  },

  deleteItem(item_id) {
    return fetch(`${config.API_ENDPOINT}/items/${item_id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        authorization: `${TokenService.getAuthToken()}`,
      },
    }).then((res) =>
      !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
    );
  },
};

export default ItemApiService;
