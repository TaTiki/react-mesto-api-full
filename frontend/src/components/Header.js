import logo from '../images/logo.svg';

export default function Header({email, textButton, onClick}) {
  return (
    <header className="header">
      <img className="header__logo" alt="логотип" src={logo}/>
      <div className = "header__email">{email} 
      <button className = "header__link" onClick = {onClick}>{textButton}</button>
      </div>
    </header>
  );
}
