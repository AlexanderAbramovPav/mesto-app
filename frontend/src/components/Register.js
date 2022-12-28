import React from 'react';
import Header from './Header';
import SignFormik from './SignFormik';
import {withRouter} from 'react-router-dom';

function Register (props) {

  function handleSubmit(values) {

    props.onRegister(values);
  }

  return (
    <>
      <Header actionButton={"Log in"} onSignChange={props.onSignChange}/>
      <SignFormik title={"Registration"} button={"Register"} registrationCheck={true} onSubmitSign={handleSubmit}/>
    </>
  );
  
}

export default withRouter(Register); 