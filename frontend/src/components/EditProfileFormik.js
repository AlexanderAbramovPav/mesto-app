import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import PopupWithForm from "./PopupWithForm";
import React from "react";
import { useQuery } from 'react-query' ///
import { fetchUserInfo } from "../utils/apiQuery";

function EditProfileFormik(props) {
    
    const userInfoQuery = useQuery("userInfo", fetchUserInfo, {staleTime: 50000})

    const PlaceSchema = Yup.object().shape({
        authorName: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
        authorAbout: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
    });
    
    function handleSubmit(values) {
    
        props.onUpdateUser({
          name: values.authorName,
          about: values.authorAbout,
        });

    }

    return (
        userInfoQuery.data && (<PopupWithForm
            onClose={props.onClose}
            isOpen={props.isOpen}
            onSubmit={props.onSubmit}
            name="edit-profile"
            title="Edit profile"
            onOutClick={props.onOutClick}
        >
            <Formik
                initialValues={{
                    authorName: userInfoQuery.data?.name,
                    authorAbout: userInfoQuery.data?.about,
                }}
                enableReintialize
                validationSchema={PlaceSchema}
                onSubmit={values => {
                    handleSubmit(values);
                }}
                >
                {({ errors, touched, isValid }) => (
                    <Form className="popup__form" name={`form_${props.name}`}>

                        <label className="popup__field">
                            <Field name="authorName" className="popup__input" placeholder="What's your name?" />
                                {errors.authorName && touched.authorName ? (
                                    <div className="popup__error">{errors.authorName}</div>) : null}             
                        </label>

                        <label className="popup__field">
                            <Field name="authorAbout" className="popup__input" placeholder="Write briefly about yourself"/>
                                {errors.authorAbout && touched.authorAbout ? (
                                    <div className="popup__error">{errors.authorAbout}</div>) : null}
                        </label>
                            
                        <button className="popup__submit-btn" aria-label="submit action" type="submit" name="submit-button" disabled={!isValid}>Save</button>
                    </Form>
                )}
            </Formik>
        </PopupWithForm>)
    )
};

export default EditProfileFormik;
