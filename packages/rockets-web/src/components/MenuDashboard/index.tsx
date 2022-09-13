import React from "react";
import logoBranco from '../../assets/imgs/RemoteLife_horizontal-branco-sem-slogan 1.svg';
import './index.css';
import user from '../../assets/imgs/Vector (9).svg';


export const MenuDashboard = ()=> {



    return(
        <div className="containerMenu">
            <img src={logoBranco} alt='Logo'/>
            <div className="menu-principal">
                <ul>
                    <li>
                        <a href="#"><span className="material-symbols-outlined">rocket_launch</span>Usuários cadastrados</a>
                    </li>
                    <li>
                        <a href="#"><span className="material-symbols-outlined">rocket_launch</span>Vagas</a>
                    </li>
                    <li>
                        <a href="#"><span className="material-symbols-outlined">rocket_launch</span>Lorem</a>
                    </li>
                    <li>
                        <a href="#"><span className="material-symbols-outlined">rocket_launch</span>Lorem</a>
                    </li>
                </ul>
            </div>
            <div className="perfil-adm">
                <img src={user} alt="foto-perfil" className="foto-perfil"/>
                <h2>Thiago</h2>
                <p>Administrator</p>
                <a href="#"><span className="material-symbols-outlined logout">logout</span>
                </a>
            </div>



        </div>

    );
}