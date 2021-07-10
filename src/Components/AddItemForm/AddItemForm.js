import React, { useState } from "react";
import ItemApiService from "../../services/item-api-service";
import "./AddItemForm.css";

function AddItemForm(props) {
  const [input, setInput] = useState([]);

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleAdd = (ev) => {
    ev.preventDefault();
    setHasError(false);
    setErrorMessage(null);
    ItemApiService.postItem(input)
      .then((newItem) => props.setItems(newItem))
      .then(() => setInput(""))
      .catch((err) => {
        setHasError(true);
        setErrorMessage(err.error);
      });
  };

  return (
    <form id="shopping-list-form" onSubmit={handleAdd}>
      <label for="shopping-list-entry">Add an item:&nbsp;</label>
      <input
        type="text"
        name="shopping-list-entry"
        class="shopping-list-entry"
        placeholder="e.g., bananas"
        value={input}
        onChange={(ev) => setInput(ev.target.value)}
      />
      &nbsp;
      <button className="Button" id="AddButton" type="submit">
        Add Item
      </button>
    </form>
  );
}

export default AddItemForm;
