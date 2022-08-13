import mestoLogo from '../images/logo-white.svg';
import {Link} from 'react-router-dom';

function Header(props) {

  return (
    <header className="header">
        <img
        src={mestoLogo}
        alt="Логотип Mesto"
        className="header__logo"
        />
        <div className="header__container">
          {props.loggedIn?.loggedIn} ? <p className="header__email-info">{props.loggedIn?.email}</p>
          <button className="header__actionButton" onClick={props.onLogoutClick}><Link to={props.onSignChange} style={{ textDecoration: 'none', color: '#FFFFFF'}}>{props.actionButton}</Link></button>
        </div>
        
    </header>   
  );
}

export default Header;
