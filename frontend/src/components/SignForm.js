import React from 'react';


function SignForm(props) {

    return (
        <div className='sign-form'>
            <h1 className='sign-form__title'>{props.title}</h1>
            <form className='sign-form__container' onSubmit={props.onSubmitSign}>
                <input 
                    type="email"
                    className="sign-form__input"
                    placeholder="Email"
                    name="email"
                    required
                    minLength="2"
                    maxLength="30"
                    id="email-input"
                    value={props.data?.email || ''}
                    onChange={props.onChange}
                />
                <input 
                    type="password"
                    className="sign-form__input"
                    placeholder="Пароль"
                    name="password"
                    required
                    minLength="2"
                    maxLength="30"
                    id="password-input"
                    value={props.data?.password || ''}
                    onChange={props.onChange}
                />
                <button className='sign-form__submit-btn' aria-label="Подтвердить действие" type="submit" name="submit-button">{props.button}</button>
            </form>
        </div>
    );
  
}

export default SignForm;