import './App.css'
import InicioSesion from './InicioSesion.jsx'
import Cajas from './Cajas.jsx'
import AcercaDe from './AcercaDe.jsx'
import Movimientos from './Movimientos.jsx'
import {useState, useEffect, useRef } from 'react'
import { jwtDecode } from "jwt-decode"
import swal from 'sweetalert'
import endpoints from './endpoints.js'


function App() {
const [logueado, setLogueado] = useState(false);
const [userName, setUserName] = useState('');
const [userId, setUserId] = useState(-1);
const [componenteActivo, setComponenteActivo] = useState(0);
const initialized = useRef(false);

useEffect( () => {

  if (!initialized.current){
    initialized.current = true;
    const token = localStorage.getItem('token');
    console.log("token desde usefect -> app.jsx "+token);
    console.log("Entreal usefect")
    if (token !== null){
      const tokenDecoded = jwtDecode(token);
      setComponenteActivo(1);
      setUserId(tokenDecoded.userId);
      setUserName(tokenDecoded.unique_name);
      setLogueado(true)
    }
  }
  
}, [])
// useEffect( () => console.log("ususario logueado = id: "+userId+" username: "+userName),[userName]);

function nuevoInicio(token){
  if (token !== '401'){
    setLogueado(true)
    const tokenDecoded = jwtDecode(token);
    localStorage.setItem('token', token);
    console.log(tokenDecoded);
    setComponenteActivo(1);
    setUserId(tokenDecoded.userId);
    setUserName(tokenDecoded.unique_name);
  }
  
}

function cerrarSesion(){
  setLogueado(false);
  setUserId(-1);
  setUserName('');
  localStorage.removeItem('token')
  setComponenteActivo(0);
}


  return (
    <>
      <header>
      <nav>
        <ul>
          { !logueado ? 
          (
            <> 
              <li><a href="#" onClick={ () => setComponenteActivo(0)}>Inicio</a></li>

            </>
            ) 
          : (
              <>
                <li><a href="#" onClick={ () => setComponenteActivo(1)}>{userName.substring(0, 1).toUpperCase() + userName.substring(1)}</a></li>
                <li><a href="#" onClick={ () => setComponenteActivo(2)}>Cajas</a></li>
                <li><a href="#" onClick={ () => setComponenteActivo(3)}>Movimientos</a></li>
                
              </>
          )}
              <li><a href="#" onClick={ () => setComponenteActivo(4)}>Acerca de</a></li>
            { logueado ? (
              <>
                  <li><a href="#"></a></li> 
                  <li><a href="#" onClick = {cerrarSesion}>Salir</a></li>   
              </>
              
                
            ) :
            <></>
            }
        </ul>
        </nav>        
      </header>
      <main>
          { componenteActivo === 0 && <InicioSesion nuevoInicio={nuevoInicio}/>}
          { componenteActivo === 1 && <Usuario userName={userName} cerrarSesion={cerrarSesion}/>}
          { componenteActivo === 2 && <Cajas userId={userId} cerrarSesion={cerrarSesion} />}
          { componenteActivo === 3 && <Movimientos userId={userId} cerrarSesion={cerrarSesion}/>}
          { componenteActivo === 4 && <AcercaDe />}
        </main>

        <footer>
          jjaviergraff@gmail.com
        </footer>
    </>
  )
}

function Usuario({userName, cerrarSesion}){
  
  async function eliminarCuenta(){
    const token = localStorage.getItem('token');

      const RequestOptions = {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    const response = await fetch(endpoints.ENDPOINT_DELETE_USER , RequestOptions)

    return response;

  }

  const onSubmitDelete = () =>{
    swal({
      title: "Estas seguro que deseas eliminar tu cuenta?", 
      text :"Se eliminaran todas las cajas y movimientos", 
      icon: "warning",
      buttons: ['Cancelar', 'Aceptar']
    }).then( result => {
      if (result){
          eliminarCuenta().then( response => {
            console.log(response)
            cerrarSesion();
          });
        }
          
    });
  }

  

  return(
    <>
    <div>
    <h1>Bienvenido <span>{userName}</span></h1>
    <button onClick={onSubmitDelete} className="botonEliminarCuenta" type="button">Eliminar Cuenta</button>
    </div>     
    </>
    
  )
}

export default App
