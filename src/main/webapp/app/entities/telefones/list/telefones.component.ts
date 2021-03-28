import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITelefones } from '../telefones.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { TelefonesService } from '../service/telefones.service';
import { TelefonesDeleteDialogComponent } from '../delete/telefones-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';

@Component({
  selector: 'jhi-telefones',
  templateUrl: './telefones.component.html',
})
export class TelefonesComponent implements OnInit {
  telefones: ITelefones[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(protected telefonesService: TelefonesService, protected modalService: NgbModal, protected parseLinks: ParseLinks) {
    this.telefones = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.isLoading = true;

    this.telefonesService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<ITelefones[]>) => {
          this.isLoading = false;
          this.paginateTelefones(res.body, res.headers);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  reset(): void {
    this.page = 0;
    this.telefones = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ITelefones): number {
    return item.id!;
  }

  delete(telefones: ITelefones): void {
    const modalRef = this.modalService.open(TelefonesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.telefones = telefones;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.reset();
      }
    });
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateTelefones(data: ITelefones[] | null, headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link') ?? '');
    if (data) {
      for (const d of data) {
        this.telefones.push(d);
      }
    }
  }
}
