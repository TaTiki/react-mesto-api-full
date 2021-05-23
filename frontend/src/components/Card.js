import {useContext} from 'react';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

export default function Card({ card, onCardClick, onCardLike, onCardDelete}) {
  const user = useContext(CurrentUserContext);
  const isOwn = card.owner._id === user._id;
  const isLiked = card.likes.some(i => i._id === user._id);
  return (
    <li className="photos__card">
      <img className="photos__image" alt="картинка" src={card.link} onClick={() => onCardClick(card)}/>
      <div className="photos__info">
        <h2 className="photos__name">{card.name}</h2>
        {isOwn && <button className="photos__delete-button" 
          aria-label="удалить фотографию" 
          onClick={() => {onCardDelete(card)}}></button>}
        <div className="photos__like-container">
          <button
          className= {isLiked ? "photos__like-button photos__like-button-active" : 'photos__like-button'}
          aria-label="лайк"
          type="button" onClick={() => {onCardLike(card)}}></button>
          <span className="photos__like-count">{card.likes.length}</span>
        </div>
      </div>
    </li>
  );
}
