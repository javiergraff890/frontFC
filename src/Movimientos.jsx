import './Movimientos.css'
import { useState, useEffect, useRef } from 'react'
import {fechaActual} from './funciones.js'
import  endpoints from './endpoints.js'
import swal from 'sweetalert'

export default function Movimientos({ cerrarSesion }){
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
    //const initialized = useRef(false);
    //const initializedmov = useRef(false);
    const initialized2 = useRef(false);
    const initialized3 = useRef(false);
    const [paginaActual, setpaginaActual] = useState(0);
    const [cantidadPorPagina, setcantidadPorPagina] = useState(5);
    const [hayOtraPag, sethayOtraPag] = useState(true);
    const [botonesActivos, setBotonesActivos] = useState(false);
    const divcargando = useRef(false);
    const initializedPaginaActual = useRef(false);
    const divErrorRef = useRef(false);
    const botonIngresoEgreso = useRef(false);
    const [cantidadMovs, setCantidadMovs] = useState(1);
    
    //true ingreso, false egreso
    const [ingreso, setIngreso] = useState(true);
    // const [contador, setcontador] = useState(0);
    const [selectedOption, setSelectedOption] = useState('default');
   

    /*Use efect que se usa para mostrar cajas y movimientos, los dejo comentados */
    // useEffect( () => {
    //     if (initialized.current){
    //         console.log("cajas")
    //         console.log(cajas) 
    //      } else {
    //         initialized.current = true;
    //      }
    // }, [cajas]);

    // useEffect( () => {
    //     if (initializedmov.current){
    //         console.log("movs")
    //         console.log(movs)  
    //      } else {
    //         initializedmov.current = true;
    //      }
    // }, [movs]);

    async function getCajas(){
        const token = localStorage.getItem('token');
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'ngrok-skip-browser-warning' : 'skip-browser-warning'
            }
        };

        const response = await fetch(endpoints.ENDPOINT_GET_CAJAS ,requestOptions);
        
        if (response.status == 401){
            swal('Sesion expirada', 'Vuelva a iniciar sesion', )
            cerrarSesion()
            return [];
        }

         const data = await response.json();

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
                'Authorization': `Bearer ${token}`,
                'ngrok-skip-browser-warning' : 'skip-browser-warning'
            }
        };

        const inicial = (paginaActual) * cantidadPorPagina + 1;
        const endpoint = endpoints.ENDPOINT_GET_MOVS+inicial+'/'+cantidadPorPagina;

        const response = await fetch(endpoint,requestOptions);

        if (response.status == 401){
            swal('Sesion expirada', 'Vuelva a iniciar sesion', )
            cerrarSesion()
            return [];
        }

        const data = await response.json();

        sethayOtraPag(data.siguiente);
        setCantidadMovs(data.cantidadMovs);

        if (divcargando.current != null)
            if (data.movs.length == 0)
                divcargando.current.textContent = "No hay movimientos";
            else{
                divcargando.current.textContent = "";
        }
         return data.movs;    
    }

    //useeffect para la primer carga de movimientos y cajas, se espera a que ambas promesas se resuelvan
    useEffect( () => {
        if (initialized2.current){
            
            Promise.all([
                getCajas(),
                getMovimientos()
            ]).then( ([listacajas,listamovimientos]) => {
                setCajas(listacajas)
                setMovs(listamovimientos)
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

                    if (response.status == 401){
                        swal('Sesion expirada', 'Vuelva a iniciar sesion')
                        cerrarSesion()
                        return null;
                    } else if (response.status == 422){
                        //caja inconsistente por ahora da lo mismo si excede el maximo o si supera el cero
                        return response.text()
                    } else if (response.status == 200){
                        const cant_movs = cantidadMovs -1;
                        console.log("cant_movs "+cant_movs+" cantxpag "+cantidadPorPagina+" paginaactual "+paginaActual);
                        //en codigo pagina inicial es cero
                        //esto se hace para cuando se elimna una pagina con 1 solo elemento, en caso de haber paginas anteriores
                        //con este calculo se muesrta la pagina anterior, caso contrario se mostraba que no habia movimientos
                        if ( (cant_movs % cantidadPorPagina == 0) && (cant_movs > 0) && (paginaActual > 0)){
                            setpaginaActual(paginaActual-1);
                        } else {
                            getMovimientos().then( data => {
                                setMovs(data)
                                setBotonesActivos(true);
                            })
                        }
                        return null;
                    }
                    return null;
                }
            ).then( texto => {
                if (texto!= null && texto == 'saldo_caja_inconsistente_max'){
                    swal("No se puede remover este movimiento", "Deshacer este movimiento provoca que el saldo total de la caja exceda el saldo máximo")
                    setBotonesActivos(true);
                } else if (texto!= null && texto == 'saldo_caja_inconsistente_min'){
                    swal("No se puede remover este movimiento", "Deshacer este movimiento provoca que el saldo total de la caja sea negativo")
                    setBotonesActivos(true);
                }
            }).catch( ex => console.log(ex))
        }
    }

    function formatFecha(fecha){
        const fechasplit = fecha.split("T");
        const dia = fechasplit[0];
        const hora = fechasplit[1].substring(0,5);
        return dia + " ("+ hora+")";
    }

    //por lo pronto permito que se ignresen movs mientras se eliminan otras o se pasa de pagina
    //el asincronismo deberia ordenar, en caso de inconisistencias debo arreglar esto
    const handleSubmit = (event) =>{
        event.preventDefault()

        if (botonesActivos){
            setBotonesActivos(false);

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
                        if (response.ok){
                            getMovimientos().then( data => {
                                setMovs(data)
                                setBotonesActivos(true);
                            })
                            return "";       
                        } else if (response.status == 401){
                            swal('Sesion expirada', 'Vuelva a iniciar sesion', )
                            cerrarSesion()
                            return "";
                        } else {
                            setBotonesActivos(true);
                            return response.text()
                        }
                    }
                ).then(
                    texto => {
                        if (texto == 'saldo_maximo_excedido'){
                            console.log(texto)
                            divErrorRef.current.classList.toggle("errorInputVisible", true)
                            divErrorRef.current.classList.toggle("errorInputOculto", false)
                            divErrorRef.current.textContent ="Este movimiento provoca que se exceda el saldo máximo de la caja ($ 99.999.999,99)";
                        } else if (texto == 'saldo_negativo'){
                            console.log(texto)
                            divErrorRef.current.classList.toggle("errorInputVisible", true)
                            divErrorRef.current.classList.toggle("errorInputOculto", false)
                            divErrorRef.current.textContent ="Este movimiento provoca un saldo de caja negativo en la caja";
                        }
                        else if (texto != "")
                            throw new Error(texto);
                        //esto no deberia ocurrir nunca ya que hago chequeos en el frontend
                    }
                ).catch(error => console.log("errror "+error));
        }    
    }

    const clickSiguiente = () => {
        if (hayOtraPag){
            if (botonesActivos){
                setBotonesActivos(false);
                setpaginaActual(paginaActual+1);
            }
        }   
    }

    const clickAnterior = () => {
        if (paginaActual > 0){
            if (botonesActivos){
                setBotonesActivos(false);
                console.log("ant")
                setpaginaActual(paginaActual-1);
            }
        }
    }

    useEffect( () => {
        if (initialized3.current){
            if (initializedPaginaActual.current){
                getMovimientos().then( data => {
                    setMovs(data)
                    setBotonesActivos(true);
                })
            } else {
                initializedPaginaActual.current = true;
            }
        } else {
            initialized3.current=true;
        }
    }, [paginaActual])

    const toggleIngresoEgreso = () => {
        setIngreso(!ingreso)
    }

    const handleChangeSelect = (event) => {
        setSelectedOption(event.target.value);
      };


    return (
        <div className="container">
        <table className='tabla-movimientos'>
            <thead>
                <tr>
                    <th className="columnaConcepto-mov">Concepto</th>
                    <th className="columnaFecha-mov">Fecha</th>
                    <th className="columnaValor-mov">Valor</th>
                    <th className="columnaCaja-mov">Caja</th>
                    <th className="columnaEliminar-mov">Eliminar</th>
                </tr>
            </thead>
            <tbody>
        {
            movs.map( (elem) =>
            <tr key={elem.id}>
                <td className="columnaConcepto-mov"><p className="p-nombre" title={elem.concepto}>{elem.concepto}</p></td>
                <td className="columnaFecha-mov font-columnaFecha desc-visible">{formatFecha(elem.fecha)}</td>
                <td className="columnaValor-mov">$ {elem.valor}</td>
                <td className="columnaCaja-mov font-columnaCaja">
                    <p className="p-nombre" title={cajas[elem.idCaja].nombre}> 
                        <span className="desc-oculto spanCaja">Caja:&nbsp;</span>
                        {cajas[elem.idCaja].nombre}
                    </p>
                </td>
                <td className="columnaEliminar-mov"> {botonesActivos ? <button onClick={() => eventEliminar(elem.id)}><p className="desc-oculto">Eliminar </p>X</button> : <></> }</td>
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
                    <span>Página {paginaActual+1}/{ Math.ceil(cantidadMovs / cantidadPorPagina) }</span>
                    : <span>Cargando página</span>
                }
                
            </div>
        <div className="divNuevoMov">
             
                <form onSubmit={handleSubmit} action="#" className='form-nuevo-movimiento'>
                <h2>Nuevo Movimiento</h2>
                <div className="container-nuevo-mov">
                <div>
                    <input className="conceptoInput" ref={inputConceptoRef} type="text"  maxLength="50" id="concepto" name="concepto" placeholder='Concepto' required></input>
                </div>
                <div className="divValorInput">
                    <div className={ ingreso ? "divSignomas" : "divSignomenos"}>
                    {ingreso ? "+$ " : "- $ "}
                    </div >
                    <input className="inputValor" ref={inputValorRef} type="number" maxLength="4" step="0.01" min="0.00" max="99999999.99" id="valor" name="valor" placeholder='Valor' required></input>
                </div>
                <div>
                    <select ref={selectRef} defaultValue={'DEFAULT'} onChange={handleChangeSelect}>
                        <option value="DEFAULT" disabled>Caja</option>
                        {
                            Object.values(cajas).map( (elem) => 
                                <option key={elem.id} value={elem.id}>{elem.nombre}</option>
                            )
                        }
                    </select>
                </div>
                <div>
                    <button type="button" ref={botonIngresoEgreso} onClick={toggleIngresoEgreso} className={ingreso ? "ingreso" : "egreso"} >{ingreso ? "Ingreso" : "Egreso"}</button>
                </div>
                <div>
                    <button disabled={selectedOption=='default'} type="submit">Enviar</button>
                </div>
                </div>
                    <div ref={divErrorRef} id="mensajeErrorOculto" className="errorInput"></div>
                </form>
            </div>
                </>
            : <></>
        }
        </div>
    );
}