import './Movimientos.css'
import { useState, useEffect } from 'react'

export default function Movimientos(){
    return (
        <TablaMovimientos />
    );
}

function TablaMovimientos () {
    const [movs, setMovs] = useState([]);

    async function getMovimientos(){
        const token = localStorage.getItem('token');
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await fetch('https://localhost:7178/movimiento',requestOptions);

         const data = await response.json();
         console.log('Datos obtenidos:', data);
         return data;    
    }

    useEffect( () => {
        getMovimientos().then( data => {
            setMovs(data)
        })      
    }, [])

    const eventEliminar = (id) => {}

    return (
        <table className='tabla-cajas'>
            {/* <caption>Cajas</caption> */}
            <thead>
                <tr>
                    <th>Concepto</th>
                    <th>Valor</th>
                    <th>Caja</th>
                    <th>Eliminar</th>
                </tr>
            </thead>
            <tbody>
        {
            movs.map( (elem) =>
            <tr key={elem.id}>
                <td>{elem.concepto}</td>
                <td>{elem.valor}</td>
                <td>{elem.idCaja}</td>
                <td><button onClick={() => eventEliminar(elem.id)}>X</button></td>
            </tr>
            )
        }
        </tbody>
        </table>

    );
}