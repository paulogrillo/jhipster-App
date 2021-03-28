import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITelefones, Telefones } from '../telefones.model';
import { TelefonesService } from '../service/telefones.service';

@Injectable({ providedIn: 'root' })
export class TelefonesRoutingResolveService implements Resolve<ITelefones> {
  constructor(protected service: TelefonesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITelefones> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((telefones: HttpResponse<Telefones>) => {
          if (telefones.body) {
            return of(telefones.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Telefones());
  }
}
