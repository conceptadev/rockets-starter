import './formulario.css';
import vetorGit from '../../assets/imgs/Vectorgithub.svg';
import vetorGoogle from '../../assets/imgs/Vectorgoogle.svg';
import vetorLinkedin from '../../assets/imgs/Vectorlinkedin.svg';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';

const schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(4).max(15).required(),
    passwordConfirm: yup.string().oneOf([yup.ref("password"), null])
})

export const Formulario = ({formData, setFormData, pageForm, setFormPage}) => {
    
    const { register, handleSubmit, clearErrors} = useForm({
        resolver: yupResolver(schema),
    });

    const submitForm = (data) => {
        if(data){
            setFormPage((currPage) => currPage + 1);
            console.log(pageForm)
            console.log(data)
        }
    }

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

        <form className="formularioInfos" onSubmit={handleSubmit(submitForm)}>

            <label htmlFor="">Nome</label>
            <input className="inputGeneral" {...register("name")} type="text" placeholder='Seu nome' value={formData.name} onChange={(event) => setFormData({...formData, name: event.target.value})}/>

            <label htmlFor="">Email</label>
            <input className="inputGeneral" {...register("email")} type="text" placeholder='Email' value={formData.email} onChange={(event) => setFormData({...formData, email: event.target.value})}/>

            <label htmlFor="">Senha</label>
            <input className="inputGeneral" {...register("password")} type="password" placeholder='Senha' value={formData.password} onChange={(event) => setFormData({...formData, password: event.target.value})}/>

            <label htmlFor="">Confimar senha</label>
            <input className="inputGeneral" {...register("passwordConfirm")} type="password" placeholder='Confirmar senha' value={formData.passwordConfirm} onChange={(event) => setFormData({...formData, passwordConfirm: event.target.value})}/>
            
            <button type="submit" className='btnContinuar'>Continuar</button>
            <div className='centerSmall'>
                <small>Já possui conta? <span>Faça o Login</span></small>
            </div>
            
        </form>

      </div>
    );
  };