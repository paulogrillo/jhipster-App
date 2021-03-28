import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITelefones, Telefones } from '../telefones.model';

import { TelefonesService } from './telefones.service';

describe('Service Tests', () => {
  describe('Telefones Service', () => {
    let service: TelefonesService;
    let httpMock: HttpTestingController;
    let elemDefault: ITelefones;
    let expectedResult: ITelefones | ITelefones[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TelefonesService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        phoneDDD: 0,
        phoneNumero: 0,
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

      it('should create a Telefones', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Telefones()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Telefones', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            phoneDDD: 1,
            phoneNumero: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Telefones', () => {
        const patchObject = Object.assign(
          {
            phoneNumero: 1,
          },
          new Telefones()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Telefones', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            phoneDDD: 1,
            phoneNumero: 1,
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

      it('should delete a Telefones', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTelefonesToCollectionIfMissing', () => {
        it('should add a Telefones to an empty array', () => {
          const telefones: ITelefones = { id: 123 };
          expectedResult = service.addTelefonesToCollectionIfMissing([], telefones);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(telefones);
        });

        it('should not add a Telefones to an array that contains it', () => {
          const telefones: ITelefones = { id: 123 };
          const telefonesCollection: ITelefones[] = [
            {
              ...telefones,
            },
            { id: 456 },
          ];
          expectedResult = service.addTelefonesToCollectionIfMissing(telefonesCollection, telefones);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Telefones to an array that doesn't contain it", () => {
          const telefones: ITelefones = { id: 123 };
          const telefonesCollection: ITelefones[] = [{ id: 456 }];
          expectedResult = service.addTelefonesToCollectionIfMissing(telefonesCollection, telefones);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(telefones);
        });

        it('should add only unique Telefones to an array', () => {
          const telefonesArray: ITelefones[] = [{ id: 123 }, { id: 456 }, { id: 96208 }];
          const telefonesCollection: ITelefones[] = [{ id: 123 }];
          expectedResult = service.addTelefonesToCollectionIfMissing(telefonesCollection, ...telefonesArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const telefones: ITelefones = { id: 123 };
          const telefones2: ITelefones = { id: 456 };
          expectedResult = service.addTelefonesToCollectionIfMissing([], telefones, telefones2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(telefones);
          expect(expectedResult).toContain(telefones2);
        });

        it('should accept null and undefined values', () => {
          const telefones: ITelefones = { id: 123 };
          expectedResult = service.addTelefonesToCollectionIfMissing([], null, telefones, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(telefones);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
