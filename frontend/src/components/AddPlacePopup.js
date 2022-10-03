import PopupWithForm from "./PopupWithForm";
import React, { useState, useEffect } from "react";

function AddPlacePopup(props) {
  // State that contains the input value
  const [placeName, setPlaceName] = useState("");
  const [placeLink, setPlaceLink] = useState("");

  // The input change handler updates the state
  function handlePlaceNameChange(e) {
    setPlaceName(e.target.value);
  }

  function handlePlaceLinkChange(e) {
    setPlaceLink(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    props.onAddPlace({
      name: placeName,
      link: placeLink,
    });
  }

  useEffect(() => {
    setPlaceName("");
    setPlaceLink("");
  }, [props.isOpen]);

  return (
    <PopupWithForm
      onClose={props.onClose}
      isOpen={props.isOpen}
      onSubmit={handleSubmit}
      name="add-card"
      title="New location"
      submit="Create"
      onOutClick={props.onOutClick}
    >
      <label className="popup__field">
        <input
          type="text"
          className="popup__input popup__input_type_place"
          placeholder="Place name"
          name="place-name"
          required
          minLength="2"
          maxLength="30"
          id="text-input"
          value={placeName}
          onChange={handlePlaceNameChange}
        />
        <span className="popup__error text-input-error"></span>
      </label>
      <label className="popup__field">
        <input
          type="url"
          className="popup__input popup__input_type_link"
          placeholder="Link to image"
          name="place-link"
          required
          id="url-input"
          value={placeLink}
          onChange={handlePlaceLinkChange}
        />
        <span className="popup__error url-input-error"></span>
      </label>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
