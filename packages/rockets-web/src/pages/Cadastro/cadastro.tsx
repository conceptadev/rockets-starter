import { HeaderCadastro } from '../../components/HeaderCadastro/headerCadastro';
import { MenuLateral } from '../../components/MenuLateral/menuLateral';
import { Formulario } from '../../components/Formulario/formulario';
import { FormularioContinue } from '../../components/FormularioContinue/formularioContinue';

import './cadastro.css';
import { useState } from 'react';
import { Registrado } from '../../components/Registrado/registrado';

export const Cadastro = () => {

  const [pageForm, setFormPage] = useState(0);
  
  const BtnTitle = ["Continuar", "Registrar"];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    dataNasc: "",
    cel: ""
  });

  const [blockBtn, setBlockBtn] = useState(false);
  const [smallBtn, setSmallBtn] = useState(false);

  const PageDisplay = () =>{
    if(pageForm === 0){
      return <Formulario formData={formData} setFormData={setFormData}/>;
    } else if (pageForm === 1){
      return <FormularioContinue formData={formData} setFormData={setFormData}/>
    } else{
      return <Registrado/>
    }
  }

  function submitCadastro(){
    if(pageForm === 0){
      if(formData.name !== "" && formData.email !== "" && formData.password !== "" && formData.passwordConfirm !== ""){
        if(formData.password !== formData.passwordConfirm){
          alert("senhas diferentes!")
        }else{
          setFormPage((currPage) => currPage + 1);
          console.log("deu bom!");
          smallDisplayChange()
        }
      } else {
        alert('preencha todos os campos!')
      }
    }else if(pageForm === 1){
      if(formData.dataNasc !== "" && formData.cel !== ""){
        setFormPage((currPage) => currPage + 1);
        console.log("deu bom!");
        btnDisplayChange();
      } else {
        alert('preencha todos os campos!')
      }
    }
  
   
  }

  function btnDisplayChange() {
    setBlockBtn(!blockBtn);
  }

  function smallDisplayChange() {
    setSmallBtn(!smallBtn);
  }

    return (
    <div className='containerCadastro'>
        <HeaderCadastro/>
        <div className="contentCadastro">
            <MenuLateral/>
            <div className="formCenter">
              {PageDisplay()}
              <div className='btnContinuar'>
                  <button className={`buttonFormulario ${blockBtn ? 'buttonFormulario-active' : ''}`} onClick={submitCadastro}>{BtnTitle[pageForm]}</button>
                  <small className={`smallz ${smallBtn ? 'smallz-active' : ''}`}>Já possui conta?<span> Faça login</span></small>
              </div>
            </div>
        </div>
      </div>
    );
  };