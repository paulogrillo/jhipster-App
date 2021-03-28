import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITelefones, Telefones } from '../telefones.model';
import { TelefonesService } from '../service/telefones.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';

@Component({
  selector: 'jhi-telefones-update',
  templateUrl: './telefones-update.component.html',
})
export class TelefonesUpdateComponent implements OnInit {
  isSaving = false;

  usuariosSharedCollection: IUsuario[] = [];

  editForm = this.fb.group({
    id: [],
    phoneDDD: [],
    phoneNumero: [],
    ddd: [],
  });

  constructor(
    protected telefonesService: TelefonesService,
    protected usuarioService: UsuarioService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ telefones }) => {
      this.updateForm(telefones);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const telefones = this.createFromForm();
    if (telefones.id !== undefined) {
      this.subscribeToSaveResponse(this.telefonesService.update(telefones));
    } else {
      this.subscribeToSaveResponse(this.telefonesService.create(telefones));
    }
  }

  trackUsuarioById(index: number, item: IUsuario): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITelefones>>): void {
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

  protected updateForm(telefones: ITelefones): void {
    this.editForm.patchValue({
      id: telefones.id,
      phoneDDD: telefones.phoneDDD,
      phoneNumero: telefones.phoneNumero,
      ddd: telefones.ddd,
    });

    this.usuariosSharedCollection = this.usuarioService.addUsuarioToCollectionIfMissing(this.usuariosSharedCollection, telefones.ddd);
  }

  protected loadRelationshipsOptions(): void {
    this.usuarioService
      .query()
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(map((usuarios: IUsuario[]) => this.usuarioService.addUsuarioToCollectionIfMissing(usuarios, this.editForm.get('ddd')!.value)))
      .subscribe((usuarios: IUsuario[]) => (this.usuariosSharedCollection = usuarios));
  }

  protected createFromForm(): ITelefones {
    return {
      ...new Telefones(),
      id: this.editForm.get(['id'])!.value,
      phoneDDD: this.editForm.get(['phoneDDD'])!.value,
      phoneNumero: this.editForm.get(['phoneNumero'])!.value,
      ddd: this.editForm.get(['ddd'])!.value,
    };
  }
}
