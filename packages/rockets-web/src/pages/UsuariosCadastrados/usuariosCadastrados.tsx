import {useState} from "react";
import { MenuDashboard } from "../../components/MenuDashboard/index";
import './usuariosCadastrados.css';
import  UsuariosCadastradosComp  from "../../components/UsuariosCadastradosComp/index";


export default function UsuariosCadastrados(){
    
    return(
        <div className="container-user">
            
            <MenuDashboard />
            <UsuariosCadastradosComp/>

        </div>
    );
}