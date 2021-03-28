import { IUsuario } from 'app/entities/usuario/usuario.model';

export interface ILogin {
  id?: number;
  login?: string | null;
  password?: string | null;
  loginXUsuario?: IUsuario | null;
}

export class Login implements ILogin {
  constructor(public id?: number, public login?: string | null, public password?: string | null, public loginXUsuario?: IUsuario | null) {}
}

export function getLoginIdentifier(login: ILogin): number | undefined {
  return login.id;
}
