import './formulario.css';
import vetorGit from '../../assets/imgs/Vectorgithub.svg';
import vetorGoogle from '../../assets/imgs/Vectorgoogle.svg';
import vetorLinkedin from '../../assets/imgs/Vectorlinkedin.svg';
import { useState } from 'react';

export const Formulario = () => {

    const [name, setName] = useState();

    function inputChangeName(e){
        setName(e.target.value);
    }

    console.log(name)

    return (
      <div className="formularioContainer">

        <div className="facaSeuCadastro">

            <h1 className='cadastroTitle'>Faça seu cadastro</h1>
            <div className="redesSociais">
                <div className="blocoRedes">
                    <img src={vetorGit} alt="Git" />
                    <small className='smallRedes'>Github</small>
                </div>
                <div className="blocoRedes">
                    <img src={vetorGoogle} alt="Google" />
                    <small className='smallRedes'>Google</small>
                </div>
                <div className="blocoRedes">
                    <img src={vetorLinkedin} alt="LinkedIn" />
                    <small className='smallRedes'>LinkedIn</small>
                </div>
            </div>

        </div>

        <div className="separar">

            <div className='line'></div>
            <small className='smallOu'>ou</small>
            <div className='line'></div>

        </div>

        <div className="formularioInfos">

            <label htmlFor="">Nome</label>
            <input type="text" placeholder='Seu nome' value={name} onChange={inputChangeName}/>

            <label htmlFor="">Email</label>
            <input type="text" placeholder='Email'/>

            <label htmlFor="">Senha</label>
            <input type="password" placeholder='Senha'/>

            <label htmlFor="">Confimar senha</label>
            <input type="password" placeholder='Confirmar senha'/>
            
            <button className='buttonFormulario'>Continuar</button>
        </div>

        <div>
            <small>Já possui conta?<span> Faça login</span></small>
        </div>

      </div>
    );
  };