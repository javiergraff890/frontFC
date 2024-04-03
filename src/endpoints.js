//const base = 'https://localhost:7178';
const base = 'https://www.apiflujocaja.somee.com'
//const base = 'https://7f3f-181-229-197-65.ngrok-free.app'
const endpoints = {
    ENDPOINT_SUBMIT_SIGNUP : base+'/user',
    ENDPOINT_POST_LOGIN : base+'/user/Login',
    ENDPOINT_GET_CAJAS : base+'/caja',
    ENDPOINT_GET_MOVS : base+'/movimiento/',
    ENDPOINT_DELETE_MOVS : base+'/movimiento/',
    ENDPOINT_POST_MOVS : base+'/movimiento',
    ENDPOINT_DELETE_USER : base+'/user',
    ENDPOINT_DELETE_CAJA : base+'/caja/',
    ENDPOINT_POST_CAJA : base+'/caja'
  };
  
  export default endpoints;