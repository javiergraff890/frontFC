
export function fechaActual () {
    const fechaActual = new Date();

    // Obtener los componentes de la fecha
    const año = fechaActual.getFullYear();
    const mes = ('0' + (fechaActual.getMonth() + 1)).slice(-2);
    const dia = ('0' + fechaActual.getDate()).slice(-2);
    const horas = ('0' + fechaActual.getHours()).slice(-2);
    const minutos = ('0' + fechaActual.getMinutes()).slice(-2);
    const segundos = ('0' + fechaActual.getSeconds()).slice(-2);
    const milisegundos = ('00' + fechaActual.getMilliseconds()).slice(-3);

    const fechaFormateada = `${año}-${mes}-${dia}T${horas}:${minutos}:${segundos}.${milisegundos}Z`;

    return fechaFormateada;
}