import heroone from '../../assets/imgs/Img - Hero.svg';
import './registrado.css';

export const Registrado = () => {
    
  
      return (
        <div className='containerRegistro'>
            <h1 className='titleRegistro'>Seu registro foi efetuado com sucesso, logo será direcionado 
            ao dashboard</h1>
            <img src={heroone} alt="imagem" />
        </div>
      );
    };