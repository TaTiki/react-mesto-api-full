import { useState, useContext, useEffect } from 'react';
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import PopupWithForm from './PopupWithForm';

export default function EditProfilePopup({isOpen, onClose, onUpdateUser}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const user = useContext(CurrentUserContext);

  useEffect(() => {
    setName(user.name);
    setDescription(user.about);
  }, [user]);
  
   const handleOnChange = (evt) => {
    if(evt.target.id === "edit-profile-name"){
      setName(evt.target.value);
    }else{
      setDescription(evt.target.value);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
  
    onUpdateUser({
      name,
      about: description,
    }).then(onClose).catch(console.log);
  } 

  return (
    <PopupWithForm name="edit-profile" title="Редактировать профиль"
      isOpen ={isOpen} onClose={onClose} onSubmit = {handleSubmit}>

      <input className="form__input" type="text" id="edit-profile-name" 
      placeholder="имя" value = {name} required minLength="2" maxLength="40" onChange = {handleOnChange}/>

      <input className="form__input" type="text" id="edit-profile-hobby"
      placeholder="хобби" value = {description} required minLength="2" maxLength="200" onChange = {handleOnChange}/>
    </PopupWithForm>
  );
} 