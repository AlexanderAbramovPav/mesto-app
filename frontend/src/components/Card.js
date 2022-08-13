import {CurrentUserContext} from '../context/CurrentUserContext';
import React, { useContext } from 'react'


function Card(props) {

    const currentUser = useContext(CurrentUserContext);


    const handleCardClick = () => {
        props.onCardClick(props.item);
    }

    const handleLikeClick = () => {
        props.onCardLike(props.item);
    }

    const handleDeleteClick = () => {
        props.onCardDelete(props.item);
    }

    // Определяем, являемся ли мы владельцем текущей карточки
    const isOwn = props.item.owner._id === currentUser._id;

    // Создаём переменную, которую после зададим в `className` для кнопки удаления
    const cardDeleteButtonClassName = (
        `element__trash-btn ${isOwn ? 'element__trash-btn_visible' : 'element__trash-btn_hidden'}`
    );

    // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
    const isLiked = props.item.likes.some(i => i._id === currentUser._id);

    // Создаём переменную, которую после зададим в `className` для кнопки лайка
    const cardLikeButtonClassName = (
        `element__like-btn ${isLiked ? 'element__like-btn_liked' : ''}`
    );; 

    return (
        <div className="element" >
            <img
                className="element__image"
                onClick={handleCardClick} src={props.link} alt={props.name}
            />
            <button className={cardDeleteButtonClassName} type="button" aria-label="Удалить карточку" onClick={handleDeleteClick}></button>
            <div className="element__mesto-container">
                <h2 className="element__title">{props.name}</h2>
                <div className="element__like-container">
                    <button className={cardLikeButtonClassName} type="button" aria-label="Поставить Лайк карточке" onClick={handleLikeClick}></button>
                    <p className="element__like-counter">{props.likes}</p>
                </div>
            </div>
        </div>
    );
}

export default Card;
