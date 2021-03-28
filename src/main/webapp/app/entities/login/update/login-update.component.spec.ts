jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { LoginService } from '../service/login.service';
import { ILogin, Login } from '../login.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';

import { LoginUpdateComponent } from './login-update.component';

describe('Component Tests', () => {
  describe('Login Management Update Component', () => {
    let comp: LoginUpdateComponent;
    let fixture: ComponentFixture<LoginUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let loginService: LoginService;
    let usuarioService: UsuarioService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LoginUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(LoginUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LoginUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      loginService = TestBed.inject(LoginService);
      usuarioService = TestBed.inject(UsuarioService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call loginXUsuario query and add missing value', () => {
        const login: ILogin = { id: 456 };
        const loginXUsuario: IUsuario = { id: 68960 };
        login.loginXUsuario = loginXUsuario;

        const loginXUsuarioCollection: IUsuario[] = [{ id: 9437 }];
        spyOn(usuarioService, 'query').and.returnValue(of(new HttpResponse({ body: loginXUsuarioCollection })));
        const expectedCollection: IUsuario[] = [loginXUsuario, ...loginXUsuarioCollection];
        spyOn(usuarioService, 'addUsuarioToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ login });
        comp.ngOnInit();

        expect(usuarioService.query).toHaveBeenCalled();
        expect(usuarioService.addUsuarioToCollectionIfMissing).toHaveBeenCalledWith(loginXUsuarioCollection, loginXUsuario);
        expect(comp.loginXUsuariosCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const login: ILogin = { id: 456 };
        const loginXUsuario: IUsuario = { id: 56093 };
        login.loginXUsuario = loginXUsuario;

        activatedRoute.data = of({ login });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(login));
        expect(comp.loginXUsuariosCollection).toContain(loginXUsuario);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const login = { id: 123 };
        spyOn(loginService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ login });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: login }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(loginService.update).toHaveBeenCalledWith(login);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const login = new Login();
        spyOn(loginService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ login });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: login }));
        saveSubject.complete();

        // THEN
        expect(loginService.create).toHaveBeenCalledWith(login);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const login = { id: 123 };
        spyOn(loginService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ login });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(loginService.update).toHaveBeenCalledWith(login);
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
