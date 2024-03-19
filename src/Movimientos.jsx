import './Movimientos.css'
import { useState, useEffect, useRef } from 'react'
import {fechaActual} from './funciones.js'
import  endpoints from './endpoints.js'
import swal from 'sweetalert'

export default function Movimientos({userId, cerrarSesion}){
    return (
        <TablaMovimientos cerrarSesion={cerrarSesion} />
    );
}

function TablaMovimientos ({cerrarSesion}) {
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
    // const mensajeExistenciaCajas = useRef(null);
    const [botonesActivos, setBotonesActivos] = useState(false);
    const divcargando = useRef(false);
    const initializedPaginaActual = useRef(false);
    const divErrorRef = useRef(false);
    const botonIngresoEgreso = useRef(false);
    
    //true ingreso, false egreso
    const [ingreso, setIngreso] = useState(true);
    // const [contador, setcontador] = useState(0);
   
    // useEffect( () => {
    //     if (ingreso){
    //         botonIngresoEgreso.current.classList.toggle("ingreso", true);
    //         botonIngresoEgreso.current.classList.toggle("egreso", false);
    //     } else {
    //         botonIngresoEgreso.current.classList.toggle("ingreso", false);
    //         botonIngresoEgreso.current.classList.toggle("egreso", true);
    //     }

    // }, [ingreso])

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
        
        if (response.status == 401){
            swal('Sesion expirada', 'Vuelva a iniciar sesion', )
            cerrarSesion()
            return [];
        }

         const data = await response.json();
         console.log('Datos obtenidos (cajas):', data);
         return data.reduce( (acc,elemento) => {
            acc[elemento.id] = elemento;
            return acc;
         }, {});    
    }

    async function getMovimientos(){
        if (divcargando.current != null)
            divcargando.current.textContent = "Cargando movimientos ...";
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

        if (response.status == 401){
            swal('Sesion expirada', 'Vuelva a iniciar sesion', )
            cerrarSesion()
            return [];
        }

         const data = await response.json();
         
         console.log('Datos obtenidos (movs):', data);
         sethayOtraPag(data.siguiente);
         if (divcargando.current != null)
            if (data.movs.length == 0)
                divcargando.current.textContent = "No hay cajas";
            else{
                divcargando.current.textContent = "";
            }
            
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
                    if (response.status == 401){
                        swal('Sesion expirada', 'Vuelva a iniciar sesion')
                        cerrarSesion()
                        return null;
                    } else if (response.status == 422){
                        console.log("olis")
                       return response.text()
                    } else {
                        getMovimientos().then( data => {
                            setMovs(data)
                            setBotonesActivos(true);
                        })
                        return null;
                    }
                        
                }
            ).then( texto => {
                if (texto!= null && texto == 'saldo_caja_inconsistente'){
                    swal("No se puede remover este movimiento", "Deshacer este movimiento provoca que el saldo total de la caja exceda el saldo maximo o minimo")
                    setBotonesActivos(true);
                }
            }).catch( ex => console.log(ex))
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

    const checkConcepto = (concepto) => {
        return (concepto.length <=200);
    }

    const handleSubmit = (event) =>{
        event.preventDefault()

        if (divErrorRef != null){
            divErrorRef.current.classList.toggle("errorInputVisible", false)
            divErrorRef.current.classList.toggle("errorInputOculto", true)
        }

        const concepto = inputConceptoRef.current.value.trim();
        var valor = inputValorRef.current.value.trim();
        if (!ingreso){
            valor = '-'+ inputValorRef.current.value.trim();
        }
        const cajaSeleccionada = selectRef.current.value;
        console.log("voy a insertar = "+concepto+" "+valor+" "+cajaSeleccionada)

        console.log("tipo de valor = "+typeof(valor))
        if (!checkConcepto(concepto)){
            console.log("gola")
        }

        const token = localStorage.getItem('token');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
                body: JSON.stringify({
                    "concepto" : concepto,
                     "valor" : valor,
                     "idCaja": cajaSeleccionada,
                     "fecha" : fechaActual()
                })
            
        };

        inputValorRef.current.value = "";
        inputConceptoRef.current.value = "";

        fetch(endpoints.ENDPOINT_POST_MOVS,requestOptions).then(
            response => {
                    console.log(response)
                    if (response.ok){
                        getMovimientos().then( data => {
                            setMovs(data)
                        })
                        return "";       
                    } else if (response.status == 401){
                        swal('Sesion expirada', 'Vuelva a iniciar sesion', )
                        cerrarSesion()
                        return "";
                    } else {
                        return response.text()
                    }
                }
                
            ).then(
                texto => {
                    if (texto == 'saldo_maximo_excedido'){
                        console.log(texto)
                        divErrorRef.current.classList.toggle("errorInputVisible", true)
                        divErrorRef.current.classList.toggle("errorInputOculto", false)
                        divErrorRef.current.textContent ="Este movimiento excede el saldo maximo ($ 99.999.999,99)";
                    } else if (texto == 'saldo_minimo_excedido'){
                        console.log(texto)
                        divErrorRef.current.classList.toggle("errorInputVisible", true)
                        divErrorRef.current.classList.toggle("errorInputOculto", false)
                        divErrorRef.current.textContent ="Este movimiento excede el saldo minimo ($ -99.999.999,99)";
                    }
                    else if (texto != "")
                        throw new Error(texto);
                    //esto no deberia ocurrir nunca ya que hago chequeos en el frontend
                }
            ).catch(error => console.log("errror "+error));
            
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
                console.log("se modifico páginaActual ="+paginaActual)
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

    const toggleIngresoEgreso = () => {
        console.log("gola")
        setIngreso(!ingreso)
    }


    return (
        <div className="container">
        <table className='tabla-movimientos'>
            {/* <caption>Cajas</caption> */}
            <thead>
                <tr>
                    <th className="columnaFecha">Fecha</th>
                    <th className="columnaConcepto">Concepto</th>
                    <th className="columnaValor">Valor</th>
                    <th className="columnaCaja">Caja</th>
                    <th className="columnaEliminar">Eliminar</th>
                </tr>
            </thead>
            <tbody>
        {
            movs.map( (elem) =>
            <tr key={elem.id}>
                <td className="columnaFecha font-columnaFecha">{formatFecha(elem.fecha)}</td>
                <td className="columnaConcepto">{elem.concepto}</td>
                <td className="columnaValor">$ {elem.valor}</td>
                <td className="columnaCaja font-columnaCaja">{cajas[elem.idCaja].nombre}</td>
                <td className="columnaEliminar"> {botonesActivos ? <button onClick={() => eventEliminar(elem.id)}>X</button> : <></> }</td>
            </tr>
            )
        }
        </tbody>
        </table>
       <div className="divCargando" ref={divcargando}></div>
        {
            (Object.keys(cajas).length > 0) ?
            <>
            <div className="divNavegacionPaginas">
                <div>
                    <button onClick={clickAnterior}>
                        {
                            paginaActual > 0 ? <box-icon name='chevron-left-circle' type='solid' color='#ffffff'></box-icon>
                            : <box-icon type='solid' color='#ffffff'></box-icon>
                        }
                    </button>
                    <button onClick={clickSiguiente}>
                        {
                            hayOtraPag ? <box-icon name='chevron-right-circle' type='solid' color='#ffffff'></box-icon>
                            : <box-icon type='solid' color='#ffffff'></box-icon>
                        }
                    </button>
                </div>
                {
                    botonesActivos ? 
                    <span>Página {paginaActual+1}</span>
                    : <span>Cargando página</span>
                }
                
            </div>
        <div className="divNuevoMov">
             
                <form onSubmit={handleSubmit} action="#" className='form-nuevo-movimiento'>
                <h2>Nuevo Movimiento</h2>
                
                <input ref={inputConceptoRef} type="text"  maxLength="50" id="concepto" name="concepto" placeholder='Concepto' required></input>
                <div className={ ingreso ? "divSignomas" : "divSignomenos"}>
                {ingreso ? "+$ " : "- $ "}
                </div >
                <input ref={inputValorRef} type="number" maxLength="4" step="0.01" min="0.00" max="99999999.99" id="valor" name="valor" placeholder='Valor' required></input>
                <select ref={selectRef}>
                    {
                        Object.values(cajas).map( (elem) => 
                            <option key={elem.id} value={elem.id}>{elem.nombre}</option>
                         )
                    }
                </select>
                <button type="button" ref={botonIngresoEgreso} onClick={toggleIngresoEgreso} className={ingreso ? "ingreso" : "egreso"} >{ingreso ? "Ingreso" : "Egreso"}</button>
                <button type="submit">Enviar</button>
                <div ref={divErrorRef} id="mensajeErrorOculto" className="errorInput"></div>
                </form>
            </div>
                </>
            : <></>
            // : <div ref={mensajeExistenciaCajas}>No hay cajas</div>
        }
        </div>
    );
}