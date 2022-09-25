import logoBranco from '../../assets/imgs/RemoteLife_horizontal-branco-sem-slogan 1.svg';
import './menuLateral.css';
import vetorRocket from '../../assets/imgs/VectorRocket.svg';

export const MenuLateral = () => {
    return (
      <div className="menuContainer">

        <div className="menuContentUm">
          <img src={logoBranco} alt="logoMenuLateral" />
          <p className='menuContentPUm'>A porta de entrada para sua carreira internacional em tecnologia.</p>
        </div>

        <div className="menuContentDois">
          <img src={vetorRocket} alt="rocket" />
          <p className='menuContentPDois'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et senectus posuere augue tellus. </p>
        </div>

      </div>
    );
  };