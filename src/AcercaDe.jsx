import './AcercaDe.css'

export default function AcercaDe(){

    return (
        <>
        <div className="container-acercaDe">
            <h1>Tecnologías utilizadas</h1>
            <h2>Backend</h2>
            <div className="contanierTec">
                <div className="divBotones">
                    <a href="https://dotnet.microsoft.com/es-es/apps/aspnet">
                        <button>ASP.NET CORE</button>
                    </a>
                    <a href="https://learn.microsoft.com/es-es/ef/">
                        <button>Entity framework</button>
                    </a>
                    <a href="https://www.microsoft.com/es-ar/sql-server/sql-server-downloads">
                        <button>SQL SERVER</button>
                    </a>
                </div>
                <p>Se utilizó además <a href="https://jwt.io/">JWT</a> para la autenticación de los usuarios, <a href="https://www.nuget.org/packages/BCrypt.Net-Next/">BCrypt</a> para hashear las passwords.</p>
                <p>En el despliegue decidí incluir el sitio que genera la herramienta Swagger en el cual se documenta como se puede acceder a los endponts, allí se pueden encontrar las formas que ofrece el backend para poder manipular a los usuarios, las cajas y los movimientos. Se puede visitar en el siguiente <a href="https://www.apiflujocaja.somee.com/swagger/index.html">Link</a>.</p>
            </div>
            <a href="https://github.com/javiergraff890/backendFC">
                <div className="divLinkGit">
                    <div>
                        <box-icon name='github' type='logo' color='#f8f2f2' ></box-icon>
                    </div>
                    <div>
                        <p>Codigo fuente Backend</p>
                    </div>
                </div>
            </a>
            
            <h2>Frontend</h2>
            <div className="contanierTec">
                <div className="divBotones">
                    <a href="https://es.react.dev/">
                        <button>React</button>
                    </a>              
                </div>
                <p>Se utilizó <a href="https://vitejs.dev/">Vite</a> como soporte, la librería <a href="https://sweetalert2.github.io/">Sweet alert</a> para mostrar avisos, <a href="https://www.react-google-charts.com/">React Google Charts</a> para gráficos de cajas y <a href="https://boxicons.com/">Boxicons</a> para iconos de botones.</p>
                <p>Solamente se usaron los hooks useState, useEffect y useRef</p>
            </div>
            <a href="https://github.com/javiergraff890/frontFC">
                <div className="divLinkGit">
                    <div>
                        <box-icon name='github' type='logo' color='#f8f2f2' ></box-icon>
                    </div>
                    <div>
                        <p>Codigo fuente Frontend</p>
                    </div>
                </div>
            </a>
            <div className="mensajeInferior">
                <h2>Diseño responsive</h2>
                <p>
                    El sistema está originalmente diseñado para un navegador web de un dispositivo con una pantalla no táctil como por ejemplo una notebook o una PC 
                </p>
                <p> A pesar de esto, el sistema está adaptado para verse correctamente en pantallas pequeñas, sin embargo, en teléfonos o tablets hay comportamientos no implementados como por ejemplo la visualización del overflow de textos. En dispositivos de escritorio se puede visualizar posando el mouse encima.
                </p>
                <div className="container-ejemplo">
                    <h3>Ejemplo de visualización posando el mouse en el concepto</h3>
                    <p>Este comportamiento no aplica para pantallas táctiles</p>
                    <img src="/src/img/ejemplo.png"></img>
                </div>
                <h2>Sesiones</h2>
                <p>Cuando un usuario se loguea o crea una cuenta nueva, se genera un token que tiene una validez de 24 horas. Pasado ese tiempo la sesión caduca y se vuelven a solicitar las credenciales, en este período la sesión sigue activa sin importar si el navegador se cierra o el dispositivo se apague </p>
                <h2>Gracias</h2>
                <p>Este proyecto fue realizado con un objetivo de aprendizaje, ante cualquier fallo o comportamiento inesperado se agradece un reporte al siguiente correo <a href="mailto:jjaviergraff@gmail.com">jjaviergraff@gmail.com</a> </p>
            </div>
            
            
        </div>
        
        </>
        
    )
}