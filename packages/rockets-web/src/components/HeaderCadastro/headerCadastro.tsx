import logo from '../../assets/imgs/Navbar logo.svg';
import './headerCadastro.css';

export const HeaderCadastro = () => {
    return (
      <header className='headerCadastro'>
        <nav className='navbarCadastro'>

          <img src={logo} alt="Logo"/>
          <div></div>

        </nav>
      </header>
    );
  };