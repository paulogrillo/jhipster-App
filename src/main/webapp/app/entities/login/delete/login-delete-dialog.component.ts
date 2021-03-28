import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILogin } from '../login.model';
import { LoginService } from '../service/login.service';

@Component({
  templateUrl: './login-delete-dialog.component.html',
})
export class LoginDeleteDialogComponent {
  login?: ILogin;

  constructor(protected loginService: LoginService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.loginService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
