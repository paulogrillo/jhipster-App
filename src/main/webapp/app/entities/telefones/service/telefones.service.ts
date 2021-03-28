import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITelefones, getTelefonesIdentifier } from '../telefones.model';

export type EntityResponseType = HttpResponse<ITelefones>;
export type EntityArrayResponseType = HttpResponse<ITelefones[]>;

@Injectable({ providedIn: 'root' })
export class TelefonesService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/telefones');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(telefones: ITelefones): Observable<EntityResponseType> {
    return this.http.post<ITelefones>(this.resourceUrl, telefones, { observe: 'response' });
  }

  update(telefones: ITelefones): Observable<EntityResponseType> {
    return this.http.put<ITelefones>(`${this.resourceUrl}/${getTelefonesIdentifier(telefones) as number}`, telefones, {
      observe: 'response',
    });
  }

  partialUpdate(telefones: ITelefones): Observable<EntityResponseType> {
    return this.http.patch<ITelefones>(`${this.resourceUrl}/${getTelefonesIdentifier(telefones) as number}`, telefones, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITelefones>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITelefones[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTelefonesToCollectionIfMissing(
    telefonesCollection: ITelefones[],
    ...telefonesToCheck: (ITelefones | null | undefined)[]
  ): ITelefones[] {
    const telefones: ITelefones[] = telefonesToCheck.filter(isPresent);
    if (telefones.length > 0) {
      const telefonesCollectionIdentifiers = telefonesCollection.map(telefonesItem => getTelefonesIdentifier(telefonesItem)!);
      const telefonesToAdd = telefones.filter(telefonesItem => {
        const telefonesIdentifier = getTelefonesIdentifier(telefonesItem);
        if (telefonesIdentifier == null || telefonesCollectionIdentifiers.includes(telefonesIdentifier)) {
          return false;
        }
        telefonesCollectionIdentifiers.push(telefonesIdentifier);
        return true;
      });
      return [...telefonesToAdd, ...telefonesCollection];
    }
    return telefonesCollection;
  }
}
