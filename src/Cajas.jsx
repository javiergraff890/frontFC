import { useState, useEffect } from 'react'
import './Cajas.css'

export default function Cajas({userId}){
    return (
        <div>
            <TablaCajas userId={userId} />
        </div>
    );
}

function TablaCajas({userId}){
    const [cajas, setCajas] = useState([]);

    async function getCajas(){
        const response = await fetch('https://localhost:7178/caja');

         const data = await response.json();
         console.log('Datos obtenidos:', data);
         return data;    
    }

    useEffect( () => {
        getCajas().then( data => {
            setCajas(data)
        })      
    }, [])
    
    const eventEliminar = (id) => {
        console.log("toque eliminar al id= "+id)
        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        };

    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const nombre = document.getElementById("nombre").value;
        const saldo = document.getElementById("saldo").value;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                    "nombre" : nombre,
                    "saldo" : saldo,
                    "userId": userId
            })
        };
    
        fetch('https://localhost:7178/caja', requestOptions)
        .then(response => {
            console.log(response)
            getCajas().then( data => {
                setCajas(data)
            })

        }
            
            ).catch(error => console.log(error));


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
            </form>
        </div>
            
        </>
    );
}