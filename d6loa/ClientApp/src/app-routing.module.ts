import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteData } from './typings';

// services
import { RouteGuard } from './app/services/security/route.guard';

// components
import { HomeComponent } from './app/components/home/home.component';
import { NotAuthorizedComponent } from './app/components/not-authorized/not-authorized.component';
import { ServerErrorComponent } from './app/components/server-error/server-error.component';

// ** SAMPLE START
import { SampleComponent } from './app/features/administration/sample/sample.component';
import { VendorComponent } from './app/features/administration/vendor/vendor.component';
import { ContractComponent } from './app/features/administration/contract/contract.component';
import { SupplementalComponent } from './app/features/administration/supplemental/supplemental.component';
import { LoaComponent } from './app/features/administration/loa/loa.component';
import { InvoiceComponent } from './app/features/administration/invoice/invoice.component';
// ** SAMPLE END

const appRoutes: Routes = [
  // ** administration routes
  // ** SAMPLE START
  {
    path: 'administration/sample',
    component: SampleComponent,
    canActivate: [RouteGuard],
    pathMatch: 'full',
    data: {
      AuthorizedRoles: ['Admin', 'B2CUser'],
    } as RouteData
  },
  {
    path: 'administration/vendor',
    component: VendorComponent,
    canActivate: [RouteGuard],
    pathMatch: 'full',
    data: {
      AuthorizedRoles: ['Admin', 'B2CUser'],
    } as RouteData
  },
  {
    path: 'administration/contract',
    component: ContractComponent,
    canActivate: [RouteGuard],
    pathMatch: 'full',
    data: {
      AuthorizedRoles: ['Admin', 'B2CUser'],
    } as RouteData
  },
  {
    path: 'administration/invoice',
    component: InvoiceComponent,
    canActivate: [RouteGuard],
    pathMatch: 'full',
    data: {
      AuthorizedRoles: ['Admin', 'B2CUser'],
    } as RouteData
  },
  {
    path: 'administration/supplemental',
    component: SupplementalComponent,
    canActivate: [RouteGuard],
    pathMatch: 'full',
    data: {
      AuthorizedRoles: ['Admin', 'B2CUser'],
    } as RouteData
  },
  {
    path: 'administration/loa',
    component: LoaComponent,
    canActivate: [RouteGuard],
    pathMatch: 'full',
    data: {
      AuthorizedRoles: ['Admin', 'B2CUser'],
    } as RouteData
  },
  // ** SAMPLE END
  // base routes
  { path: 'home', component: HomeComponent, pathMatch: 'full' },
  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      useHash: true,
      enableTracing: false, // <-- debugging purposes only
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
