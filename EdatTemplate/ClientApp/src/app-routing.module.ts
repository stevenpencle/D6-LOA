import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// services
import { RouteGuard } from './app/services/security/route.guard';

// components
import { HomeComponent } from './app/components/home/home.component';
import { NotAuthorizedComponent } from './app/components/not-authorized/not-authorized.component';
import { ServerErrorComponent } from './app/components/server-error/server-error.component';

// ** SAMPLE START
import { SampleComponent } from './app/features/administration/sample/sample.component';
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
      AuthorizedRoles: ['Admin']
    } as RouteData
  },
  {
    path: 'administration',
    canActivate: [RouteGuard],
    redirectTo: 'administration/sample',
    pathMatch: 'full',
    data: {
      AuthorizedRoles: ['Admin']
    } as RouteData
  },
  // ** SAMPLE END
  // base routes
  { path: 'home', component: HomeComponent, pathMatch: 'full' },
  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      useHash: true,
      enableTracing: false // <-- debugging purposes only
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
