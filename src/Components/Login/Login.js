import React, { useState, useEffect } from "react";
import { GoogleLogout, GoogleLogin } from "react-google-login";
import AuthApiService from "../../services/auth-api-service";
import TokenService from "../../services/token-service";
import "./Login.css";

export default function Login(props) {
  const handleLogIn = (res) => {
    AuthApiService.postLogin({ token: res.tokenId })
      .then((res) => {
        TokenService.saveAuthToken(res.authToken);
      })
      .then(() => props.setIsAuthorized(true))
      .catch((err) => {
        console.log("postLogin error", err);
      });
  };

  const logout = () => {
    TokenService.clearAuthToken();
    props.setIsAuthorized(false);
  };

  const renderLogoutLink = () => {
    return (
      <>
        <h2 className="WelcomeHeader">Welcome {props.user.email}!</h2>
        <GoogleLogout
          clientId="111999925703-s4o9na84cbhohtniij1dihkf4m0b3m0q.apps.googleusercontent.com"
          buttonText="Logout"
          className="GoogleLogin"
          onLogoutSuccess={logout}
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
        // onFailure={handleSuccess}
        cookiePolicy={"single_host_origin"}
      />
    );
  };

  return (
    <nav className="Header">
      {props.isAuthorized ? renderLogoutLink() : renderLoginLink()}
    </nav>
  );
}
