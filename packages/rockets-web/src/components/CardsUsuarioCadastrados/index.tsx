import React, { useState } from "react";
import './index.css';

import user2 from '../../assets/imgs/Vector (10).svg';
import Modal from "../modal/index";

export default function CardUsuario(){
    const [showPostModal, setShowPostModal] = useState(false);
    

    function togglePostModal(){
        setShowPostModal(!showPostModal)
        
        
    }

    return(
        
            <div className="container-card">
                <button onClick={()=>togglePostModal()}>
                    <div className="cards">
                        <img src={user2} alt="foto-perfil" className="foto-perfil-card"/>
                        <h2 className="card-nome">Lorem Impsum</h2>
                        <h2 className="card-idade">25 anos</h2>
                        <h2 className="card-telefone">83 9888-8888</h2>
                        <h2 className="card-tec">Angular, React, Nest JS</h2>
                        <h2 className="card-atuacao">Front-End</h2>

                    </div>
                </button>
                {showPostModal &&(
                    <Modal close={togglePostModal}/>
                )
                }
            </div>
        
    );
}

