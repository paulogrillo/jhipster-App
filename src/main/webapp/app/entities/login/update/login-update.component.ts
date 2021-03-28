import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILogin, Login } from '../login.model';
import { LoginService } from '../service/login.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';

@Component({
  selector: 'jhi-login-update',
  templateUrl: './login-update.component.html',
})
export class LoginUpdateComponent implements OnInit {
  isSaving = false;

  loginXUsuariosCollection: IUsuario[] = [];

  editForm = this.fb.group({
    id: [],
    login: [],
    password: [],
    loginXUsuario: [],
  });

  constructor(
    protected loginService: LoginService,
    protected usuarioService: UsuarioService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ login }) => {
      this.updateForm(login);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const login = this.createFromForm();
    if (login.id !== undefined) {
      this.subscribeToSaveResponse(this.loginService.update(login));
    } else {
      this.subscribeToSaveResponse(this.loginService.create(login));
    }
  }

  trackUsuarioById(index: number, item: IUsuario): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILogin>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(login: ILogin): void {
    this.editForm.patchValue({
      id: login.id,
      login: login.login,
      password: login.password,
      loginXUsuario: login.loginXUsuario,
    });

    this.loginXUsuariosCollection = this.usuarioService.addUsuarioToCollectionIfMissing(this.loginXUsuariosCollection, login.loginXUsuario);
  }

  protected loadRelationshipsOptions(): void {
    this.usuarioService
      .query({ filter: 'login-is-null' })
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(
        map((usuarios: IUsuario[]) =>
          this.usuarioService.addUsuarioToCollectionIfMissing(usuarios, this.editForm.get('loginXUsuario')!.value)
        )
      )
      .subscribe((usuarios: IUsuario[]) => (this.loginXUsuariosCollection = usuarios));
  }

  protected createFromForm(): ILogin {
    return {
      ...new Login(),
      id: this.editForm.get(['id'])!.value,
      login: this.editForm.get(['login'])!.value,
      password: this.editForm.get(['password'])!.value,
      loginXUsuario: this.editForm.get(['loginXUsuario'])!.value,
    };
  }
}
