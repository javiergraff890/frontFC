import { useState, useEffect } from 'react'
import './Cajas.css'

export default function Cajas(){
    return (
        <div>
            <TablaCajas />
        </div>
    );
}

function TablaCajas(){
    const [cajas, setCajas] = useState([]);

    async function getCajas(){
        const response = await fetch('https://localhost:7178/caja');

         const data = await response.json();
         console.log('Datos obtenidos:', data);
         return data;    
    }

    useEffect( () => {
        getCajas().then( data => {
            //var nuevascajas = []
            //for (const clave in data) {
                //nuevascajas.push(<div key={clave.id}>{clave.nombre} {clave.saldo}</div>)
            //    nuevascajas.push(clave)
           // }
            setCajas(data)
            // console.log("nuevas:")
            // console.log(nuevascajas);
            // console.log("nuevasfin")
        })      
    }, [])
    
    const eventEliminar = (id) => {
        console.log("toque eliminar al id= "+id)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
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
                <input type="text" id="nombre" name="nombre" placeholder='Nombre de la caja'></input>
                <input type="number" id="saldo" name="saldo" placeholder='saldo inicial'></input>
                <button type="submit">Enviar</button>
            </form>
        </div>
            
        </>
    );
}