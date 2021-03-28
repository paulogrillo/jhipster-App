import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITelefones } from '../telefones.model';
import { TelefonesService } from '../service/telefones.service';

@Component({
  templateUrl: './telefones-delete-dialog.component.html',
})
export class TelefonesDeleteDialogComponent {
  telefones?: ITelefones;

  constructor(protected telefonesService: TelefonesService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.telefonesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
