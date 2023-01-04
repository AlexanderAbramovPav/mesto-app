import React from 'react'
import Card from './Card';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { useQuery, useInfiniteQuery } from 'react-query' 
import { fetchUserInfo, fetchSomeUserCards } from "../utils/apiQuery"; 

function Main(props) {

    const userInfoQuery = useQuery("userInfo", fetchUserInfo, {staleTime: 50000})
    const userSomeCardsQuery = useInfiniteQuery(
        "userSomeCards",
        ({ pageParam = 1 }) => fetchSomeUserCards(pageParam),
        {
          getNextPageParam: (lastPage, allPages) => {
            const maxPages = Math.ceil(lastPage.cardsLength / 9);
            const nextPage = allPages.length + 1;
            console.log(nextPage, maxPages);
            return nextPage <= maxPages ? nextPage : undefined;
            },
        }
      );
    
    
      React.useEffect(() => {
        let fetching = false;
        const onScroll = async (event) => {
          const { scrollHeight, scrollTop, clientHeight } =
            event.target.scrollingElement;
            
          if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.5) {
            fetching = true;
            await userSomeCardsQuery.fetchNextPage();
            fetching = false;
          }
        };
    
        document.addEventListener("scroll", onScroll);
        return () => {
          document.removeEventListener("scroll", onScroll);
        };
      }, []);

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

            {userSomeCardsQuery.data ? 
            
                <section className="elements">
                    {userSomeCardsQuery.data.pages?.map((page) =>
                        page.cards.map((item) => (
                            <Card key={item._id} item={item} name={item.name} link={item.link} likes={item.likes} onCardClick={props.onCardClick} onCardLike={props.onCardLike} onCardDelete={props.onCardDelete} userCards={props.userCards}/>
                        )))}
                    </section>
            : 
                <Skeleton count={6} containerClassName="elements_skeleton" className='element_skeleton' borderRadius={"10px"}/>
            }

        </main>
        </SkeletonTheme>
    );
}

export default Main;