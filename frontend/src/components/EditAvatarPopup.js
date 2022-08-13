import PopupWithForm from './PopupWithForm';
import React, { useState, useEffect} from 'react'

function EditAvatarPopup(props) {

    const [avatar, setAvatar] = useState('');
    function handleAvatarChange(e) {
        setAvatar(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        props.onUpdateUser({
            avatar
        });
    }

    useEffect(() => {
        setAvatar('');
    }, [props.isOpen]);

    return (
        <PopupWithForm onClose={props.onClose} isOpen={props.isOpen} onSubmit={handleSubmit} name="avatar" title="Обновить аватар" submit="Сохранить" onOutClick={props.onOutClick}>
            <label className="popup__field">
                <input
                type="url"
                className="popup__input popup__input_type-avatar-link"
                placeholder="Ссылка на аватар"
                name="avatar-link"
                required
                id="url-avatar-input"
                value={avatar} 
                onChange={handleAvatarChange}
                />
                <span className="popup__error url-avatar-input-error"></span>
            </label>
        </PopupWithForm>
    );
}

export default EditAvatarPopup;