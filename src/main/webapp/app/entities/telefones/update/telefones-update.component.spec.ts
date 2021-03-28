jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TelefonesService } from '../service/telefones.service';
import { ITelefones, Telefones } from '../telefones.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';

import { TelefonesUpdateComponent } from './telefones-update.component';

describe('Component Tests', () => {
  describe('Telefones Management Update Component', () => {
    let comp: TelefonesUpdateComponent;
    let fixture: ComponentFixture<TelefonesUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let telefonesService: TelefonesService;
    let usuarioService: UsuarioService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TelefonesUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TelefonesUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TelefonesUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      telefonesService = TestBed.inject(TelefonesService);
      usuarioService = TestBed.inject(UsuarioService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Usuario query and add missing value', () => {
        const telefones: ITelefones = { id: 456 };
        const ddd: IUsuario = { id: 7773 };
        telefones.ddd = ddd;

        const usuarioCollection: IUsuario[] = [{ id: 66406 }];
        spyOn(usuarioService, 'query').and.returnValue(of(new HttpResponse({ body: usuarioCollection })));
        const additionalUsuarios = [ddd];
        const expectedCollection: IUsuario[] = [...additionalUsuarios, ...usuarioCollection];
        spyOn(usuarioService, 'addUsuarioToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ telefones });
        comp.ngOnInit();

        expect(usuarioService.query).toHaveBeenCalled();
        expect(usuarioService.addUsuarioToCollectionIfMissing).toHaveBeenCalledWith(usuarioCollection, ...additionalUsuarios);
        expect(comp.usuariosSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const telefones: ITelefones = { id: 456 };
        const ddd: IUsuario = { id: 63917 };
        telefones.ddd = ddd;

        activatedRoute.data = of({ telefones });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(telefones));
        expect(comp.usuariosSharedCollection).toContain(ddd);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const telefones = { id: 123 };
        spyOn(telefonesService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ telefones });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: telefones }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(telefonesService.update).toHaveBeenCalledWith(telefones);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const telefones = new Telefones();
        spyOn(telefonesService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ telefones });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: telefones }));
        saveSubject.complete();

        // THEN
        expect(telefonesService.create).toHaveBeenCalledWith(telefones);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const telefones = { id: 123 };
        spyOn(telefonesService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ telefones });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(telefonesService.update).toHaveBeenCalledWith(telefones);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUsuarioById', () => {
        it('Should return tracked Usuario primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUsuarioById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
