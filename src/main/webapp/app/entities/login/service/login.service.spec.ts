import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILogin, Login } from '../login.model';

import { LoginService } from './login.service';

describe('Service Tests', () => {
  describe('Login Service', () => {
    let service: LoginService;
    let httpMock: HttpTestingController;
    let elemDefault: ILogin;
    let expectedResult: ILogin | ILogin[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(LoginService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        login: 'AAAAAAA',
        password: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Login', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Login()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Login', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            login: 'BBBBBB',
            password: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Login', () => {
        const patchObject = Object.assign({}, new Login());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Login', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            login: 'BBBBBB',
            password: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Login', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addLoginToCollectionIfMissing', () => {
        it('should add a Login to an empty array', () => {
          const login: ILogin = { id: 123 };
          expectedResult = service.addLoginToCollectionIfMissing([], login);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(login);
        });

        it('should not add a Login to an array that contains it', () => {
          const login: ILogin = { id: 123 };
          const loginCollection: ILogin[] = [
            {
              ...login,
            },
            { id: 456 },
          ];
          expectedResult = service.addLoginToCollectionIfMissing(loginCollection, login);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Login to an array that doesn't contain it", () => {
          const login: ILogin = { id: 123 };
          const loginCollection: ILogin[] = [{ id: 456 }];
          expectedResult = service.addLoginToCollectionIfMissing(loginCollection, login);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(login);
        });

        it('should add only unique Login to an array', () => {
          const loginArray: ILogin[] = [{ id: 123 }, { id: 456 }, { id: 15588 }];
          const loginCollection: ILogin[] = [{ id: 123 }];
          expectedResult = service.addLoginToCollectionIfMissing(loginCollection, ...loginArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const login: ILogin = { id: 123 };
          const login2: ILogin = { id: 456 };
          expectedResult = service.addLoginToCollectionIfMissing([], login, login2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(login);
          expect(expectedResult).toContain(login2);
        });

        it('should accept null and undefined values', () => {
          const login: ILogin = { id: 123 };
          expectedResult = service.addLoginToCollectionIfMissing([], null, login, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(login);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
