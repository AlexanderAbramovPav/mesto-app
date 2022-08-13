import PopupWithForm from './PopupWithForm';
import React, { useState, useEffect, useContext } from 'react'
import {CurrentUserContext} from '../context/CurrentUserContext';

function EditProfilePopup(props) {

    // Стейт, в котором содержится значение инпута
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // Подписка на контекст
    const currentUser = useContext(CurrentUserContext);

    useEffect(() => {
        setName(currentUser?.name);
        setDescription(currentUser?.about);
    }, [currentUser, props.isOpen]); 

   


    // Обработчик изменения инпута обновляет стейт
    function handleNameChange(e) {
        setName(e.target.value);
    }

    
    function handleDescriptionChange(e) {
        setDescription(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        props.onUpdateUser({
            name,
            about: description,
        });
    }


    return (
        <PopupWithForm onClose={props.onClose} isOpen={props.isOpen} onSubmit={handleSubmit} name="edit-profile" title="Редактировать профиль" submit="Сохранить" onOutClick={props.onOutClick}>
            <label className="popup__field">
                <input
                    type="text"
                    className="popup__input popup__input_type_name"
                    placeholder="Как зовут?"
                    name="author-name"
                    required
                    minLength="2"
                    maxLength="40"
                    id="text-name-input" 
                    value={name || ""}
                    onChange={handleNameChange}
                />
                <span className="popup__error text-name-input-error"></span>
            </label>
            <label className="popup__field">
                <input
                type="text"
                className="popup__input popup__input_type_about"
                placeholder="Коротко о себе"
                name="author-about"
                required
                minLength="2"
                maxLength="200"
                id="text-about-input"
                value={description || ""} 
                onChange={handleDescriptionChange}
                />
                <span className="popup__error text-about-input-error"></span>
            </label>
        </PopupWithForm>
                
    );
}

export default EditProfilePopup;
