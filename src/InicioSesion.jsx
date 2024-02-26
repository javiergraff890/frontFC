import "./InicioSesion.css";
import {useState} from 'react';
import 'boxicons'


export default function InicioSesion({nuevoInicio}) {
    const [login, setLogin] = useState(true)

    const toggleComponente = () => {
        setLogin(!login);
      };

    return (
        <>
            {login? <Login toggle={toggleComponente} nuevoInicio={nuevoInicio} /> : <Signup toggle={toggleComponente} /> }
            {/* <button onClick={toggleComponente}>cambiar</button> */}
        </>
        
    );
}

function Signup({toggle}){
    return(
            <div className="conteiner">
                <form action="/login" method="post">
                    <h1>Sign Up</h1>
                <div className="conteinerCampos">
                <div className="input-div">
                    <box-icon name='user' color='#ffffff'></box-icon>
                    <input type="text" id="usuario" name="usuario" placeholder="Usuario" required/>
                </div>
                <div className="input-div">
                    <box-icon name='lock-alt' color='#ffffff' ></box-icon>
                    <input type="password" id="contrasena" name="contrasena" placeholder="Contraseña" required/>
                </div>
                <div className="input-div">
                    <box-icon name='lock-alt' color='rgba(255,255,255,0)' ></box-icon>
                    <button className="btn" type="submit">Iniciar Sesión</button>
                </div>
                </div>
                <div className="registro-div">
                    <p>No tienes cuenta? <a href="#" onClick={toggle}>Registrate</a></p>
                </div>
                
                </form>
            </div>
    );
}

function Login({toggle, nuevoInicio}){
    const [userName, setuserName] = useState('')

    async function login(){
        const pass = document.getElementById('password').value;
        const response = await fetch("https://localhost:7178/user/Login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify({
                    "userName": userName,
                    "password": pass
                  })
            })

            if (!response.ok) {
                throw new Error(response.status); 
              }
            console.log(response.status);
           
            const token = await response.text();
            return token;
            
            

    }

    const handleSubmit =  (event) => {
        event.preventDefault()
        console.log("username = ",userName);
        
        login().then(token => {
            console.log("token recibido: "+token);
            //const tokenDecoded = jwtDecode(token);
            //console.log(tokenDecoded)
            nuevoInicio(token);
        }).catch(error => {
            console.error('Error:', error);
        })
    }

    const handleChangeName = (event) => {
        setuserName(event.target.value);
    }


    return(
        <div className="conteiner">
            <form onSubmit={handleSubmit} >
                <h1>Login</h1>
            <div className="conteinerCampos">
            <div className="input-div">
                <box-icon name='user' color='#ffffff'></box-icon>
                <input type="text" id="usuario" name="usuario" placeholder="Usuario" onChange={handleChangeName} required/>
            </div>
            <div className="input-div">
                <box-icon name='lock-alt' color='#ffffff' ></box-icon>
                <input type="password" id="password" name="password" placeholder="Contraseña" required/>
            </div>
            <div className="input-div">
                <box-icon name='lock-alt' color='rgba(255,255,255,0)' ></box-icon>
                <button className="btn" type="submit">Iniciar Sesión</button>
            </div>
            </div>
            <div className="registro-div">
                <p>No tienes cuenta? <a href="#" onClick={toggle}>Registrate</a></p>
            </div>
            
            </form>
        </div>
    );
}

