import React from "react";

import'./index.css';
import user2 from '../../assets/imgs/Vector (10).svg';
export default function CardReduzido(){
    return(
        <div className="container-card-reduzido">
                <div className="cards-reduzidos">
                    <img src={user2} alt="foto-perfil" className="foto-perfil-card"/>
                    <h2 className="card-nome-reduzido">Lorem Impsum</h2>
                    <h2 className="card-atuacao-reduzido">Front-End</h2>

                </div>
        </div>
    );

}