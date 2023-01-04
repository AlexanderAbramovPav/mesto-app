import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import AddPlaceFormik from "./AddPlaceFormik";
import ImagePopup from "./ImagePopup";
import EditProfileFormik from "./EditProfileFormik";
import EditAvatarFormik from "./EditAvatarFormik";
import React, { useState, useEffect } from "react";
import * as auth from "../utils/Auth.js";
import {
  Route,
  Switch,
  Redirect,
  Link,
  withRouter,
  useHistory,
} from "react-router-dom";
import Login from "./Login.js";
import Register from "./Register.js";
import ProtectedRoute from "./ProtectedRoute.js";
import InfoTooltip from "./InfoTooltip.js";
import errorIcon from "../images/icon-error.svg";
import okIcon from "../images/icon-ok.svg";

import { useMutation, useQueryClient } from 'react-query'
import { updateUserInfo, updateUserAvatar, changeLikeCardStatus, deleteUserCard, addUserCard } from "../utils/apiQuery";

function App(props) {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isPhotoSelected, setIsPhotoSelected] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedTooltip, setSelectedTooltip] = useState(null);
  const [loggedIn, setLoggedIn] = useState(null);


  // Processing clicks on Avatar, Profile, Place add

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }



  /// User info handlers
  const queryClient = useQueryClient()
  
  const userInfoMutation = useMutation (info => updateUserInfo(info), {
    onSuccess: () => {
      queryClient.invalidateQueries('userInfo');
      closeAllPopups();
    },
    onError: (error) => {
      console.log(error);
      handleSignSubmitPopup({
        icon: errorIcon,
        tipTitle: "Something went wrong! Try again.",
      });
    }
  })

  function handleUpdateUser(data) {
    userInfoMutation.mutate(data)
  }
  
  const userAvatarMutation = useMutation (info => updateUserAvatar(info), {
    onSuccess: () => {
      queryClient.invalidateQueries('userInfo');
      closeAllPopups();
    },
    onError: (error) =>{
      console.log(error);
      handleSignSubmitPopup({
        icon: errorIcon,
        tipTitle: "Something went wrong! Try again.",
      });
    }
  })

  function handleUpdateAvatar(data) {
    userAvatarMutation.mutate(data)
  }

  // Close all popups

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedTooltip(null);
    setIsPhotoSelected(false);
  }

  // Cards handlers

  const userCardLikeMutation = useMutation (data => changeLikeCardStatus(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('userSomeCards');
    },
    onError: (error) =>{
      console.log(error);
      handleSignSubmitPopup({
        icon: errorIcon,
        tipTitle: "Something went wrong! Try again.",
      });
    }
  })

  function handleCardLike(card, isLiked) {
    userCardLikeMutation.mutate([card._id, isLiked])
  }

  const userCardDeliteMutation = useMutation (data => deleteUserCard(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('userSomeCards');
    },
    onError: (error) => {
      console.log(error);
      handleSignSubmitPopup({
        icon: errorIcon,
        tipTitle: "Something went wrong! Try again.",
      });
    }
  })


  function handleCardDelete(card) {
    userCardDeliteMutation.mutate(card._id)
  }

  const userCardAddMutation = useMutation (data => addUserCard(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('userSomeCards');
      closeAllPopups();
    },
    onError: (error) => {
      console.log(error);
      handleSignSubmitPopup({
        icon: errorIcon,
        tipTitle: "Something went wrong! Try again.",
      });
    }
  })

  function handleAddPlaceSubmit(data) {
    userCardAddMutation.mutate(data)
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsPhotoSelected(true);
  }

  // Close popups by escape and overlay

  const isOpen =
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    selectedCard ||
    isPhotoSelected ||
    isInfoTooltipOpen;

  useEffect(() => {
    if (!isOpen) return;
    const closeByEscape = (e) => {
      if (e.key === "Escape") {
        closeAllPopups();
      }
    };
    document.addEventListener("keydown", closeByEscape);
    return () => document.removeEventListener("keydown", closeByEscape);
  }, [isOpen]);

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) {
      closeAllPopups();
    }
  };

  // Tooltips

  function handleSignSubmitPopup(selectedTooltip) {
    setSelectedTooltip(selectedTooltip);
    setIsInfoTooltipOpen(true);
  }

  // Exit

  const history = useHistory();

  function signOut() {
    localStorage.removeItem("isLogged");
    auth
      .logout()
      .then(() => history.push("/sign-in"));
  }

  // Login api

  function handleLogin(useFormData) {
    auth
      .authorize(useFormData.password, useFormData.email)
      .then((res) => {
        if (res) {
          setLoggedIn({
            loggedIn: true,
            email: useFormData.email,
          });

          localStorage.setItem("isLogged", "true");
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
        handleSignSubmitPopup({
          icon: errorIcon,
          tipTitle: "Something went wrong! Try again.",
        });
      });
  }

  function handleGetContent() {
    if (localStorage.getItem("isLogged")) {
      auth
        .checkToken()
        .then((res) => {
          if (res) {
            setLoggedIn({
              loggedIn: true,
              email: res.email,
            });
          }
        })
        .then(() => {
          props.history.push("/");
        })
        .catch((err) => {
          console.log(err);
          props.history.push("/sign-in");
        });
    }
  }

  useEffect(() => {
    handleGetContent();
  }, []);

  // Register api

  function handleRegister(useFormData) {
    auth
      .register(useFormData.password, useFormData.email)
      .then((res) => {
        if (res) {
          handleSignSubmitPopup({
            icon: okIcon,
            tipTitle: "You have successfully registered!",
          });
          history.push("/sign-in");
        }
      })
      .catch((err) => {
        console.log(err);
        handleSignSubmitPopup({
          icon: errorIcon,
          tipTitle: "Something went wrong! Try again.",
        });
      });
  }

  return (
    <>
      <Switch>
        <ProtectedRoute
          exact
          path="/"
          loggedIn={localStorage.getItem("isLogged")}
          component={
            <div className="page page_preload">
              <Header
                actionButton={"Log out"}
                onLogoutClick={signOut}
                onSignChange={"/sign-in"}
                loggedIn={loggedIn}
              />
              <Main
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              />
              <EditAvatarFormik
                isOpen={isEditAvatarPopupOpen}
                onClose={closeAllPopups}
                onUpdateUser={handleUpdateAvatar}
                onOutClick={handleOverlay}
              />
              <EditProfileFormik
                isOpen={isEditProfilePopupOpen}
                onClose={closeAllPopups}
                onUpdateUser={handleUpdateUser}
                onOutClick={handleOverlay}
              />
              <AddPlaceFormik
                isOpen={isAddPlacePopupOpen}
                onClose={closeAllPopups}
                onAddPlace={handleAddPlaceSubmit}
                onOutClick={handleOverlay}
              />
              <ImagePopup
                onClose={closeAllPopups}
                card={selectedCard}
                onOutClick={handleOverlay}
                isPhotoSelected={isPhotoSelected}
              />
            </div>
          }
        />
        <Route path="/sign-in">
          <div className="loginContainer">
            <Login
              onClose={closeAllPopups}
              onSubmitPopup={handleSignSubmitPopup}
              onSignChange={"/sign-up"}
              onLogin={handleLogin}
            />
          </div>
        </Route>
        <Route path="/sign-up">
          <div className="registerContainer">
            <Register
              onClose={closeAllPopups}
              onSubmitPopup={handleSignSubmitPopup}
              onSignChange={"/sign-in"}
              onRegister={handleRegister}
            />
          </div>
        </Route>
        <Route exact path="/">
          {loggedIn ? <Redirect exact to="/" /> : <Redirect to="/sign-in" />}
        </Route>
        <Route path="*">
          <div className="ErrorContainer">
            <h1 style={{ color: "white" }}>
              OOPS! It seems you have passed through a non-existent link... Well,
              no problems :) Go to - {" "}
              <Link to="/">Main page</Link>
            </h1>
          </div>
        </Route>
      </Switch>
      <InfoTooltip
        onClose={closeAllPopups}
        isOpen={isInfoTooltipOpen}
        selectedTooltip={selectedTooltip}
        onOutClick={handleOverlay}
      />
      <Footer />
    </>
  );
}

export default withRouter(App);
