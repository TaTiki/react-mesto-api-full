import successImage from '../images/Unionyes.svg';
import failImage from '../images/UnionNo.svg';
import { useLocation } from 'react-router';
export default function InfoTooltip({isOpen, success, onClose}) {
  const {pathname} = useLocation();
  const pathtext = pathname === '/sign-up' ? 'зарегистрировались' : 'вошли';
  const image = success ? successImage : failImage;
  const text = success ? `Вы успешно ${pathtext}!`: 'Что-то пошло не так! Попробуйте еще раз.'
  return (
    <div className={isOpen ? `popup popup_opened`:`popup`}>
      <div className = "popup__infotip">
        <img className = "popup__picture-img" src = {image}></img>
        <p className = "popup__text-title">{text}</p>
        <button className="popup__close-btn" type="reset"
        aria-label="Закрыть форму" onClick={onClose}></button>
    </div>
    </div>
  )
}