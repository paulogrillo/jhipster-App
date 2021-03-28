import { IUsuario } from 'app/entities/usuario/usuario.model';

export interface ITelefones {
  id?: number;
  phoneDDD?: number | null;
  phoneNumero?: number | null;
  ddd?: IUsuario | null;
}

export class Telefones implements ITelefones {
  constructor(public id?: number, public phoneDDD?: number | null, public phoneNumero?: number | null, public ddd?: IUsuario | null) {}
}

export function getTelefonesIdentifier(telefones: ITelefones): number | undefined {
  return telefones.id;
}
