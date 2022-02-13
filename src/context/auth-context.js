import React, { useState } from 'react';

export const AuthContext = React.createContext({
  isAuth: false,
  login: () => {},
});

const AuthContextProvider = function (props) {
  const [isAuthanticated, setIsAuthenticated] = useState(false);

  const loginHandler = function () {
    setIsAuthenticated(true);
  };
  return (
    <AuthContext.Provider
      value={{ login: loginHandler, isAuth: isAuthanticated }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
