import React, { useState } from "react";
import ItemApiService from "../../services/item-api-service";
import TokenService from "../../services/token-service";
import "./AddItemForm.css";

export default function AddItemForm(props) {
  const [input, setInput] = useState([]);

  const handleAdd = (ev) => {
    ev.preventDefault();
    props.setHasError(false);
    props.setErrorMessage(null);
    ItemApiService.postItem(input)
      .then((newItem) => props.setItems(newItem))
      .then(() => setInput(""))
      .catch((err) => {
        if (err.error.code === "Google Authentication Failure") {
          TokenService.clearAuthToken();
          props.setIsAuthorized(false);
          props.setUser({});
          props.setItems([]);
          window.alert("401 Unauthorized. Please login again.");
          return;
        }
        props.setHasError(true);
        props.setErrorMessage(err.message);
      });
  };

  return (
    <>
      <form id="shopping-list-form" onSubmit={handleAdd}>
        <label htmlFor="shopping-list-entry">Add an item:&nbsp;</label>
        <input
          type="text"
          name="shopping-list-entry"
          className="shopping-list-entry"
          placeholder="e.g., bananas"
          value={input}
          onChange={(ev) => setInput(ev.target.value)}
        />
        &nbsp;
        <button className="Button" id="AddButton" type="submit">
          Add Item
        </button>
      </form>
    </>
  );
}
