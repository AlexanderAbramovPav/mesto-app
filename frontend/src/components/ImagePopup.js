function ImagePopup(props) {

  return (
    <div className={props.isPhotoSelected ? `popup popup-img popup_opened` : `popup popup-img`} onClick={props.onOutClick}>
      <div className="popup__img-container">
        <img
            src={props.card?.link} 
            alt={props.card?.name}
            className="popup__image"
          />
          <p className="popup__img-title">{props.card?.name}</p>
          <button className="popup__close-btn" type="button" aria-label="Close the card" onClick={props.onClose}></button>
      </div>
    </div>
  );
}

export default ImagePopup;