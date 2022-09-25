import React from "react";

import './index.css';



import CardUsuario from "../CardsUsuarioCadastrados";

export default function UsuariosCadastradosComp(){
    return(
        
            
            <div className="container-conteudo">
                <div className="titulo-principal">
                    <h1>Usuários cadastrados</h1>
                    
                </div>
                <div className="title-e-order-select">
                    <h2 className="titulo-secundario">Novos Cadastrados</h2>
                    
                </div>
                <div className="alinhamento-card">
                    <div className="titulos-cards">
                        <h2 className="nome">Nome</h2>
                        <h2 className="idade">Idade</h2>
                        <h2 className="telefone">Telefone</h2>
                        <h2 className="tec">Tecnologias</h2>
                        <h2 className="atuacao">Atuação</h2>
                    </div>
                    <CardUsuario/>
                    <CardUsuario/>
                    <CardUsuario/>
                    <CardUsuario/>
                    <CardUsuario/>
                    <CardUsuario/>
                    <CardUsuario/>
                    <CardUsuario/>
                    
                </div>
                
            </div>
        
    );
}