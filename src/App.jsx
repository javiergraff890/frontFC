import './App.css'
import InicioSesion from './InicioSesion.jsx'
import Cajas from './Cajas.jsx'
import Movimientos from './Movimientos.jsx'
import {useState, useEffect, useRef } from 'react'
import { jwtDecode } from "jwt-decode";

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
                <li><a href="#" onClick={ () => setComponenteActivo(1)}>{userName}</a></li>
                <li><a href="#" onClick={ () => setComponenteActivo(2)}>Cajas</a></li>
                <li><a href="#" onClick={ () => setComponenteActivo(3)}>Movimientos</a></li>
                <li><a href="#" onClick = {cerrarSesion}>Salir</a></li>
              </>
          )}
              <li><a href="#" onClick={ () => setComponenteActivo(4)}>Acerca de</a></li>
          
          
          
          
        </ul>
        </nav>        
      </header>
      <main>
          { componenteActivo === 0 && <InicioSesion nuevoInicio={nuevoInicio}/>}
          { componenteActivo === 1 && <h1>Bienvenido {userName}</h1>}
          { componenteActivo === 2 && <Cajas userId={userId} cerrarSesion={cerrarSesion} />}
          { componenteActivo === 3 && <Movimientos userId={userId} cerrarSesion={cerrarSesion}/>}
          { componenteActivo === 4 && <div>Acerca de</div>}
        </main>

        <footer>
          jjaviergraff@gmail.com
        </footer>
    </>
  )
}

export default App
