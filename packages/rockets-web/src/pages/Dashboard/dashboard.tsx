import { MenuDashboard } from '../../components/MenuDashboard/index';
import './dashboard.css';

import { useState } from 'react';
import notificacao from '../../assets/imgs/Vector (11).svg';
import CardReduzido from '../../components/CardReduzido/index';

export const Dashboard = () => {

    return (
        <div className='container-dash'>
            <MenuDashboard/>
            <div className='conteudo-dash'>
                <div className="titulo-dash">
                        <h1>Bem vindo, Thiago</h1>
                        <img src={notificacao} alt="notificacao" className="notificacao-dashboard"/>
                </div>
                <div className='cards-principais'>
                    <div className='novos-cadastrados-dash'>
                        <div className='novos-cadastrados-dash-alinhamento'>
                            <h1 className='titulo-novos-cadastrados'>Novos cadastrados</h1>
                            <CardReduzido/>
                            <CardReduzido/>
                            <CardReduzido/>
                            <CardReduzido/>
                        </div>
                    </div>
                    <div className='novas-vagas-dash'>
                        <div className='novos-cadastrados-dash-alinhamento'>
                            <h1 className='titulo-novas-vagas'>Novas Vagas</h1>
                            <CardReduzido/>
                            <CardReduzido/>
                            <CardReduzido/>
                            <CardReduzido/>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
  };