import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Card from './Card';

export default function Main({ onEditProfile, onAddPlace, onEditAvatar, onCardClick, cards, onCardLike, onCardDelete }) {
  const user = useContext(CurrentUserContext);
 
  return (
    <main>
      <section className="profile">
        <div className="profile__container">
          <div className="profile__container-marker">
            <img className="profile__picture" alt="Аватар" src={user.avatar}/>
            <button
            className="profile__picture-edit-button"
            aria-label="открыть форму обновления аватара профиля"
            onClick={onEditAvatar}></button>
          </div>
          <div className="profile__data">
            <div className="profile__info">
              <h1 className="profile__name">{user.name}</h1>
              <p className="profile__hobby">{user.about}</p>
            </div>
            <button
            className="profile__edit-button"
            aria-label="редактировать профиль"
            type="button"
            onClick={onEditProfile}></button>
          </div>
        </div>
        <button
        className="profile__add-button"
        aria-label="добавить фотографии"
        type="button"
        onClick={onAddPlace}></button>
      </section>
      <section className="photos">
        <ul className="photos__list">
          {
            cards.map(card => (
              <Card card={card} key={card._id} onCardClick={onCardClick} onCardLike = {onCardLike} onCardDelete = {onCardDelete}/>
            ))
          }
        </ul>
      </section>
    </main>
  );
}
