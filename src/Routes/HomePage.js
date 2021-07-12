import React, { useState, useEffect } from "react";
import ItemApiService from "../services/item-api-service";
import TokenService from "../services/token-service";
import AddItemForm from "../Components/AddItemForm/AddItemForm";

export default function HomePage(props) {
  const [items, setItems] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Set's isAuthorized state based on presence of token
  useEffect(() => {
    props.setIsAuthorized(TokenService.hasAuthToken());
  }, []);

  // Used when logged in user opens page
  useEffect(() => {
    ItemApiService.getItems()
      .then((res) => {
        setItems(res.items);
        props.setUser(res.user);
      })
      .catch((err) => {
        if (err.error.code === "Google Authentication Failure") {
          TokenService.clearAuthToken();
          props.setIsAuthorized(false);
          props.setUser({});
          setItems([]);
          window.alert("401 Unauthorized. Please login again.");
          return;
        }
        setHasError(true);
        setErrorMessage(err.message);
      });
  }, []);

  const handleDeleteItem = (itemId) => {
    setHasError(false);
    setErrorMessage(null);
    ItemApiService.deleteItem(itemId)
      .then(() => {
        const updatedItems = items.filter((item) => item.id !== itemId);
        setItems(updatedItems);
      })
      .catch((err) => {
        if (err.error.code === "Google Authentication Failure") {
          TokenService.clearAuthToken();
          props.setIsAuthorized(false);
          props.setUser({});
          setItems([]);
          window.alert("401 Unauthorized. Please login again.");
          return;
        }
        setHasError(true);
        setErrorMessage(err.message);
      });
  };

  const handleDeleteAll = () => {
    setHasError(false);
    setErrorMessage(null);
    ItemApiService.deleteAllItems()
      .then(() => {
        const updatedItems = [];
        setItems(updatedItems);
      })
      .catch((err) => {
        if (err.error.code !== undefined) {
          TokenService.clearAuthToken();
          props.setIsAuthorized(false);
          props.setUser({});
          setItems([]);
          window.alert("401 Unauthorized. Please login again.");
          return;
        }
        setHasError(true);
        setErrorMessage(err.message);
      });
  };

  const renderList = () => {
    return items.map((shoppingItem, key) => (
      <div className="Item" key={key}>
        <div className="ItemName">{shoppingItem.item}</div>
        <button
          className="Button DeleteButton"
          onClick={() => handleDeleteItem(shoppingItem.id)}
        >
          Delete
        </button>
      </div>
    ));
  };

  return (
    <>
      <div role="alert">
        {hasError && <p className="red">{errorMessage}</p>}
      </div>
      <div className="MainHeading">
        <h1>Shopping List</h1>
        &nbsp; &nbsp;
        <button
          className="Button"
          id="DeleteAllButton"
          onClick={handleDeleteAll}
        >
          Delete All!!!
        </button>
      </div>
      <div className="Container">
        <AddItemForm
          setHasError={setHasError}
          setErrorMessage={setErrorMessage}
          setIsAuthorized={props.setIsAuthorized}
          setUser={props.setUser}
          setItems={setItems}
          setItems={(newItem) => setItems([...items, newItem])}
        />
        <div className="ItemList">{renderList()}</div>
      </div>
    </>
  );
}
