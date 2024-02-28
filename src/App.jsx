import './App.css'
import InicioSesion from './InicioSesion.jsx'
import Cajas from './Cajas.jsx'
import {useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode";

function App() {
const [logueado, setLogueado] = useState(false);
const [userName, setUserName] = useState('');
const [userId, setUserId] = useState(-1);
const [componenteActivo, setComponenteActivo] = useState(0);


useEffect( () => {
  const token = localStorage.getItem('token');
  console.log(token);
  console.log("Entreal usefect")
  if (token !== null){
    console.log(token);
    const tokenDecoded = jwtDecode(token);
    setComponenteActivo(1);
    setUserId(tokenDecoded.userId);
    setUserName(tokenDecoded.unique_name);
    setLogueado(true)
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

function setCajaActivo(){
  setComponenteActivo(2);
}

  return (
    <>
      <header>
      <nav>
        <ul>
          { !logueado ? 
          (
            <> 
              <li><a href="#">Inicio</a></li>

            </>
            ) 
          : (
              <>
                <li><a href="#" onClick={setCajaActivo}>Cajas</a></li>
                <li><a href="#">Movimientos</a></li>
                <li><a href="#" onClick = {cerrarSesion}>Salir</a></li>
              </>
          )}
              <li><a href="#">Acerca de</a></li>
          
          
          
          
        </ul>
        </nav>        
      </header>
      <main>
          { componenteActivo === 0 && <InicioSesion nuevoInicio={nuevoInicio}/>}
          { componenteActivo === 1 && <h1>Bienvenido {userName}</h1>}
          { componenteActivo === 2 && <Cajas userId={userId} />}
        </main>

        <footer>
          Hola que tal
        </footer>
    </>
  )
}

export default App
