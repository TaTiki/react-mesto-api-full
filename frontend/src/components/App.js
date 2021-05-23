import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import ImagePopup from "./ImagePopup";
import Main from "./Main";
import api from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import { Switch, Route, withRouter, useLocation } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from "./ProtectedRoute";
import auth from '../utils/auth';
import InfoTooltip from "./InfoTooltip";

function App({history}) {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isInfoTooltipPopupOpen, setInfoTooltipPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [JWT, setJWT] = useState('');
  const [email, setEmail] = useState('');
  const [headerProps, setHeaderProps] = useState({buttonText: '', onClick: () => {}});
  const [signSuccess, setSignSuccess] = useState(false);

  const { pathname } = useLocation();

  useEffect(() => {
    switch (pathname) {
      case '/':
        setHeaderProps({
          buttonText: 'Выйти',
          onClick: () => {
            localStorage.removeItem('JWT');
            setEmail('');
          }
        });
        
        break;
      case '/sign-in': 
        setHeaderProps({
          buttonText: 'Регистрация',
          onClick: () => {
            history.push('/sign-up');
          }
        });
        
        break;
      case '/sign-up': 
        setHeaderProps({
          buttonText: 'Войти',
          onClick: () => {
            history.push('/sign-in');
          }
        });
    }
  },[pathname] )

  useEffect(() => {
    if(JWT) {
      handleTokenCheck(JWT);
    } 
  }, [JWT])

  useEffect(() => {
    const JWT = localStorage.getItem('JWT');
    if(JWT) {
      setJWT(JWT);
    }
  }, []);

  useEffect(() => {
    if(email) {
      
      Promise.all([
        api.getUser(),
        api.getInitialCards(),
      ]).then(([user, cards]) => {
        setCurrentUser(user);
        setCards(cards);
      }).catch(console.log);
    }
  }, [email])

  const handleTokenCheck = (JWT) => {
      auth.getAuthUser(JWT).then((email) => {
        setEmail(email);
        history.push('/');
      }).catch(console.log)
  }

  const handleSignUp = (email, password) => {
    auth.signup(email, password).then(()=> {
      setSignSuccess(true)
      history.push('/sign-in')
    })
    .catch(()=> {
      setSignSuccess(false)
    }).finally(()=>{
      setInfoTooltipPopupOpen(true)
    })
   // setInfoTooltipPopupOpen(true);
  }

  const handleSignIn = (email, password) => {
    auth.signin(email, password).then((token) => {

      setSignSuccess(true)
      setJWT(token);
     
    }).catch(() => {
      setSignSuccess(false)
    }).finally(() => {
      setInfoTooltipPopupOpen(true)
    })
  }

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };
  
  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };
  
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  }

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({});
    setInfoTooltipPopupOpen(false);
  };

  const handleUpdateUser = (userInfo) => {
    return api.updateUserInfo(userInfo).then(setCurrentUser);
  }

  const handleUpdateAvatar = (avatar) => {
    return api.updateUserAvatar(avatar).then(setCurrentUser);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    const func = isLiked ? api.unlikeCard : api.likeCard;
    func(card._id).then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    }).catch(console.log);
  } 

  function handleCardDelete(card) {
    api.deleteCard(card._id).then(() => {
      setCards((state) => state.filter((c) => c._id !== card._id));
    }).catch(console.log);
  }

  function handleAddPlace(card) {
    return api.postCard(card).then((card) => {
      setCards([card, ...cards]);
    });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header email = {email} onClick = {headerProps.onClick} textButton = {headerProps.buttonText} />
        <Switch>
          <ProtectedRoute exact path = '/' component = { Main } onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick} onEditAvatar={handleEditAvatarClick} loggedIn = {email !== ''}
            onCardClick={handleCardClick} cards = {cards} onCardLike = {handleCardLike} onCardDelete = {handleCardDelete}/>
          <Route path = '/sign-up'>
            <Register onSubmit = {handleSignUp}/>
          </Route>  
          <Route path = '/sign-in'>
            <Login onSubmit = {handleSignIn}/>
          </Route>  
        </Switch>
        <EditProfilePopup isOpen ={isEditProfilePopupOpen} onClose ={closeAllPopups} onUpdateUser = {handleUpdateUser}/> 
        <EditAvatarPopup isOpen ={isEditAvatarPopupOpen} onClose ={closeAllPopups} onUpdateAvatar = {handleUpdateAvatar}/> 
        <AddPlacePopup isOpen = {isAddPlacePopupOpen} onClose = {closeAllPopups} onAddPlace = {handleAddPlace}/>
        <InfoTooltip isOpen = {isInfoTooltipPopupOpen} success = {signSuccess} onClose = {closeAllPopups}/>

        <ImagePopup card={selectedCard} onClose={closeAllPopups}/>

        <Footer/>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
