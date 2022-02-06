import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent  } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { AngularFireAuthGuard,redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/compat/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['sign-in']);

const routes: Routes = [
  {  path: 'home', component: HomeComponent },
  {  path: 'sign-in', component: SignInComponent },
  {  path: 'sign-up', component: SignUpComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'discussion', component: DiscussionComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
