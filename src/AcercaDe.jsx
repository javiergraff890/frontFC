import './AcercaDe.css'

export default function AcercaDe(){

    return (
        <>
        <div className="container-acercaDe">
            <h1>Tecnologias utilizadas</h1>
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
                <p>Se utilizo ademas <a href="https://jwt.io/">JWT</a> para la autenticacion de los usuarios, <a href="https://www.nuget.org/packages/BCrypt.Net-Next/">BCrypt</a> para hashear las password</p>
            </div>
            <a href="https://github.com/javiergraff890/backendFC">
                <div className="divLinkGit">
                    <div>
                        <box-icon name='github' type='logo' color='#f8f2f2' ></box-icon>
                    </div>
                    <div>
                        <p>Codigo fuente backend</p>
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
                <p>Se utilizo <a href="https://vitejs.dev/">Vite</a> como soporte, la libreria <a href="https://sweetalert2.github.io/">Sweet alert</a> para mostrar avisos, <a href="https://www.react-google-charts.com/">React Google Charts</a> para graficos de cajas y <a href="https://boxicons.com/">Boxicons</a> para iconos de botones</p>
            </div>
            <a href="https://github.com/javiergraff890/frontFC">
                <div className="divLinkGit">
                    <div>
                        <box-icon name='github' type='logo' color='#f8f2f2' ></box-icon>
                    </div>
                    <div>
                        <p>Codigo fuente frontend</p>
                    </div>
                </div>
            </a>
            <div className="mensajeInferior">
                <p>Este proyecto fue realizado con un objetivo de aprendizaje, ante cualquier fallo o comportamiento inesperado se agradece un reporte al siguiente correo <a href="mailto:jjaviergraff@gmail.com">jjaviergraff@gmail.com</a> </p>
            </div>
            
            
        </div>
        
        </>
        
    )
}