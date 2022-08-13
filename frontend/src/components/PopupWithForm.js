function PopupWithForm(props) {
  return (
    <div className={props.isOpen ? `popup popup_type_${props.name} popup_opened` : `popup popup_type_${props.name}`} onClick={props.onOutClick}>
      <div className="popup__container">
        <h2 className="popup__title">{props.title}</h2>
        <form className="popup__form" name={`form_${props.name}`} onSubmit={props.onSubmit} >
            {props.children}
          <button className="popup__submit-btn" aria-label="Подтвердить действие" type="submit" name="submit-button">{props.submit}</button>
        </form>
        <button className="popup__close-btn" type="button" aria-label="Закрыть попап" onClick={props.onClose}></button>
      </div>
    </div>
  );
}

export default PopupWithForm;