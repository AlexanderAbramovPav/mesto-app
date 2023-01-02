import React from 'react'
import Card from './Card';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { useQuery } from 'react-query' 
import { fetchUserInfo, fetchUserCards } from "../utils/apiQuery"; 

function Main(props) {

    const userInfoQuery = useQuery("userInfo", fetchUserInfo, {staleTime: 50000})
    const userCardsQuery = useQuery("userCards", fetchUserCards, {staleTime: 50000})

    return (
        <SkeletonTheme  baseColor={"#2b2b2b"} highlightColor={"#474747"}>
            <main className="main">
            <section className="profile">
                <div className="profile__avatar-container">
                    {userInfoQuery.data ? <img 
                        src={userInfoQuery.data?.avatar}
                        className="profile__avatar"
                        alt="user avatar"
                    /> : <Skeleton height={"100%"} width={"120px"} circle={true}/>}
                    <button className="profile__avatar-overlay" type="button" aria-label="update avatar" onClick={props.onEditAvatar}></button>
                </div>

                <div className="profile__info-container">
                    {userInfoQuery.data ? <h1 className="profile__name">{userInfoQuery.data?.name}</h1> : <Skeleton height={"35px"} width={"220px"}/>}
                    <button className="profile__edit-btn" type="button" aria-label="update persnal info" onClick={props.onEditProfile}></button>
                    {userInfoQuery.data ? <p className="profile__about">{userInfoQuery.data?.about}</p> : <Skeleton height={"30px"} width={"150px"} style={{marginTop: "10px"}}/>}
                </div>
                <button className="profile__add-btn" type="button" aria-label="add new card" onClick={props.onAddPlace}></button>
            </section>

            {userCardsQuery.data ? 
            
                <section className="elements">
                    {userCardsQuery.data?.slice(0).reverse().map((item) => (
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