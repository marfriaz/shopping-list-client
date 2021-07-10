import React, { useState, useEffect } from "react";
import ItemApiService from "../../services/item-api-service";
import TokenService from "../../services/token-service";
import Login from "../Login/Login";
import AddItemForm from "../AddItemForm/AddItemForm";

import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState({});

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    setIsAuthorized(TokenService.hasAuthToken());
  }, []);

  useEffect(() => {
    ItemApiService.getItems().then((res) => {
      setItems(res.items);
      setUser(res.user);
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
    <div className="App">
      <Login
        user={user}
        isAuthorized={isAuthorized}
        setIsAuthorized={(update) => setIsAuthorized(update)}
      />
      <div role="alert">
        {hasError && <p className="red">{errorMessage}</p>}
      </div>
      {isAuthorized && (
        <>
          <h1>Shopping List</h1>
          <div className="Container">
            <AddItemForm
              setItems={(newItem) => setItems([...items, newItem])}
            />
            <div className="ItemList">{renderList()}</div>
            <button
              className="Button"
              id="DeleteAllButton"
              onClick={handleDeleteAll}
            >
              Delete All!!!
            </button>
          </div>
        </>
      )}
      {!isAuthorized && (
        <h1>
          Please login via Google to create and delete items from your shopping
          list
        </h1>
      )}
    </div>
  );
}

export default App;
