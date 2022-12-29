import React, {useContext } from 'react'
import {CurrentUserContext} from '../context/CurrentUserContext';
import Card from './Card';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'


function Main(props) {

    const currentUser = useContext(CurrentUserContext);

    return (
        <SkeletonTheme  baseColor={"#2b2b2b"} highlightColor={"#474747"}>
            <main className="main">
            <section className="profile">
                <div className="profile__avatar-container">
                    {currentUser ? <img 
                        src={currentUser?.avatar}
                        className="profile__avatar"
                        alt="user avatar"
                    /> : <Skeleton height={"100%"} width={"120px"} circle={true}/>}
                    <button className="profile__avatar-overlay" type="button" aria-label="update avatar" onClick={props.onEditAvatar}></button>
                </div>

                <div className="profile__info-container">
                    {currentUser ? <h1 className="profile__name">{currentUser?.name}</h1> : <Skeleton height={"35px"} width={"220px"}/>}
                    <button className="profile__edit-btn" type="button" aria-label="update persnal info" onClick={props.onEditProfile}></button>
                    {currentUser ? <p className="profile__about">{currentUser?.about}</p> : <Skeleton height={"30px"} width={"150px"} style={{marginTop: "10px"}}/>}
                </div>
                <button className="profile__add-btn" type="button" aria-label="add new card" onClick={props.onAddPlace}></button>
            </section>

            {currentUser ? 
            
                <section className="elements">
                    {props.userCards?.map((item) => (
                            <Card key={item._id} item={item} name={item.name} link={item.link} likes={item.likes} onCardClick={props.onCardClick} onCardLike={props.onCardLike} onCardDelete={props.onCardDelete} userCards={props.userCards}/>
                        ))}
                    </section>
                : <Skeleton count={6} containerClassName="elements_skeleton" className='element_skeleton' borderRadius={"10px"}/>
            }

        </main>
        </SkeletonTheme>
    );
}

export default Main;