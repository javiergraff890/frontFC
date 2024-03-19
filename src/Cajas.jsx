import { useState, useEffect, useRef } from 'react'
import './Cajas.css'
import {fechaActual} from './funciones.js'
import swal from 'sweetalert'

export default function Cajas({userId, cerrarSesion}){
    return (
        <div>
            <TablaCajas userId={userId} cerrarSesion={cerrarSesion} />
        </div>
    );
}

function TablaCajas({userId, cerrarSesion}){
    const [cajas, setCajas] = useState([]);
    const [nombreDuplicado, setnombreDuplicado] = useState(false)
    const initialized = useRef(false);
    const inputNombreRef = useRef(null);
    const inputSaldoRef = useRef(null);
    const [botonesActivos, setBotonesActivos] = useState(false);
    const divcargando = useRef(false);

    async function getCajas(){
        if (divcargando.current != null)
            divcargando.current.textContent = "Cargando cajas ...";
        const token = localStorage.getItem('token');
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await fetch('https://localhost:7178/caja',requestOptions);

        if (response.status == 401){
            swal('Sesion expirada', 'Vuelva a iniciar sesion', )
            cerrarSesion()
            return [];
        }

         const data = await response.json();
         console.log('Datos obtenidos (cajas):', data);

         if (divcargando.current != null){
            if (data.length == 0)
                divcargando.current.textContent = "No hay cajas";
            else
                divcargando.current.textContent = "";
         }
            

         return data;    
    }

    useEffect( () => {
        if (initialized.current){
            getCajas().then( data => {
                setCajas(data)
                setBotonesActivos(true);
            })
        } else {
            initialized.current = true;
        }
    }, [])
    
    const eventEliminar = (id) => {

        if (botonesActivos){
            setBotonesActivos(false);
            console.log("toque eliminar al id= "+id)
            const token = localStorage.getItem('token');
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
                // headers: { 'Content-Type': 'application/json' },
                // body: JSON.stringify({})
            };

            fetch('https://localhost:7178/caja/'+id, requestOptions).then(
                response => {
                    console.log(response)
                    if (response.status == 401){
                        swal('Sesion expirada', 'Vuelva a iniciar sesion', )
                        cerrarSesion()
                    } else
                        getCajas().then( data => {
                            setCajas(data)
                            setBotonesActivos(true);
                        })
                }
            ).catch( error => console.log(error))
        }

    }
    //sacada de GPT!
    function obtenerFechaExpiracion(jwt) {
        const payloadBase64 = jwt.split('.')[1]; // Obtiene el payload del JWT (la segunda parte)
        const payload = JSON.parse(atob(payloadBase64)); // Decodifica el payload Base64 y lo convierte a objeto JSON
        
        if (payload.exp) {
            return new Date(payload.exp * 1000).toString().split('(')[0]; // Multiplica por 1000 para convertir de segundos a milisegundos
        } else {
            return null; // El token no tiene una fecha de expiración
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        //const nombre = document.getElementById("nombre").value;
        //const saldo = document.getElementById("saldo").value;
        if (botonesActivos){
            setBotonesActivos(false);
            const nombre = inputNombreRef.current.value;
            const saldo = inputSaldoRef.current.value;
            const token = localStorage.getItem('token');
            const requestOptions = {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    "caja" : {
                        "nombre" : nombre,
                        "saldo" : saldo,
                        "userId": userId
                    },
                    "fecha" : fechaActual()   
                })
            };
        
            inputNombreRef.current.value = "";
            inputSaldoRef.current.value = "";
            fetch('https://localhost:7178/caja', requestOptions)
            .then(response => {
                console.log(response)
                if (response.status == 204){
                    console.log("se ingreso nombre repetido");
                    setnombreDuplicado(true);
                    setBotonesActivos(true);
                } else if (response.status == 401){
                    swal('Sesion expirada', 'Vuelva a iniciar sesion - nueva caja\n'+obtenerFechaExpiracion(token) )
                    cerrarSesion()
                } else {
                    getCajas().then( data => {
                        setCajas(data)
                        setBotonesActivos(true);
                    })
                    
                    if (nombreDuplicado)
                        setnombreDuplicado(false);
                }
                
            }).catch(error => console.log(error));
            
        }
    }

    return (
        <>
        <table className='tabla-cajas'>
            {/* <caption>Cajas</caption> */}
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Saldo</th>
                    <th>Eliminar</th>
                </tr>
            </thead>
            <tbody>
        {
            cajas.map( (elem) =>
            <tr key={elem.id}>
                <td>{elem.nombre}</td>
                <td>{elem.saldo}</td>
                <td>{botonesActivos ? <button onClick={() => eventEliminar(elem.id)}>X</button> : <></> }</td>
            </tr>
            )
        }
        </tbody>
        </table>
        <div className="divCargando" ref={divcargando}></div>
        {/* <div> */}
            <form onSubmit={handleSubmit} action="#" className='form-nueva-caja'>
                <h2>Nueva caja</h2>
                <input ref={inputNombreRef} type="text" id="nombre" name="nombre" placeholder='Nombre de la caja' required></input>
                <input ref={inputSaldoRef} type="number" step="0.01" id="saldo" name="saldo" placeholder='Saldo inicial' required></input>
                <button disabled={!botonesActivos} type="submit">Enviar</button>
                <p className={nombreDuplicado ? 'form-nueva-caja-spanDuplicado-visible'
                :'form-nueva-caja-spanDuplicado-oculto'}>Nombre de caja duplicado</p>
            </form>
        {/* </div> */}
            
        </>
    );
}


