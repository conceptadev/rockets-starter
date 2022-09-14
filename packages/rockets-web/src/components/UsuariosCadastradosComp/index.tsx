import React from "react";

import './index.css';

import user from '../../assets/imgs/Vector (9).svg';

export default function UsuariosCadastradosComp(){
    return(
        <div className="container-user-cadastrado">
            
            <div className="container-conteudo">
                <div className="titulo-principal"><h1>Usuários cadastrados</h1></div>
                <div className="title-e-order-select">
                    <h2 className="titulo-secundario">Novos Cadastrados</h2>
                    <select id="orderSelect" name="orderSelect">
                        <option  disabled selected>Ordenar por:</option>
                        <option>Ordenar por: data de inscrição</option>
                        <option>Ordenar por: nome</option>
                    </select>
                </div>
                <div className="titulos-cards">
                    <h2 className="nome">Nome</h2>
                    <h2 className="idade">Idade</h2>
                    <h2 className="telefone">Telefone</h2>
                    <h2 className="tec">Tecnologias</h2>
                    <h2 className="atuacao">Atuação</h2>
                </div>

                <div className="cards">
                    <img src={user} alt="foto-perfil" className="foto-perfil"/>
                    <h2 className="card-nome">Lorem Impsum</h2>
                    <h2 className="card-idade">25 anos</h2>
                    <h2 className="card-telefone">83 9888-8888</h2>
                    <h2 className="card-tec">Angular, React, Nest JS</h2>
                    <h2 className="card-atuacao">Front-End</h2>

                </div>
            </div>
        </div>
    );
}