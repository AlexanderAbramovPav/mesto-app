import React, {useContext } from 'react'
import {CurrentUserContext} from '../context/CurrentUserContext';
import Card from './Card';


function Main(props) {

    const currentUser = useContext(CurrentUserContext);

    return (
        <main className="main">
            <section className="profile">
                <div className="profile__avatar-container">
                    <img 
                        src={currentUser?.avatar}
                        className="profile__avatar"
                        alt="Логотип Пользователя"
                    />
                    <button className="profile__avatar-overlay" type="button" aria-label="Обновление аватара" onClick={props.onEditAvatar}></button>
                </div>

                <div className="profile__info-container">
                    <h1 className="profile__name">{currentUser?.name}</h1>
                    <button className="profile__edit-btn" type="button" aria-label="Изменение информации о себе" onClick={props.onEditProfile}></button>
                    <p className="profile__about">{currentUser?.about}</p>
                </div>
                <button className="profile__add-btn" type="button" aria-label="Добаление новой карточки" onClick={props.onAddPlace}></button>
            </section>

            <section className="elements">
                {props.userCards?.map((item) => (
                    <Card key={item._id} item={item} name={item.name} link={item.link} likes={item.likes.length} onCardClick={props.onCardClick} onCardLike={props.onCardLike} onCardDelete={props.onCardDelete} userCards={props.userCards}/>
                ))}
            </section>

        </main>
    );
}

export default Main;