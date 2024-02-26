import './App.css'
import InicioSesion from './InicioSesion.jsx'
import {useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode";

function App() {
const [logueado, setLogueado] = useState(false);
const [userName, setUserName] = useState('');
const [userId, setUserId] = useState(-1);


useEffect( () => {
  const token = localStorage.getItem('token');
  console.log(token);
  if (token !== null){
    console.log(token);
    const tokenDecoded = jwtDecode(token);
    setUserId(tokenDecoded.userId);
    setUserName(tokenDecoded.unique_name);
    setLogueado(true)
  }
}, [])
// useEffect( () => console.log("ususario logueado = id: "+userId+" username: "+userName),[userName]);

function nuevoInicio(token){
  setLogueado(true)
  const tokenDecoded = jwtDecode(token);
  localStorage.setItem('token', token);
  console.log(tokenDecoded);
  setUserId(tokenDecoded.userId);
  setUserName(tokenDecoded.unique_name);
}

function cerrarSesion(){
  setLogueado(false);
  setUserId(-1);
  setUserName('');
  localStorage.removeItem('token')
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
                <li><a href="#">Cajas</a></li>
                <li><a href="#">Movimientos</a></li>
                <li><a href="#" onClick = {cerrarSesion}>Salir</a></li>
              </>
          )}
              <li><a href="#">Acerca de</a></li>
          
          
          
          
        </ul>
        </nav>        
      </header>
      <main>
          { logueado ? <h1>logueado!</h1> : <InicioSesion nuevoInicio={nuevoInicio}/> }
        </main>

        <footer>
          Hola que tal
        </footer>
    </>
  )
}

export default App
