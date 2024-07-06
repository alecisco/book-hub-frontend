import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { MyLibraryComponent } from './core/my-library/my-library.component';
import { LoanedBooksComponent } from './core/loaned-books/loaned-books.component';
import { ProfileComponent } from './core/profile/profile.component';
import { AuthGuard } from './helpers/auth.guard';
import { NotificationCenterComponent } from './core/notification-center/notification-center.component';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'my-library', component: MyLibraryComponent, canActivate: [AuthGuard] },
  { path: 'loaned-books', component: LoanedBooksComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'notification-center', component: NotificationCenterComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
