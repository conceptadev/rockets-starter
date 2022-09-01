import './formularioContinue.css';

export const FormularioContinue = ({formData, setFormData}) => {
    
//flexwrap
    return (
      <div className="formularioContainer">

        <div className="formularioInfosWrap"> 
            <div className="formsCenter">
                <label htmlFor="">Data de Nascimento</label>
                <input className="dataNasc" type="number" placeholder='xx/mm/yy' value={formData.dataNasc} onChange={(event) => setFormData({...formData, dataNasc: event.target.value})}/>
            </div>

            <div className="formsCenter">
                <label htmlFor="">Número de telefone</label>
                <input className="cel" type="number" placeholder='88888888' value={formData.cel} onChange={(event) => setFormData({...formData, cel: event.target.value})}/>
            </div>

            <label htmlFor="">Em que você atua?</label>
            <input className="inputGeneralContinue" type="text" placeholder='Senha' />

            <label htmlFor="">Quais tecnologias você domina?</label>
            <input className="inputGeneralContinue" type="text" placeholder='tecnologias'/>

            <label htmlFor="">Conte sobre você</label>
            <input type="password" placeholder='Confirmar senha'/>

            <small>Anexe seu currículo</small>
            <button>Adicionar currículo</button>
             
        </div>

      </div>
    );
  };