import './Movimientos.css'
import { useState, useEffect, useRef } from 'react'

export default function Movimientos(){
    return (
        <TablaMovimientos />
    );
}

function TablaMovimientos () {
    const [movs, setMovs] = useState([]);
    const [cajas, setCajas] = useState({});
    const inputConceptoRef = useRef(null);
    const inputValorRef = useRef(null);
    const selectRef = useRef(null);
    

    useEffect( () => {
        console.log("catidad de cajas = "+Object.values(cajas).length)
        console.log(cajas)
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
         return data.reduce( (acc,elemento) => {
            acc[elemento.id] = elemento;
            return acc;
         }, {});    
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
        getCajas().then( data => {
            setCajas(data)
        })
        getMovimientos().then( data => {
            setMovs(data)
        })
                
        console.log(cajas.length)
    }, [])

    const eventEliminar = (id) => {}

    function formatFecha(fecha){
        const fechasplit = fecha.split("T");
        const dia = fechasplit[0];
        const hora = fechasplit[1].substring(0,5);
        return dia + " ("+ hora+")";
    }

    const handleSubmit = (event) =>{
        event.preventDefault()
        const concepto = inputConceptoRef.current.value;
        const valor = inputValorRef.current.value;
        const cajaSeleccionada = selectRef.current.value;
        console.log("voy a insertar = "+concepto+" "+valor+" "+cajaSeleccionada)

        const token = localStorage.getItem('token');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
                body: JSON.stringify({
                    "concepto" : concepto,
                     "valor" :valor,
                     "idCaja": cajaSeleccionada,
                     "fecha" : "2024-03-04T20:36:15.994Z"
                })
            
        };

        fetch('https://localhost:7178/movimiento',requestOptions).then(
            response => {
                console.log(response);
                getMovimientos().then( data => {
                    setMovs(data)
                })
            }).catch(error => console.log(error));
    }

    return (
        <div className="container">
        <table className='tabla-movimientos'>
            {/* <caption>Cajas</caption> */}
            <thead>
                <tr>
                    <th>Fecha</th>
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
                <td>{formatFecha(elem.fecha)}</td>
                <td>{elem.concepto}</td>
                <td>{elem.valor}</td>
                <td>{cajas[elem.idCaja].nombre}</td>
                <td><button onClick={() => eventEliminar(elem.id)}>X</button></td>
            </tr>
            )
        }
        </tbody>
        </table>

        <div>
            <form onSubmit={handleSubmit} action="#" className='form-nuevo-movimiento'>
                <h2>Nuevo Movimiento</h2>
                <input ref={inputConceptoRef} type="text" id="concepto" name="concepto" placeholder='Concepto' required></input>
                <input ref={inputValorRef} type="number" step="0.01" id="valor" name="valor" placeholder='Valor' required></input>
                <select ref={selectRef}>
                    {
                        Object.values(cajas).map( (elem) => 
                            <option key={elem.id} value={elem.id}>{elem.nombre}</option>
                         )
                    }
                </select>
                <button type="submit">Enviar</button>
            </form>
        </div>
        </div>
    );
}