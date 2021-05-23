import { useRef } from 'react';
import PopupWithForm from './PopupWithForm';

export default function EditAvatarPopup({isOpen, onClose, onUpdateAvatar}) {
  const avatar = useRef();
  function handleSubmit(e) {
    e.preventDefault();
  
    onUpdateAvatar({
      avatar: avatar.current.value,
    }).then(onClose).catch(console.log);
  } 

  return (
    <PopupWithForm name="edit-avatar" title="Обновить аватар"
    isOpen={isOpen} onClose={onClose} onSubmit = {handleSubmit}>

      <input className="form__input" type="url"
      placeholder="Ссылка на картинку" id="edit-avatar-link" required ref = {avatar}/>
    </PopupWithForm>

  )
}
