import { HeaderCadastro } from '../../components/HeaderCadastro/headerCadastro';
import { MenuLateral } from '../../components/MenuLateral/menuLateral';
import { Formulario } from '../../components/Formulario/formulario';

import './cadastro.css';

export const Cadastro = () => {

  

    return (
    <div className='containerCadastro'>
        <HeaderCadastro/>
        <div className="contentCadastro">
            <MenuLateral/>
            <div className="formCenter">
              <Formulario/>
            </div>
        </div>
      </div>
    );
  };