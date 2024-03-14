import './Movimientos.css'
import { useState, useEffect, useRef } from 'react'
import {fechaActual} from './funciones.js'
import  endpoints from './endpoints.js'

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
    const initialized = useRef(false);
    const initializedmov = useRef(false);
    const initialized2 = useRef(false);
    const initialized3 = useRef(false);
    const [paginaActual, setpaginaActual] = useState(0);
    const [cantidadPorPagina, setcantidadPorPagina] = useState(5);
    const [hayOtraPag, sethayOtraPag] = useState(true);
    const mensajeExistenciaCajas = useRef(null);
    const [botonesActivos, setBotonesActivos] = useState(true);
    const divcargando = useRef(false);
    const initializedPaginaActual = useRef(false);
    // const [contador, setcontador] = useState(0);
   
    useEffect( () => {
        if (initialized.current){
            console.log("cajas")
            console.log(cajas)
        //     console.log("catidad de movs = "+Object.values(movs).length)
            // console.log("veces que entre = "+contador)
            // setcontador(contador+1)
        //    
         } else {
            initialized.current = true;
         }
        
    }, [cajas]);

    useEffect( () => {
        if (initializedmov.current){
            console.log("movs")
            console.log(movs)
        //     console.log("catidad de movs = "+Object.values(movs).length)
        //    
         } else {
            initializedmov.current = true;
         }
        
    }, [movs]);

    async function getCajas(){
        const token = localStorage.getItem('token');
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await fetch(endpoints.ENDPOINT_GET_CAJAS ,requestOptions);

         const data = await response.json();
         console.log('Datos obtenidos (cajas):', data);
         return data.reduce( (acc,elemento) => {
            acc[elemento.id] = elemento;
            return acc;
         }, {});    
    }

    async function getMovimientos(){
        if (divcargando.current != null)
            divcargando.current.textContent = "Cargando ...";
        const token = localStorage.getItem('token');
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const inicial = (paginaActual) * cantidadPorPagina + 1;
        const endpoint = endpoints.ENDPOINT_GET_MOVS+inicial+'/'+cantidadPorPagina;
        console.log("voy a enviar "+endpoint)
        const response = await fetch(endpoint,requestOptions);

         const data = await response.json();
         
         console.log('Datos obtenidos (movs):', data);
         sethayOtraPag(data.siguiente);
         if (divcargando.current != null)
            if (data.movs.length == 0)
                divcargando.current.textContent = "No hay cajas";
            else
            divcargando.current.textContent = "";
         return data.movs;    
    }

    useEffect( () => {
        if (initialized2.current){
            // if (mensajeExistenciaCajas.current != null)
            //     mensajeExistenciaCajas.current.textContent = "Cargando ..."
            Promise.all([
                getCajas(),
                getMovimientos()
            ]).then( ([listacajas,listamovimientos]) => {
                setCajas(listacajas)
                setMovs(listamovimientos)
                // if (mensajeExistenciaCajas.current != null)
                //     mensajeExistenciaCajas.current.textContent = "No hay cajas"
                setBotonesActivos(true);
            }).catch( error => {
                console.error('Error al cargar datos:', error);
            })
        } else {
            initialized2.current = true;
        }
        
    }, []);

    const eventEliminar = (id) => {
        if (botonesActivos){
            setBotonesActivos(false);
            const token = localStorage.getItem('token')
            const requestOptions = {
                method : 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }

            fetch(endpoints.ENDPOINT_DELETE_MOVS+id, requestOptions).then(
                response => {
                    console.log(response);
                    getMovimientos().then( data => {
                        setMovs(data)
                        setBotonesActivos(true);
                    })
                }
            ).catch( ex => console.log(ex))
        } else {
            console.log("intente eliminar pero estadeshabilitado")
        }
        
    }

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
                     "fecha" : fechaActual()
                })
            
        };

        fetch(endpoints.ENDPOINT_POST_MOVS,requestOptions).then(
            response => {
                console.log(response);
                getMovimientos().then( data => {
                    setMovs(data)
                })
            }).catch(error => console.log(error));
    }

    const clickSiguiente = () => {
        if (hayOtraPag){
            if (botonesActivos){
                //setMovs([])
                setBotonesActivos(false);
                console.log("sig")
                
                setpaginaActual(paginaActual+1);
                // getMovimientos().then( data => {
                //     setMovs(data)
                //     setBotonesActivos(true);
                // })
            }
            
        }
            
    }

    const clickAnterior = () => {
        if (paginaActual > 0){
            if (botonesActivos){
                //setMovs([])
                setBotonesActivos(false);
                console.log("ant")
                setpaginaActual(paginaActual-1);
            }
        //     getMovimientos().then( data => {
        //         setMovs(data)
        //    })
        }
    }

    useEffect( () => {
        if (initialized3.current){
            if (initializedPaginaActual.current){
                console.log("se modifico paginaActual ="+paginaActual)
                    getMovimientos().then( data => {
                        setMovs(data)
                        setBotonesActivos(true);
                })
            } else{
                initializedPaginaActual.current = true;
            }
            
            
        } else {
            initialized3.current=true;
        }
    }, [paginaActual])



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
                <td> {botonesActivos ? <button onClick={() => eventEliminar(elem.id)}>X</button> : <></> }</td>
            </tr>
            )
        }
        </tbody>
        </table>
       <div ref={divcargando}></div>
        {
            (Object.keys(cajas).length > 0) ?
            <>
            <div className="divNavegacionPaginas">
                <div>
                    <button onClick={clickAnterior}><box-icon name='chevron-left-circle' type='solid' color='#ffffff'></box-icon></button>
                    <button onClick={clickSiguiente}><box-icon name='chevron-right-circle' type='solid' color='#ffffff'></box-icon></button>
                </div>
                
                <span>pagina actual {paginaActual+1}</span>
            </div>
        <div className="divNuevoMov">
             
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
                </>
            : <></>
            // : <div ref={mensajeExistenciaCajas}>No hay cajas</div>
        }
        </div>
    );
}