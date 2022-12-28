import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

function SignForm(props) {

    const PlaceSchema = Yup.object().shape({
        email: Yup.string().email('Wrong email').required('Required'),
        password: Yup.string().min(6, 'Should be 6 chars minimum').required('Required'),
    });

    return (
        <div className='sign-form'>
            <h1 className='sign-form__title'>{props.title}</h1>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                }}
                validationSchema={props.registrationCheck ? PlaceSchema : ""}
                onSubmit={values => {
                    props.onSubmitSign(values)
                }}
                >
                {({ errors, touched, isValid }) => (
                    <Form className="popup__form" name={`form_${props.name}`}>
                        <label className="popup__field">
                            <Field name="email" className="sign-form__input" placeholder="Email"/>
                                {errors.email && touched.email ? (
                                    <div className="sign-form__error">{errors.email}</div>) : null}             
                        </label>

                        <label className="popup__field">
                            <Field name="password" type='password' className="sign-form__input" placeholder="Password"/>
                                {errors.password && touched.password ? <div className="sign-form__error">{errors.password}</div> : null}
                        </label>
                        
                        <button className='sign-form__submit-btn' aria-label="Submit action" type="submit" name="submit-button" disabled={!isValid}>{props.button}</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
  
}

export default SignForm;