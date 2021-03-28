import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TelefonesComponent } from '../list/telefones.component';
import { TelefonesDetailComponent } from '../detail/telefones-detail.component';
import { TelefonesUpdateComponent } from '../update/telefones-update.component';
import { TelefonesRoutingResolveService } from './telefones-routing-resolve.service';

const telefonesRoute: Routes = [
  {
    path: '',
    component: TelefonesComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TelefonesDetailComponent,
    resolve: {
      telefones: TelefonesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TelefonesUpdateComponent,
    resolve: {
      telefones: TelefonesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TelefonesUpdateComponent,
    resolve: {
      telefones: TelefonesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(telefonesRoute)],
  exports: [RouterModule],
})
export class TelefonesRoutingModule {}
