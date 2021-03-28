import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'login',
        data: { pageTitle: 'gutoApp.login.home.title' },
        loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
      },
      {
        path: 'usuario',
        data: { pageTitle: 'gutoApp.usuario.home.title' },
        loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule),
      },
      {
        path: 'telefones',
        data: { pageTitle: 'gutoApp.telefones.home.title' },
        loadChildren: () => import('./telefones/telefones.module').then(m => m.TelefonesModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
