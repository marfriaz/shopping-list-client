import React, { useState, useEffect } from "react";
import { GoogleLogout, GoogleLogin } from "react-google-login";
import AuthApiService from "../../services/auth-api-service";
import TokenService from "../../services/token-service";
import "./Login.css";

export default function Login(props) {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogIn = (res) => {
    AuthApiService.postLogin({ token: res.tokenId })
      .then((res) => {
        TokenService.saveAuthToken(res.authToken);
      })
      .then(() => props.setIsAuthorized(true))
      .catch((err) => {
        setHasError(true);
        setErrorMessage(err.message);
      });
  };

  // Clear authToken and state upon logout
  const logOut = () => {
    TokenService.clearAuthToken();
    props.setIsAuthorized(false);
    props.setUser({});
  };

  const renderLogoutLink = () => {
    return (
      <>
        <GoogleLogout
          clientId="111999925703-s4o9na84cbhohtniij1dihkf4m0b3m0q.apps.googleusercontent.com"
          buttonText="Logout"
          className="GoogleLogin"
          onLogoutSuccess={logOut}
          cookiePolicy={"single_host_origin"}
        />
      </>
    );
  };

  const renderLoginLink = () => {
    return (
      <GoogleLogin
        clientId="111999925703-s4o9na84cbhohtniij1dihkf4m0b3m0q.apps.googleusercontent.com"
        buttonText="Login"
        className="GoogleLogin"
        onSuccess={handleLogIn}
        onFailure={handleLogIn}
        cookiePolicy={"single_host_origin"}
      />
    );
  };

  return (
    <>
      <div role="alert" className="LoginError">
        {hasError && <p className="red">{errorMessage}</p>}
      </div>
      {props.isAuthorized ? renderLogoutLink() : renderLoginLink()}
    </>
  );
}
