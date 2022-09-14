import React from "react";
import { MenuDashboard } from "../../components/MenuDashboard/index";
import './usuariosCadastrados.css';
import  UsuariosCadastradosComp  from "../../components/UsuariosCadastradosComp/index";

import user from '../../assets/imgs/Vector (9).svg';

export default function UsuariosCadastrados(){
    return(
        <div className="container-user">
            <div>
                <MenuDashboard/>
            </div>
            <div>
                <UsuariosCadastradosComp/>
            </div>
            
        </div>
    );
}