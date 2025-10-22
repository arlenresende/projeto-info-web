import { authGuard } from './core/guard/auth.guard'
import { AuthComponent } from './modules/pages/auth/auth.component'
import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./modules/pages/auth/auth.component').then((mod) => mod.AuthComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./modules/pages/home/home.component').then((mod) => mod.HomeComponent),
    canActivate: [authGuard],
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./modules/pages/register/register.component').then((mod) => mod.RegisterComponent),
  },
]
