jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITelefones, Telefones } from '../telefones.model';
import { TelefonesService } from '../service/telefones.service';

import { TelefonesRoutingResolveService } from './telefones-routing-resolve.service';

describe('Service Tests', () => {
  describe('Telefones routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: TelefonesRoutingResolveService;
    let service: TelefonesService;
    let resultTelefones: ITelefones | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(TelefonesRoutingResolveService);
      service = TestBed.inject(TelefonesService);
      resultTelefones = undefined;
    });

    describe('resolve', () => {
      it('should return ITelefones returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTelefones = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTelefones).toEqual({ id: 123 });
      });

      it('should return new ITelefones if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTelefones = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultTelefones).toEqual(new Telefones());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTelefones = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTelefones).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
