import { ITelefones } from 'app/entities/telefones/telefones.model';

export interface IUsuario {
  id?: number;
  nome?: string | null;
  cpf?: string | null;
  rg?: string | null;
  telefones?: ITelefones[] | null;
}

export class Usuario implements IUsuario {
  constructor(
    public id?: number,
    public nome?: string | null,
    public cpf?: string | null,
    public rg?: string | null,
    public telefones?: ITelefones[] | null
  ) {}
}

export function getUsuarioIdentifier(usuario: IUsuario): number | undefined {
  return usuario.id;
}
