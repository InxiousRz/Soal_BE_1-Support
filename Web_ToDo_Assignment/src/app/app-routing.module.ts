import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './core/dashboard/dashboard.component';
import { LoginPageComponent } from './core/login-page/login-page.component';
import { UserAccessGuard } from './services/user-access.guard';
import { SearchpageComponent } from './core/searchpage/searchpage.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'dashboard',
    // canActivate: [UserAccessGuard],
    component: DashboardComponent,
  },
  {
    path: 'search',
    // canActivate: [UserAccessGuard],
    component: SearchpageComponent
  },
  // {
  //   path: 'history',
  //   canActivate: [RouteGuardGuard],
  //   component: DashboardPageComponent,
  //   children: [
  //     { path: '', redirectTo: 'user-access', pathMatch: 'full' },
  //     {
  //       path: 'user-access', // child route path
  //       canActivate: [RouteGuardGuard],
  //       component: UserAccessComponent // child route component that the router renders
  //     },
  //     {
  //       path: 'log-activity',
  //       canActivate: [RouteGuardGuard],
  //       component: ActivityLogComponent // another child route component that the router renders
  //     },
  //     {
  //       path: 'log-activity-detail/:uid',
  //       canActivate: [RouteGuardGuard],
  //       component: ActivityLogDetailComponent // another child route component that the router renders
  //     },
  //   ]
  // },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
