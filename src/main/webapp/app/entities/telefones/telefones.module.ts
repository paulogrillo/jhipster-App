import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { TelefonesComponent } from './list/telefones.component';
import { TelefonesDetailComponent } from './detail/telefones-detail.component';
import { TelefonesUpdateComponent } from './update/telefones-update.component';
import { TelefonesDeleteDialogComponent } from './delete/telefones-delete-dialog.component';
import { TelefonesRoutingModule } from './route/telefones-routing.module';

@NgModule({
  imports: [SharedModule, TelefonesRoutingModule],
  declarations: [TelefonesComponent, TelefonesDetailComponent, TelefonesUpdateComponent, TelefonesDeleteDialogComponent],
  entryComponents: [TelefonesDeleteDialogComponent],
})
export class TelefonesModule {}
