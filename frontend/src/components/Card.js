import { CurrentUserContext } from "../context/CurrentUserContext";
import React, { useContext } from "react";
import { useQuery } from 'react-query' ///
import { fetchUserInfo } from "../utils/apiQuery";

function Card(props) {
  
  const userInfoQuery = useQuery("userInfo", fetchUserInfo, {staleTime: 50000})

  const handleCardClick = () => {
    props.onCardClick(props.item);
  };

  const handleLikeClick = () => {
    props.onCardLike(props.item);
  };

  const handleDeleteClick = () => {
    props.onCardDelete(props.item);
  };

  // We determine whether we are the owner of the current card
  const isOwn = props.item.owner === userInfoQuery.data._id;

  // Creating a variable, which we will then set in `className` for the delete button
  const cardDeleteButtonClassName = `element__trash-btn ${
    isOwn ? "element__trash-btn_visible" : "element__trash-btn_hidden"
  }`;

  // We determine whether the card has a like set by the current user
  const isLiked = props.likes.some((i) => i === userInfoQuery.data._id);

  // Creating a variable, which we will then set in `className` for the like button
  const cardLikeButtonClassName = `element__like-btn ${
    isLiked ? "element__like-btn_liked" : ""
  }`;

  return (
    <div className="element">
      <img
        className="element__image"
        onClick={handleCardClick}
        src={props.link}
        alt={props.name}
      />
      <button
        className={cardDeleteButtonClassName}
        type="button"
        aria-label="Delete card"
        onClick={handleDeleteClick}
      ></button>
      <div className="element__mesto-container">
        <h2 className="element__title">{props.name}</h2>
        <div className="element__like-container">
          <button
            className={cardLikeButtonClassName}
            type="button"
            aria-label="Like the card"
            onClick={handleLikeClick}
          ></button>
          <p className="element__like-counter">{props.likes.length}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
