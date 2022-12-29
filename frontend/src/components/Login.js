import React from 'react';
import {withRouter} from 'react-router-dom';
import Header from './Header';
import SignFormik from './SignFormik';


function Login (props) {

  function handleSubmit(values) {
    props.onLogin(values);

  }

  return (
    <>
      <Header actionButton={"Register"} onSignChange={props.onSignChange}/>
      <SignFormik title={"Welcome!"} button={"Log in"} registrationCheck={false} onSubmitSign={handleSubmit}/>
    </>
  );
  
}

export default withRouter(Login); 