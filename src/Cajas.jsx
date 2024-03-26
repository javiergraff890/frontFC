import { useState, useEffect, useRef } from 'react'
import './Cajas.css'
import {fechaActual} from './funciones.js'
import swal from 'sweetalert'
import { Chart } from "react-google-charts";
import endpoints from './endpoints.js'

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
    const [contenido, setContenido] = useState(0);

    async function getCajas(){
        if (divcargando.current != null)
            divcargando.current.textContent = "Cargando cajas ...";
        const token = localStorage.getItem('token');
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'ngrok-skip-browser-warning' : 'skip-browser-warning'
            }
        };

        const response = await fetch(endpoints.ENDPOINT_GET_CAJAS,requestOptions);

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

            fetch(endpoints.ENDPOINT_DELETE_CAJA+id, requestOptions).then(
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
            fetch(endpoints.ENDPOINT_POST_CAJA, requestOptions)
            .then(response => {
                console.log(response)
                if (response.status == 204){
                    console.log("se ingreso nombre repetido");
                    setnombreDuplicado(true);
                    setBotonesActivos(true);
                } else if (response.status == 401){
                    swal('Sesion expirada', 'Vuelva a iniciar sesion' )
                    cerrarSesion()
                } else if (response.status == 422){
                    swal("Error", "esta entrada provoco un error en el servidor, contacte al admin :(")
                    setBotonesActivos(true)
                    throw new Error("No se puede insertar, entradas invalidas");
                } else {
                    getCajas().then( data => {
                        setCajas(data)
                        setBotonesActivos(true);
                    })
                    
                    if (nombreDuplicado)
                        setnombreDuplicado(false);
                }
                
            }).catch(error => {
                console.log(error)
            });
            
        }
    }

    return (
        <>
        <div className="divTablaGrafico">
            <button onClick={ () => setContenido(0)}><div>Tabla</div> <div><box-icon size='15px' name='table'></box-icon></div></button>
            <button onClick={ () => setContenido(1)}>Grafico <box-icon size ='15px' name='pie-chart-alt-2'></box-icon></button>
        </div>
        { 
            //en lugar de este condicional hubiera sido mejor separar en dos componentes uno tabla y uno grafico
            //sin embargo como eso requeria rediseñar gran parte del componente principal queda como pendiente
            contenido === 0 ? 
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
                    <td className="columnaNombre"><p className="p-nombre" title={elem.nombre}>{elem.nombre}</p></td>
                    <td className="columnaSaldo">{elem.saldo}</td>
                    <td className="columnaEliminar">{botonesActivos ? <button onClick={() => eventEliminar(elem.id)}>X</button> : <></> }</td>
                </tr>
                )
            }
            </tbody>
            </table>

            </>
            : 
                ((cajas.length == 0) ? <></> : <GraficoCajas  cajas={cajas}/> )
            }

            <div className="divCargando" ref={divcargando}></div>
            {/* <div> */}
                <form onSubmit={handleSubmit} action="#" className='form-nueva-caja'>
                    <h2>Nueva caja</h2>
                    <div className="conteiner-nueva-caja">
                        <input ref={inputNombreRef} maxLength={50} type="text" id="nombre" name="nombre" placeholder='Nombre de la caja' required></input>
                        <input ref={inputSaldoRef} type="number" min="0.0" max="99999999.99" step="0.01" id="saldo" name="saldo" placeholder='Saldo inicial' required></input>
                        <button disabled={!botonesActivos} type="submit">Enviar</button>
                        <p className={nombreDuplicado ? 'form-nueva-caja-spanDuplicado-visible'
                        :'form-nueva-caja-spanDuplicado-oculto'}>Nombre de caja duplicado</p>
                    </div>
                </form>
            {/* </div> */}


            
            
        </>
    );
}

function GraficoCajas({cajas}){

    const data = []
    var totalCajas = 0;
    data.push(["Nombre", "Saldo"]);
    cajas.map( (c) => {
            data.push([c.nombre, c.saldo])
            totalCajas+=c.saldo;
        })

    
    //cajas.foreach( c => console.log([c.nombre, c.saldo]))
    // const data = [
    //     ["Task", "Hours per Day"],
    //     ["Work", 11],
    //     ["Eat", 2],
    //     ["Commute", 2],
    //     ["Watch TV", 2],
    //     ["Sleep", 7],
    //   ];

      const options = {
        title: "Total Cajas : $"+totalCajas,
        titleTextStyle: {fontSize: 15, fontName: 'Arial', bold: true, italic: false, color: '#87711a'},
        is3D: true,
         backgroundColor: '#c2d4f2'
      };
    


    return (
        <div className="divChart">
                <Chart
                    chartType="PieChart"
                    data={data}
                    options={options}
                    width={"100%"}
                    height={"200px"}
                />
            
        </div>
        
      );
}


