import './index.css';
import btn from '../../assets/imgs/Vector (12).svg';

import user2 from '../../assets/imgs/Vector (10).svg';

export default function Modal({/*conteudo, */close}){
    return(
        <div className='modal'>
            <div className='container-modal'>
                <button className='close' onClick={close}>
                    <img src={btn} alt='close'/>
                </button>
                <div>
                    <img className='foto-perfil-modal'src={user2} alt="foto-perfil-modal" />
                </div>
                <div className='row'>
                    <span className='dados'>
                        Nome: <span className='dados-user'> Renan Dantas</span>
                    </span>
                </div>
                <div className='row'>
                    <span className='dados'>
                        Email: <span className='dados-user'>renangomesux@gmail.com</span>
                    </span>
                </div>
                <div className='row'>
                    <span className='dados'>
                        Data de Nascimento: <span className='dados-user'>00/00/00</span>
                    </span>
                </div>
                <div className='row'>
                    <span className='dados'>
                        Telefone: <span className='dados-user'>83988888888</span>
                    </span>
                </div>
                <div className='row'>
                    <span className='dados'>
                        Atuação: <span className='dados-user'>Front-end</span>
                    </span>
                </div>
                <div className='row'>
                    <span className='dados'>
                        Tecnologias: <span className='dados-user'> Lorem ipsum </span>
                    </span>
                </div>
                <div className='row'>
                    <span className='dados'>
                        Sobre: <span className='dados-user'> Lorem ipsum dolor sit amet consectetur adipisicing elit. Id non quis iusto dolore porro tenetur numquam autem deserunt voluptatum consequatur quo quaerat sunt sapiente sequi nulla hic dolorem, vero illo!</span>
                    </span>
                </div>
                <div className='alinhamento-btns'>
                    <button className='btn-modal-curriculo'>Visualizar Curriculo</button>
                    <button className='btn-modal-contato'>Entrar em contato</button>
                </div>
            </div>

        </div>
    )
}