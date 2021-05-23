import {useRef} from 'react';
export default function Login({onSubmit}) {
  const email = useRef();
  const password = useRef();

  const handleSubmit = (evt) => {
    evt.preventDefault();
    //console.log(email.current.value);
    //console.log(password.current.value);
    console.log(onSubmit);
    onSubmit(email.current.value, password.current.value)
    /*.then((data) => {
      console.log(data)
      history.push('/sign-in')
    }).catch(console.log);*/
  }
  return (
    <form className ="form-register" onSubmit = {handleSubmit}>
      <div className = "title">Вход </div>
      <input ref = {email} className ="form__input-email" placeholder = "Email" id = "add-email" type = "email"></input>
      <input  ref = {password} className = "form__input-email" placeholder = "Пароль" id = "add-password" type = "password"></input>
      <button className = "form-save">Войти</button>
    </form>
 )
}