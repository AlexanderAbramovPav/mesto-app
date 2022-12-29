import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import PopupWithForm from "./PopupWithForm";


function AddPlaceFormik(props) {

    const PlaceSchema = Yup.object().shape({
        placeName: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
        placeLink: Yup.string().url('Invalid link').required('Required'),
    });
    
    function handleSubmit(values) {
    
        props.onAddPlace({
          name: values.placeName,
          link: values.placeLink,
        });

        values.placeName = ''
        values.placeLink = ''
    }

    return (
        <PopupWithForm
            onClose={props.onClose}
            isOpen={props.isOpen}
            onSubmit={props.onSubmit}
            name="add-card"
            title="New location"
            onOutClick={props.onOutClick}
        >
            <Formik
                initialValues={{
                    placeName: '',
                    placeLink: '',
                }}
                validationSchema={PlaceSchema}
                onSubmit={values => {
                    handleSubmit(values);
                }}
                >
                {({ errors, touched, isValid }) => (
                    <Form className="popup__form" name={`form_${props.name}`}>
                        <label className="popup__field">
                            <Field name="placeName" className="popup__input" placeholder="Place name"/>
                                {errors.placeName && touched.placeName ? (
                                    <div className="popup__error">{errors.placeName}</div>) : null}             
                        </label>

                        <label className="popup__field">
                            <Field name="placeLink" className="popup__input" placeholder="Link to image"/>
                                {errors.placeLink && touched.placeLink ? <div className="popup__error">{errors.placeLink}</div> : null}
                        </label>
                            
                        <button className="popup__submit-btn" aria-label="submit action" type="submit" name="submit-button" disabled={!isValid}>Create</button>
                    </Form>
                )}
            </Formik>
        </PopupWithForm>
    )
};

export default AddPlaceFormik;
