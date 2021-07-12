import React, { useState, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import HomePage from "../../Routes/HomePage";
import LoginPage from "../../Routes/LoginPage";
import Login from "../Login/Login";
import TokenService from "../../services/token-service";
import "./App.css";

export default function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState({});

  // Set's isAuthorized state based on presence of token
  useEffect(() => {
    setIsAuthorized(TokenService.hasAuthToken());
  }, []);

  return (
    <div className="App">
      <header className="Header">
        <h2 className="WelcomeUser">Welcome {user.name}!</h2>
        <Login
          user={user}
          setUser={setUser}
          isAuthorized={isAuthorized}
          setIsAuthorized={(update) => setIsAuthorized(update)}
        />
      </header>
      <main className="App__main">
        <Switch>
          <Route exact path="/">
            {isAuthorized ? (
              <HomePage setUser={setUser} setIsAuthorized={setIsAuthorized} />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          <Route exact path="/login">
            {!isAuthorized ? (
              <LoginPage setUser={setUser} />
            ) : (
              <Redirect to="/" />
            )}
          </Route>
        </Switch>
      </main>
    </div>
  );
}
