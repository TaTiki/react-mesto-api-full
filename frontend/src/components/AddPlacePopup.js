import {useRef} from 'react';
import PopupWithForm from './PopupWithForm';
export default function AddPlacePopup({isOpen, onClose, onAddPlace}) {
  const name = useRef();
  const link = useRef();
  function handleSubmit(e) {
    e.preventDefault();
  
    onAddPlace({
      name: name.current.value,
      link: link.current.value,
    }).then(onClose).catch(console.log);
  } 

  return (
    <PopupWithForm name="add-place" title="Новое место"
    isOpen={isOpen} onClose={onClose} onSubmit = {handleSubmit}>

      <input className="form__input" type="text" placeholder="Название"
      id="add-place-name" required minLength="2" maxLength="30" ref = {name}/>

      <input className="form__input" type="url"
      placeholder="Ссылка на картинку" id="add-place-link" required ref = {link}/>
    </PopupWithForm>
  )
}