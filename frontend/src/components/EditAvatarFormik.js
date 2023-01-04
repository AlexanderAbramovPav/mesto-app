import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import PopupWithForm from "./PopupWithForm";


function EditAvatarFormik(props) {

    const AvatarSchema = Yup.object().shape({
        avatarLink: Yup.string().url('Invalid link').required('Required'),
    });
    
    function handleSubmit(values) {
    
        props.onUpdateUser({
          avatar: values.avatarLink,
        });

        values.avatarLink = ''
    }

    return (
        <PopupWithForm
            onClose={props.onClose}
            isOpen={props.isOpen}
            onSubmit={props.onSubmit}
            name="avatar"
            title="Update avatar"
            onOutClick={props.onOutClick}
        >
            <Formik
                initialValues={{
                    avatarLink: '',
                }}
                validationSchema={AvatarSchema}
                onSubmit={values => {
                    handleSubmit(values);
                }}
                >
                {({ errors, touched, isValid }) => (
                    <Form className="popup__form" name={`form_${props.name}`}>

                        <label className="popup__field">
                            <Field name="avatarLink" className="popup__input" placeholder="Link to avatar"/>
                                {errors.avatarLink && touched.avatarLink ? <div className="popup__error">{errors.avatarLink}</div> : null}
                        </label>
                            
                        <button className="popup__submit-btn" aria-label="submit action" type="submit" name="submit-button" disabled={!isValid}>Save</button>
                    </Form>
                )}
            </Formik>
        </PopupWithForm>
    )
};

export default EditAvatarFormik;
