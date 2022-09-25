import { HeaderCadastro } from '../../components/HeaderCadastro/headerCadastro';
import { MenuLateral } from '../../components/MenuLateral/menuLateral';
import { Formulario } from '../../components/Formulario/formulario';
import { FormularioContinue } from '../../components/FormularioContinue/formularioContinue';

import './cadastro.css';
import { useState } from 'react';
import { Registrado } from '../../components/Registrado/registrado';

export const Cadastro = () => {

  const [pageForm, setFormPage] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    dataNasc: "",
    cel: ""
  });


  const PageDisplay = () =>{
    if(pageForm === 0){
      return <Formulario pageForm={pageForm} setFormPage={setFormPage} formData={formData} setFormData={setFormData}/>;
    } else if (pageForm === 1){
      return <FormularioContinue pageForm={pageForm} setFormPage={setFormPage} formData={formData} setFormData={setFormData}/>
    } else{
      return <Registrado/>
    }
  }


    return (
    <div className='containerCadastro'>
        <HeaderCadastro/>
        <div className="contentCadastro">
            <MenuLateral/>
            <div className="formCenter">
              {PageDisplay()}
            </div>
        </div>
      </div>
    );
  };