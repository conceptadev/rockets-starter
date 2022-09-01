import './formulario.css';
import vetorGit from '../../assets/imgs/Vectorgithub.svg';
import vetorGoogle from '../../assets/imgs/Vectorgoogle.svg';
import vetorLinkedin from '../../assets/imgs/Vectorlinkedin.svg';

export const Formulario = ({formData, setFormData}) => {

    

    

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
            <input className="inputGeneral" type="text" placeholder='Seu nome' value={formData.name} onChange={(event) => setFormData({...formData, name: event.target.value})}/>

            <label htmlFor="">Email</label>
            <input className="inputGeneral" type="text" placeholder='Email' value={formData.email} onChange={(event) => setFormData({...formData, email: event.target.value})}/>

            <label htmlFor="">Senha</label>
            <input className="inputGeneral" type="password" placeholder='Senha' value={formData.password} onChange={(event) => setFormData({...formData, password: event.target.value})}/>

            <label htmlFor="">Confimar senha</label>
            <input className="inputGeneral" type="password" placeholder='Confirmar senha' value={formData.passwordConfirm} onChange={(event) => setFormData({...formData, passwordConfirm: event.target.value})}/>
            
            
        </div>

      </div>
    );
  };