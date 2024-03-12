import { useState, useEffect, useRef } from 'react'
import './Cajas.css'
import {fechaActual} from './funciones.js'

export default function Cajas({userId}){
    return (
        <div>
            <TablaCajas userId={userId} />
        </div>
    );
}

function TablaCajas({userId}){
    const [cajas, setCajas] = useState([]);
    const [nombreDuplicado, setnombreDuplicado] = useState(false)
    const initialized = useRef(false);
    

    async function getCajas(){
        const token = localStorage.getItem('token');
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await fetch('https://localhost:7178/caja',requestOptions);

         const data = await response.json();
         console.log('Datos obtenidos (cajas):', data);
         return data;    
    }

    useEffect( () => {
        if (initialized.current){
            getCajas().then( data => {
                setCajas(data)
            })
        } else {
            initialized.current = true;
        }
    }, [])
    
    const eventEliminar = (id) => {
        console.log("toque eliminar al id= "+id)
        
        const requestOptions = {
            method: 'DELETE',
            // headers: { 'Content-Type': 'application/json' },
            // body: JSON.stringify({})
        };

        fetch('https://localhost:7178/caja/'+id, requestOptions).then(
            response => {
                console.log(response)
                getCajas().then( data => {
                    setCajas(data)
                })
            }
        )

    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const nombre = document.getElementById("nombre").value;
        const saldo = document.getElementById("saldo").value;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "caja" : {
                    "nombre" : nombre,
                    "saldo" : saldo,
                    "userId": userId
                },
                "fecha" : fechaActual()   
            })
        };
    
        fetch('https://localhost:7178/caja', requestOptions)
        .then(response => {
            console.log(response)
            if (response.status == 204){
                console.log("se ingreso nombre repetido");
                setnombreDuplicado(true);
            } else {
                getCajas().then( data => {
                    setCajas(data)
                })
                if (nombreDuplicado)
                    setnombreDuplicado(false);
            }
        }).catch(error => console.log(error));}
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
                <td><button onClick={() => eventEliminar(elem.id)}>X</button></td>
            </tr>
            )
        }
        </tbody>
        </table>

        <div>
            <form onSubmit={handleSubmit} action="#" className='form-nueva-caja'>
                <h2>Nueva caja</h2>
                <input type="text" id="nombre" name="nombre" placeholder='Nombre de la caja' required></input>
                <input type="number" step="0.01" id="saldo" name="saldo" placeholder='saldo inicial' required></input>
                <button type="submit">Enviar</button>
                <p className={nombreDuplicado ? 'form-nueva-caja-spanDuplicado-visible'
                :'form-nueva-caja-spanDuplicado-oculto'}>Nombre de caja duplicado</p>
            </form>
        </div>
            
        </>
    );
}


