import React from 'react';
import Header from './Header';
import SignForm from './SignForm';
import {withRouter} from 'react-router-dom';
import useForm from '../hooks/useForm';

function Register (props) {

  const useFormData = useForm()

  function handleSubmit(e) {
    e.preventDefault()
    props.onRegister(useFormData);
    useFormData.setValues({
      email: '',
      password: ''
    })
  }

  return (
    <>
      <Header actionButton={"Log in"} onSignChange={props.onSignChange}/>
      <SignForm title={"Registration"} button={"Register"} registrationCheck={true} onSubmitSign={handleSubmit} onChange={useFormData.handleChange} data={useFormData.values}/>
    </>
  );
  
}

export default withRouter(Register); 