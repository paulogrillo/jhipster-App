import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITelefones } from '../telefones.model';

@Component({
  selector: 'jhi-telefones-detail',
  templateUrl: './telefones-detail.component.html',
})
export class TelefonesDetailComponent implements OnInit {
  telefones: ITelefones | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ telefones }) => {
      this.telefones = telefones;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
