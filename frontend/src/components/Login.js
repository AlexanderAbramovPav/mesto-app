import React from 'react';
import {withRouter} from 'react-router-dom';
import Header from './Header';
import SignForm from './SignForm';
import useForm from '../hooks/useForm';

function Login (props) {

  const useFormData = useForm()

  function handleSubmit(e) {
    e.preventDefault();
    props.onLogin(useFormData);
    useFormData.setValues({
      email: '',
      password: ''
    })
  }

  return (
    <>
      <Header actionButton={"Регистрация"} onSignChange={props.onSignChange}/>
      <SignForm title={"Вход"} button={"Войти"} registrationCheck={false} onSubmitSign={handleSubmit} onChange={useFormData.handleChange} data={useFormData.values}/>
    </>
  );
  
}

export default withRouter(Login); 