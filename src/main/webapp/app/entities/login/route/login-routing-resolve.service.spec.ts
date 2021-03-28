jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ILogin, Login } from '../login.model';
import { LoginService } from '../service/login.service';

import { LoginRoutingResolveService } from './login-routing-resolve.service';

describe('Service Tests', () => {
  describe('Login routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: LoginRoutingResolveService;
    let service: LoginService;
    let resultLogin: ILogin | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(LoginRoutingResolveService);
      service = TestBed.inject(LoginService);
      resultLogin = undefined;
    });

    describe('resolve', () => {
      it('should return ILogin returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLogin = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultLogin).toEqual({ id: 123 });
      });

      it('should return new ILogin if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLogin = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultLogin).toEqual(new Login());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLogin = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultLogin).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
