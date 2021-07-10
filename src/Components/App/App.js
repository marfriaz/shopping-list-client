import React, { useState, useEffect } from "react";
import ItemApiService from "../../services/item-api-service";
import TokenService from "../../services/token-service";
import Login from "../Login/Login";
import AddItemForm from "../AddItemForm/AddItemForm";
import "./App.css";
import { Route, Switch } from "react-router-dom";

export default function App() {
  const [items, setItems] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState({});

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Set's isAuthorized state based on presence of token
  useEffect(() => {
    setIsAuthorized(TokenService.hasAuthToken());
  }, []);

  // Used when logged in user opens page
  useEffect(() => {
    ItemApiService.getItems()
      .then((res) => {
        setItems(res.items);
        setUser(res.user);
      })
      .catch((err) => {
        if (err.error.code === "Google Authentication Failure") {
          TokenService.clearAuthToken();
          setIsAuthorized(false);
          setUser({});
          setItems([]);
          return;
        }
        setHasError(true);
        setErrorMessage(err.message);
      });
  }, []);

  // Refreshes state. Used upon login
  const refreshItems = () => {
    ItemApiService.getItems()
      .then((res) => {
        setItems(res.items);
        setUser(res.user);
      })
      .catch((err) => {
        if (err.error.code === "Google Authentication Failure") {
          TokenService.clearAuthToken();
          setIsAuthorized(false);
          setUser({});
          setItems([]);
          return;
        }
        setHasError(true);
        setErrorMessage(err.message);
      });
  };

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
          setIsAuthorized(false);
          setUser({});
          setItems([]);
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
          setIsAuthorized(false);
          setUser({});
          setItems([]);
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
    <div className="App">
      <nav className="Header">
        <h2 className="WelcomeHeader">Welcome {user.name}!</h2>
        <Login
          user={user}
          setUser={setUser}
          setItems={setItems}
          refreshItems={refreshItems}
          isAuthorized={isAuthorized}
          setIsAuthorized={(update) => setIsAuthorized(update)}
        />
      </nav>
      <main className="App__main">
        <div role="alert">
          {hasError && <p className="red">{errorMessage}</p>}
        </div>
        {isAuthorized && (
          <>
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
                setUser={setUser}
                setItems={setItems}
                refreshItems={refreshItems}
                setItems={(newItem) => setItems([...items, newItem])}
              />
              <div className="ItemList">{renderList()}</div>
            </div>
          </>
        )}
        {!isAuthorized && (
          <div className="banner">
            <div className="description">
              <h1>
                Please login via Google to create and delete items from your
                shopping list
              </h1>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
