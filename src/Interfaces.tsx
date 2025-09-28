export interface userRegisterInterface {
    full_name: string;
    email: string;
    password: string;
    role:string
    company_id: string
  }
  
  export const errorMsg = 'Uh sorry the server is Down.';
  // export const Url = 'https://kaydhub.up.railway.app/api';
  export const Url = 'http://localhost:8080/api';