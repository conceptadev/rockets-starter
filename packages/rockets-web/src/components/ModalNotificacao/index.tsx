import './index.css'
import notificacao from '../../assets/imgs/Vector (11).svg';
import { useState } from 'react';
import user2 from '../../assets/imgs/Vector (10).svg';
export default function Notificacao(){
    const [showPostModal, setShowPostModal] = useState(false);

    function togglePostModal(){
        setShowPostModal(!showPostModal)
        
    }
    function ModalNotificacao(close){
        return(
            <div className='background-shadow-modal' >
                
                <div className='container-notificacao'>
                    <h1>Notificações</h1>
                    <CardNotificacao/>
                    <CardNotificacao/>
                    <CardNotificacao/>
                    <CardNotificacao/>

                </div>
            </div>
        )
    }


    function CardNotificacao(){
        return(
            <div className='notificacao-card'>
            <img className='foto-perfil-modal-notificacao'src={user2} alt="foto-perfil-modal" />
            <div className='conteudo-notificacao'>
                <p className='texto-principal-notificacao'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et senectus posuere augue tellus.</p>
                <p className='tempo-notificacao'>2 horas atrás</p>
            </div>

        </div>
        )
    }

    return(
        <div>
            <button onClick={()=>togglePostModal()}>
                <img src={notificacao} alt="notificacao" className="notificacao"/>
            </button>
            {showPostModal &&(
                    <ModalNotificacao close={togglePostModal}/>
                )
            }  
        </div>
    )
}