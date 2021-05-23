export default function ImagePopup({ card, onClose }) {

  return (
    <div className={card.link ? "popup popup_opened" : "popup"} id="show-photo">
      <div className="popup__container popup__container-photos">
        <form className="form-photos">
          <img className="form-photos__image" alt={card.name} src={card.link}/>
          <h4 className="form-photos__info">{card.name}</h4>
        </form>
        <button className="popup__close-btn" 
        aria-label="закрыть просмотр фотографии" onClick={onClose}></button>
      </div>
    </div>
  );
}
