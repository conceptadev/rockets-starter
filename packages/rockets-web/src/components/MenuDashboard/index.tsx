import {useState} from "react";
import logoBranco from '../../assets/imgs/RemoteLife_horizontal-branco-sem-slogan 1.svg';
import './index.css';
import user from '../../assets/imgs/Vector (9).svg';
import { Link } from "react-router-dom";


export const MenuDashboard = ()=> {

    const [active1, setActive1] = useState(false);


    return(
        <div className="containerMenu">
            <Link to='/dashboard'><img src={logoBranco} alt='Logo'/></Link>
            <div className="menu-principal">
                <ul>
                    <li>
                        <Link onClick={() =>  setActive1(true) } to='/dashboard/usuarios-cadastrados' className={`${active1 ? 'active' : ''}`} ><span className="material-symbols-outlined">account_circle</span>Usuários cadastrados</Link>
                    </li>
                    <li>
                        <Link  to='/dashboard'><span className="material-symbols-outlined">rocket_launch</span>Vagas</Link>
                        
                    </li>

                </ul>
            </div>
            <div className="perfil-adm">
                <img src={user} alt="foto-perfil" className="foto-perfil"/>
                <h2>Thiago</h2>
                <p>Administrator</p>
                <a href="#"><span className="material-symbols-outlined logout">logout</span>
                </a>
            </div>



        </div>

    );
}