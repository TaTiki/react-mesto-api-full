 import {Link} from 'react-router-dom';
 import {useRef} from 'react';
 export default function Register({onSubmit, history}) {
   const email = useRef();
   const password = useRef();

   const handleSubmit = (evt) => {
     evt.preventDefault();
     onSubmit(email.current.value, password.current.value)
   }
   return (

      <form className ="form-register" onSubmit = {handleSubmit}>
        <div className = "title">Регистрация </div>
        <input ref = {email} className ="form__input-email" placeholder = "Email" id = "add-email" type = "email"></input>
        <input ref = {password} className = "form__input-email" placeholder = "Пароль" id = "add-password" type = "password"></input>
        <button className = "form-save">Зарегистрироваться</button>
        <Link to = '/sign-in' className = "form__signin">Уже зарегистрированы? Войти</Link>
      </form>
   )
 }