import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILogin, getLoginIdentifier } from '../login.model';

export type EntityResponseType = HttpResponse<ILogin>;
export type EntityArrayResponseType = HttpResponse<ILogin[]>;

@Injectable({ providedIn: 'root' })
export class LoginService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/logins');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(login: ILogin): Observable<EntityResponseType> {
    return this.http.post<ILogin>(this.resourceUrl, login, { observe: 'response' });
  }

  update(login: ILogin): Observable<EntityResponseType> {
    return this.http.put<ILogin>(`${this.resourceUrl}/${getLoginIdentifier(login) as number}`, login, { observe: 'response' });
  }

  partialUpdate(login: ILogin): Observable<EntityResponseType> {
    return this.http.patch<ILogin>(`${this.resourceUrl}/${getLoginIdentifier(login) as number}`, login, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILogin>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILogin[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLoginToCollectionIfMissing(loginCollection: ILogin[], ...loginsToCheck: (ILogin | null | undefined)[]): ILogin[] {
    const logins: ILogin[] = loginsToCheck.filter(isPresent);
    if (logins.length > 0) {
      const loginCollectionIdentifiers = loginCollection.map(loginItem => getLoginIdentifier(loginItem)!);
      const loginsToAdd = logins.filter(loginItem => {
        const loginIdentifier = getLoginIdentifier(loginItem);
        if (loginIdentifier == null || loginCollectionIdentifiers.includes(loginIdentifier)) {
          return false;
        }
        loginCollectionIdentifiers.push(loginIdentifier);
        return true;
      });
      return [...loginsToAdd, ...loginCollection];
    }
    return loginCollection;
  }
}
