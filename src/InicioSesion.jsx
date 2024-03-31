import "./InicioSesion.css";
import {useState, useRef} from 'react';
import 'boxicons'
import endpoints from "./endpoints.js"


export default function InicioSesion({nuevoInicio}) {
    const [login, setLogin] = useState(true)

    const toggleComponente = () => {
        setLogin(!login)
    }

    return (
        <>
            {login? <Login toggle={toggleComponente} nuevoInicio={nuevoInicio} /> : <Signup toggle={toggleComponente} nuevoInicio={nuevoInicio} /> }
        </>
    );
}



function Signup({toggle, nuevoInicio}){
    const [userName, setuserName] = useState('')
    const inputpassref = useRef(false);
    const divError = useRef(null);

    const handleSubmitSignUp = (event) => {
        event.preventDefault();
        signup().then().catch(error => console.log(error))
    }
    
    async function signup() {
        divError.current.textContent = "Creando usuario";
        const requestOptions = {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                "userName": userName,
                "password": inputpassref.current.value
              })
        }

        const response = await fetch(endpoints.ENDPOINT_SUBMIT_SIGNUP, requestOptions)

        if (response.ok){
            const token = await response.text();
            nuevoInicio(token);
        } else {
            const err = await response.json();
            if (err.error.code == "user_already_exist")
                divError.current.textContent = err.error.message;
        }
        return response;
    }
    
    const handleChangeName = (event) => {
        setuserName(event.target.value);
    }


    return(
            <div className="conteiner">
                <form onSubmit={handleSubmitSignUp}>
                    <h1>Sign Up</h1>
                    <div className="conteinerCampos">
                        <div className="input-div">
                            <box-icon name='user' color='#ffffff'></box-icon>
                            <input type="text" id="usuario" name="usuario" placeholder="Usuario" onChange={handleChangeName} required/>
                        </div>
                        <div className="input-div">
                            <box-icon name='lock-alt' color='#ffffff' ></box-icon>
                            <input ref={inputpassref} type="password" id="contrasena" name="contrasena" placeholder="Contraseña" required/>
                        </div>
                        <div ref ={divError} className="divError">
                            &nbsp;
                        </div>
                        <div className="input-div">
                            <box-icon name='lock-alt' color='rgba(255,255,255,0)' ></box-icon>
                            <button className="btn" type="submit">Registrarse</button>
                        </div>
                    </div>
                    <div className="registro-div">
                        <p>Tenes una cuenta? <a href="#" onClick={toggle}>Iniciar sesión</a></p>
                    </div>                
                </form>
            </div>
    );
}

function Login({toggle, nuevoInicio}){
    const [userName, setuserName] = useState('')
    const [datosCorrectos, setDatosCorrectos] = useState(true);
    const passwordInput = useRef(null);
    const divErrorRef = useRef(null);

    async function login(){
        divErrorRef.current.textContent = "Ingresando...";
        const response = await fetch(endpoints.ENDPOINT_POST_LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify({
                    "userName": userName,
                    "password": passwordInput.current.value
                  })
            })
            
            if (response.ok) {
                const token = await response.text();
                return token;
            }
            else if (response.status == '401'){
                const codigo = await response.text();
                return codigo;
            }else {
                throw new Error(response.status); 
            }    
    }

    const handleSubmit =  (event) => {
        event.preventDefault()
        
        login().then(token => {
            if (token == "user"){
                divErrorRef.current.textContent = "El usuario no existe"
            } else if (token == "password"){
                divErrorRef.current.textContent = "Password incorrecta"
            }
            else
                nuevoInicio(token);
        }).catch(error => { console.log(error) })
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
                <input ref={passwordInput} type="password" id="password" name="password" placeholder="Contraseña" required/>
            </div>
            <div ref={divErrorRef} className="divError">
                &nbsp;
            </div>
            <div className="input-div">
                <box-icon name='lock-alt' color='rgba(255,255,255,0)' ></box-icon>
                <button className="btn" type="submit">Iniciar Sesión</button>
            </div>
            </div>
            <div className="registro-div">
                <p>No tíenes cuenta? <a href="#" onClick={toggle}>Registrate</a></p>
            </div>
            
            </form>
        </div>
    );
}

