import "./InicioSesion.css";
import {useState, useRef} from 'react';
import 'boxicons'
import endpoints from "./endpoints.js"


export default function InicioSesion({nuevoInicio}) {
    const [login, setLogin] = useState(true)

    const toggleComponente = () => {
        setLogin(!login);
      };

    return (
        <>
            {login? <Login toggle={toggleComponente} nuevoInicio={nuevoInicio} /> : <Signup toggle={toggleComponente} nuevoInicio={nuevoInicio} /> }
            {/* <button onClick={toggleComponente}>cambiar</button> */}
        </>
        
    );
}



function Signup({toggle, nuevoInicio}){
    const [userName, setuserName] = useState('')
    const [creacionIncorrecta, setcreacionIncorrecta] = useState(false);
    const inputpassref = useRef(false);

    const handleSubmitSignUp = (event) => {
        event.preventDefault();
        console.log("estoy en singup");
        signup().then(
            response => {
                console.log(response);
            }
        )
    }
    
    async function signup() {
        const pass = inputpassref.current.value;

        const requestOptions = {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                "userName": userName,
                "password": pass
              })
        }

        
        const response = await fetch(endpoints.ENDPOINT_SUBMIT_SIGNUP, requestOptions)

        if (response.ok){
            console.log("usuario creado con exito");

            const token = await response.text();
            nuevoInicio(token);
        } else {
            setcreacionIncorrecta(true);
        }


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
                {
                    creacionIncorrecta ? (
                        <div className="divError">
                            Usuario existente
                        </div>
                    )
                    :
                    <div className="divespacio">
                         »
                    </div>
                }
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
    
    async function login(){
        const pass = document.getElementById('password').value;
        const response = await fetch(endpoints.ENDPOINT_POST_LOGIN, {
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
            if (error == "Error: 401"){
                nuevoInicio('401');
                setDatosCorrectos(false);
                console.error("no autorizado");
            } else {
                console.error(error); 
            }
                
            
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
            {
                !datosCorrectos ? (
                    <div className="divError">
                        Usuario o Password Incorrectos
                    </div>
                )
                :
                    <div className="divespacio">
                         »
                    </div>
            }
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

