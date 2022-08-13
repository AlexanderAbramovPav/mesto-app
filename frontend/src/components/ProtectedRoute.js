import React from "react";
import { Route, Redirect } from "react-router-dom";


const ProtectedRoute = (props) => {
  return (
    <Route>
      {() =>
        props.loggedIn ? props.component : <Redirect to="/sign-in" />
      }
    </Route>
  );
};

export default ProtectedRoute; 