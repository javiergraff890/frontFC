import './Movimientos.css'
import { useState, useEffect } from 'react'

export default function Movimientos(){
    return (
        <TablaMovimientos />
    );
}

function TablaMovimientos () {
    const [movs, setMovs] = useState([]);
    const [cajas, setCajas] = useState([]);

    useEffect( () => {
        console.log("catidad de cajas = "+cajas.length)
    }, [cajas]);

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
         console.log('Datos obtenidos:', data);
         return data;    
    }

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
        getCajas().then( data => {
            setCajas(data)
        })        
        console.log(cajas.length)
    }, [])

    const eventEliminar = (id) => {}

    const handleSubmit = () =>{}

    return (
        <>
        <table className='tabla-movimientos'>
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

        <div>
            <form onSubmit={handleSubmit} action="#" className='form-nuevo-movimiento'>
                <h2>Nueva caja</h2>
                <input type="text" id="concepto" name="concepto" placeholder='Concepto' required></input>
                <input type="number" step="0.01" id="valor" name="valor" placeholder='Valor' required></input>
                <select>
                    {
                        cajas.map( (elem) => {
                            <option key={elem.idCaja} value={elem.idCaja}>{elem.concepto}</option>
                        } )
                    }
                </select>
                <button type="submit">Enviar</button>
            </form>
        </div>
        </>
    );
}