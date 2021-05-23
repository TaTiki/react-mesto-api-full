export default function PopupWithForm({ title, name, isOpen, children, onClose, onSubmit}) {
  return (
    <div className={isOpen ? `popup popup_type_${name} popup_opened`:
    `popup popup_type_${name}`}>

      <div className="popup__container">
        <form className="form" name={name} noValidate onSubmit={onSubmit}>
          <h3 className="form__header">{title}</h3>
          <fieldset className="form__fieldset">
            {children}
            <button
            className="form__save-btn"
            type="submit"
            disabled={false}>Сохранить</button>
          </fieldset>
        </form>
        <button className="popup__close-btn" type="reset"
        aria-label="Закрыть форму" onClick={onClose}></button>
      
      </div>
    </div>
  );
}
